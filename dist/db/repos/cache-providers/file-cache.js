"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cache_provider_intf_1 = require("./cache-provider-intf");
const fs = require("fs");
class FileCache {
    constructor(validSeconds) {
        this.cacheDir = './cache';
        console.log('FileCache validSeconds:', validSeconds);
        this.validSeconds = validSeconds;
        if (!fs.existsSync(this.cacheDir)) {
            fs.mkdirSync(this.cacheDir);
        }
    }
    id(params) {
        const paramsId = { ...params };
        delete paramsId.offset;
        delete paramsId.limit;
        return this.cacheDir + '/cache' + cache_provider_intf_1.hashCode(JSON.stringify(paramsId));
    }
    exists(id) {
        if (fs.existsSync(id)) {
            const stats = fs.statSync(id);
            return (Date.now().valueOf() <= (stats.atime.valueOf() + this.validSeconds * 1000));
        }
        else {
            return false;
        }
    }
    setData(id, data) {
        fs.promises.writeFile(id, JSON.stringify(data), 'utf8');
    }
    async getData(id, params) {
        const buffer = await fs.promises.readFile(id, 'utf8');
        const data = JSON.parse(buffer);
        return data.slice(params.offset, params.offset + params.limit);
    }
    fetchAndSetData(id, data, params) {
        this.setData(id, data);
        return data.slice(params.offset, params.offset + params.limit);
    }
    gc() {
        fs.readdir(this.cacheDir, (err, files) => {
            files.forEach((file) => {
                console.log('file:', file);
                const stats = fs.statSync(this.cacheDir + '/' + file);
                if (!(Date.now().valueOf() <= (stats.atime.valueOf() + this.validSeconds * 1000))) {
                    console.log('deleting file:', file);
                    fs.unlink(this.cacheDir + '/' + file, (unlinkErr) => {
                        if (unlinkErr) {
                            console.error(unlinkErr);
                            return;
                        }
                        console.log('file deleted:', file);
                    });
                }
            });
        });
    }
}
exports.FileCache = FileCache;
//# sourceMappingURL=file-cache.js.map