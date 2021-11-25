const express = require("express");
const router = express.Router();

const auth = require("../auth");

const controller = require("./controller");
router.get("/list", auth.verifyMiddleware, controller.list);

module.exports = router;
