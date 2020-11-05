import { ColumnSet, IMain } from "pg-promise";
import { DB } from "../../db";
import sqlProvider = require("../sql");
import { shNumber, shPolygon } from "./regions";

// import _ from "lodash";

import * as Joi from "@hapi/joi";

// device, pm10, pm2_5, so2, co, o3, pb, hc, voc, temp, humidity, pressure, gps, battery, measured, received, aqi

// schemas

export const shTypeCreateData = Joi.string().required().valid("full", "fast");

const shSensors = Joi.string()
  .required()
  .valid(
    "pm10",
    "pm2_5",
    "so2",
    "co",
    "o3",
    "pb",
    "hc",
    "voc",
    "temp",
    "humidity",
    "pressure",
    "gps",
    "battery",
    "measured"
  );
const thDate = Joi.object()
  .keys({
    date: Joi.date(),
    interval: Joi.string().isoDuration(),
  })
  .xor("date", "interval");

const shTimeFrame = Joi.object().keys({
  from: thDate.required(),
  to: thDate,
});

export const shshTypeCreateData = Joi.object().keys({
  type: shTypeCreateData,
});

export const shDataCreate = Joi.object().keys({
  //device: Joi.number().required(),
  pm10: Joi.number(),
  pm2_5: Joi.number(),
  so2: Joi.number(),
  co: Joi.number(),
  o3: Joi.number(),
  pb: Joi.number(),
  hc: Joi.number(),
  voc: Joi.number(),
  temp: Joi.number(),
  humidity: Joi.number(),
  pressure: Joi.number(),
  gps: Joi.array().items(Joi.number()).length(2),
  battery: Joi.number(),
  measured: Joi.date().required(),
  // received: Joi.string().required(),
  // aqi: Joi.number().required()
});

export const shDataCreateHeader = Joi.object().keys({
  apikey: Joi.string().required(),
});

const shCircle = Joi.object().keys({
  center: Joi.array().items(shNumber).length(2).required(),
  radius: Joi.number().required(),
});

const shLocations = Joi.object()
  .keys({
    devices: Joi.array().items(Joi.number()),
    owner: Joi.boolean().allow(true),
    name: Joi.string(),
    polygon: shPolygon,
    circle: shCircle,
  })
  .xor("devices", "owner", "name", "polygon", "circle");

export const shDataRetreive = Joi.object().keys({
  sensors: Joi.array().items(shSensors).required(),
  time: shTimeFrame.required(),
  locations: shLocations,
  order: Joi.array().items(Joi.string()),
  limit: Joi.number(),
});

export const shDataRetrievePage = Joi.object().keys({
  page: Joi.number().required(),
});

const sql = sqlProvider.data;

export class DataRepository {
  private static cs: DataColumnsets;
  private db: DB;
  private pgp: IMain;

  constructor(db: any, pgp: any) {
    this.db = db;
    this.pgp = pgp;
    this.createColumnsets();
  }

  public existingCols = (values: any, columnSet: any) => {
    // filter existing columns from columnset or create new ones on-the-fly
    const keys = Object.keys(values);
    return keys.map(
      (key: string) =>
        columnSet.columns.find((c: any) => c.name === key) ||
        new this.pgp.helpers.Column({ name: key, skip: (c: any) => !c.exists })
    );
  };

  private replaceField = (
    values: string[],
    field: string,
    newField: string
  ) => {
    const i = values.indexOf(field);
    if (i >= 0) {
      values[i] = newField;
    }
  };

  private replaceFields = (
    values: string[],
    fields: string[],
    newFields: string[]
  ) =>
    fields.forEach((field: string, i: number) =>
      this.replaceField(values, field, newFields[i])
    );

  private replaceAllFieldsRule = (
    values: string[],
    fields: string[],
    prefix: string,
    postfix: string,
    exceptFields: string[]
  ) => {
    const rFields = fields.filter(
      (field: string) => !exceptFields.includes(field)
    );
    const newFields = rFields.map(
      (field: string) => prefix + field + postfix + ` as ${field}`
    );
    this.replaceFields(values, rFields, newFields);
  };

