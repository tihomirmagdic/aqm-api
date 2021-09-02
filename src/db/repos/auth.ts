import { IDatabase, IMain } from "pg-promise";
import sqlProvider = require("../sql");
import { IExtensions } from "../../db/repos";
// import _ from "lodash";

import * as Joi from "@hapi/joi";

// id, email, name, admin, enabled, created
// hidden: password, salt

// schemas
export const shAuthTypes = Joi.string().required().valid("local", "google", "facebook");

export const shAuthTypeCreate = Joi.object().keys({
  type: shAuthTypes
});

export const shAuthCreateLocal = Joi.object().keys({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const sql = sqlProvider.auth;

export class AuthRepository {
  private db: IDatabase<IExtensions> & IExtensions;// IDatabase<any>;
  private pgp: IMain;
  // private keys: string[] = ["id"];

  constructor(db: any, pgp: any) {
    this.db = db;
    this.pgp = pgp;
  }

  public create(credentials: any) {
    console.log("register with credentials:", credentials);
    /*
    if (type === 'local') {
      return this.createLocalAccount(credentials);
    } else if (type === 'google') {
      return this.createGoogleAccount(credentials);
    } else {
      console.log('unknown auth strategy');
    }
    */
  }

  public async getUserByEmailPassword(credentials: any) {
    console.log("credentials:", credentials);
    const id = await this.db.any(sql.checkEmailPassword, { email: credentials.email, password: credentials.password });
    console.log("id:", id);
    if (!id.length) { // user not found
      return false;
    }
    console.log("id:", id);
    return this.db.owners.getByIDs([id]);
  }

  public async getUserByEmail(credentials: any) {
    console.log("credentials:", credentials);
    const id = await this.db.any(sql.checkEmail, { email: credentials.email });
    console.log("id:", id);
    if (!id.length) { // user not found
      return false;
    }
    console.log("id:", id);
    return this.db.owners.getByIDs([id]);
  }

  public async createLocalAccount(credentials: any) {
    console.log("credentials:", credentials);
    const id = await this.db.any(sql.checkEmailPassword, { email: credentials.email, password: credentials.password });
    console.log("id:", id);
    if (!id.length) {
      return("user not found");
    }
    console.log("id:", id);
    return this.db.owners.getByIDs([id]);
  }

  public async createGoogleAccount(credentials: any) {
    console.log("google auth");
    const id = await this.db.any(sql.checkEmail, { id: credentials.googleId });
    if (!id.length) {
      // create user
    } else {
      // user found
    }
    // return passport.authenticate("google", { scope: ["profile"] });
  }

  public delete() {
    console.log("provider logout");
    // return this.db.result(sql.remove, { where }, (r: IResult) => ({ deleted: r.rowCount }));
  }
}
