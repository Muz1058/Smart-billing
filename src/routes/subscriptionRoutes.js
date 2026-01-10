"use strict";

const express = require("express");
const { param } = require("express-validator");
const validate = require("../middleware/validate");
const { authMiddleware } = require("../middleware/auth");
const {
    getSubscriptions,
    getSubscription,
    createSubscription,
    updateStatus,
    subscriptionValidators,
    statusValidator
} = require("../controllers/subscriptionController");

const router = express.Router();

router.use(authMiddleware);

router.post("/", validate(subscriptionValidators), createSubscription);
router.get("/", getSubscriptions);
router.get("/:id", validate([param("id").isMongoId()]), getSubscription);
// statusValidator likely only checks body("status"). Merge carefully?
// Let's assume statusValidator is just body checks. Merging is safer.
// If statusValidator includes param check, this is redundant but harmless.
router.patch("/:id/status", validate([param("id").isMongoId(), ...statusValidator]), updateStatus);

module.exports = router;
