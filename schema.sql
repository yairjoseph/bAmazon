DROP DATABASE IF EXISTS bAmazon_db;
CREATE DATABASE bAmazon_db;

USE bAmazon_db;

CREATE TABLE products (
  id INTEGER(11) AUTO_INCREMENT NOT NULL PRIMARY KEY,
  name VARCHAR (100) NOT NULL,
  department VARCHAR(100),
  stock INTEGER DEFAULT 0,
  price DECIMAL (10, 2)
);

SELECT * FROM products
