const express = require("express");
const router = express.Router();

const controller = require("./controller");
router.post("/sign_up", controller.signUp);

module.exports = router;
