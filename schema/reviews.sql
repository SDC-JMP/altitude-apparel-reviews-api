-- -----------------------------------------------------
-- Schema reviews
-- -----------------------------------------------------
DROP DATABASE IF EXISTS reviews_db;
CREATE DATABASE reviews_db;
USE reviews_db;

-- -----------------------------------------------------
-- Table reviews.review
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS review (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  rating INT NOT NULL,
  date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  summary VARCHAR(60) NOT NULL,
  body VARCHAR(1000) NOT NULL,
  recommend TINYINT NOT NULL DEFAULT 0,
  reported TINYINT NOT NULL DEFAULT 0,
  reviewer_name VARCHAR(60) NOT NULL,
  reviewer_email VARCHAR(60) NOT NULL,
  response VARCHAR(200) NULL,
  helpfulness INT NOT NULL DEFAULT 0
);


-- -----------------------------------------------------
-- Table reviews.photo
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS photo (
  id INT PRIMARY KEY AUTO_INCREMENT,
  url VARCHAR(1000) NOT NULL,
  review_id INT NOT NULL,
  CONSTRAINT fk_photo_review_id
    FOREIGN KEY (review_id)
    REFERENCES reviews.review (id)
);


-- -----------------------------------------------------
-- Table reviews.product_characteristic
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS characteristic (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  name VARCHAR(7) NOT NULL
);


-- -----------------------------------------------------
-- Table reviews.review_characteristic
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS review_characteristic (
  id INT PRIMARY KEY AUTO_INCREMENT,
  review_id INT NOT NULL,
  value INT NOT NULL,
  characteristic_id INT NOT NULL,
  CONSTRAINT fk_review_id
    FOREIGN KEY (review_id)
    REFERENCES reviews.review (id),
  CONSTRAINT fk_characteristic_id
    FOREIGN KEY (characteristic_id)
    REFERENCES reviews.product_characteristic (id)
);
