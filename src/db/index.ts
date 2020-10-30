import * as promise from "bluebird"; // best promise library today
import { dbConfig } from "../db-config"; // db connection details
import pgPromise = require("pg-promise");
import { Diagnostics } from "./diagnostics"; // optional diagnostics
import { IInitOptions, IDatabase, IMain } from "pg-promise";
import {
  IExtensions,
  CacheRepository,
  DeviceTypesRepository,
  ConfigurationsRepository,
  ConfigurationItemsRepository,
  RegionTypesRepository,
  RegionsRepository,
  OwnersRepository,
  AuthRepository,
  FirmwaresRepository,
  DevicesRepository,
  DataRepository,
  UsersRepository,
} from "../db/repos";

type ExtendedProtocol = IDatabase<IExtensions> & IExtensions;

// pg-promise initialization options:
const initOptions: IInitOptions<IExtensions> = {
  // Using a custom promise library, instead of the default ES6 Promise:
  promiseLib: promise,

  // Extending the database protocol with our custom repositories;
  // API: http://vitaly-t.github.io/pg-promise/global.html#event:extend
  extend(obj: ExtendedProtocol, dc: any) {
    // Database Context (dc) is mainly needed for extending multiple databases with different access API.

    // Do not use 'require()' here, because this event occurs for every task and transaction being executed,
    // which should be as fast as possible.
    obj.cache = new CacheRepository(obj, pgp);
    obj.devicetypes = new DeviceTypesRepository(obj, pgp);
    obj.configurations = new ConfigurationsRepository(obj, pgp);
    obj.configurationitems = new ConfigurationItemsRepository(obj, pgp);
    obj.regiontypes = new RegionTypesRepository(obj, pgp);
    obj.regions = new RegionsRepository(obj, pgp);
    obj.owners = new OwnersRepository(obj, pgp);
    obj.auth = new AuthRepository(obj, pgp);
    obj.firmwares = new FirmwaresRepository(obj, pgp);
    obj.devices = new DevicesRepository(obj, pgp);
    obj.data = new DataRepository(obj, pgp);
    obj.users = new UsersRepository(obj, pgp);
  },
};

export type DB = IDatabase<IExtensions> & IExtensions;

// Initializing the library:
const pgp: IMain = pgPromise(initOptions);

// Creating the database instance with extensions:
//console.log("dbConfig:", dbConfig);
const db: ExtendedProtocol = pgp(dbConfig);

// Initializing optional diagnostics:
Diagnostics.init(initOptions);

interface DBKey {
  config: any;
  key: string;
}

class DBPool {
  private pool = new Map();

  public get = (ct: any): DB => {
    //console.log("pool:", this.pool);
    return db;
    /*
    const dbKey = this.key(ct);
    let ldb: DB = this.pool.get(dbKey.key) as DB;

    if (!ldb) {
      //const pgp: IMain = pgPromise(initOptions);
      ldb = pgp(dbKey.config) as DB;
      this.pool.set(dbKey.key, ldb);
    }
		return ldb;
		*/
  };

  public remove = (ct: any): boolean => {
    const dbKey = this.key(ct);
    const ldb: DB = this.pool.get(dbKey.key) as DB;
    if (ldb) {
      ldb.$pool.end();
    }
    return this.pool.delete(dbKey.key);
  };

  private key = (ct: any): DBKey => {
    // const config = { ...dbConfig, ...ct };
    const config = { ...dbConfig };
    const { host, port, database, user } = config;
    return { config, key: JSON.stringify({ host, port, database, user }) };
  };
}

export const dbPool = new DBPool();

// Alternatively, you can get access to pgp via db.$config.pgp
// See: https://vitaly-t.github.io/pg-promise/Database.html#$config
export { db, pgp };
