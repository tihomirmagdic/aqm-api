export const dbConfig = {
  connectionString: process.env.DATABASE_URL, // ||
  //connectionString:
  //process.env.DATABASE_URL +
  //"?ssl=true&sslfactory=org.postgresql.ssl.NonValidatingFactory",
  //"postgres://nshsodqdoimnqo:9ba94ac902fa70628a04020137a5b91b9d9172b751b3b40e65daaf4864d4ca46@ec2-52-86-116-94.compute-1.amazonaws.com:5432/d9o5v8kne8u0su?ssl=true&sslfactory=org.postgresql.ssl.NonValidatingFactory",
  //"postgres://nshsodqdoimnqo:9ba94ac902fa70628a04020137a5b91b9d9172b751b3b40e65daaf4864d4ca46@ec2-52-86-116-94.compute-1.amazonaws.com:5432/d9o5v8kne8u0su",
  // host: "localhost",
  host: "ec2-52-86-116-94.compute-1.amazonaws.com",
  port: 5432,
  //database: "postgres",
  database: "d9o5v8kne8u0su",
  //user: "postgres",
  user: "nshsodqdoimnqo",
  password: "9ba94ac902fa70628a04020137a5b91b9d9172b751b3b40e65daaf4864d4ca46",
  connectionTimeoutMillis: 1000 * 5, // return an error after 5 seconds if connection could not be established
  //ssl: false,
  statement_timeout: 2000, // max milliseconds any query using this connection will execute for before timing out in error. false=unlimited
  query_timeout: 2000, // max milliseconds to wait for query to complete (client side)
};
