"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    toJson() {
      return {
        id: this.id,
        username: this.username,
        email: this.email,
      };
    }
  }
  User.init(
    {
      spotify_id: { type: DataTypes.STRING, unique: true },
      username: { type: DataTypes.STRING },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      refresh_token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      timestamps: false,
    }
  );
  return User;
};
