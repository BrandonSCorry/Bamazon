DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(50) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock_quantity INT(100),
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Toothbrush", "Hygiene", 5, 20), ("48-inch Television", "Entertainment", 500, 5), ("32GB RAM", "Computer", 1000, 50),
("Wireless Mouse", "Computer", 25, 30), ("Strawberry Shampoo", "Hygiene", 6, 45), ("22-inch Television", "Entertainment", 150, 10),
("Form-fitting Shirt", "Fashion", 25, 60), ("Puffy Winter Coat", "Fashion", 100, 15), ("X-Files DVD", "Entertainment", 20, 50),
("Motherboard with LED lights", "Computer", 1000, 10);
