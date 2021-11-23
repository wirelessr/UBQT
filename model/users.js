"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Users extends Model {}
  Users.init(
    {
      acct: {
        type: DataTypes.STRING(255),
        primaryKey: true
      },
      pwd: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      fullname: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      createdAt: {
        field: "created_at",
        type: DataTypes.DATE
      },
      updatedAt: {
        field: "updated_at",
        type: DataTypes.DATE
      }
    },
    {
      sequelize,
      freezeTableName: true,
      timestamps: true,
      modelName: "users"
    }
  );
  return Users;
};
