"use strict";

const mongoose = require("mongoose");
const env = require("./env");
const logger = require("../utils/logger");

const connectDB = async () => {
  try {
    await mongoose.connect(env.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    logger.info("MongoDB connected");
  } catch (err) {
    logger.error("MongoDB connection error", err);
    process.exit(1);
  }
};

module.exports = connectDB;

