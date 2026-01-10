"use strict";

const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    invoice: { type: mongoose.Schema.Types.ObjectId, ref: "Invoice", required: true },
    paymentMethod: { type: String, enum: ["EASYPaisa", "JAZZCASH"], required: true },
    transactionId: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ["PENDING", "SUCCESS", "FAILED"], default: "PENDING" },
    checksum: { type: String, required: true }
  },
  { timestamps: { createdAt: "timestamp", updatedAt: "updatedAt" } }
);

module.exports = mongoose.model("Payment", PaymentSchema);

