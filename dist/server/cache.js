"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Cache {
    constructor(load) {
        this.loaded = false;
        console.log("Cache constructor:", load);
        //this.load = load;
    }
    get(key) {
        if (!this.loaded) {
            this.load();
            this.loaded = true;
        }
        return this.data[key];
    }
    exists(key) {
        return this.data.hasProperty(key);
    }
    invalidate() {
        this.loaded = false;
    }
}
exports.Cache = Cache;
//export const cache = new Cache();
//# sourceMappingURL=cache.js.map