const express = require('express');
const {
  Review,
  Photo,
  Characteristic,
  ReviewCharacteristic
} = require('../models/reviewModel');

const router = express.Router();

// eslint-disable-next-line no-unused-vars
router.get('/', (req, res) => {
  const page = req.query.page || 1;
  const count = req.query.count || 5;

  if (page < 1 || count < 1 || !req.query.product_id) {
    res.sendStatus(422);
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
    .catch((err) => res.send(err));
});

module.exports = router;
