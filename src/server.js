"use strict";

const app = require("./app");
const connectDB = require("./config/db");
const env = require("./config/env");
const logger = require("./utils/logger");

const start = async () => {
  await connectDB();
  const server = app.listen(env.port, () => logger.info(`Server running on port ${env.port}`));

  const gracefulShutdown = () => {
    logger.info("Received kill signal, shutting down gracefully");
    server.close(() => {
      logger.info("Closed out remaining connections");
      process.exit(0);
    });

    setTimeout(() => {
      logger.error("Could not close connections in time, forcefully shutting down");
      process.exit(1);
    }, 10000);
  };

  process.on("SIGTERM", gracefulShutdown);
  process.on("SIGINT", gracefulShutdown);
};

start();

