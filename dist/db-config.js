"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConfig = {
    //connectionString: process.env.DATABASE_URL, // ||
    //connectionString: 
    //  "postgres://nshsodqdoimnqo:9ba94ac902fa70628a04020137a5b91b9d9172b751b3b40e65daaf4864d4ca46@ec2-52-86-116-94.compute-1.amazonaws.com:5432/d9o5v8kne8u0su",
    //connectionString:
    //    process.env.DATABASE_URL +
    //  "?ssl=true&sslfactory=org.postgresql.ssl.NonValidatingFactory",
    //"postgres://nshsodqdoimnqo:9ba94ac902fa70628a04020137a5b91b9d9172b751b3b40e65daaf4864d4ca46@ec2-52-86-116-94.compute-1.amazonaws.com:5432/d9o5v8kne8u0su?ssl=true&sslfactory=org.postgresql.ssl.NonValidatingFactory",
    //"postgres://nshsodqdoimnqo:9ba94ac902fa70628a04020137a5b91b9d9172b751b3b40e65daaf4864d4ca46@ec2-52-86-116-94.compute-1.amazonaws.com:5432/d9o5v8kne8u0su",
    host: (process.env.PG_LOCAL && process.env.PG_LOCAL.toLowerCase() === "true") ? "localhost" : process.env.PG_HOST,
    port: (process.env.PG_LOCAL && process.env.PG_LOCAL.toLowerCase() === "true") ? 5432 : (process.env.PG_PORT ? +process.env.PG_PORT : 5432),
    database: (process.env.PG_LOCAL && process.env.PG_LOCAL.toLowerCase() === "true") ? "postgres" : process.env.PG_DATABASE,
    user: (process.env.PG_LOCAL && process.env.PG_LOCAL.toLowerCase() === "true") ? "postgres" : process.env.PG_USER,
    password: (process.env.PG_LOCAL && process.env.PG_LOCAL.toLowerCase() === "true") ? "pg" : process.env.PG_PASSWORD,
    ssl: (process.env.PG_LOCAL && process.env.PG_LOCAL.toLowerCase() === "true") ? false : { rejectUnauthorized: false },
    /*
    ssl: {
      rejectUnauthorized: false
    },
    
    port: 5432,
    host: "ec2-52-86-116-94.compute-1.amazonaws.com",
    database: "d9o5v8kne8u0su",
    user: "nshsodqdoimnqo",
    password: "9ba94ac902fa70628a04020137a5b91b9d9172b751b3b40e65daaf4864d4ca46",
    */
    connectionTimeoutMillis: 1000 * 5,
    statement_timeout: 2000,
    query_timeout: 2000,
};
//# sourceMappingURL=db-config.js.map