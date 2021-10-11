import { CacheProvider } from "./cache-providers/cache-provider-intf";

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
      return await this.cache.fetchAndSetData(id, data, params);
      // await this.cache.setData(id, data);
      // return this.cache.getData(id, params);
    }
  }
}