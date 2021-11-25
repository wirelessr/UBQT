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
router.post("/sign_up", controller.signUp);
router.post("/sign_in", controller.signIn);
router.delete("/delete", auth.verifyMiddleware, controller.delete);

module.exports = router;
