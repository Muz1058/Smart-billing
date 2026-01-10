"use strict";

const jwt = require("jsonwebtoken");
const User = require("../models/User");
const env = require("../config/env");
const logger = require("../utils/logger");

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn
  });
};

const register = async ({ name, email, password, role = "user" }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    const error = new Error("Email already registered");
    error.statusCode = 400;
    throw error;
  }
  const user = await User.create({ name, email, password, role });
  logger.info("User registered", { id: user._id, email: user.email });
  return { user: { id: user._id, name: user.name, email: user.email, role: user.role }, token: generateToken(user) };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }
  return { user: { id: user._id, name: user.name, email: user.email, role: user.role }, token: generateToken(user) };
};

module.exports = {
  register,
  login
};

