import { IDatabase, IMain } from "pg-promise";
import { IResult } from "pg-promise/typescript/pg-subset";
import sqlProvider = require("../sql");
import { checkModifiedIDs } from "../../server/handler";

// import _ from "lodash";

import * as Joi from "@hapi/joi";

import { shID } from "../../server/default-schemas";
import { shSensors, shTimeFrame, shLocations } from "./data";

// id, name, enabled, action

// schemas
export const shFiltersCreate = Joi.object().keys({
  name: Joi.string().required(),
  enabled: Joi.boolean(),
  action: Joi.string(),
  visible: Joi.string().valid('private', 'public'),
  sensors: Joi.array().items(shSensors).required(),
  time: shTimeFrame.required(),
  locations: shLocations.required(),
});

export const shFiltersValues = Joi.object().keys({
  name: Joi.string(),
  enabled: Joi.boolean(),
  action: Joi.string(),
  visible: Joi.string().valid('private', 'public'),
  sensors: Joi.array().items(shSensors),
  time: shTimeFrame,
  locations: shLocations,
});

export const shFiltersUpdate = Joi.object().keys({
  ids: Joi.array().items(shID).required(),
  values: shFiltersValues.required(),
});

const sql = sqlProvider.filters;

export class FiltersRepository {
  private db: IDatabase<any>;
  private pgp: IMain;
  private keys: string[] = ["id"];

  constructor(db: any, pgp: any) {
    this.db = db;
    this.pgp = pgp;
  }

  public get() {
    return this.db.any(sql.getAll);
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
    if(data.values.sensors) {
      data.values.sensors = JSON.stringify(data.values.sensors); // explicit converts array to json
    }

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
