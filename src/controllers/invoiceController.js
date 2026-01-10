"use strict";

const { body, param } = require("express-validator");
const invoiceService = require("../services/invoiceService");

const invoiceValidators = [
  body("invoiceNumber").notEmpty().withMessage("invoiceNumber is required"),
  body("customerName").notEmpty().withMessage("customerName is required"),
  body("amount").isFloat({ gt: 0 }).withMessage("amount must be positive"),
  body("dueDate").isISO8601().withMessage("dueDate must be ISO date"),
  body("status").optional().isIn(["PAID", "UNPAID", "PENDING"]).withMessage("Invalid status")
];

const statusValidator = [
  param("id").isMongoId().withMessage("Invalid invoice id"),
  body("status").isIn(["PAID", "UNPAID", "PENDING"]).withMessage("Invalid status")
];

const createInvoice = async (req, res, next) => {
  try {
    const invoice = await invoiceService.createInvoice(req.body, req.user?.email || "system");
    res.status(201).json(invoice);
  } catch (err) {
    next(err);
  }
};

const getInvoice = async (req, res, next) => {
  try {
    const invoice = await invoiceService.getInvoiceById(req.params.id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.json(invoice);
  } catch (err) {
    next(err);
  }
};

const getInvoices = async (req, res, next) => {
  try {
    const invoices = await invoiceService.getAllInvoices();
    res.json(invoices);
  } catch (err) {
    next(err);
  }
};

const getUnpaid = async (req, res, next) => {
  try {
    const invoices = await invoiceService.getUnpaidInvoices();
    res.json(invoices);
  } catch (err) {
    next(err);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const invoice = await invoiceService.updateInvoiceStatus(req.params.id, req.body.status, req.user?.email);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.json(invoice);
  } catch (err) {
    next(err);
  }
};

const deleteInvoice = async (req, res, next) => {
  try {
    const invoice = await invoiceService.deleteInvoice(req.params.id, req.user?.email);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.json({ message: "Invoice deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createInvoice,
  getInvoice,
  getInvoices,
  getUnpaid,
  updateStatus,
  deleteInvoice,
  invoiceValidators,
  statusValidator
};

