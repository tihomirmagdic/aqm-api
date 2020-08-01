"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConfig = {
    host: process.env.DATABASE_URL || "localhost",
    port: 5432,
    database: "postgres",
    user: "postgres",
};
//# sourceMappingURL=db-config.js.map