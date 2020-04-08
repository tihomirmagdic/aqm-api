"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sql_1 = require("../sql");
/*
 This repository mixes hard-coded and dynamic SQL, just to show how to use both.
*/
class UsersRepository {
    /**
     * @param db
     * Automated database connection context/interface.
     *
     * If you ever need to access other repositories from this one,
     * you will have to replace type 'IDatabase<any>' with 'any'.
     *
     * @param pgp
     * Library's root, if ever needed, like to access 'helpers'
     * or other namespaces available from the root.
     */
    constructor(db, pgp) {
        this.db = db;
        this.pgp = pgp;
        /*
          If your repository needs to use helpers like ColumnSet,
          you should create it conditionally, inside the constructor,
          i.e. only once, as a singleton.
        */
    }
    // Creates the table;
    async create() {
        return this.db.none(sql_1.users.create);
    }
    // Initializes the table with some user records, and return their id-s;
    async init() {
        return this.db.map(sql_1.users.init, [], (row) => row.id);
    }
    // Drops the table;
    async drop() {
        return this.db.none(sql_1.users.drop);
    }
    // Removes all records from the table;
    async empty() {
        return this.db.none(sql_1.users.empty);
    }
    // Adds a new user, and returns the new object;
    async add(name) {
        return this.db.one(sql_1.users.add, name);
    }
    // Tries to delete a user by id, and returns the number of records deleted;
    async remove(id) {
        return this.db.result('DELETE FROM users WHERE id = $1', +id, (r) => r.rowCount);
    }
    // Tries to find a user from id;
    async findById(id) {
        return this.db.oneOrNone('SELECT * FROM users WHERE id = $1', +id);
    }
    // Tries to find a user from name;
    async findByName(name) {
        return this.db.oneOrNone('SELECT * FROM users WHERE name = $1', name);
    }
    // Returns all user records;
    async all() {
        return this.db.any('SELECT * FROM users');
    }
    // Returns the total number of users;
    async total() {
        return this.db.one('SELECT count(*) FROM users', [], (a) => +a.count);
    }
}
exports.UsersRepository = UsersRepository;
//# sourceMappingURL=users.js.map