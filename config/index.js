"use strict";

const config = require("./config.json");

if (process.env.POSTGRES_HOST) {
  config.rdb.host = process.env.POSTGRES_HOST;
}
if (process.env.POSTGRES_PORT) {
  config.rdb.port = process.env.POSTGRES_PORT;
}

module.exports = config;
