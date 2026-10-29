const path = require("node:path");
require("dotenv").config({ path: path.join(__dirname, ".env"), quiet: true });
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 2,
  connectionTimeoutMillis: 5000
});

pool.on("error", error => {
  console.error("PostgreSQL pool error:", error.code || "UNKNOWN");
});

module.exports = pool;
