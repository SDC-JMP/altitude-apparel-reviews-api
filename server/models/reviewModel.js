const { Sequelize, DataTypes } = require('sequelize');

const db = new Sequelize('reviews_db', 'reviews_user', 'user_review', {
  host: 'localhost',
  dialect: 'postgres',
  define: {
    timestamps: false,
    freezeTableName: true
  }
});

exports.Review = db.define('item', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  completed: {
    type: DataTypes.BOOLEAN
  }
});
