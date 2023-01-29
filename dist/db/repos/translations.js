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
// id, label, ordernum, enabled
// schemas
exports.shTranslationsCreate = Joi.object().keys({
    id: Joi.string().required(),
    label: Joi.string().required(),
    ordernum: Joi.number(),
    enabled: Joi.bool(),
});
exports.shTranslationsValues = Joi.object().keys({
    label: Joi.string(),
    ordernum: Joi.number(),
    enabled: Joi.bool(),
});
exports.shTranslationsUpdate = Joi.object().keys({
    ids: Joi.array().items(default_schemas_1.shText).required(),
    values: exports.shTranslationsValues.required(),
});
const sql = sqlProvider.translations;
class TranslationsRepository {
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
}
exports.TranslationsRepository = TranslationsRepository;
//# sourceMappingURL=translations.js.map