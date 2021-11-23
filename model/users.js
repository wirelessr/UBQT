"use strict";
const { Model, DataTypes, Sequelize } = require("sequelize");

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
      created_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
        allowNull: false
      }
    },
    {
      sequelize,
      freezeTableName: true,
      timestamps: false,
      modelName: "users"
    }
  );
  /*
  Hobby.afterValidate(function (model, options, cb) {
    if (
      model.dataValues.db_insert_time &&
      model.dataValues.db_insert_time.val
    ) {
      delete model.dataValues.db_insert_time;
    }
    if (
      model.dataValues.db_update_time &&
      model.dataValues.db_update_time.val
    ) {
      delete model.dataValues.db_update_time;
    }
  });
*/
  return Users;
};
