import { IDatabase, IMain } from "pg-promise";
import { IResult } from "pg-promise/typescript/pg-subset";
import sqlProvider = require("../sql");
import { checkModifiedIDs } from "../../server/handler";

// import _ from "lodash";

import * as Joi from "@hapi/joi";

import { shText } from "../../server/default-schemas";

// id, name

// schemas
export const shConfigurationsCreate = Joi.object().keys({
  id: Joi.string().required(),
  name: Joi.string().required(),
});

export const shConfigurationsValues = Joi.object().keys({
  id: Joi.string(),
  name: Joi.string(),
});

export const shConfigurationsUpdate = Joi.object().keys({
  ids: Joi.array().items(shText).required(),
  values: shConfigurationsValues.required(),
});

const sql = sqlProvider.configurations;

export class ConfigurationsRepository {
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
