"use strict";

const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const env = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI || "mongodb://localhost:27017/smart_billing",
  jwtSecret: process.env.JWT_SECRET || "supersecretjwt",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
  easypaisaSecret: process.env.EASYPaisa_SECRET || "easypaisa_checksum_secret",
  jazzcashSecret: process.env.JAZZCASH_SECRET || "jazzcash_checksum_secret",
  logLevel: process.env.LOG_LEVEL || "info"
};

module.exports = env;

