import { IDatabase, IMain } from "pg-promise";
import { IResult } from "pg-promise/typescript/pg-subset";
import sqlProvider = require("../sql");
import { checkModifiedIDs } from "../../server/handler";

// import _ from "lodash";

import * as Joi from "@hapi/joi";

import { shID } from "../../server/default-schemas";

// id, type, owner, firmware, ffirmware, configuration, fconfiguration, apikey, note, enabled

// schemas
export const shDevicesCreate = Joi.object().keys({
  type: Joi.string().required(),
  owner: Joi.number().required(),
  firmware: Joi.number().required(),
  ffirmware: Joi.number().allow(null),
  configuration: Joi.string().required(),
  fconfiguration: Joi.string().allow(null),
  apikey: Joi.string().required(),
  note: Joi.string(),
  enabled: Joi.boolean(),
});

export const shDevicesValues = Joi.object().keys({
  type: Joi.string(),
  owner: Joi.number(),
  firmware: Joi.number(),
  ffirmware: Joi.number().allow(null),
  configuration: Joi.string(),
  fconfiguration: Joi.string().allow(null),
  apikey: Joi.string(),
  note: Joi.string(),
  enabled: Joi.boolean(),
});

export const shDevicesUpdate = Joi.object().keys({
  ids: Joi.array().items(shID).required(),
  values: shDevicesValues.required(),
});

const sql = sqlProvider.devices;

export class DevicesRepository {
  private db: IDatabase<any>;
  private pgp: IMain;
  private keys: string[] = ["id"];

  constructor(db: any, pgp: any) {
    console.log("Device constructor:");
    this.db = db;
    this.pgp = pgp;
  }

  public get() {
    //return { a: "b" };
    console.log("before GET:", sql.getAll);
    console.log("db.$cn:", this.db.$cn);
    console.log("db.$config:", this.db.$config);
    return this.db.any(sql.getAll);
  }

  public getByIDs(where: any) {
    return this.db.any(sql.getByIDs, { where });
  }

  public getByOwner(owner: number) {
    return this.db.any(sql.getByOwner, { owner });
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
