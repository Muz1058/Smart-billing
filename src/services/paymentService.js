"use strict";

const Invoice = require("../models/Invoice");
const Payment = require("../models/Payment");
const AuditLog = require("../models/AuditLog");
const { verifyChecksum } = require("../utils/checksum");
const easypaisa = require("../integrations/easypaisa");
const jazzcash = require("../integrations/jazzcash");

const gateways = {
  EASYPaisa: easypaisa,
  JAZZCASH: jazzcash
};

const initiatePayment = async ({ invoiceId, paymentMethod }) => {
  const invoice = await Invoice.findById(invoiceId);
  if (!invoice) {
    const error = new Error("Invoice not found");
    error.statusCode = 404;
    throw error;
  }

  const gateway = gateways[paymentMethod];
  if (!gateway) {
    const error = new Error("Unsupported payment method");
    error.statusCode = 400;
    throw error;
  }

  const { transactionId, checksum, payload } = gateway.initiate(invoice);

  const payment = await Payment.create({
    invoice: invoice._id,
    paymentMethod,
    transactionId,
    amount: invoice.amount,
    checksum,
    status: "PENDING"
  });

  await AuditLog.create({
    action: "INITIATE_PAYMENT",
    entity: "Payment",
    entityId: payment._id.toString(),
    performedBy: "system",
    metadata: payload
  });

  return { transactionId, checksum, amount: invoice.amount, invoiceId: invoice._id };
};

const handleCallback = async ({ paymentMethod, transactionId, status, checksum, invoiceId }) => {
  const payment = await Payment.findOne({ transactionId, paymentMethod });
  if (!payment) {
    const error = new Error("Payment not found");
    error.statusCode = 404;
    throw error;
  }

  const gateway = gateways[paymentMethod];
  if (!gateway) {
    const error = new Error("Unsupported payment method");
    error.statusCode = 400;
    throw error;
  }

  const payload = { invoiceId, amount: payment.amount, transactionId, paymentMethod };
  const isValid = verifyChecksum(payload, gateway.secret, checksum);
  if (!isValid) {
    const error = new Error("Checksum verification failed");
    error.statusCode = 400;
    throw error;
  }

  payment.status = status === "SUCCESS" ? "SUCCESS" : "FAILED";
  await payment.save();

  if (status === "SUCCESS") {
    await Invoice.findByIdAndUpdate(invoiceId, { status: "PAID" });
  }

  await AuditLog.create({
    action: "PAYMENT_CALLBACK",
    entity: "Payment",
    entityId: payment._id.toString(),
    performedBy: "gateway",
    metadata: { status, transactionId }
  });

  return payment;
};

const listPayments = async () => Payment.find().populate("invoice").sort({ timestamp: -1 });

module.exports = {
  initiatePayment,
  handleCallback,
  listPayments
};

