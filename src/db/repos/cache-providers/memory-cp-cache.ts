import { CacheProvider, hashCode } from "./cache-provider-intf";

export class MemoryCherryPickCache implements CacheProvider {
  validSeconds: number;
  private cache: any = {};

  constructor(validSeconds: number) {
    this.validSeconds = validSeconds;
  }

  public id(params: any): string {
    // const paramsId = {...params};
    // delete paramsId.offset;
    // delete paramsId.limit;
    return 'cache' + hashCode(JSON.stringify(params));
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
    return this.cache[id].data;
  }

  public fetchAndSetData(id: string, data: any, params: any): any {
    const firstPage = data.slice(params.offset, params.offset + params.limit);
    this.setData(id, firstPage);

    let pageToSave: any[];
    do {
      params.offset += params.limit;
      pageToSave = data.slice(params.offset, params.offset + params.limit);
      id = this.id(params);
      this.setData(id, pageToSave);
    // } while(pageToSave.length === params.limit);
    } while(pageToSave.length > 0);

    return firstPage;
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