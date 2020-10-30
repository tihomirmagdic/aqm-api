"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const sqlProvider = require("../sql");
const dbConfig = __importStar(require("../../db-config")); // db connection details
const sql = sqlProvider.cache;
class CacheRepository {
    constructor(db, pgp) {
        this.loaded = false;
        this.data = {};
        //console.log("Cache constructor:");
        this.db = db;
        this.pgp = pgp;
    }
    async loadApiKeys() {
        console.log("loading api keys...");
        const db = __1.dbPool.get(dbConfig);
        const apikeys = await db.any(sql.getApiKeys);
        apikeys.forEach((ak) => (this.data["apikey-" + ak.apikey] = ak.id));
        console.log("apikey data:", this.data);
    }
    get(key) {
        console.log("get key:", key);
        if (!this.loaded) {
            this.load();
        }
        return this.data[key];
    }
    async apiKey(key) {
        console.log("apiKey:", key);
        return this.loaded
            ? this.data["apikey-" + key]
            : await this.load().then(() => {
                console.log("return: ", this.data["apikey-" + key]);
                return this.data["apikey-" + key];
            });
    }
    exists(key) {
        console.log("exists key:", key);
        if (!this.loaded) {
            this.load();
        }
        console.log("cache data:", this.data);
        return this.data.hasOwnProperty(key);
    }
    invalidate() {
        console.log("invalidate");
        this.loaded = false;
    }
    async load() {
        console.log("loading data...");
        this.data = {};
        await this.loadApiKeys();
        this.loaded = true;
    }
}
exports.CacheRepository = CacheRepository;
//# sourceMappingURL=cache.js.map