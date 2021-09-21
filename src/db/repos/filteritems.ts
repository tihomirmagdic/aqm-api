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
  min_max: Joi.string().valid('min', 'max').required(),
});

export const shFilterItemsCreate = Joi.object().keys({
  filter: Joi.number().required(),
  sensor: Joi.string().required(),
  value: Joi.number().required(),
  min_max: Joi.string().valid('min', 'max').required(),
});

export const shFilterItemsValues = Joi.object().keys({
  filter: Joi.number(),
  sensor: Joi.string(),
  value: Joi.number(),
  min_max: Joi.string().valid('min', 'max'),
});

export const shFilterItemsIds = Joi.object().keys({
  ids: Joi.array().items(shFilterItemsID).required(),
});

export const shFilterItemsUpdate = Joi.object().keys({
  ids: Joi.array().items(shFilterItemsID).required(),
  values: shFilterItemsValues.required(),
});

export const shFilterItemsMultipleCreate = Joi.array().items(shFilterItemsCreate);

export const shFilterItemsValuesWithKeys = Joi.object().keys({
  filter: Joi.number().required(),
  sensor: Joi.string().required(),
  min_max: Joi.string().valid('min', 'max').required(),
  value: Joi.number(),
});

export const shFilterItemsMultipleUpdate = Joi.array().items(shFilterItemsValuesWithKeys);

const sql = sqlProvider.filteritems;

export class FilterItemsRepository {
  private db: IDatabase<any>;

  private pgp: IMain;

  private keys: string[] = ["filter", "sensor", "min_max"];

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
    console.log("type:", type);
    console.log("data:", data);
    const where = data.ids;
    const set = this.pgp.helpers.sets(data.values);
    console.log("where:", where);
    console.log("set:", set);
    const returning = type === "full" ? "returning *" : type === "id" ? "returning " + this.keys.join(", ") : "";
    if (type === "fast") {
      return this.db.result(sql.update, { set, where, returning }, (r: IResult) => ({ updated: r.rowCount }));
    } else {
      return this.db.any(sql.update, { set, where, returning });
    }
  }

  public multipleCreate(type: string, data: any): any {
    console.log("type:", type);
    console.log("data:", data);
    const result: any[] = [];
    data.forEach((values: any) => {
      console.log("values:", values);
      result.push(this.add(type, { values}));
    });
    return Promise.all(result);
  }

  public async multipleUpdate(type: string, data: any): Promise<any> {
    console.log("type:", type);
    console.log("data:", data);
    const result: any[] = [];
    data.forEach((values: any) => {
      const ids: any[] = [{}];
      this.keys.forEach((key: string) => {
        ids[0][key] = values[key];
        delete values[key];
      });
      console.log("ids:", ids);
      console.log("values:", values);
      result.push(this.update(type, { ids, values}));
    });

    if (type === "fast") {
      const results = await Promise.all(result);
      console.log("results:", results);
      return { updated: results.reduce((prev: number, u: any) => (prev + u.updated), 0) };
    }
    else {
      console.log("not fast");
      return Promise.all(result);
    }
  }

  public delete(where: any[]) {
    return this.db.result(sql.remove, { where }, (r: IResult) => ({ deleted: r.rowCount }));
  }
}
