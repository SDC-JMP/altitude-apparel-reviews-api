const { Sequelize, DataTypes } = require('sequelize');

exports.db = new Sequelize(process.env.DATABASE_URL, {
  logging: false,
  omitNull: true,
  define: {
    timestamps: false,
    freezeTableName: true
  }
});

exports.Review = exports.db.define('review', {
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
    defaultValue: Sequelize.fn('now'),
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
    defaultValue: false,
    allowNull: false
  },
  reported: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
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
    defaultValue: 0,
    allowNull: false
  },
  photos: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    defaultValue: [],
    allowNull: false
  }
}, { underscored: true });

// exports.Photo = exports.db.define('photo', {
//   url: {
//     type: DataTypes.STRING(2000),
//     allowNull: false
//   }
// }, { underscored: true });

// exports.Review.hasMany(exports.Photo);
// exports.Photo.belongsTo(exports.Review);

exports.Characteristic = exports.db.define('characteristic', {
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(7),
    allowNull: false
  }
}, { underscored: true });

exports.ReviewCharacteristic = exports.db.define('review_characteristic', {
  value: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  characteristic_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  review_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, { underscored: true });

exports.Review.hasMany(exports.ReviewCharacteristic);
exports.ReviewCharacteristic.belongsTo(exports.Review);
exports.Characteristic.hasMany(exports.ReviewCharacteristic, { as: 'rc' });
exports.ReviewCharacteristic.belongsTo(exports.Characteristic);
