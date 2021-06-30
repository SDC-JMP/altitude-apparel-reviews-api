/* eslint-disable camelcase */
const express = require('express');
const { Sequelize } = require('sequelize');
const {
  Review,
  ReviewCharacteristic,
  db
} = require('../models/reviewModel');

const router = express.Router();

// Get route for /reviews
router.get('/', (req, res) => {
  const page = req.query.page || 1;
  const count = req.query.count || 5;

  if (page < 1 || count < 1 || !req.query.product_id) {
    res.sendStatus(422);
    return;
  }

  const sorts = {
    newest: [['date', 'DESC'], ['id', 'ASC']],
    helpful: [['helpfulness', 'DESC'], ['id', 'ASC']],
    relevant: [['helpfulness', 'DESC'], ['date', 'DESC'], ['id', 'ASC']]
  };

  Review.findAll({
    attributes: [
      ['id', 'review_id'],
      'rating',
      'summary',
      'recommend',
      'response',
      'body',
      'date',
      'reviewer_name',
      'helpfulness',
      'photos'
    ],
    where: {
      product_id: req.query.product_id,
      reported: false
    },
    limit: count,
    offset: count * (page - 1),
    order: sorts[req.query.sort || 'relevant']
  })
    .then((results) => {
      const formattedResults = {
        product: Number(req.query.product_id),
        page: Number(page),
        count: Number(count),
        results
      };
      res.status(200).send(formattedResults);
    })
    .catch((err) => {
      res.send(err);
    });
});

// Used for validating characteristics object
const isValidCharObj = (charObj) => {
  const keys = Object.keys(charObj);
  for (let i = 0; i < keys.length; i += 1) {
    const num = Number(keys[i]);
    if (!Number.isInteger(num) || num < 1) {
      return false;
    }
  }
  return true;
};

// Post route for /reviews
router.post('/', (req, res) => {
  const {
    product_id,
    rating,
    summary,
    body,
    recommend,
    name,
    email,
    photos,
    characteristics
  } = req.body;

  if (Number.isNaN(Number(product_id)) || product_id < 1
    || !rating
    || rating < 1 || rating > 5
    || !summary || !body
    || !name || !email || !photos
    || !Array.isArray(photos) || !characteristics
    || !isValidCharObj(characteristics)) {
    res.sendStatus(422);
    return;
  }

  Review.create({
    product_id,
    rating,
    summary,
    body,
    recommend,
    reviewer_name: name,
    reviewer_email: email,
    photos
  })
    .then((review) => {
      const characteristicModels = [];
      const characteristicIds = Object.keys(characteristics);

      for (let i = 0; i < characteristicIds.length; i += 1) {
        characteristicModels.push({
          characteristic_id: Number(characteristicIds[i]),
          review_id: review.id,
          value: characteristics[characteristicIds[i]]
        });
      }

      return ReviewCharacteristic.bulkCreate(characteristicModels);
    })
    .then(() => {
      res.status(200).send('Created');
      db.query(`UPDATE characteristic_agg SET value = calc.value
      FROM (SELECT
        char.id, AVG(rc.value) AS value
        FROM characteristic AS char
        INNER JOIN review_characteristic AS rc
        ON char.id = rc.characteristic_id
        WHERE product_id = ${product_id}
        GROUP BY char.id) AS calc
      WHERE characteristic_agg.id = calc.id;`);
    })
    .catch((err) => {
      res.send(err);
    });
});

// Put route for helpfulness
router.put('/:reviewId/helpful', (req, res) => {
  Review.update({
    helpfulness: Sequelize.literal('helpfulness + 1')
  }, {
    where: {
      id: req.params.reviewId
    }
  })
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err) => {
      res.send(err);
    });
});

// Put route for reported
router.put('/:reviewId/report', (req, res) => {
  Review.update({
    reported: true
  }, {
    where: {
      id: req.params.reviewId
    }
  })
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err) => {
      res.send(err);
    });
});

// Get meta data about a product usint /meta
router.get('/meta', (req, res) => {
  const product_id = Number(req.query.product_id);
  if (!Number.isNaN(product_id) && product_id > 0) {
    const metaData = { product_id };

    db.query(`SELECT JSONB_OBJECT_AGG(countRating.rating, countRating.value) AS ratings FROM
      (SELECT rating, COUNT(rating) as value FROM review WHERE product_id = ${product_id} GROUP BY rating) AS countRating;`,
    { type: Sequelize.QueryTypes.SELECT })
      .then((ratings) => {
        metaData.ratings = ratings[0].ratings;

        return db.query(`SELECT JSONB_OBJECT_AGG(countRecommend.recommend, countRecommend.value) AS recommendations FROM
          (SELECT recommend, COUNT(recommend) as value FROM review WHERE product_id = ${product_id} GROUP BY recommend)
          AS countRecommend;`,
        { type: Sequelize.QueryTypes.SELECT });
      })
      .then((recommendations) => {
        metaData.recommended = recommendations[0].recommendations;

        return db.query(`SELECT JSONB_OBJECT_AGG(metaData.name, JSON_BUILD_OBJECT('id', metaData.id, 'value', metaData.value)) AS characteristics FROM
        (SELECT name, id, value FROM characteristic_agg WHERE product_id = ${product_id}) AS metaData;`,
        { type: Sequelize.QueryTypes.SELECT });
      })
      .then((characteristics) => {
        metaData.characteristics = characteristics[0].characteristics;

        res.status(200).send(metaData);
      })
      .catch((err) => {
        res.send(err);
      });
  } else {
    res.status(422).send(new Error('Invalid product_id'));
  }
});

module.exports = router;
