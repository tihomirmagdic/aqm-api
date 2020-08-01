export const config = {
  AUTH0_DOMAIN: "https://indigo-services.eu.auth0.com/",
  AUTH0_API_AUDIENCE: "http://localhost:8083/api/",
  MONGO_URI:
    process.env.MONGO_URI ||
    "mongodb://[USER]:[PASSWORD]@[DS######].mlab.com:[PORT]/[DB_NAME]",
  joi: {},
  upload: {},
};

// Database connection parameters:
export const adbConfig = {
  host: "localhost",
  port: 5432,
  database: "postgres",
  user: "postgres", // dynamic
  password: "pg", // dynamic
  max: 5, // set pool max size to 2
  min: 0, // set min pool size to 0
  idleTimeoutMillis: 1000 * 60 * 60, // close idle clients after 1 hour or set to 0 to disable auto-disconnection of idle clients
  connectionTimeoutMillis: 1000 * 5, // return an error after 5 seconds if connection could not be established
  client_encoding: "",
  ssl: false,
  application_name: "mercata",
  // fallback_application_name: undefined,
  parseInputDatesAsUTC: false,
  statement_timeout: false, // max milliseconds any query using this connection will execute for before timing out in error. false=unlimited
  query_timeout: false, // max milliseconds to wait for query to complete (client side)
};
