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
// id, type, name, coordinates
// schemas
exports.shNumber = Joi.number().required();
exports.shPolygonPoints = Joi.array().items(exports.shNumber);
exports.shPolygon = Joi.array().items(exports.shPolygonPoints);
exports.shPolygons = Joi.object().keys({
    coordinates: Joi.array().items(exports.shPolygon).required(),
    type: Joi.string().valid('Polygon').required()
});
exports.shRegionsCreate = Joi.object().keys({
    type: Joi.string().required(),
    name: Joi.string().required(),
    coordinates: exports.shPolygon.required(),
    gtype: Joi.string().valid('Polygon').required()
});
exports.shRegionsValues = Joi.object().keys({
    type: Joi.string(),
    name: Joi.string(),
    coordinates: exports.shPolygon.required(),
    gtype: Joi.string().valid('Polygon').required()
});
exports.shRegionsUpdate = Joi.object().keys({
    ids: Joi.array().items(default_schemas_1.shID).required(),
    values: exports.shRegionsValues.required(),
});
const sql = sqlProvider.regions;
class RegionsRepository {
    constructor(db, pgp) {
        this.keys = ["id"];
        this.existingCols = (values, columnSet) => {
            const keys = Object.keys(values);
            return keys.map((key) => columnSet.columns.find((c) => c.name === key) ||
                new this.pgp.helpers.Column({ name: key, skip: (c) => !c.exists }));
        };
        this.db = db;
        this.pgp = pgp;
        this.createColumnsets();
    }
    get() {
        return this.db.any(sql.getAll);
    }
    getByIDs(where) {
        return this.db.any(sql.getByIDs, { where });
    }
    add(type, values) {
        // console.log("regions add0: ", values);
        values.coordinates = handler_1.preparePolygonValues(values.coordinates);
        const cols = this.existingCols(values, RegionsRepository.cs.insert);
        // console.log("values:", values);
        // console.log("cols:", cols);
        const colValues = this.pgp.helpers.values(values, cols);
        // console.log("colValues:", colValues);
        const dbcall = type === "fast" ? this.db.none : this.db.one;
        const returning = type === "full" ? "returning id, type, name, gtype, (ST_AsGeoJSON(coordinates)::json->>'coordinates')::json coordinates"
            : type === "id" ? "returning " + this.keys.join(", ") : "";
        return dbcall(sql.add, { values, colValues, returning });
    }
    update(type, data) {
        const where = data.ids;
        const values = data.values;
        console.log("where:", where);
        console.log("values:", values);
        values.coordinates = handler_1.preparePolygonValues(values.coordinates);
        const set = this.pgp.helpers.sets(values, RegionsRepository.cs.update);
        console.log("set:", set);
        const returning = type === "full" ? "returning id, type, name, gtype, (ST_AsGeoJSON(coordinates)::json->>'coordinates')::json coordinates" : "";
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
    createColumnsets() {
        // create all ColumnSet objects only once:
        if (!RegionsRepository.cs) {
            const helpers = this.pgp.helpers, cs = {};
            // Type TableName is useful when schema isn't default "public" ,
            // otherwise you can just pass in a string for the table name.
            // const table = new helpers.TableName({table: "products", schema: "public"});
            // cs.update = cs.insert.extend(["?id", "?user_id"]);
            const colPosition = new this.pgp.helpers.Column({
                name: "coordinates",
                mod: ":raw",
                init: (params) => {
                    console.log("cs: params: ", params);
                    // return this.pgp.as.format(`point(${params.value.x}, ${params.value.y})`);
                    const c = { type: params.source.gtype, coordinates: [params.source.coordinates] };
                    return "ST_SetSRID(ST_GeomFromGeoJSON('" + JSON.stringify(c) + "'::json), 4326)";
                    return "ST_MakePolygon(ST_MakeLine(array[" + params.value.map((pt) => {
                        console.log("pt:", pt, this.pgp.as.format(`ST_SetSRID(ST_MakePoint(${pt[0]}, ${pt[1]}), 4326)`));
                        return this.pgp.as.format(`ST_SetSRID(ST_MakePoint(${pt[0]}, ${pt[1]}), 4326)`);
                    }).join(", ") + "]))";
                    // return this.pgp.as.format(`ST_SetSRID(ST_MakePoint(${params.value.x}, ${params.value.y}), 4326)`);
                }
            });
            cs.insert = new helpers.ColumnSet(colPosition);
            cs.update = new helpers.ColumnSet([colPosition, ...Object.keys(exports.shRegionsValues.describe().keys).filter((key) => key !== "coordinates")]);
            RegionsRepository.cs = cs;
        }
    }
}
exports.RegionsRepository = RegionsRepository;
//# sourceMappingURL=regions.js.map