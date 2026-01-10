"use strict";

const express = require("express");
const { param } = require("express-validator");
const validate = require("../middleware/validate"); // Need to import validate middleware!
const { authMiddleware, requireRole } = require("../middleware/auth");
const { getLogs, getLog, clearLogs } = require("../controllers/auditController");

const router = express.Router();

router.use(authMiddleware);
router.use(requireRole("admin"));

router.get("/", getLogs);
router.get("/:id", validate([param("id").isMongoId()]), getLog);
router.delete("/", clearLogs);

module.exports = router;
