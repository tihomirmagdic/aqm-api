import { CacheProvider, hashCode } from "./cache-provider-intf";

export class MemoryCache implements CacheProvider {
  validSeconds: number;
  private cache: any = {};

  constructor(validSeconds: number) {
    this.validSeconds = validSeconds;
  }

  public id(params: any): string {
    const paramsId = {...params};
    delete paramsId.offset;
    delete paramsId.limit;
    return 'cache' + hashCode(JSON.stringify(paramsId));
  }

  public exists(id: string): boolean {
    const item = this.cache[id];
    return (item !== undefined) && (Date.now() <= Date.parse(item.validUntil));
  }

  public setData(id: string, data: any) {
    this.cache[id] = {
      validUntil: new Date(Date.now() + this.validSeconds * 1000).toISOString(),
      data
    }
  }

  public getData(id: string, params: any): any {
    const data: any[] = this.cache[id].data;
    return data.slice(params.offset, params.offset + params.limit);
  }

  public fetchAndSetData(id: string, data: any, params: any): any {
    this.setData(id, data);
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
