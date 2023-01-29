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
// translation, id, value
// schemas
exports.shDictionaryID = Joi.object().keys({
    translation: Joi.string().required(),
    id: Joi.string().required(),
});
exports.shDictionaryCreate = Joi.object().keys({
    translation: Joi.string().required(),
    id: Joi.string().required(),
    value: Joi.string().required(),
});
exports.shDictionaryValues = Joi.object().keys({
    translation: Joi.string(),
    id: Joi.string(),
    value: Joi.string(),
});
exports.shDictionaryIds = Joi.object().keys({
    ids: Joi.array().items(exports.shDictionaryID).required(),
});
exports.shDictionaryUpdate = Joi.object().keys({
    ids: Joi.array().items(exports.shDictionaryID).required(),
    values: exports.shDictionaryValues.required(),
});
const sql = sqlProvider.dictionary;
class DictionaryRepository {
    constructor(db, pgp) {
        this.keys = ["translation", "id"];
        this.db = db;
        this.pgp = pgp;
    }
    getByTranslation(translation) {
        return this.db.any(sql.getByTranslation, { translation });
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
exports.DictionaryRepository = DictionaryRepository;
//# sourceMappingURL=dictionary.js.map