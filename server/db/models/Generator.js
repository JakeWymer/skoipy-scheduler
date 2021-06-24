const { DataTypes } = require("sequelize");
const db = require("../index");

const Generator = db.define(
  `Generator`,
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
  },
  {
    tableName: `generators`,
  }
);

Generator.sync({ alter: true });

// import { DataTypes, Model } from "https://deno.land/x/denodb/mod.ts";

// class Generator extends Model {
//   static table = "skoip_generators";
//   static timestamps = true;

//   static fields = {
//     id: { primaryKey: true, autoIncrement: true },
//     name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     seeds: {
//       type: DataTypes.JSON,
//     },
//     owner_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//   };

//   static defaults = {
//     seeds: JSON.stringify([]),
//   };
// }

module.exports = Generator;
