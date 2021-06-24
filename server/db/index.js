const { Sequelize } = require("sequelize");

const pgConnectionUri = process.env.PG_CONNECTION_URI;
const sequelize = new Sequelize(pgConnectionUri, { dialect: `postgres` });

module.exports = sequelize;
