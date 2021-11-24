"use strict";
const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");

const { initSequelize } = require("./db");
const config = require("./config");
initSequelize(config.rdb);
require("./model");

app.use(bodyParser.json());

function errorHandler(err, req, res, next) {
  res.status(500).send({ error: err });
}
app.use(errorHandler);
const user = require("./user");
app.use("/user", user);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const afterListen = async () => {
  console.log(`starting on port ${port}`);
};
app.listen(port, afterListen);
