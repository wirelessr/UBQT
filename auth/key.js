"use strict";
const fs = require("fs");
const path = require("path");
const pathBase = path.resolve(__dirname, "..");

class KeySingleton {
  constructor() {
    const instance = this.constructor.instance;
    if (instance) {
      return instance;
    }

    const secretPath = path.resolve(pathBase, "secret");
    this.priv = fs.readFileSync(`${secretPath}/jwtRS256.key`, "utf8");
    this.public = fs.readFileSync(`${secretPath}/jwtRS256.key.pub`, "utf8");
    this.constructor.instance = this;
  }

  getPrivKey() {
    return this.priv;
  }
  getPublicKey() {
    return this.public;
  }
}

module.exports = { KeySingleton };
