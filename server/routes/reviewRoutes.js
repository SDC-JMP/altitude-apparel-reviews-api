/* eslint-disable camelcase */
const express = require('express');
const { Sequelize } = require('sequelize');
const {
  Review,
  Characteristic,
  ReviewCharacteristic
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

  if (!product_id || !rating
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

router.get('/meta', (req, res) => {
  Review.findAll({
    attributes: ['rating', [Sequelize.fn('COUNT', Sequelize.col('rating')), 'value']],
    where: {
      product_id: req.query.product_id
    },
    group: 'rating'
  })
    .then((results) => {
      res.status(200).send(results);
    })
    .catch((err) => {
      res.send(err);
    });
});

module.exports = router;
