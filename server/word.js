const { DataTypes } = require('sequelize');
const sequelize = require('./database');

const Word = sequelize.define('palavra', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  palavra: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true
});

module.exports = Word;
