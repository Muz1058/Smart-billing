"use strict";

const express = require("express");
const authRoutes = require("./authRoutes");
const invoiceRoutes = require("./invoiceRoutes");
const paymentRoutes = require("./paymentRoutes");
const customerRoutes = require("./customerRoutes");
const categoryRoutes = require("./categoryRoutes");
const productRoutes = require("./productRoutes");
const subscriptionRoutes = require("./subscriptionRoutes");
const reportRoutes = require("./reportRoutes");
const userRoutes = require("./userRoutes");
const auditRoutes = require("./auditRoutes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/invoices", invoiceRoutes);
router.use("/payments", paymentRoutes);
router.use("/customers", customerRoutes);
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);
router.use("/subscriptions", subscriptionRoutes);
router.use("/reports", reportRoutes);
router.use("/user", userRoutes);
router.use("/audit", auditRoutes);

module.exports = router;

