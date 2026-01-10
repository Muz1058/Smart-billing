"use strict";

const express = require("express");
const { param } = require("express-validator");
const validate = require("../middleware/validate");
const { authMiddleware } = require("../middleware/auth");
const {
    getCustomers,
    getCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomerInvoices,
    addCustomerNote,
    customerValidators
} = require("../controllers/customerController");

const router = express.Router();

router.use(authMiddleware);

router.post("/", validate(customerValidators), createCustomer);
router.get("/", getCustomers);
router.get("/:id", validate([param("id").isMongoId()]), getCustomer);
router.put("/:id", validate([param("id").isMongoId(), ...customerValidators]), updateCustomer);
router.delete("/:id", validate([param("id").isMongoId()]), deleteCustomer);

router.get("/:id/invoices", validate([param("id").isMongoId()]), getCustomerInvoices);
router.post("/:id/notes", validate([param("id").isMongoId()]), addCustomerNote);

module.exports = router;
