"use strict";

const { conn } = require("../db");

const models = {
  Users: require("./users")(conn.rdb)
};

module.exports = models;
