"use strict";

const Joi = require("joi");
const repo = require("./repo");
const auth = require("../auth");

const self = {
  signUp: async (req, res) => {
    const signUpSchema = Joi.object({
      user: Joi.string().min(1).max(100).required(),
      password: Joi.string().min(1).max(100).required(),
      fullname: Joi.string().min(1).max(100).required()
    });
    console.log(req.body);

    const body = signUpSchema.validate(req.body);
    if (body.error) {
      return res.status(400).send();
    }
    let ret;
    try {
      ret = await repo.createUser(
        body.value.user,
        body.value.password,
        body.value.fullname
      );
    } catch (err) {
      res.status(500).send();
    }

    res.send({
      token: auth.sign({ acct: ret.acct })
    });
  }
};

module.exports = self;
