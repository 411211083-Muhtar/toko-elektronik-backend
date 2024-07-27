const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('toko_elektronik', 'username', 'password', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
