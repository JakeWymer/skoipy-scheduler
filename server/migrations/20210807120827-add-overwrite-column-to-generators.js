"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          "generators",
          "overwrite_existing",
          {
            type: Sequelize.DataTypes.BOOLEAN,
          },
          { transaction: t }
        ),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn("generators", "overwrite_existing", {
          transaction: t,
        }),
      ]);
    });
  },
};
