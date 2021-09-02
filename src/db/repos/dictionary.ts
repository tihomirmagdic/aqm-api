import { IDatabase, IMain } from "pg-promise";
import { IResult } from "pg-promise/typescript/pg-subset";
import sqlProvider = require("../sql");
import { checkModifiedIDs } from "../../server/handler";

// import _ from "lodash";

import * as Joi from "@hapi/joi";

// translation, id, value

// schemas
export const shDictionaryID = Joi.object().keys({
  translation: Joi.string().required(),
  id: Joi.string().required(),
});

export const shDictionaryCreate = Joi.object().keys({
  translation: Joi.string().required(),
  id: Joi.string().required(),
  value: Joi.string().required(),
});

export const shDictionaryValues = Joi.object().keys({
  translation: Joi.string(),
  id: Joi.string(),
  value: Joi.string(),
});

export const shDictionaryIds = Joi.object().keys({
  ids: Joi.array().items(shDictionaryID).required(),
});

export const shDictionaryUpdate = Joi.object().keys({
  ids: Joi.array().items(shDictionaryID).required(),
  values: shDictionaryValues.required(),
});

const sql = sqlProvider.dictionary;

export class DictionaryRepository {
  private db: IDatabase<any>;

  private pgp: IMain;

  private keys: string[] = ["translation", "id"];

  constructor(db: any, pgp: any) {
    this.db = db;
    this.pgp = pgp;
  }

  public getByTranslation(translation: any) {
    return this.db.any(sql.getByTranslation, { translation });
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
