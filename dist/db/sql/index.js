"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_promise_1 = require("pg-promise");
const path = __importStar(require("path"));
/**
 * First, copy all .sql files with npm run copy:assets
 *
 * In development watch an dcopz any changes in .sql files with npm run watch:assets
 *
 */
exports.devicetypes = {
    getAll: sql('device-types/get-all.sql'),
    getByIDs: sql('device-types/get-by-ids.sql'),
    add: sql('device-types/add.sql'),
    update: sql('device-types/update.sql'),
    remove: sql('device-types/remove.sql'),
};
exports.filters = {
    getAll: sql('filters/get-all.sql'),
    getByIDs: sql('filters/get-by-ids.sql'),
    add: sql('filters/add.sql'),
    update: sql('filters/update.sql'),
    remove: sql('filters/remove.sql'),
};
exports.filteritems = {
    getAll: sql('filter-items/get-all.sql'),
    getByFilter: sql('filter-items/get-by-filter.sql'),
    getByIDs: sql('filter-items/get-by-ids.sql'),
    add: sql('filter-items/add.sql'),
    update: sql('filter-items/update.sql'),
    remove: sql('filter-items/remove.sql'),
};
exports.configurations = {
    getAll: sql('configurations/get-all.sql'),
    getByIDs: sql('configurations/get-by-ids.sql'),
    add: sql('configurations/add.sql'),
    update: sql('configurations/update.sql'),
    remove: sql('configurations/remove.sql'),
};
exports.configurationitems = {
    getAll: sql('configuration-items/get-all.sql'),
    getByConfiguration: sql('configuration-items/get-by-configuration.sql'),
    getByIDs: sql('configuration-items/get-by-ids.sql'),
    add: sql('configuration-items/add.sql'),
    update: sql('configuration-items/update.sql'),
    remove: sql('configuration-items/remove.sql'),
};
exports.regiontypes = {
    getAll: sql('region-types/get-all.sql'),
    getByIDs: sql('region-types/get-by-ids.sql'),
    add: sql('region-types/add.sql'),
    update: sql('region-types/update.sql'),
    remove: sql('region-types/remove.sql'),
};
exports.regions = {
    getAll: sql('regions/get-all.sql'),
    getByIDs: sql('regions/get-by-ids.sql'),
    add: sql('regions/add.sql'),
    update: sql('regions/update.sql'),
    remove: sql('regions/remove.sql'),
};
exports.owners = {
    getAll: sql('owners/get-all.sql'),
    getByIDs: sql('owners/get-by-ids.sql'),
    add: sql('owners/add.sql'),
    update: sql('owners/update.sql'),
    remove: sql('owners/remove.sql'),
};
exports.auth = {
    checkEmailPassword: sql('auth/check-email-password.sql'),
    checkEmail: sql('auth/check-email.sql'),
};
exports.firmwares = {
    getAll: sql('firmwares/get-all.sql'),
    getByIDs: sql('firmwares/get-by-ids.sql'),
    add: sql('firmwares/add.sql'),
    update: sql('firmwares/update.sql'),
    remove: sql('firmwares/remove.sql'),
};
exports.devices = {
    getAll: sql('devices/get-all.sql'),
    getByIDs: sql('devices/get-by-ids.sql'),
    getByOwner: sql('devices/get-by-owner.sql'),
    add: sql('devices/add.sql'),
    update: sql('devices/update.sql'),
    remove: sql('devices/remove.sql'),
};
exports.data = {
    get: sql('data/get.sql'),
    add: sql('data/add.sql'),
};
exports.cache = {
    getApiKeys: sql('cache/get-api-keys.sql'),
};
exports.users = {
    create: sql('users/create.sql'),
    empty: sql('users/empty.sql'),
    init: sql('users/init.sql'),
    drop: sql('users/drop.sql'),
    add: sql('users/add.sql')
};
///////////////////////////////////////////////
// Helper for linking to external query files;
function sql(file) {
    const fullPath = path.join(__dirname, file); // generating full path;
    const options = {
        // minifying the SQL is always advised;
        // see also option 'compress' in the API;
        minify: true
        // See also property 'params' for two-step template formatting
    };
    const qf = new pg_promise_1.QueryFile(fullPath, options);
    if (qf.error) {
        // Something is wrong with our query file :(
        // Testing all files through queries can be cumbersome,
        // so we also report it here, while loading the module:
        console.error(qf.error);
    }
    return qf;
    // See QueryFile API:
    // http://vitaly-t.github.io/pg-promise/QueryFile.html
}
///////////////////////////////////////////////////////////////////
// Possible alternative - enumerating all SQL files automatically:
// http://vitaly-t.github.io/pg-promise/utils.html#.enumSql
//# sourceMappingURL=index.js.map