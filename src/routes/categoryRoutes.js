"use strict";

const express = require("express");
const { param } = require("express-validator");
const validate = require("../middleware/validate");
const { authMiddleware, requireRole } = require("../middleware/auth");
const {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    categoryValidators
} = require("../controllers/categoryController");

const router = express.Router();

router.use(authMiddleware);

router.post("/", requireRole("admin"), validate(categoryValidators), createCategory);
router.get("/", getCategories);
router.get("/:id", validate([param("id").isMongoId()]), getCategory);
router.put("/:id", requireRole("admin"), validate([param("id").isMongoId(), ...categoryValidators]), updateCategory);
router.delete("/:id", requireRole("admin"), validate([param("id").isMongoId()]), deleteCategory);

module.exports = router;
