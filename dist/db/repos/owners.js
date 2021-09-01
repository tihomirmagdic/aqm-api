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
// id, email, name, created, password, admin, enabled, groupowner
// schemas
exports.shOwnersCreate = Joi.object().keys({
    email: Joi.string().email().required(),
    name: Joi.string().required(),
    password: Joi.string().required(),
    admin: Joi.boolean().default(false),
    enabled: Joi.boolean().default(true),
    groupowner: Joi.boolean().default(false)
});
exports.shOwnersValues = Joi.object().keys({
    email: Joi.string().email(),
    name: Joi.string(),
    password: Joi.string(),
    admin: Joi.boolean(),
    enabled: Joi.boolean(),
    groupowner: Joi.boolean()
});
exports.shOwnersUpdate = Joi.object().keys({
    ids: Joi.array().items(default_schemas_1.shID).required(),
    values: exports.shOwnersValues.required(),
});
const sql = sqlProvider.owners;
class OwnersRepository {
    constructor(db, pgp) {
        this.keys = ["id"];
        this.secure_columns = "id, email, name, created, admin, enabled, groupowner"; // all except password and salt
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
        //console.log("type:", type);
        //console.log("values:", values);
        const colValues = this.pgp.helpers.values(values);
        const dbcall = type === "fast" ? this.db.none : this.db.one;
        const returning = type === "full" ? `returning ${this.secure_columns}` : type === "id" ? "returning " + this.keys.join(", ") : "";
        return dbcall(sql.add, { values, colValues, returning });
    }
    update(type, data) {
        const where = data.ids;
        const set = this.pgp.helpers.sets(data.values);
        const returning = type === "full" ? `returning ${this.secure_columns}` : "";
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
}
exports.OwnersRepository = OwnersRepository;
//# sourceMappingURL=owners.js.map