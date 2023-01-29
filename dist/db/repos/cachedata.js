"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CacheData {
    constructor(cache) {
        this.cache = cache;
    }
    getId(params) {
        return this.cache.id(params);
    }
    setData(id, data) {
        this.cache.setData(id, data);
    }
    getData(id, params) {
        return this.cache.getData(id, params);
    }
    gc() {
        this.cache.gc();
    }
    async get(params, cb) {
        const id = this.cache.id(params);
        // console.log('cache id:', id);
        if (this.cache.exists(id)) {
            // console.log('cache hits');
            return this.cache.getData(id, params);
        }
        else {
            console.log("cache missed");
            console.log("cb:" + cb);
            const data = await cb(params);
            console.log("cache data len:", data.length);
            return await this.cache.fetchAndSetData(id, data, params);
            // await this.cache.setData(id, data);
            // return this.cache.getData(id, params);
        }
    }
}
exports.CacheData = CacheData;
//# sourceMappingURL=cachedata.js.map