DROP DATABASE IF EXISTS bAmazon_db;
CREATE DATABASE bAmazon_db;

USE bAmazon_db;

DROP TABLE products;
CREATE TABLE products (
  id INTEGER(11) AUTO_INCREMENT NOT NULL PRIMARY KEY,
  name VARCHAR (100) NOT NULL,
  department VARCHAR(100),
  stock INTEGER DEFAULT 0,
  price DECIMAL (10, 2),
  productsales DECIMAL (10, 2) DEFAULT 0
);

DROP TABLE departments;

CREATE TABLE departments (
  department_id INTEGER (100) AUTO_INCREMENT NOT NULL PRIMARY KEY,
  department VARCHAR(100),
  overheadcosts INTEGER DEFAULT 0
);

SELECT * FROM departments;

SELECT * FROM products;


SELECT departments.department_id, departments.department, departments.overheadcosts, products.productsales
FROM products
INNER JOIN departments ON departments.department = products.department

SELECT departments.department_id, departments.department, departments.overheadcosts, products.productsales FROM departments,products;









