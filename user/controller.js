"use strict";

const self = {
  signUp: async (req, res) => {
    console.log(req.body);
    res.send("sign up seccess");
  }
};

module.exports = self;
