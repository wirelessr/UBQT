"use strict";

const { Sequelize } = require("sequelize");

const conn = {};
let already_init = false;

const initSequelize = (config) => {
  if (already_init) return;
  already_init = true;
  const rdb = new Sequelize(config.database, config.user, config.pwd, {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    }
  });
  conn.rdb = rdb;
};

module.exports = { conn, initSequelize };
