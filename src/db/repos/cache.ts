import { IMain } from "pg-promise";
import { DB, dbPool } from '..';
import sqlProvider = require("../sql");
import { getDBContext } from "../../server/handler";
import * as dbConfig from '../../db-config.json'; // db connection details

const sql = sqlProvider.cache;

export class CacheRepository {
  private db: DB;
  private pgp: IMain;
  public loaded: boolean = false;
  public data: any = {};

  constructor(db: any, pgp: any) {
    console.log("Cache constructor:");
    this.db = db;
    this.pgp = pgp;
  }

  private async loadApiKeys() {
    console.log("loading api keys...");
    const db = dbPool.get(dbConfig);
    const apikeys = await db.any(sql.getApiKeys);
    apikeys.forEach(ak => this.data["apikey-" + ak.apikey] = ak.id);
    console.log("apikey data:", this.data);
  }

  public get(key: string): any {
    console.log("get key:", key);
    if (!this.loaded) {
      this.load();
    }
    return this.data[key];
  }

  public async apiKey(key: string) {
    return (this.loaded ? this.data["apikey-" + key] : await this.load().then(() => {
      console.log("return: ", this.data["apikey-" + key]);
      return this.data["apikey-" + key];
    }));
  }

  public exists(key: string): boolean {
    console.log("exists key:", key);
    if (!this.loaded) {
      this.load();
    }
    console.log("cache data:", this.data);
    return this.data.hasOwnProperty(key);
  }

  public invalidate() {
    this.loaded = false;
  }

  private async load() {
    this.data = {};
    await this.loadApiKeys();
    this.loaded = true;
  }
}
