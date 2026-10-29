const path = require("node:path");
require("dotenv").config({ path: path.join(__dirname, ".env"), quiet: true });

const express = require("express");
const { Pool } = require("pg");
const multer = require("multer");
const { parseCsv, productsToCsv } = require("./csv.js");

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 2
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use((req, res, next) => {
    res.locals.year = new Intl.DateTimeFormat("en-US", {
        year: "numeric", timeZone: "America/Los_Angeles"
    }).format(new Date());
    next();
});

async function query(sql, values = []) {
    if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL is not configured in .env.");
    }
    return pool.query(sql, values);
}

pool.on("error", error => console.error(`Database error: ${error.message}`));

app.get("/", async (req, res) => {
    try {
        const result = await query("SELECT * FROM PRODUCT ORDER BY PROD_ID");
        res.render("index", { message: "success", model: result.rows });
    } catch (error) {
        console.error(`Product query error: ${error.message}`);
        res.status(500).render("index", { message: `Error - ${error.message}`, model: [] });
    }
});

app.get("/input", (req, res) => res.render("input"));

app.post("/input", upload.single("filename"), async (req, res) => {
    if (!req.file) return res.status(400).send("Error: Import file not uploaded");

    let products;
    try {
        products = parseCsv(req.file.buffer.toString("utf8"));
        if (products.length === 0) throw new Error("Import file contains no records.");
        if (products.some(product => product.length !== 4)) {
            throw new Error("Each CSV record must contain ID, name, description, and price.");
        }
    } catch (error) {
        return res.status(400).send(`Error: ${error.message}`);
    }

    let inserted = 0;
    try {
        const sql = "INSERT INTO PRODUCT(prod_id, prod_name, prod_desc, prod_price) VALUES ($1, $2, $3, $4)";
        for (const product of products) {
            await query(sql, product);
            inserted += 1;
        }
        res.send(`Processing Complete - Processed ${inserted} records`);
    } catch (error) {
        console.error(`Insert error after ${inserted} records: ${error.message}`);
        res.status(500).send(`Error: Inserted ${inserted} of ${products.length} records. ${error.message}`);
    }
});

app.get("/output", (req, res) => res.render("output", { message: "" }));

app.post("/output", async (req, res) => {
    try {
        const result = await query("SELECT * FROM PRODUCT ORDER BY PROD_ID");
        res.type("text/csv").attachment("export.csv").send(productsToCsv(result.rows));
    } catch (error) {
        console.error(`Export error: ${error.message}`);
        res.status(500).render("output", { message: `Error - ${error.message}` });
    }
});

app.use((error, req, res, next) => {
    console.error(`Request error: ${error.message}`);
    res.status(400).type("text").send(`Error: ${error.message}`);
});

if (require.main === module) {
    const port = process.env.PORT || 3000;
    app.listen(port, "0.0.0.0", () => {
        console.log(`Server started (http://localhost:${port}/)!`);
    });
}

module.exports = { app, pool };
