"use strict";

const { body } = require("express-validator");
const authService = require("../services/authService");

const registerValidators = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 chars"),
  body("role").optional().isIn(["admin", "user"]).withMessage("Invalid role")
];

const loginValidators = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required")
];

const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  registerValidators,
  loginValidators
};

