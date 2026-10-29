-- Tutorial 12: run explicitly in your own database; recreates TESTTABLE.
DROP TABLE IF EXISTS TESTTABLE;

CREATE TABLE TESTTABLE (
    ID SERIAL PRIMARY KEY,
    FNAME VARCHAR(10),
    LNAME VARCHAR(15)
);

INSERT INTO TESTTABLE (FNAME, LNAME) VALUES
    ('Amy', 'Andrews'),
    ('Bob', 'Barns'),
    ('Cindy', 'Chase'),
    ('Dave', 'Dunn');

SELECT * FROM TESTTABLE ORDER BY ID;
