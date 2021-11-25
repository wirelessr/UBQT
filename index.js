"use strict";
const express = require("express");
const app = express();
const port = 3000;

const { initSequelize } = require("./db");
const config = require("./config");
initSequelize(config.rdb);
require("./model");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  res.status(500).send({ error: err });
}
app.use(errorHandler);
const user = require("./user");
app.use("/user", user);

app.get("/", (req, res) => {
  res.send({ Hello: "World" });
});

const afterListen = async () => {
  console.log(`starting on port ${port}`);
};
const server = app.listen(port, afterListen);

module.exports = server;
