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
      res.sendStatus(400);
    }
    let ret;
    try {
      ret = await repo.createUser(
        body.value.user,
        body.value.password,
        body.value.fullname
      );
    } catch (err) {
      res.sendStatus(500);
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
      res.sendStatus(400);
    }

    let passed = false;

    try {
      passed = await repo.verifyUser(body.value.user, body.value.password);
    } catch (err) {
      res.sendStatus(500);
    }
    if (!passed) {
      res.sendStatus(401);
    }

    res.send({
      token: auth.sign({ acct: body.value.user })
    });
  },
  list: async (req, res) => {
    let result;
    try {
      result = await repo.listUser();
    } catch (err) {
      res.sendStatus(500);
    }
    res.send(result);
  },
  searchByFullName: async (req, res) => {
    const fullname = req.params.fullname;
    let result;
    try {
      result = await repo.searchUser("fullname", fullname);
    } catch (err) {
      res.sendStatus(500);
    }
    res.send(result);
  }
};

module.exports = self;
