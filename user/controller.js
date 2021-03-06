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
      return res.sendStatus(400);
    }
    let ret;
    try {
      ret = await repo.createUser(
        body.value.user,
        body.value.password,
        body.value.fullname
      );
    } catch (err) {
      return res.sendStatus(500);
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
      return res.sendStatus(400);
    }

    let passed = false;

    try {
      passed = await repo.verifyUser(body.value.user, body.value.password);
    } catch (err) {
      return res.sendStatus(500);
    }
    if (!passed) {
      return res.sendStatus(401);
    }

    res.send({
      token: auth.sign({ acct: body.value.user })
    });
  },
  list: async (req, res) => {
    const listSchema = Joi.object({
      order: Joi.string().optional(),
      page: Joi.number().integer().positive().optional(),
      size: Joi.number().integer().positive().optional()
    });

    const query = listSchema.validate(req.query);
    if (query.error) {
      return res.sendStatus(400);
    }

    let result;
    try {
      result = await repo.listUser(
        query.value.order,
        query.value.page,
        query.value.size
      );
    } catch (err) {
      return res.sendStatus(500);
    }
    res.send(result);
  },
  searchByFullName: async (req, res) => {
    const fullname = decodeURIComponent(req.params.fullname);
    let result;
    try {
      result = await repo.searchUser("fullname", fullname);
    } catch (err) {
      return res.sendStatus(500);
    }
    res.send(result);
  },
  update: async (req, res) => {
    const updateSchema = Joi.object({
      password: Joi.string().min(1).max(100).optional(),
      fullname: Joi.string().min(1).max(100).optional()
    });

    const body = updateSchema.validate(req.body);
    if (body.error) {
      return res.sendStatus(400);
    }
    const acct = req.decoded.acct ?? "";
    try {
      await repo.updateUser(acct, body.value.password, body.value.fullname);
    } catch (err) {
      return res.sendStatus(500);
    }
    res.sendStatus(200);
  },
  delete: async (req, res) => {
    const acct = req.decoded.acct ?? "";
    try {
      await repo.deleteUser(acct);
    } catch (err) {
      return res.sendStatus(500);
    }
    res.sendStatus(200);
  },
  detail: async (req, res) => {
    const acct = req.decoded.acct ?? "";

    let result;
    try {
      result = await repo.searchUser("acct", acct);
    } catch (err) {
      return res.sendStatus(500);
    }
    res.send(result);
  }
};

module.exports = self;
