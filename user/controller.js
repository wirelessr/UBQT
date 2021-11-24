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
  },
  signIn: async (req, res) => {
    const signInSchema = Joi.object({
      user: Joi.string().min(1).max(100).required(),
      password: Joi.string().min(1).max(100).required()
    });

    const body = signInSchema.validate(req.body);
    if (body.error) {
      return res.status(400).send();
    }

    let passed = false;

    try {
      passed = await repo.verifyUser(body.value.user, body.value.password);
    } catch (err) {
      res.status(500).send();
    }
    if (!passed) {
      return res.status(401).send();
    }

    res.send({
      token: auth.sign({ acct: body.value.user })
    });
  }
};

module.exports = self;
