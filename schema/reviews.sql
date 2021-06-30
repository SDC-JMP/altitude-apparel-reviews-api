-- -----------------------------------------------------
-- Drop all tables
-- -----------------------------------------------------
DROP TABLE IF EXISTS review_characteristic;
DROP TABLE IF EXISTS characteristic;
DROP TABLE IF EXISTS photo;
DROP TABLE IF EXISTS review;

-- -----------------------------------------------------
-- Table reviews.review
-- -----------------------------------------------------
CREATE TABLE review (
  id BIGSERIAL PRIMARY KEY,
  product_id INT NOT NULL,
  rating INT NOT NULL,
  date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  summary VARCHAR(60) NOT NULL,
  body VARCHAR(1000) NOT NULL,
  recommend BOOLEAN NOT NULL DEFAULT false,
  reported BOOLEAN NOT NULL DEFAULT false,
  reviewer_name VARCHAR(60) NOT NULL,
  reviewer_email VARCHAR(60) NOT NULL,
  response VARCHAR(1000) NULL,
  helpfulness INT NOT NULL DEFAULT 0,
  photos TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[]
);


-- -----------------------------------------------------
-- Table reviews.photo
-- -----------------------------------------------------
CREATE TABLE photo (
  id BIGSERIAL PRIMARY KEY,
  url VARCHAR(2000) NOT NULL,
  review_id INT NOT NULL,
  CONSTRAINT fk_photo_review_id
    FOREIGN KEY (review_id)
    REFERENCES review (id)
);


-- -----------------------------------------------------
-- Table reviews.product_characteristic
-- -----------------------------------------------------
CREATE TABLE characteristic (
  id BIGSERIAL PRIMARY KEY,
  product_id INT NOT NULL,
  name VARCHAR(7) NOT NULL
);


-- -----------------------------------------------------
-- Table reviews.review_characteristic
-- -----------------------------------------------------
CREATE TABLE review_characteristic (
  id BIGSERIAL PRIMARY KEY,
  review_id INT NOT NULL,
  value INT NOT NULL,
  characteristic_id INT NOT NULL,
  CONSTRAINT fk_review_id
    FOREIGN KEY (review_id)
    REFERENCES review (id),
  CONSTRAINT fk_characteristic_id
    FOREIGN KEY (characteristic_id)
    REFERENCES characteristic (id)
);

-- CREATE TABLE characteristic_agg (
--   id INTEGER PRIMARY KEY,
--   name VARCHAR(7) NOT NULL,
--   value NUMERIC NOT NULL,
--   product_id INT NOT NULL
-- );