export const dbConfig = {
  host: process.env.DATABASE_URL || "localhost",
  port: 5432,
  database: "postgres",
  user: "postgres",
};
