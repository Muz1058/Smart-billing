"use strict";

const express = require("express");
const validate = require("../middleware/validate");
const { authMiddleware } = require("../middleware/auth");
const { initiate, callback, list, initiateValidator, callbackValidator } = require("../controllers/paymentController");

const router = express.Router();

const attachMethod = (method) => (req, res, next) => {
  req.body.paymentMethod = method;
  next();
};

router.post(
  "/easypaisa/initiate",
  authMiddleware,
  attachMethod("EASYPaisa"),
  validate(initiateValidator),
  initiate
);
router.post(
  "/jazzcash/initiate",
  authMiddleware,
  attachMethod("JAZZCASH"),
  validate(initiateValidator),
  initiate
);

router.post("/initiate", authMiddleware, validate(initiateValidator), initiate);

router.post("/easypaisa/callback", attachMethod("EASYPaisa"), validate(callbackValidator), callback);
router.post("/jazzcash/callback", attachMethod("JAZZCASH"), validate(callbackValidator), callback);
router.post("/callback", validate(callbackValidator), callback);
router.get("/", authMiddleware, list);

module.exports = router;

