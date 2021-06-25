COPY review (id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
FROM '/home/pixellord/projects/altitude-apparel-reviews-api/data/reviews_cleaned.csv'
WITH(FORMAT CSV, DELIMITER ',', HEADER TRUE);

COPY photo (id, review_id, url)
FROM '/home/pixellord/projects/altitude-apparel-reviews-api/data/reviews_photos.csv'
WITH(FORMAT CSV, DELIMITER ',', HEADER TRUE);

COPY characteristic (id, product_id, name)
FROM '/home/pixellord/projects/altitude-apparel-reviews-api/data/characteristics.csv'
WITH(FORMAT CSV, DELIMITER ',', HEADER TRUE);

COPY review_characteristic (id, characteristic_id, review_id, value)
FROM '/home/pixellord/projects/altitude-apparel-reviews-api/data/characteristic_reviews.csv'
WITH(FORMAT CSV, DELIMITER ',', HEADER TRUE);
