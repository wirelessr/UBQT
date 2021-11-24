"use strict";

const bcrypt = require("bcrypt");
const model = require("../model");

const self = {
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
  }
};

module.exports = self;
