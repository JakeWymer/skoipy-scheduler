"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      spotify_id: { type: Sequelize.STRING, unique: true },
      username: { type: Sequelize.STRING },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      refresh_token: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable("users");
  },
};
