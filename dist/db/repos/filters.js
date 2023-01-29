"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const sqlProvider = require("../sql");
const handler_1 = require("../../server/handler");
// import _ from "lodash";
const Joi = __importStar(require("@hapi/joi"));
const default_schemas_1 = require("../../server/default-schemas");
const data_1 = require("./data");
// id, name, enabled, action
// schemas
exports.shFiltersCreate = Joi.object().keys({
    name: Joi.string().required(),
    enabled: Joi.boolean(),
    action: Joi.string(),
    visibility: Joi.string().valid('private', 'public'),
    sensors: Joi.array().items(data_1.shSensors).required(),
    time: data_1.shTimeFrame.required(),
    locations: data_1.shLocations.required(),
});
exports.shFiltersValues = Joi.object().keys({
    name: Joi.string(),
    enabled: Joi.boolean(),
    action: Joi.string(),
    visibility: Joi.string().valid('private', 'public'),
    sensors: Joi.array().items(data_1.shSensors),
    time: data_1.shTimeFrame,
    locations: data_1.shLocations,
});
exports.shFiltersUpdate = Joi.object().keys({
    ids: Joi.array().items(default_schemas_1.shID).required(),
    values: exports.shFiltersValues.required(),
});
exports.shFiltersValuesForCopy = Joi.object().keys({
    id: Joi.number().required(),
    name: Joi.string(),
    enabled: Joi.boolean(),
    action: Joi.string(),
    visibility: Joi.string().valid('private', 'public'),
    sensors: Joi.array().items(data_1.shSensors),
    time: data_1.shTimeFrame,
    locations: data_1.shLocations,
});
const fieldList = (() => Object.keys(exports.shFiltersValuesForCopy.describe().keys))();
const fieldListForOrder = [...fieldList, ...fieldList.map((field) => ('-' + field)), ...fieldList.map((field) => ('+' + field))];
console.log("fieldList:", fieldList);
console.log("fieldList for order:", fieldListForOrder);
const shFields = Joi.string()
    .valid(...fieldList);
const shFieldsForOrder = Joi.string()
    .valid(...fieldListForOrder);
exports.shFiltersQuery = Joi.object().keys({
    // fields: Joi.array().unique().items(shFields),
    fields: Joi.array().unique().items(Joi.string()),
    order: Joi.array().unique().items(shFieldsForOrder),
    // fields: Joi.array().unique().items(Joi.string().valid(...fieldList)),
    // order: Joi.array().valid('id', 'name'),
    limit: Joi.number().integer(),
    bind: Joi.array().items(Joi.string()),
});
const sql = sqlProvider.filters;
class FiltersRepository {
    constructor(db, pgp) {
        this.keys = ["id"];
        this.autokeys = ["id"]; // auto-generated keys
        this.db = db;
        this.pgp = pgp;
    }
    get(query) {
        console.log("query:", query);
        let { fields, order, limit } = query;
        const selectFields = [];
        fields = fields ?
            fields.map((field) => {
                let pair = field.split('=').map((value) => value.trim());
                selectFields.push(pair[pair.length - 1]);
                pair = pair.map((value) => '"' + value + '"');
                if (pair.length === 2) {
                    return [pair[1], pair[0]].join(' as ');
                }
                else {
                    return pair[0];
                }
            }).join(', ') : '*';
        console.log("selectFields: ", selectFields);
        console.log("fields: ", fields);
        Joi.attempt(selectFields, Joi.array().unique().items(shFields), 'fields');
        order = order ? ' order by ' + order.map((field) => field.startsWith('-') ? field.substr(1) + ' desc' : field.startsWith('+') ? field.substr(1) : field).join(', ') : '';
        limit = limit ? ' limit ' + limit : '';
        return this.db.any(sql.getAll, { fields, order, limit });
    }
    getByIDs(where) {
        return this.db.any(sql.getByIDs, { where });
    }
    add(type, values) {
        const colValues = this.pgp.helpers.values(values);
        const dbcall = type === "fast" ? this.db.none : this.db.one;
        const returning = type === "full" ? "returning *" : type === "id" ? "returning " + this.keys.join(", ") : "";
        return dbcall(sql.add, { values, colValues, returning });
    }
    update(type, data) {
        const where = data.ids;
        const set = this.pgp.helpers.sets(data.values);
        const returning = type === "full" ? "returning *" : "";
        if (type === "full") {
            return this.db.any(sql.update, { set, where, returning });
        }
        else {
            return this.db.result(sql.update, { set, where, returning }, (r) => ({ updated: r.rowCount }));
        }
    }
    delete(where) {
        return this.db.result(sql.remove, { where }, (r) => ({ deleted: r.rowCount }));
    }
    copy(type, values) {
        if (!this.autokeys.length) {
            throw new Error('autokeys empty! use clone instead');
        }
        const valueKeys = Object.keys(values);
        const whereFields = {};
        valueKeys.forEach((field) => {
            if (this.keys.includes(field)) {
                whereFields[field] = values[field];
                delete values[field];
            }
        });
        return this.cloneItem(type, whereFields, values);
    }
    cloneItem(type, whereFields, values) {
        const valueKeys = Object.keys(values);
        const allFields = Object.keys(exports.shFiltersValuesForCopy.describe().keys);
        const selectFields = {};
        let selectValues = '';
        allFields.forEach((field) => {
            if (!this.autokeys.includes(field)) {
                const value = valueKeys.includes(field) ? values[field] : undefined;
                selectFields[field] = value;
                if (selectValues !== '') {
                    selectValues += ', ';
                }
                if (value === undefined) {
                    selectValues += field;
                }
                else {
                    const formatted = this.pgp.as.format("${value:raw}", { value });
                    if (Array.isArray(value)) {
                        selectValues += `${formatted}`;
                    }
                    else {
                        selectValues += `'${formatted}'`;
                    }
                }
            }
        });
        const dbcall = type === "fast" ? this.db.one : this.db.one;
        const returning = type === "full" ? "returning *" : type === "id" ? "returning " + this.keys.join(", ") : "";
        if (type === "fast") {
            return dbcall(sql.copy, { values: selectFields, select: selectValues, where: whereFields, returning }, (r) => ({ created: r.rowCount }));
        }
        else {
            return dbcall(sql.copy, { values: selectFields, select: selectValues, where: whereFields, returning });
        }
    }
    clone(type, values) {
        const result = [];
        values.ids.forEach((id) => {
            result.push(this.cloneItem(type, id, values.values));
        });
        return handler_1.allSettled(result);
    }
}
exports.FiltersRepository = FiltersRepository;
//# sourceMappingURL=filters.js.map