import { IDatabase, IMain } from "pg-promise";
import { IResult } from "pg-promise/typescript/pg-subset";
import sqlProvider = require("../sql");
import { checkModifiedIDs, allSettled } from "../../server/handler";

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
  visibility: Joi.string().valid('private', 'public'),
  sensors: Joi.array().items(shSensors).required(),
  time: shTimeFrame.required(),
  locations: shLocations.required(),
});

export const shFiltersValues = Joi.object().keys({
  name: Joi.string(),
  enabled: Joi.boolean(),
  action: Joi.string(),
  visibility: Joi.string().valid('private', 'public'),
  sensors: Joi.array().items(shSensors),
  time: shTimeFrame,
  locations: shLocations,
});

export const shFiltersUpdate = Joi.object().keys({
  ids: Joi.array().items(shID).required(),
  values: shFiltersValues.required(),
});

export const shFiltersValuesForCopy = Joi.object().keys({
  id: Joi.number().required(),
  name: Joi.string(),
  enabled: Joi.boolean(),
  action: Joi.string(),
  visibility: Joi.string().valid('private', 'public'),
  sensors: Joi.array().items(shSensors),
  time: shTimeFrame,
  locations: shLocations,
});

const fieldList = (() => Object.keys(shFiltersValuesForCopy.describe().keys))();
const fieldListForOrder = [...fieldList, ...fieldList.map((field: string) => ('-' + field)), ...fieldList.map((field: string) => ('+' + field))];
console.log("fieldList:", fieldList);
console.log("fieldList for order:", fieldListForOrder);

const shFields = Joi.string()
  .valid(...fieldList);

const shFieldsForOrder = Joi.string()
  .valid(...fieldListForOrder);

export const shFiltersQuery = Joi.object().keys({
  //fields: Joi.array().unique().items(shFields),
  fields: Joi.array().unique().items(Joi.string()),
  order: Joi.array().unique().items(shFieldsForOrder),
  //fields: Joi.array().unique().items(Joi.string().valid(...fieldList)),
  //order: Joi.array().valid('id', 'name'),
  limit: Joi.number().integer(),
  bind: Joi.array().items(Joi.string()),
});

const sql = sqlProvider.filters;

export class FiltersRepository {
  private db: IDatabase<any>;

  private pgp: IMain;

  private keys: string[] = ["id"];

  private autokeys: string[] = ["id"]; // auto-generated keys

  constructor(db: any, pgp: any) {
    this.db = db;
    this.pgp = pgp;
  }

  public get(query: any) {
    console.log("query:", query);
    let { fields, order, limit } = query;

    const selectFields: string[] = [];
    fields = fields ?
      fields.map((field: string) => {
        let pair = field.split('=').map((value: string) => value.trim());
        selectFields.push(pair[pair.length - 1]);
        pair = pair.map((value: string) => '"' + value + '"');
        if (pair.length === 2) {
          return [pair[1], pair[0]].join(' as ');
        } else {
          return pair[0];
        }
      }
    ).join(', ') : '*';

    console.log("selectFields: ", selectFields);
    console.log("fields: ", fields);
    Joi.attempt(selectFields, Joi.array().unique().items(shFields), 'fields') ;

    order = order ? ' order by ' + order.map((field: string) => field.startsWith('-') ? field.substr(1) + ' desc': field.startsWith('+') ? field.substr(1) : field).join(', ') : '';

    limit = limit ? ' limit ' + limit : '';

    return this.db.any(sql.getAll, { fields, order, limit});
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

  public copy(type: string, values: any): any {
    if (!this.autokeys.length) {
      throw new Error('autokeys empty! use clone instead');
    }

    const valueKeys = Object.keys(values);
    const whereFields: any = {};
    valueKeys.forEach((field: string) => {
      if (this.keys.includes(field)) {
        whereFields[field] = values[field];
        delete values[field];
      }
    });

    return this.cloneItem(type, whereFields, values);
  }

  public cloneItem(type: string, whereFields: any, values: any): any {
    const valueKeys = Object.keys(values);
    const allFields = Object.keys(shFiltersValuesForCopy.describe().keys);

    const selectFields: any = {};
    let selectValues: string = '';

    allFields.forEach((field: string) => {
      if (!this.autokeys.includes(field)) {
        const value = valueKeys.includes(field) ? values[field] : undefined;
        selectFields[field] = value;
        if (selectValues !== '') {
          selectValues += ', ';
        }
        if (value === undefined) {
          selectValues += field;
        } else {
          const formatted = this.pgp.as.format("${value:raw}", { value });
          if (Array.isArray(value)) {
            selectValues += `${formatted}`;
          } else {
            selectValues += `'${formatted}'`;
          }
        }
      }
    });

    const dbcall = type === "fast" ? this.db.none : this.db.one;
    const returning = type === "full" ? "returning *" : type === "id" ? "returning " + this.keys.join(", ") : "";
    return dbcall(sql.copy, { values: selectFields, select: selectValues, where: whereFields, returning });
  }

  public clone(type: string, values: any): any {
    const result: any[] = [];
    values.ids.forEach((id: any) => {
      result.push(this.cloneItem(type, id, values.values));
    });
    return allSettled(result);
  }
}
