import fs = require('fs');

function hashCode(str: string): number {
  let hash = 0, i = 0;
  const len = str.length;
  while ( i < len ) {
      /* tslint:disable:no-bitwise */
      hash  = ((hash << 5) - hash + str.charCodeAt(i++)) << 0;
      /* tslint:enable:no-bitwise */
  }
  return hash;
}

export interface CacheProvider {
  id(params: any): string;

  exists(id: string): boolean;

  setData(id: string, data: any): any;

  getData(id: string, params: any): any;

  gc(): void;
};

export class MemoryCache implements CacheProvider {
  validSeconds: number;
  private cache: any = {};

  constructor(validSeconds: number) {
    this.validSeconds = validSeconds;
  }

  public id(params: any): string {
    // console.log('get id input params:', params);
    const paramsId = {...params};
    delete paramsId.offset;
    delete paramsId.limit;
    // console.log('get id params:', paramsId);
    return 'cache' + hashCode(JSON.stringify(paramsId));
  }

  public exists(id: string): boolean {
    // console.log('id:', id);
    // console.log('cache keys:', Object.keys(this.cache));
    const item = this.cache[id];
    // console.log('this.cache:', JSON.stringify(this.cache));
    if (item !== undefined) {
      // console.log('item.validUntil:', item.validUntil);
    }
    // console.log('Date.now():', Date.now());
//    console.log('item.validUntil:', item.validUntil);
    return (item !== undefined) && (Date.now() <= Date.parse(item.validUntil));
  }

  public setData(id: string, data: any) {
    this.cache[id] = {
      validUntil: new Date(Date.now() + this.validSeconds * 1000).toISOString(),
      data
    }
    // console.log('this.cache:', JSON.stringify(this.cache));
  }

  public getData(id: string, params: any): any {
    const data: any[] = this.cache[id].data;
    // console.log('params:', params);
    return data.slice(params.offset, params.offset + params.limit);
  }

  public gc(): void {
    const ids = Object.keys(this.cache);
    ids.forEach((key: string) => {
      if (this.cache[key].validUntil < Date.now()) {
        delete this.cache[key];
      }
    });
  }
}

export class FileCache implements CacheProvider {
  validSeconds: number;
  cacheDir = './cache';

  constructor(validSeconds: number) {
    console.log('FileCache validSeconds:', validSeconds);
    this.validSeconds = validSeconds;
    if (!fs.existsSync(this.cacheDir)){
      fs.mkdirSync(this.cacheDir);
  }
  }

  public id(params: any): string {
    const paramsId = {...params};
    delete paramsId.offset;
    delete paramsId.limit;
    return this.cacheDir + '/cache' + hashCode(JSON.stringify(paramsId));
  }

  public exists(id: string): boolean {
    if(fs.existsSync(id)) {
      const stats = fs.statSync(id);
      return (Date.now().valueOf() <= (stats.atime.valueOf() + this.validSeconds * 1000));
    } else {
      return false;
    }
  }

  async setData(id: string, data: any) {
    await fs.promises.writeFile(id, JSON.stringify(data), 'utf8');
  }

  async getData(id: string, params: any) {
    // console.log('getData id:', id);
    const buffer = await fs.promises.readFile(id, 'utf8');
    // console.log('buffer:', buffer.substr(-5));
    // console.log('buffer len:', buffer.length);
    // console.log('buffer string:', buffer.toString().substr(-5));
    const data = JSON.parse(buffer);
    // console.log('data:', JSON.stringify(data).substr(-5));
    // console.log('data.length:', data.length);
    return data.slice(params.offset, params.offset + params.limit);
  }

  gc(): void {
    fs.readdir(this.cacheDir, (err: any, files: any) => {
      files.forEach((file: string) => {
        console.log('file:', file);
        const stats = fs.statSync(this.cacheDir + '/' + file);
        if(!(Date.now().valueOf() <= (stats.atime.valueOf() + this.validSeconds * 1000))) {
          console.log('deleting file:', file);
          fs.unlink(this.cacheDir + '/' + file, (unlinkErr: any) => {
            if (unlinkErr) {
              console.error(unlinkErr)
              return
            }
            console.log('file deleted:', file);
          })
        }
      });
    });
  }
}

export class CacheData {

  private cache: CacheProvider;

  constructor(cache: CacheProvider) {
    this.cache = cache;
  }

  private getId(params: any): string {
    return this.cache.id(params);
  }

  private setData(id: string, data: any) {
    this.cache.setData(id, data);
  }

  private getData(id: string, params: any): any {
    return this.cache.getData(id, params);
  }

  public gc() {
    this.cache.gc();
  }

  public async get(params: any, cb: any): Promise<any> {
    const id = this.cache.id(params);
    // console.log('cache id:', id);
    if(this.cache.exists(id)) {
      // console.log('cache hits');
      return this.cache.getData(id, params);
    } else {
      console.log('cache missed');
      const data = await cb(params);
      console.log('cache data len:', data.length);
      await this.cache.setData(id, data);
      return this.cache.getData(id, params);
    }
  }
}