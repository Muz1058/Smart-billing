"use strict";

const express = require("express");
const { authMiddleware, requireRole } = require("../middleware/auth");
const {
    getDashboardStats,
    getRevenueStats,
    getTopCustomers
} = require("../controllers/reportController");

const router = express.Router();

router.use(authMiddleware);

router.get("/dashboard", requireRole("admin"), getDashboardStats);
router.get("/revenue", requireRole("admin"), getRevenueStats);
router.get("/top-customers", requireRole("admin"), getTopCustomers);

module.exports = router;
