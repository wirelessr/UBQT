const express = require("express");
const router = express.Router();

const auth = require("../auth");

const controller = require("./controller");
router.get("/list", auth.verifyMiddleware, controller.list);
router.get(
  "/search/:fullname",
  auth.verifyMiddleware,
  controller.searchByFullName
);
router.get("/detail", auth.verifyMiddleware, controller.detail);

module.exports = router;