  public get(page: number, values: any) {
    const config = { pageSize: 500, owner: 1 }; // from configuration

    const aFields = values.sensors;
    /*
    this.replaceFields(aFields,
      ["gps", "temp", "battery", "humidity", "pm10", "pm2_5"], 
      ["point(st_x(gps), st_y(gps)) gps", "temp::float", "battery || '%' battery", "humidity || '%' humidity", "pm10::float + 0.1 pm10", "pm2_5::float + 0.01 pm2_5"]);
    */
    //this.replaceAllFieldsRule(aFields, aFields, '', '::float', ["gps", "measured", "battery", "humidity"]);
    //this.replaceAllFieldsRule(aFields, ["battery", "humidity"], '', ` || '%'`, []);
    this.replaceField(aFields, "gps", "array[st_x(gps), st_y(gps)] gps");
    const fields = `\n\t${aFields.join(", ")}\n`;

    const from = values.time.from.date
      ? `'${values.time.from.date.toISOString()}'`
      : `(now() - '${values.time.from.interval}'::interval)`;
    const to =
      values.time.to && values.time.to.date
        ? `'${values.time.to.date.toISOString()}'`
        : values.time.to && values.time.to.interval
        ? `(now() - '${values.time.to.interval}'::interval)`
        : null;
    const measured = to
      ? `measured between ${from} and ${to}\n`
      : `measured >= ${from}\n`;

    let locations;
    let addTables = "\n";
    if (values.locations.devices) {
      locations = `device in (${values.locations.devices.join(", ")})`;
    } else if (values.locations.owner) {
      addTables = `, airq.devices d\n`;
      locations = `d.owner = ${config.owner} and device = d.id`;
    } else {
      if (values.locations.name) {
        addTables = `, airq.regions r\n`;
        locations = `r.id = '${values.locations.name}' and ST_Contains(r.coordinates, gps)`;
      } else if (values.locations.polygon) {
        const polygon = values.locations.polygon;
        // console.log("polygon:", polygon);
        polygon.push(polygon[0]);
        /*
        if (
          polygon[0][0] !== polygon[polygon.length - 1][0] &&
          polygon[0][1] !== polygon[polygon.length - 1][1]
        ) {
          polygon.push(polygon[0]);
        }
        */
        if (polygon.length < 4) {
          throw new Error("Polygon with insufficient number of points");
        }
        // console.log("polygon:", polygon);

        const sPolygon =
          "ST_MakePolygon(ST_MakeLine(array[" +
          polygon
            .map(
              (pt: any) => `ST_SetSRID(ST_MakePoint(${pt[0]}, ${pt[1]}), 4326)`
            )
            .join(", ") +
          "]))";

        // console.log("sPolygon:", sPolygon);
        locations = `st_within(gps, ${sPolygon})`;
      } else if (values.locations.circle) {
        // ST_DWithin(gps, ST_SetSRID(ST_MakePoint(16.3519478, 46.3187183)::geography, 4326), 400)
        const circle = `ST_SetSRID(ST_MakePoint(${values.locations.circle.center[0]}, ${values.locations.circle.center[1]})::geography, 4326)`;
        locations = `ST_DWithin(gps, ${circle}, ${values.locations.circle.radius})`;
      }
    }

    const order =
      (values.order
        ? `\norder by ` +
          values.order
            .map((field: string) =>
              field.substr(0, 1) === "-" ? field.substr(1) + " desc" : field
            )
            .join(", ")
        : "") + "\n";

    const limit = Math.min(values.limit, config.pageSize) || config.pageSize;
    /* TODO: lastPage: boolean - get data for one row more than is page size, and test if retrived data has more data of page size (it is not lastPage) or less (it is lastPage)
        limit++;
        lastPage = !(data.length > config.pageSize)
        data = data.slice(limit - 1)
    */
    
    /*
    console.log("config:", config);
    console.log("page:", page);
    console.log("values:", values);
    console.log("fields:", fields);
    console.log("from:", from);
    console.log("to:", to);
    console.log("locations:", locations);
    console.log("order:", order);
    console.log("limit:", limit);
    */

    return this.db.any(sql.get, {
      fields,
      measured,
      addTables,
      locations,
      order,
      offset: config.pageSize * (page - 1),
      limit,
    });
  }

  public add(type: string, apikey: string, values: any): any {
    console.log("add api key: ", apikey);
    return this.checkApiKey(apikey).then((device: number) => {
      values.device = device;
      values.aqi = this.aqi(values);
      const cols = this.existingCols(values, DataRepository.cs.insert);
      console.log("values:", values);
      console.log("cols:", cols);
      const colValues = this.pgp.helpers.values(values, cols);
      console.log("colValues:", colValues);
      const { dbcall, returning } =
        type === "full"
          ? {
              dbcall: this.db.one,
              returning:
                "returning pm10, pm2_5, so2, co, o3, pb, hc, voc, temp, humidity, pressure, array[st_x(gps), st_y(gps)] gps, battery, measured, received, aqi",
            } // return full record
          : { dbcall: this.db.none, returning: "" }; // call SQL insert, and do not return any record
      const dbResult = dbcall(sql.add, { values, colValues, returning });

      // check rules

      return dbResult;
    });
  }

  private checkApiKey(apikey: string): any {
    return this.db.cache.apiKey(apikey).then((device: number) => {
      console.log("api key value (device): ", device);
      if (!device) throw new Error("invalid apikey");
      return device;
    });
  }

  private aqi(values: any): number {
    return values.temp + 10;
  }

  private createColumnsets() {
    // create all ColumnSet objects only once:
    if (!DataRepository.cs) {
      const helpers = this.pgp.helpers,
        cs: DataColumnsets = {};

      const colGPS = new this.pgp.helpers.Column({
        name: "gps", // required
        mod: ":raw", // optional
        init: (params: any) =>
          this.pgp.as.format(
            `ST_SetSRID(ST_MakePoint(${params.value[0]}, ${params.value[1]}), 4326)`
          ),
      });
      cs.insert = new helpers.ColumnSet(colGPS);
      DataRepository.cs = cs;
    }
  }
}

interface DataColumnsets {
  insert?: ColumnSet;
}
