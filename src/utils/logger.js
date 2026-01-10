"use strict";

const levels = ["error", "warn", "info", "debug"];
const currentLevel = process.env.LOG_LEVEL || "info";

const shouldLog = (level) => levels.indexOf(level) <= levels.indexOf(currentLevel);

const format = (level, message, meta) => {
  const time = new Date().toISOString();
  const base = `[${time}] ${level.toUpperCase()}: ${message}`;
  if (!meta) return base;
  return `${base} | ${JSON.stringify(meta)}`;
};

const logger = {
  error: (msg, meta) => shouldLog("error") && console.error(format("error", msg, meta)),
  warn: (msg, meta) => shouldLog("warn") && console.warn(format("warn", msg, meta)),
  info: (msg, meta) => shouldLog("info") && console.log(format("info", msg, meta)),
  debug: (msg, meta) => shouldLog("debug") && console.debug(format("debug", msg, meta))
};

module.exports = logger;

