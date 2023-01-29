"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cache_provider_intf_1 = require("./cache-provider-intf");
class MemoryCherryPickCache {
    constructor(validSeconds) {
        this.cache = {};
        this.validSeconds = validSeconds;
    }
    id(params) {
        // const paramsId = {...params};
        // delete paramsId.offset;
        // delete paramsId.limit;
        return 'cache' + cache_provider_intf_1.hashCode(JSON.stringify(params));
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
        return this.cache[id].data;
    }
    fetchAndSetData(id, data, params) {
        const firstPage = data.slice(params.offset, params.offset + params.limit);
        this.setData(id, firstPage);
        let pageToSave;
        do {
            params.offset += params.limit;
            pageToSave = data.slice(params.offset, params.offset + params.limit);
            id = this.id(params);
            this.setData(id, pageToSave);
            // } while(pageToSave.length === params.limit);
        } while (pageToSave.length > 0);
        return firstPage;
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
exports.MemoryCherryPickCache = MemoryCherryPickCache;
//# sourceMappingURL=memory-cp-cache.js.map