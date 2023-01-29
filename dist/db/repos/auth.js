"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const sqlProvider = require("../sql");
// import _ from "lodash";
const Joi = __importStar(require("@hapi/joi"));
// id, email, name, admin, enabled, created
// hidden: password, salt
// schemas
exports.shAuthTypes = Joi.string().required().valid("local", "google", "facebook");
exports.shAuthTypeCreate = Joi.object().keys({
    type: exports.shAuthTypes
});
exports.shAuthCreateLocal = Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required()
});
const sql = sqlProvider.auth;
class AuthRepository {
    // private keys: string[] = ["id"];
    constructor(db, pgp) {
        this.db = db;
        this.pgp = pgp;
    }
    create(credentials) {
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
    async getUserByEmailPassword(credentials) {
        console.log("credentials:", credentials);
        const id = await this.db.any(sql.checkEmailPassword, { email: credentials.email, password: credentials.password });
        console.log("id:", id);
        if (!id.length) { // user not found
            return false;
        }
        console.log("id:", id);
        return this.db.owners.getByIDs([id]);
    }
    async getUserByEmail(credentials) {
        console.log("credentials:", credentials);
        const id = await this.db.any(sql.checkEmail, { email: credentials.email });
        console.log("id:", id);
        if (!id.length) { // user not found
            return false;
        }
        console.log("id:", id);
        return this.db.owners.getByIDs([id]);
    }
    async createLocalAccount(credentials) {
        console.log("credentials:", credentials);
        const id = await this.db.any(sql.checkEmailPassword, { email: credentials.email, password: credentials.password });
        console.log("id:", id);
        if (!id.length) {
            return ("user not found");
        }
        console.log("id:", id);
        return this.db.owners.getByIDs([id]);
    }
    async createGoogleAccount(credentials) {
        console.log("google auth");
        const id = await this.db.any(sql.checkEmail, { id: credentials.googleId });
        if (!id.length) {
            // create user
        }
        else {
            // user found
        }
        // return passport.authenticate("google", { scope: ["profile"] });
    }
    delete() {
        console.log("provider logout");
        // return this.db.result(sql.remove, { where }, (r: IResult) => ({ deleted: r.rowCount }));
    }
}
exports.AuthRepository = AuthRepository;
//# sourceMappingURL=auth.js.map