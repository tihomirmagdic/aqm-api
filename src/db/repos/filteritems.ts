import { IDatabase, IMain } from "pg-promise";
import { IResult } from "pg-promise/typescript/pg-subset";
import sqlProvider = require("../sql");
import { checkModifiedIDs } from "../../server/handler";

// import _ from "lodash";

import * as Joi from "@hapi/joi";

// filter, sensor, value, min_max,

// schemas
export const shFilterItemsID = Joi.object().keys({
  filter: Joi.number().required(),
  sensor: Joi.string().required(),
});

export const shFilterItemsCreate = Joi.object().keys({
  filter: Joi.number().required(),
  sensor: Joi.string().required(),
  value: Joi.number().required(),
  min_max: Joi.string().required(),
});

export const shFilterItemsValues = Joi.object().keys({
  filter: Joi.number(),
  sensor: Joi.string(),
  value: Joi.number(),
  min_max: Joi.string(),
});

export const shFilterItemsIds = Joi.object().keys({
  ids: Joi.array().items(shFilterItemsID).required(),
});

export const shFilterItemsUpdate = Joi.object().keys({
  ids: Joi.array().items(shFilterItemsID).required(),
  values: shFilterItemsValues.required(),
});

const sql = sqlProvider.filteritems;

export class FilterItemsRepository {
  private db: IDatabase<any>;

  private pgp: IMain;

  private keys: string[] = ["filter", "sensor"];

  constructor(db: any, pgp: any) {
    this.db = db;
    this.pgp = pgp;
  }

  public get() {
    return this.db.any(sql.getAll);
  }

  public getByFilter(filter: any) {
    return this.db.any(sql.getByFilter, { filter });
  }

  public getByIDs(where: any) {
    return this.db.any(sql.getByIDs, { where });
  }

  public add(type: string, values: any): any {
    const colValues = this.pgp.helpers.values(values);
    const dbcall = type === "fast" ? this.db.none : this.db.one;
    const returning = type === "full" ? "returning *" : type === "id" ? "returning " + this.keys.join(", ") : "";
    return dbcall(sql.add, { values, colValues, returning });
  }

  public update(type: string, data: any): any {
    const where = data.ids;
    const set = this.pgp.helpers.sets(data.values);
    const returning = type === "full" ? "returning *" : "";
    if (type === "full") {
      return this.db.any(sql.update, { set, where, returning });
    } else {
      return this.db.result(sql.update, { set, where, returning }, (r: IResult) => ({ updated: r.rowCount }));
    }
  }

  public delete(where: any[]) {
    return this.db.result(sql.remove, { where }, (r: IResult) => ({ deleted: r.rowCount }));
  }
}