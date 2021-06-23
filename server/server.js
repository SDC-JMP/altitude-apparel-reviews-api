const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const router = require('./routes/reviewRoutes');

app.use(bodyParser.urlEncoded({ extended: true }));
app.use(bodyParser.json());

app.use('/reviews', router);

module.exports = app;
