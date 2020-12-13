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
// import _ from "lodash";
const Joi = __importStar(require("@hapi/joi"));
const default_schemas_1 = require("../../server/default-schemas");
// id, type, owner, firmware, ffirmware, configuration, fconfiguration, apikey, note, enabled
// schemas
exports.shDevicesCreate = Joi.object().keys({
    type: Joi.string().required(),
    name: Joi.string(),
    owner: Joi.number().required(),
    firmware: Joi.number().required(),
    ffirmware: Joi.number().allow(null),
    configuration: Joi.string().required(),
    fconfiguration: Joi.string().allow(null),
    apikey: Joi.string().required(),
    public: Joi.boolean().required(),
    note: Joi.string(),
    enabled: Joi.boolean(),
});
exports.shDevicesValues = Joi.object().keys({
    type: Joi.string(),
    owner: Joi.number(),
    name: Joi.string(),
    firmware: Joi.number(),
    ffirmware: Joi.number().allow(null),
    configuration: Joi.string(),
    fconfiguration: Joi.string().allow(null),
    apikey: Joi.string(),
    public: Joi.boolean(),
    note: Joi.string(),
    enabled: Joi.boolean(),
});
exports.shDevicesUpdate = Joi.object().keys({
    ids: Joi.array().items(default_schemas_1.shID).required(),
    values: exports.shDevicesValues.required(),
});
const sql = sqlProvider.devices;
class DevicesRepository {
    constructor(db, pgp) {
        this.keys = ["id"];
        //console.log("Device constructor:");
        this.db = db;
        this.pgp = pgp;
    }
    get() {
        //return { a: "b" };
        //console.log("before GET:", sql.getAll);
        //console.log("db.$cn:", this.db.$cn);
        //console.log("db.$config:", this.db.$config);
        return this.db.any(sql.getAll);
    }
    getByIDs(where) {
        return this.db.any(sql.getByIDs, { where });
    }
    getByOwner(owner) {
        return this.db.any(sql.getByOwner, { owner });
    }
    add(type, values) {
        const colValues = this.pgp.helpers.values(values);
        const dbcall = type === "fast" ? this.db.none : this.db.one;
        const returning = type === "full"
            ? "returning *"
            : type === "id"
                ? "returning " + this.keys.join(", ")
                : "";
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
        return this.db.result(sql.remove, { where }, (r) => ({
            deleted: r.rowCount,
        }));
    }
}
exports.DevicesRepository = DevicesRepository;
//# sourceMappingURL=devices.js.map