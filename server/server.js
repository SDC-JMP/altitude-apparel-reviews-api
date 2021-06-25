const express = require('express');
const bodyParser = require('body-parser');

const router = require('./routes/reviewRoutes');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/reviews', router);

module.exports = app;
