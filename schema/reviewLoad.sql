COPY review
FROM '/home/pix3llord/projects/altitude-apparel-reviews-api/data/reviews_cleaned.csv'
WITH(FORMAT CSV, DELIMITER ',', HEADER TRUE);