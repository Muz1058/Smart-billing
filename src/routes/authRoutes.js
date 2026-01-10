"use strict";

const express = require("express");
const validate = require("../middleware/validate");
const { register, login, registerValidators, loginValidators } = require("../controllers/authController");

const router = express.Router();

router.post("/register", validate(registerValidators), register);
router.post("/login", validate(loginValidators), login);

module.exports = router;

