const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('~/sequelize/instance')(Sequelize);

const models = require('~/sequelize/model-definitions')(sequelize, DataTypes);

module.exports = Object.assign({ sequelize }, models)


