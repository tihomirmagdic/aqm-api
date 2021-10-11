import { CacheProvider, hashCode } from "./cache-provider-intf";
import fs = require('fs');

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

  setData(id: string, data: any) {
    fs.promises.writeFile(id, JSON.stringify(data), 'utf8');
  }

  async getData(id: string, params: any): Promise<any> {
    const buffer = await fs.promises.readFile(id, 'utf8');
    const data = JSON.parse(buffer);
    return data.slice(params.offset, params.offset + params.limit);
  }

  public fetchAndSetData(id: string, data: any, params: any): any {
    this.setData(id, data);
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