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
  listUser: async (order = null, page = null, size = null) => {
    const params = {
      attributes: detailAttr,
      raw: true
    };

    if (detailAttr.includes(order)) {
      Object.assign(params, { order: [[order, "DESC"]] });
    }
    if (page && size) {
      Object.assign(params, { limit: size, offset: (page - 1) * size });
    }

    const result = await model.Users.findAll(params);
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
  updateUser: async (user, password = null, fullname = null) => {
    const params = {};

    if (!password && !fullname) {
      return;
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      params.pwd = await bcrypt.hash(password, salt);
    }
    if (fullname) {
      params.fullname = fullname;
    }
    await model.Users.update(params, { where: { acct: user } });
  }
};

module.exports = self;
