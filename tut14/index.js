const express = require("express");
const path = require("node:path");
const pool = require("./db");

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: false }));
app.locals.year = new Intl.DateTimeFormat("en-US", {
  year: "numeric", timeZone: "America/Los_Angeles"
}).format(new Date());

app.get("/", (request, response) => response.render("index"));
app.get("/about", (request, response) => response.render("about"));
app.get("/data", (request, response) => {
  response.render("data", { model: { title: "Test", items: ["one", "two", "three"] } });
});

app.use(["/books", "/create", "/edit", "/delete"], (request, response, next) => {
  if (!process.env.DATABASE_URL) {
    return response.status(503).render("error", { message: "The database is not configured." });
  }
  next();
});

app.param("id", (request, response, next, value) => {
  const id = Number(value);
  if (!/^\d+$/.test(value) || !Number.isSafeInteger(id) || id < 1 || id > 2147483647) {
    return response.status(400).render("error", { message: "Invalid book ID." });
  }
  request.bookId = id;
  next();
});

function readBook(request) {
  const { title, author, comments = "" } = request.body || {};
  if (typeof title !== "string" || !title.trim() || title.length > 100 ||
      typeof author !== "string" || !author.trim() || author.length > 100 ||
      typeof comments !== "string" || comments.length > 32000) {
    return null;
  }
  return [title.trim(), author.trim(), comments];
}

app.get("/books", async (request, response) => {
  const result = await pool.query("SELECT * FROM books ORDER BY title");
  response.render("books", { model: result.rows });
});

app.get("/create", (request, response) => {
  response.render("create", { model: { title: "", author: "", comments: "" } });
});

app.post("/create", async (request, response) => {
  const book = readBook(request);
  if (!book) {
    return response.status(400).render("error", { message: "Enter a title and author of at most 100 characters each." });
  }
  await pool.query("INSERT INTO books (title, author, comments) VALUES ($1, $2, $3)", book);
  response.redirect("/books");
});

app.get("/edit/:id", async (request, response) => {
  const result = await pool.query("SELECT * FROM books WHERE book_id = $1", [request.bookId]);
  if (!result.rows.length) {
    return response.status(404).render("error", { message: "Book not found." });
  }
  response.render("edit", { model: result.rows[0] });
});

app.post("/edit/:id", async (request, response) => {
  const book = readBook(request);
  if (!book) {
    return response.status(400).render("error", { message: "Enter a title and author of at most 100 characters each." });
  }
  const result = await pool.query(
    "UPDATE books SET title = $1, author = $2, comments = $3 WHERE book_id = $4",
    [...book, request.bookId]
  );
  if (!result.rowCount) {
    return response.status(404).render("error", { message: "Book not found." });
  }
  response.redirect("/books");
});

app.get("/delete/:id", async (request, response) => {
  const result = await pool.query("SELECT * FROM books WHERE book_id = $1", [request.bookId]);
  if (!result.rows.length) {
    return response.status(404).render("error", { message: "Book not found." });
  }
  response.render("delete", { model: result.rows[0] });
});

app.post("/delete/:id", async (request, response) => {
  const result = await pool.query("DELETE FROM books WHERE book_id = $1", [request.bookId]);
  if (!result.rowCount) {
    return response.status(404).render("error", { message: "Book not found." });
  }
  response.redirect("/books");
});

app.use((error, request, response, next) => {
  console.error("Request failed:", error.code || error.type || "UNKNOWN");
  response.status(500).render("error", { message: "Unable to complete the request. Please try again." });
});

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, "0.0.0.0", () => {
    console.log(`Tutorial 14 server is listening on port ${port}.`);
  });
}

module.exports = app;
