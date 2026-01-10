"use strict";

const express = require("express");
const validate = require("../middleware/validate");
const { authMiddleware, requireRole } = require("../middleware/auth");
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    getLowStock,
    productValidators,
    stockValidator
} = require("../controllers/productController");

const { param } = require("express-validator");
const router = express.Router();

router.use(authMiddleware);

router.post("/", requireRole("admin"), validate(productValidators), createProduct);
router.get("/", getProducts);
router.get("/low-stock", getLowStock);
router.get("/:id", validate([param("id").isMongoId()]), getProduct);
router.put("/:id", requireRole("admin"), validate([param("id").isMongoId(), ...productValidators]), updateProduct);
router.delete("/:id", requireRole("admin"), validate([param("id").isMongoId()]), deleteProduct);
router.patch("/:id/stock", requireRole("admin"), validate([param("id").isMongoId(), ...stockValidator]), updateStock);

module.exports = router;
