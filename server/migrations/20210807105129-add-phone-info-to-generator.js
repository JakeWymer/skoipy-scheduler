"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          "generators",
          "opt_in_text",
          {
            type: Sequelize.DataTypes.BOOLEAN,
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          "generators",
          "phone_number",
          {
            type: Sequelize.DataTypes.STRING,
          },
          { transaction: t }
        ),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn("generators", "opt_in_text", {
          transaction: t,
        }),
        queryInterface.removeColumn("generators", "phone_number", {
          transaction: t,
        }),
      ]);
    });
  },
};
