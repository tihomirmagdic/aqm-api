"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cache_provider_intf_1 = require("./cache-provider-intf");
class MemoryCache {
    constructor(validSeconds) {
        this.cache = {};
        this.validSeconds = validSeconds;
    }
    id(params) {
        const paramsId = { ...params };
        delete paramsId.offset;
        delete paramsId.limit;
        return 'cache' + cache_provider_intf_1.hashCode(JSON.stringify(paramsId));
    }
    exists(id) {
        const item = this.cache[id];
        return (item !== undefined) && (Date.now() <= Date.parse(item.validUntil));
    }
    setData(id, data) {
        this.cache[id] = {
            validUntil: new Date(Date.now() + this.validSeconds * 1000).toISOString(),
            data
        };
    }
    getData(id, params) {
        const data = this.cache[id].data;
        return data.slice(params.offset, params.offset + params.limit);
    }
    fetchAndSetData(id, data, params) {
        this.setData(id, data);
        return data.slice(params.offset, params.offset + params.limit);
    }
    gc() {
        const ids = Object.keys(this.cache);
        ids.forEach((key) => {
            if (this.cache[key].validUntil < Date.now()) {
                delete this.cache[key];
            }
        });
    }
}
exports.MemoryCache = MemoryCache;
//# sourceMappingURL=memory-cache.js.map