"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = {
    AUTH0_DOMAIN: "https://indigo-services.eu.auth0.com/",
    AUTH0_API_AUDIENCE: "http://localhost:8083/api/",
    MONGO_URI: process.env.MONGO_URI ||
        "mongodb://[USER]:[PASSWORD]@[DS######].mlab.com:[PORT]/[DB_NAME]",
    joi: {},
    upload: {},
};
// Database connection parameters:
const adbConfig = {
    host: "localhost",
    port: 5432,
    database: "postgres",
    user: "postgres",
    password: "pg",
    max: 5,
    min: 0,
    idleTimeoutMillis: 1000 * 60 * 60,
    connectionTimeoutMillis: 1000 * 5,
    client_encoding: "",
    ssl: false,
    application_name: "mercata",
    // fallback_application_name: undefined,
    parseInputDatesAsUTC: false,
    statement_timeout: false,
    query_timeout: false,
};
//# sourceMappingURL=config.js.map