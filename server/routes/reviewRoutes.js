const express = require('express');
const {
  Review,
  Photo,
  Characteristic,
  ReviewCharacteristic
} = require('../models/reviewModel');

const router = express.Router();

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
    where: {
      product_id: req.query.product_id,
      reported: false
    },
    limit: count,
    offset: count * (page - 1),
    order: sorts[req.query.sort || 'relevant']
  })
    .then((results) => {
      res.status(200).send(results);
    })
    .catch((err) => {
      res.send(err);
    });
});

const validateCharacteristicsObj = (charObj) => {
  const keys = Object.keys(charObj);
  for (let i = 0; i < keys.length; i += 1) {
    const num = Number(keys[i]);
    if (!Number.isInteger(num) || num < 1) {
      return false;
    }
  }
  return true;
};

router.post('/', (req, res) => {
  const {
    product_id: productId,
    rating,
    summary,
    body,
    recommend,
    name,
    email,
    photos,
    characteristics
  } = req.body;

  if (!productId || !rating
      || rating < 1 || rating > 5
      || !summary || !body || !recommend
      || !name || !email || !photos
      || Array.isArray(photos) || !characteristics
      || validateCharacteristicsObj(characteristics)) {
    res.sendStatus(422);
    return;
  }

  Review.findAll({
    where: {
      product_id: req.query.product_id,
      reported: false
    },
    limit: count,
    offset: count * (page - 1),
    order: sorts[req.query.sort || 'relevant']
  })
    .then((results) => {
      res.status(200).send(results);
    })
    .catch((err) => {
      res.send(err);
    });
});

module.exports = router;
