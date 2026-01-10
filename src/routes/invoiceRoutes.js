"use strict";

const express = require("express");
const { param } = require("express-validator");
const validate = require("../middleware/validate");
const { authMiddleware, requireRole } = require("../middleware/auth");
const {
  createInvoice,
  getInvoice,
  getInvoices,
  getUnpaid,
  updateStatus,
  deleteInvoice,
  invoiceValidators,
  statusValidator
} = require("../controllers/invoiceController");

const router = express.Router();

router.use(authMiddleware);

router.post("/", validate(invoiceValidators), createInvoice);
router.get("/", getInvoices);
router.get("/unpaid", getUnpaid);
router.get("/:id", validate([param("id").isMongoId()]), getInvoice);
// updateStatus validator (statusValidator in controller) actually ALREADY uses param('id').isMongoId validation!
// Let's double check invoiceController.js content. It was:
// const statusValidator = [ param("id").isMongoId()..., body("status")... ];
// So I don't need to wrap it specifically, but I should check if I need to merge params.
router.patch("/:id/status", validate(statusValidator), updateStatus);
router.delete("/:id", requireRole("admin"), validate([param("id").isMongoId()]), deleteInvoice);

module.exports = router;

