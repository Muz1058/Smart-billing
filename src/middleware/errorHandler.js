"use strict";

const logger = require("../utils/logger");

const notFound = (req, res) => {
  res.status(404).json({ message: "Route not found" });
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  logger.error("Unhandled error", { message: err.message, stack: err.stack });
  const status = err.statusCode || 500;
  res.status(status).json({
    message: err.message || "Internal server error"
  });
};

module.exports = {
  notFound,
  errorHandler
};

