"use strict";

const AuditLog = require("../models/AuditLog");

const getLogs = async (req, res, next) => {
    try {
        const { page = 1, limit = 20, entity, action } = req.query;
        const query = {};
        if (entity) query.entity = entity;
        if (action) query.action = action;

        const logs = await AuditLog.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort("-createdAt");

        const count = await AuditLog.countDocuments(query);

        res.json({
            logs,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (err) {
        next(err);
    }
};

const getLog = async (req, res, next) => {
    try {
        const log = await AuditLog.findById(req.params.id);
        if (!log) {
            const error = new Error("Audit log not found");
            error.statusCode = 404;
            throw error;
        }
        res.json(log);
    } catch (err) {
        next(err);
    }
};

const clearLogs = async (req, res, next) => {
    try {
        // Optional: add date filter to clear only old logs
        await AuditLog.deleteMany({});
        res.json({ message: "Audit logs cleared" });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getLogs,
    getLog,
    clearLogs
};
