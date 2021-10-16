import { ColumnSet, IDatabase, IMain } from "pg-promise";
import { IResult } from "pg-promise/typescript/pg-subset";
import sqlProvider = require("../sql");
import { preparePolygonValues } from "../../server/handler";

// import _ from "lodash";

import * as Joi from "@hapi/joi";

import { shID } from "../../server/default-schemas";

// id, type, name, coordinates

// schemas
export const shNumber = Joi.number().required();
export const shPolygonPoints = Joi.array().items(shNumber);
export const shPolygon = Joi.array().items(shPolygonPoints);
export const shPolygons = Joi.object().keys({
  coordinates: Joi.array().items(shPolygon).required(),
  type: Joi.string().valid('Polygon').required()
});

export const shRegionsCreate = Joi.object().keys({
  type: Joi.string().required(),
  name: Joi.string().required(),
  coordinates: shPolygon.required(),
  gtype: Joi.string().valid('Polygon').required()
});

export const shRegionsValues = Joi.object().keys({
  id: Joi.number(),
  type: Joi.string(),
  name: Joi.string(),
  coordinates: shPolygon.required(),
  gtype: Joi.string().valid('Polygon').required()
});

export const shRegionsUpdate = Joi.object().keys({
  ids: Joi.array().items(shID).required(),
  values: shRegionsValues.required(),
});

const sql = sqlProvider.regions;

export class RegionsRepository {
  private static cs: RegionColumnsets;
  private db: IDatabase<any>;
  private pgp: IMain;
  private keys: string[] = ["id"];

  constructor(db: any, pgp: any) {
    this.db = db;
    this.pgp = pgp;
    this.createColumnsets();
  }

  public existingCols = (values: any, columnSet: any) => { // filter existing columns from columnset or create new ones on-the-fly
    const keys = Object.keys(values);
    return keys.map((key: string) =>
      columnSet.columns.find((c: any) => c.name === key) ||
      new this.pgp.helpers.Column({ name: key, skip: (c: any) => !c.exists })
    );
  }

  public get() {
    return this.db.any(sql.getAll);
  }

  public getByIDs(where: any) {
    return this.db.any(sql.getByIDs, { where });
  }

  public add(type: string, values: any): any {
    // console.log("regions add0: ", values);
    values.coordinates = preparePolygonValues(values.coordinates);
    const cols = this.existingCols(values, RegionsRepository.cs.insert);
    // console.log("values:", values);
    // console.log("cols:", cols);
    const colValues = this.pgp.helpers.values(values, cols);
    // console.log("colValues:", colValues);

    const dbcall = type === "fast" ? this.db.none : this.db.one;
    const returning = type === "full" ? "returning id, type, name, gtype, (ST_AsGeoJSON(coordinates)::json->>'coordinates')::json coordinates"
      : type === "id" ? "returning " + this.keys.join(", ") : "";
    return dbcall(sql.add, { values, colValues, returning });
  }

  public update(type: string, data: any): any {
    const where = data.ids;
    const values = data.values;
    console.log("where:", where);
    console.log("values:", values);
    values.coordinates = preparePolygonValues(values.coordinates);
    const set = this.pgp.helpers.sets(values, RegionsRepository.cs.update);
    console.log("set:", set);
    const returning = type === "full" ? "returning id, type, name, gtype, (ST_AsGeoJSON(coordinates)::json->>'coordinates')::json coordinates" : "";
    if (type === "full") {
      return this.db.any(sql.update, { set, where, returning });
    } else {
      return this.db.result(sql.update, { set, where, returning }, (r: IResult) => ({ updated: r.rowCount }));
    }
  }

  public delete(where: any[]) {
    return this.db.result(sql.remove, { where }, (r: IResult) => ({ deleted: r.rowCount }));
  }

  private createColumnsets() {
    // create all ColumnSet objects only once:
    if (!RegionsRepository.cs) {
      const helpers = this.pgp.helpers, cs: RegionColumnsets = {};

      // Type TableName is useful when schema isn't default "public" ,
      // otherwise you can just pass in a string for the table name.
      // const table = new helpers.TableName({table: "products", schema: "public"});

      // cs.update = cs.insert.extend(["?id", "?user_id"]);
      const colPosition = new this.pgp.helpers.Column({
        name: "coordinates", // required
        mod: ":raw", // optional
        init: (params: any) => {
          console.log("cs: params: ", params);
          // return this.pgp.as.format(`point(${params.value.x}, ${params.value.y})`);
          const c = { type: params.source.gtype, coordinates: [params.source.coordinates] };
          return "ST_SetSRID(ST_GeomFromGeoJSON('" + JSON.stringify(c) + "'::json), 4326)";

          return "ST_MakePolygon(ST_MakeLine(array[" + params.value.map((pt: any) => {
            console.log("pt:", pt, this.pgp.as.format(`ST_SetSRID(ST_MakePoint(${pt[0]}, ${pt[1]}), 4326)`));
            return this.pgp.as.format(`ST_SetSRID(ST_MakePoint(${pt[0]}, ${pt[1]}), 4326)`);
          }).join(", ") + "]))";
          // return this.pgp.as.format(`ST_SetSRID(ST_MakePoint(${params.value.x}, ${params.value.y}), 4326)`);
        }
      });
      cs.insert = new helpers.ColumnSet(colPosition);
      cs.update = new helpers.ColumnSet([ "type", "name", colPosition, "gtype" ]);

      RegionsRepository.cs = cs;
    }
  }
}

interface RegionColumnsets {
  insert?: ColumnSet;
  update?: ColumnSet;
}
