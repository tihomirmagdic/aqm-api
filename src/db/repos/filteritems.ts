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
    const dbcall = type === "fast" ? this.db.result : this.db.one;
    const returning = type === "full" ? "returning *" : type === "id" ? "returning " + this.keys.join(", ") : "";
    if (type === "fast") {
      return dbcall(sql.add, { values, colValues, returning }, (r: IResult) => ({ created: r.rowCount }));
    } else {
      return dbcall(sql.add, { values, colValues, returning });
    }
  }

  public update(type: string, data: any): any {
    const where = data.ids;
    const set = this.pgp.helpers.sets(data.values);
    const returning = type === "full" ? "returning *" : type === "id" ? "returning " + this.keys.join(", ") : "";
    if (type === "fast") {
      return this.db.result(sql.update, { set, where, returning }, (r: IResult) => ({ updated: r.rowCount }));
    } else {
      return this.db.any(sql.update, { set, where, returning });
    }
  }

  filterProps(obj: any, props: string[]): any {
    Object.keys(obj).forEach((key: string) => !props.includes(key) ? delete obj[key] : null );
    return obj;
  }

  allSettled(promises: any) {
    const wrappedPromises = promises.map((p: any) => Promise.resolve(p)
        .then(
            val => ({ status: "ok", result: val }),
            err => ({ status: err.name || "rejected", reason: this.filterProps(err, ["code", "detail", "constraint"]) })));
    return Promise.all(wrappedPromises);
  }

  public async multipleCreate(type: string, data: any): Promise<any> {
    const result: any[] = [];
    data.forEach((values: any) => {
      result.push(this.add(type, values));
    });
    if (type === "xfast") {
      const results = await this.allSettled(result);
      return { created: results.reduce((prev: number, call: any) => (prev + (call.status === "fulfilled" ? call.value.created : 0)), 0) };
    }
    else {
      return this.allSettled(result);
      // return Promise.all(result);
    }
  }

  public async multipleUpdate(type: string, data: any): Promise<any> {
    const result: any[] = [];
    data.forEach((values: any) => {
      const ids: any[] = [{}];
      this.keys.forEach((key: string) => {
        ids[0][key] = values[key];
        delete values[key];
      });
      result.push(this.update(type, { ids, values}));
    });

    if (type === "fast") {
      const results = await this.allSettled(result);
      return { updated: results.reduce((prev: number, call: any) => (prev + (call.status === "fulfilled" ? call.value.updated : 0)), 0) };
    } else {
      return Promise.all(result);
    }
  }

  public delete(where: any[]) {
    return this.db.result(sql.remove, { where }, (r: IResult) => ({ deleted: r.rowCount }));
  }
}
