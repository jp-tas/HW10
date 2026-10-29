-- Initialize the two homework tables without deleting existing tables or rows.
BEGIN;

CREATE TABLE IF NOT EXISTS product (
    prod_id SERIAL PRIMARY KEY,
    prod_name VARCHAR(20) NOT NULL,
    prod_desc VARCHAR(50),
    prod_price NUMERIC
);

INSERT INTO product (prod_id, prod_name, prod_desc, prod_price) VALUES
    (101, 'Pen', 'Black Ink', 0.99),
    (102, 'Pencil', 'Yellow No. 2', 0.35),
    (103, 'Paper', 'College Rule', 1.10),
    (104, 'Eraser', 'Pink', 0.75),
    (105, 'Calculator', 'Scientific', 99.99),
    (106, 'Camera', 'Desktop 720p', 39.99),
    (107, 'Ruler', '12"', 4.75),
    (108, 'Stamps', 'Dozen', 6.60),
    (109, 'Notepad', '8.5 by 11', 2.95),
    (110, 'Charger', 'USB', 22.50)
ON CONFLICT (prod_id) DO NOTHING;

SELECT setval('product_prod_id_seq', GREATEST(
    (SELECT MAX(prod_id) FROM product),
    (SELECT last_value FROM product_prod_id_seq)
));

CREATE TABLE IF NOT EXISTS books (
    book_id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    author VARCHAR(100) NOT NULL,
    comments TEXT
);

INSERT INTO books (book_id, title, author, comments) VALUES
    (1, 'Mrs. Bridge', 'Evan S. Connell', 'First in the serie'),
    (2, 'Mr. Bridge', 'Evan S. Connell', 'Second in the serie'),
    (3, 'L''ingénue libertine', 'Colette', 'Minne + Les égarements de Minne')
ON CONFLICT (book_id) DO NOTHING;

SELECT setval('books_book_id_seq', GREATEST(
    (SELECT MAX(book_id) FROM books),
    (SELECT last_value FROM books_book_id_seq)
));

COMMIT;
