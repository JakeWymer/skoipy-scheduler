const { DataTypes } = require("sequelize");
const db = require("../index");

const User = db.define(
  `User`,
  {
    spotify_id: { type: DataTypes.STRING, unique: true },
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

User.sync({ alter: true });

// import { DataTypes, Model } from "https://deno.land/x/denodb/mod.ts";

// class User extends Model {
//   static table = "users";
//   static timestamps = true;

//   static fields = {
//     id: { primaryKey: true, autoIncrement: true },
//     spotify_id: { type: DataTypes.INTEGER, unique: true },
//     email: {
//       type: DataTypes.STRING,
//       unique: true,
//       allowNull: false,
//     },
//     refresh_token: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//   };
// }

module.exports = User;
