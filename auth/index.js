"use strict";
const { KeySingleton } = require("./key");
const jwt = require("jsonwebtoken");

const self = {
  sign: (payload) => {
    const key = new KeySingleton();
    const signOptions = {
      algorithm: "RS256"
    };
    return jwt.sign(payload, key.getPrivKey(), signOptions);
  },
  decode: (token) => {
    const key = new KeySingleton();
    const verifyOptions = {
      algorithms: ["RS256"]
    };
    let ret;
    try {
      ret = jwt.verify(token, key.getPublicKey(), verifyOptions);
    } catch (err) {
      ret = null;
    }
    return ret;
  },
  verifyMiddleware: (req, res, next) => {
    const h = req.header("Authorization") ?? "";
    const token = h.replace("Bearer ", "");
    if (!token) {
      res.status(401);
    }
    if (self.decode(token)) {
      next();
    } else {
      res.status(401);
    }
  }
};

module.exports = self;
