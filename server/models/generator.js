"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Generator extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Generator.User = Generator.belongsTo(models.User, {
        foreignKey: "owner_id",
      });
    }
  }
  Generator.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      seeds: {
        type: DataTypes.JSONB,
      },
      owner_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      schedule_frequency: {
        type: DataTypes.STRING,
      },
      schedule_day: {
        type: DataTypes.STRING,
      },
      opt_in_text: {
        type: DataTypes.BOOLEAN,
      },
      phone_number: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "Generator",
      tableName: "generators",
      timestamps: false,
    }
  );
  return Generator;
};
