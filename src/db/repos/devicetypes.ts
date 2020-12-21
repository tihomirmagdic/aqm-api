import { IDatabase, IMain } from "pg-promise";
import { IResult } from "pg-promise/typescript/pg-subset";
import sqlProvider = require("../sql");
import { checkModifiedIDs } from "../../server/handler";

// import _ from "lodash";

import * as Joi from "@hapi/joi";

import { shText } from "../../server/default-schemas";

// id, name, version

// schemas
export const shDeviceTypesCreate = Joi.object().keys({
  id: Joi.string().required(),
  name: Joi.string().required(),
  version: Joi.string().required(),
  initgroupowner: Joi.number().required(),
});

export const shDeviceTypesValues = Joi.object().keys({
  id: Joi.string(),
  name: Joi.string(),
  version: Joi.string(),
  initgroupowner: Joi.number(),
});

export const shDeviceTypesUpdate = Joi.object().keys({
  ids: Joi.array().items(shText).required(),
  values: shDeviceTypesValues.required(),
});

const sql = sqlProvider.devicetypes;

export class DeviceTypesRepository {
  private db: IDatabase<any>;
  private pgp: IMain;
  private keys: string[] = ["id"];

  constructor(db: any, pgp: any) {
    //console.log("DeviceTypes constructor:");
    this.db = db;
    this.pgp = pgp;
  }

  public get() {
    return this.db.any(sql.getAll);
  }

  public getByIDs(where: any) {
    return this.db.any(sql.getByIDs, { where });
  }

  public add0(type: string, values: any): any {
    if (type === "full") {
      return this.db.task("add device type", (t) =>
        this.add("id", values).then((id: any) => {
          console.log("id:", id);
          return this.getByIDs([id]);
        })
      );
    }
    const colValues = this.pgp.helpers.values(values);
    console.log("colValues:", colValues);
    const { dbcall, returning } =
      type === "id"
        ? {
            dbcall: this.db.one,
            returning: "returning " + this.keys.join(", "),
          } // return one record with id column
        : { dbcall: this.db.none, returning: "" }; // call SQL insert, and do not return any record
    return dbcall(sql.add, { values, colValues, returning });
  }

  public add(type: string, values: any): any {
    const colValues = this.pgp.helpers.values(values);
    const dbcall = type === "fast" ? this.db.none : this.db.one;
    const returning =
      type === "full"
        ? "returning *"
        : type === "id"
        ? "returning " + this.keys.join(", ")
        : "";
    return dbcall(sql.add, { values, colValues, returning });
  }

  public update0(type: string, data: any): any {
    if (type === "full") {
      return this.db.task("update device types", (t) =>
        this.update("fast", data).then(() => {
          checkModifiedIDs(data, this.keys);
          /*
            if (data.values.id) {
              data.ids.map((item: any) => item.id = data.values.hasOwnProperty("id") ? data.values.id : item.id);
            }
            */
          // console.log("before find:", data.ids);
          return this.getByIDs(data.ids);
        })
      );
    } else {
      const where = data.ids;
      const set = this.pgp.helpers.sets(data.values);
      return this.db.result(sql.update, { set, where }, (r: IResult) => ({
        updated: r.rowCount,
      }));
    }
  }

  public update(type: string, data: any): any {
    const where = data.ids;
    const set = this.pgp.helpers.sets(data.values);
    const returning = type === "full" ? "returning *" : "";
    if (type === "full") {
      return this.db.any(sql.update, { set, where, returning });
    } else {
      return this.db.result(
        sql.update,
        { set, where, returning },
        (r: IResult) => ({ updated: r.rowCount })
      );
    }
  }

  public delete(where: any[]) {
    return this.db.result(sql.remove, { where }, (r: IResult) => ({
      deleted: r.rowCount,
    }));
  }
}
