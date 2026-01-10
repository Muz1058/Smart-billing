"use strict";

const mongoose = require("mongoose");
const env = require("../src/config/env");
const User = require("../src/models/User");
const Invoice = require("../src/models/Invoice");
const logger = require("../src/utils/logger");

const seed = async () => {
  await mongoose.connect(env.mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

  await User.deleteMany({});
  await Invoice.deleteMany({});

  const admin = await User.create({
    name: "Admin",
    email: "admin@example.com",
    password: "password123",
    role: "admin"
  });

  const invoices = await Invoice.insertMany([
    {
      invoiceNumber: "INV-1001",
      customerName: "Acme Corp",
      amount: 500,
      dueDate: new Date(),
      status: "PENDING"
    },
    {
      invoiceNumber: "INV-1002",
      customerName: "Globex",
      amount: 1200,
      dueDate: new Date(),
      status: "UNPAID"
    }
  ]);

  logger.info("Seed complete", { admin: admin.email, invoices: invoices.length });
  await mongoose.connection.close();
};

seed()
  .then(() => {
    logger.info("Done");
    process.exit(0);
  })
  .catch((err) => {
    logger.error(err.message, err);
    process.exit(1);
  });

