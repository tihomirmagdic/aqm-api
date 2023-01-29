"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cache_provider_intf_1 = require("./cache-provider-intf");
const fs = require("fs");
class FileCherryPickCache {
    constructor(validSeconds) {
        this.cacheDir = './cache';
        console.log('FileCache validSeconds:', validSeconds);
        this.validSeconds = validSeconds;
        if (!fs.existsSync(this.cacheDir)) {
            fs.mkdirSync(this.cacheDir);
        }
    }
    id(params) {
        return this.cacheDir + '/cache' + cache_provider_intf_1.hashCode(JSON.stringify(params));
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
        return data;
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
exports.FileCherryPickCache = FileCherryPickCache;
//# sourceMappingURL=file-cp-cache.js.map