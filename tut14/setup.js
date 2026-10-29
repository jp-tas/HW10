const fs = require("node:fs/promises");
const path = require("node:path");
require("dotenv").config({ path: path.join(__dirname, ".env"), quiet: true });
const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL,
  max: 2,
  connectionTimeoutMillis: 15000
});

async function setup() {
  try {
    if (!process.env.DATABASE_URL_UNPOOLED && !process.env.DATABASE_URL) {
      throw new Error("Set DATABASE_URL in .env before running database setup.");
    }
    const sql = await fs.readFile(path.join(__dirname, "setup.sql"), "utf8");
    await pool.query(sql);
    console.log("Books table and tutorial seed data are ready.");
  } catch (error) {
    console.error(error.code || error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

setup();
