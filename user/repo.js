"use strict";

const bcrypt = require("bcrypt");
const model = require("../model");

const detailAttr = ["acct", "fullname", "created_at", "updated_at"];

const self = {
  flushUser: async () => {
    await model.Users.destroy({ truncate: true });
  },
  createUser: async (user, pwd, fullname) => {
    const salt = await bcrypt.genSalt(10);
    const result = await model.Users.create({
      acct: user,
      pwd: await bcrypt.hash(pwd, salt),
      fullname
    });
    return result;
  },
  verifyUser: async (user, pwd) => {
    const result = await model.Users.findOne({
      attributes: ["pwd"],
      where: { acct: user },
      raw: true
    });
    if (!result) {
      return false;
    }
    return await bcrypt.compare(pwd, result.pwd);
  },
  listUser: async () => {
    const result = await model.Users.findAll({
      attributes: detailAttr,
      raw: true
    });
    return result;
  },
  searchUser: async (key, value) => {
    const result = await model.Users.findOne({
      attributes: detailAttr,
      where: { [key]: value },
      raw: true
    });
    return result;
  },
  deleteUser: async (user) => {
    await model.Users.destroy({ where: { acct: user } });
  },
  updateUser: async (user, params) => {
    await model.Users.update(params, { where: { acct: user } });
  }
};

module.exports = self;
