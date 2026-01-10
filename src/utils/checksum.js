"use strict";

const crypto = require("crypto");

const generateChecksum = (payload, secret) => {
  const serialized = JSON.stringify(payload);
  return crypto.createHmac("sha256", secret).update(serialized).digest("hex");
};

const verifyChecksum = (payload, secret, checksum) => {
  const expected = generateChecksum(payload, secret);
  if (expected.length !== checksum.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(checksum));
};

module.exports = {
  generateChecksum,
  verifyChecksum
};

