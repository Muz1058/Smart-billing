"use strict";

const express = require("express");
const validate = require("../middleware/validate");
const { authMiddleware, requireRole } = require("../middleware/auth");
const {
    getProfile,
    updateProfile,
    updatePassword,
    getSettings,
    updateSettings,
    getAllUsers,
    updateUserRole,
    deleteUser,
    profileValidators,
    passwordValidators,
    settingsValidator,
    roleValidator
} = require("../controllers/userController");

const { param } = require("express-validator");
const router = express.Router();

router.use(authMiddleware);

// Profile
router.get("/profile", getProfile);
router.put("/profile", validate(profileValidators), updateProfile);
router.put("/password", validate(passwordValidators), updatePassword);

// Settings
router.get("/settings", getSettings);
router.put("/settings", validate(settingsValidator), updateSettings);

// Admin
router.get("/users", requireRole("admin"), getAllUsers);
router.patch("/users/:id/role", requireRole("admin"), validate([param("id").isMongoId(), ...roleValidator]), updateUserRole);
router.delete("/users/:id", requireRole("admin"), validate([param("id").isMongoId()]), deleteUser);

module.exports = router;
