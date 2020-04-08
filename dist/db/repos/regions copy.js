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
// id, type, name, area
// schemas
const Position = Joi.object().keys({
    x: Joi.number().allow(null),
    y: Joi.number().allow(null),
});
exports.shRegionsCreate = Joi.object().keys({
    id: Joi.string().required(),
    type: Joi.string().required(),
    name: Joi.string().required(),
    area: Joi.array().items(Position).required()
});
exports.shRegionsValues = Joi.object().keys({
    id: Joi.string(),
    type: Joi.string(),
    name: Joi.string(),
    area: Joi.array().items(Position)
});
exports.shRegionsUpdate = Joi.object().keys({
    ids: Joi.array().items(default_schemas_1.shText).required(),
    values: exports.shRegionsValues.required(),
});
const sql = sqlProvider.regions;
class RegionsRepository {
    constructor(db, pgp) {
        this.keys = ["id"];
        this.db = db;
        this.pgp = pgp;
    }
    get() {
        return this.db.any(sql.getAll);
    }
    getByIDs(where) {
        return this.db.any(sql.getByIDs, { where });
    }
    add(type, values) {
        if (type === "full") {
            return this.db.task("add region", (t) => this.add("id", values).then((id) => {
                console.log("id:", id);
                return this.getByIDs([id]);
            }));
        }
        const colValues = this.pgp.helpers.values(values);
        console.log("colValues:", colValues);
        const { dbcall, returning } = (type === "id") ?
            { dbcall: this.db.one, returning: "returning " + this.keys.join(", ") } : // return one record with id column
            { dbcall: this.db.none, returning: "" }; // call SQL insert, and do not return any record
        return dbcall(sql.add, { values, colValues, returning });
    }
    update(type, data) {
        if (type === "full") {
            return this.db.task("update regions", (t) => this.update("fast", data).
                then(() => {
                handler_1.checkModifiedIDs(data, this.keys);
                /*
                if (data.values.id) {
                  data.ids.map((item: any) => item.id = data.values.hasOwnProperty("id") ? data.values.id : item.id);
                }
                */
                // console.log("before find:", data.ids);
                return this.getByIDs(data.ids);
            }));
        }
        else {
            const where = data.ids;
            const set = this.pgp.helpers.sets(data.values);
            return this.db.result(sql.update, { set, where }, (r) => ({ updated: r.rowCount }));
        }
    }
    delete(where) {
        return this.db.result(sql.remove, { where }, (r) => ({ deleted: r.rowCount }));
    }
}
exports.RegionsRepository = RegionsRepository;
//# sourceMappingURL=regions copy.js.map