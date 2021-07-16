const { DataTypes } = require("sequelize");
const db = require("../index");

const User = db.define(
  `User`,
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
    tableName: "users",
  }
);

User.prototype.toJson = function () {
  return {
    id: this.id,
    username: this.username,
    email: this.email,
  };
};

User.sync({ alter: true });

module.exports = User;
