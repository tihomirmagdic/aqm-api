"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise = __importStar(require("bluebird")); // best promise library today
const db_config_1 = require("../db-config"); // db connection details
const pgPromise = require("pg-promise");
const repos_1 = require("../db/repos");
// pg-promise initialization options:
const initOptions = {
    // Using a custom promise library, instead of the default ES6 Promise:
    promiseLib: promise,
    // Extending the database protocol with our custom repositories;
    // API: http://vitaly-t.github.io/pg-promise/global.html#event:extend
    extend(obj, dc) {
        // Database Context (dc) is mainly needed for extending multiple databases with different access API.
        // Do not use 'require()' here, because this event occurs for every task and transaction being executed,
        // which should be as fast as possible.
        obj.cache = new repos_1.CacheRepository(obj, pgp);
        obj.devicetypes = new repos_1.DeviceTypesRepository(obj, pgp);
        obj.configurations = new repos_1.ConfigurationsRepository(obj, pgp);
        obj.configurationitems = new repos_1.ConfigurationItemsRepository(obj, pgp);
        obj.regiontypes = new repos_1.RegionTypesRepository(obj, pgp);
        obj.regions = new repos_1.RegionsRepository(obj, pgp);
        obj.owners = new repos_1.OwnersRepository(obj, pgp);
        obj.auth = new repos_1.AuthRepository(obj, pgp);
        obj.firmwares = new repos_1.FirmwaresRepository(obj, pgp);
        obj.devices = new repos_1.DevicesRepository(obj, pgp);
        obj.data = new repos_1.DataRepository(obj, pgp);
        obj.users = new repos_1.UsersRepository(obj, pgp);
    },
};
// Initializing the library:
const pgp = pgPromise(initOptions);
exports.pgp = pgp;
// Creating the database instance with extensions:
//console.log("dbConfig:", dbConfig);
const db = pgp(db_config_1.dbConfig);
exports.db = db;
class DBPool {
    constructor() {
        this.pool = new Map();
        this.get = (ct) => {
            //console.log("pool:", this.pool);
            return db;
            /*
            const dbKey = this.key(ct);
            let ldb: DB = this.pool.get(dbKey.key) as DB;
        
            if (!ldb) {
              //const pgp: IMain = pgPromise(initOptions);
              ldb = pgp(dbKey.config) as DB;
              this.pool.set(dbKey.key, ldb);
            }
                return ldb;
                */
        };
        this.remove = (ct) => {
            const dbKey = this.key(ct);
            const ldb = this.pool.get(dbKey.key);
            if (ldb) {
                ldb.$pool.end();
            }
            return this.pool.delete(dbKey.key);
        };
        this.key = (ct) => {
            // const config = { ...dbConfig, ...ct };
            const config = Object.assign({}, db_config_1.dbConfig);
            const { host, port, database, user } = config;
            return { config, key: JSON.stringify({ host, port, database, user }) };
        };
    }
}
exports.dbPool = new DBPool();
//# sourceMappingURL=index.js.map