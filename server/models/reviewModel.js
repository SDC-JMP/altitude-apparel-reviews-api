const { Sequelize, DataTypes } = require('sequelize');

const db = new Sequelize('reviews_db', 'reviews_user', 'user_review', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
  define: {
    timestamps: false,
    freezeTableName: true
  }
});

exports.Review = db.define('review', {
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  summary: {
    type: DataTypes.STRING(60),
    allowNull: false
  },
  body: {
    type: DataTypes.STRING(1000),
    allowNull: false
  },
  recommend: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  reported: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  reviewer_name: {
    type: DataTypes.STRING(60),
    allowNull: false
  },
  reviewer_email: {
    type: DataTypes.STRING(60),
    allowNull: false
  },
  response: {
    type: DataTypes.STRING(1000),
    allowNull: true
  },
  helpfulness: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

exports.Photo = db.define('photo', {
  url: {
    type: DataTypes.STRING(2000),
    allowNull: false
  },
  review_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

exports.Characteristic = db.define('characteristic', {
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(7),
    allowNull: false
  }
});

exports.ReviewCharacteristic = db.define('review_characteristic', {
  review_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  value: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  characteristic_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});
