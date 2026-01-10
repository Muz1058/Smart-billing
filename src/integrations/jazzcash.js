"use strict";

const { v4: uuidv4 } = require("uuid");
const env = require("../config/env");
const { generateChecksum } = require("../utils/checksum");

const initiate = (invoice) => {
  const transactionId = uuidv4();
  const payload = {
    invoiceId: invoice._id.toString(),
    amount: invoice.amount,
    transactionId,
    paymentMethod: "JAZZCASH"
  };
  const checksum = generateChecksum(payload, env.jazzcashSecret);
  return { transactionId, checksum, payload };
};

module.exports = {
  initiate,
  secret: env.jazzcashSecret
};

