"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ApikeyUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ApikeyUser.User = ApikeyUser.belongsTo(models.User, {
        foreignKey: "user_id",
      });
    }
  }
  ApikeyUser.init(
    {
      api_key: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "ApikeyUser",
      tableName: "apikey_user",
      timestamps: false,
    }
  );
  return ApikeyUser;
};