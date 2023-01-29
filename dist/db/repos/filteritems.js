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
// filter, sensor, value, min_max,
// schemas
exports.shFilterItemsID = Joi.object().keys({
    filter: Joi.number().required(),
    sensor: Joi.string().required(),
    min_max: Joi.string().valid('min', 'max').required(),
});
exports.shFilterItemsCreate = Joi.object().keys({
    filter: Joi.number().required(),
    sensor: Joi.string().required(),
    value: Joi.number().required(),
    min_max: Joi.string().valid('min', 'max').required(),
});
exports.shFilterItemsValues = Joi.object().keys({
    filter: Joi.number(),
    sensor: Joi.string(),
    value: Joi.number(),
    min_max: Joi.string().valid('min', 'max'),
});
exports.shFilterItemsIds = Joi.object().keys({
    ids: Joi.array().items(exports.shFilterItemsID).required(),
});
exports.shFilterItemsUpdate = Joi.object().keys({
    ids: Joi.array().items(exports.shFilterItemsID).required(),
    values: exports.shFilterItemsValues.required(),
});
exports.shFilterItemsMultipleCreate = Joi.array().items(exports.shFilterItemsCreate);
exports.shFilterItemsValuesWithKeys = Joi.object().keys({
    filter: Joi.number().required(),
    sensor: Joi.string().required(),
    min_max: Joi.string().valid('min', 'max').required(),
    value: Joi.number(),
});
exports.shFilterItemsValuesForCopy = Joi.object().keys({
    filter: Joi.number().required(),
    sensor: Joi.string().required(),
    value: Joi.number().required(),
    min_max: Joi.string().valid('min', 'max').required(),
});
exports.shFilterItemsMultipleUpdate = Joi.array().items(exports.shFilterItemsValuesWithKeys);
const sql = sqlProvider.filteritems;
class FilterItemsRepository {
    constructor(db, pgp) {
        this.keys = ["filter", "sensor", "min_max"];
        this.autokeys = []; // auto-generated keys
        this.db = db;
        this.pgp = pgp;
    }
    get() {
        return this.db.any(sql.getAll);
    }
    getByFilter(filter) {
        return this.db.any(sql.getByFilter, { filter });
    }
    getByIDs(where) {
        return this.db.any(sql.getByIDs, { where });
    }
    add(type, values) {
        const colValues = this.pgp.helpers.values(values);
        const dbcall = type === "fast" ? this.db.result : this.db.one;
        const returning = type === "full" ? "returning *" : type === "id" ? "returning " + this.keys.join(", ") : "";
        if (type === "fast") {
            return dbcall(sql.add, { values, colValues, returning }, (r) => ({ created: r.rowCount }));
        }
        else {
            return dbcall(sql.add, { values, colValues, returning });
        }
    }
    update(type, data) {
        const where = data.ids;
        const set = this.pgp.helpers.sets(data.values);
        const returning = type === "full" ? "returning *" : type === "id" ? "returning " + this.keys.join(", ") : "";
        if (type === "fast") {
            return this.db.result(sql.update, { set, where, returning }, (r) => ({ updated: r.rowCount }));
        }
        else {
            return this.db.any(sql.update, { set, where, returning });
        }
    }
    filterProps(obj, props) {
        Object.keys(obj).forEach((key) => !props.includes(key) ? delete obj[key] : null);
        return obj;
    }
    allSettledx(promises) {
        const wrappedPromises = promises.map((p) => Promise.resolve(p)
            .then(val => ({ status: "ok", result: val }), err => ({ status: err.name || "rejected", reason: this.filterProps(err, ["code", "detail", "constraint"]) })));
        return Promise.all(wrappedPromises);
    }
    async multipleCreate(type, data) {
        const result = [];
        data.forEach((values) => {
            result.push(this.add(type, values));
        });
        if (type === "xfast") {
            const results = await handler_1.allSettled(result);
            return { created: results.reduce((prev, call) => (prev + (call.status === "ok" ? call.value.created : 0)), 0) };
        }
        else {
            return handler_1.allSettled(result);
            // return Promise.all(result);
        }
    }
    async multipleUpdate(type, data) {
        const result = [];
        data.forEach((values) => {
            const ids = [{}];
            this.keys.forEach((key) => {
                ids[0][key] = values[key];
                delete values[key];
            });
            result.push(this.update(type, { ids, values }));
        });
        if (type === "xfast") {
            const results = await handler_1.allSettled(result);
            return { updated: results.reduce((prev, call) => (prev + (call.status === "ok" ? call.result.updated : 0)), 0) };
        }
        else {
            return handler_1.allSettled(result);
            // return Promise.all(result);
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
        const allFields = Object.keys(exports.shFilterItemsValuesForCopy.describe().keys);
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
        const dbcall = type === "fast" ? this.db.result : this.db.one;
        const returning = type === "full" ? "returning *" : type === "id" ? "returning " + this.keys.join(", ") : "";
        if (type === "fast") {
            return dbcall(sql.copy, { values: selectFields, select: selectValues, where: whereFields, returning }, (r) => ({ created: r.rowCount }));
        }
        else {
            return dbcall(sql.copy, { values: selectFields, select: selectValues, where: whereFields, returning });
        }
    }
    async clone(type, values) {
        const result = [];
        values.ids.forEach((id) => {
            result.push(this.cloneItem(type, id, values.values));
        });
        return handler_1.allSettled(result);
    }
    async multipleCreate0(type, data) {
        const result = [];
        data.forEach((values) => {
            result.push(this.add(type, values));
        });
        if (type === "xfast") {
            const results = await handler_1.allSettled(result);
            return { created: results.reduce((prev, call) => (prev + (call.status === "ok" ? call.value.created : 0)), 0) };
        }
        else {
            return handler_1.allSettled(result);
            // return Promise.all(result);
        }
    }
}
exports.FilterItemsRepository = FilterItemsRepository;
//# sourceMappingURL=filteritems.js.map