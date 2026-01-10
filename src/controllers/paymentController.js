"use strict";

const { body } = require("express-validator");
const paymentService = require("../services/paymentService");

const initiateValidator = [
  body("invoiceId").isMongoId().withMessage("invoiceId is required"),
  body("paymentMethod").isIn(["EASYPaisa", "JAZZCASH"]).withMessage("Invalid paymentMethod")
];

const callbackValidator = [
  body("transactionId").notEmpty(),
  body("status").isIn(["SUCCESS", "FAILED"]),
  body("checksum").notEmpty(),
  body("invoiceId").isMongoId(),
  body("paymentMethod").isIn(["EASYPaisa", "JAZZCASH"])
];

const initiate = async (req, res, next) => {
  try {
    const result = await paymentService.initiatePayment(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

const callback = async (req, res, next) => {
  try {
    const payment = await paymentService.handleCallback(req.body);
    res.json({ message: "Callback processed", payment });
  } catch (err) {
    next(err);
  }
};

const list = async (req, res, next) => {
  try {
    const payments = await paymentService.listPayments();
    res.json(payments);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  initiate,
  callback,
  list,
  initiateValidator,
  callbackValidator
};

