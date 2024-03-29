import { IDatabase, IMain } from "pg-promise";
import { IResult } from "pg-promise/typescript/pg-subset";
import sqlProvider = require("../sql");
import { checkModifiedIDs } from "../../server/handler";

// import _ from "lodash";

import * as Joi from "@hapi/joi";

import { shID } from "../../server/default-schemas";

// id, email, name, created, password, admin, enabled, groupowner

// schemas
export const shOwnersCreate = Joi.object().keys({
  email: Joi.string().email().required(),
  name: Joi.string().required(),
  password: Joi.string().required(),
  admin: Joi.boolean().default(false),
  enabled: Joi.boolean().default(true),
  groupowner: Joi.boolean().default(false)
});

export const shOwnersValues = Joi.object().keys({
  email: Joi.string().email(),
  name: Joi.string(),
  password: Joi.string(),
  admin: Joi.boolean(),
  enabled: Joi.boolean(),
  groupowner: Joi.boolean()
});

export const shOwnersUpdate = Joi.object().keys({
  ids: Joi.array().items(shID).required(),
  values: shOwnersValues.required(),
});

const sql = sqlProvider.owners;

export class OwnersRepository {
  private db: IDatabase<any>;
  private pgp: IMain;
  private keys: string[] = ["id"];
  private secureColumns: string = "id, email, name, created, admin, enabled, groupowner"; // all except password and salt

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
    // console.log("type:", type);
    // console.log("values:", values);
    const colValues = this.pgp.helpers.values(values);
    const dbcall = type === "fast" ? this.db.none : this.db.one;
    const returning = type === "full" ? `returning ${this.secureColumns}` : type === "id" ? "returning " + this.keys.join(", ") : "";
    return dbcall(sql.add, { values, colValues, returning });
  }

  public update(type: string, data: any): any {
    const where = data.ids;
    const set = this.pgp.helpers.sets(data.values);
    const returning = type === "full" ? `returning ${this.secureColumns}` : "";
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
