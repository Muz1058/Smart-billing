"use strict";

const Subscription = require("../models/Subscription");
const { body } = require("express-validator");

const getSubscriptions = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, customer, status } = req.query;
        const query = {};
        if (customer) query.customer = customer;
        if (status) query.status = status;

        const subscriptions = await Subscription.find(query)
            .populate("customer", "name email")
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort("-createdAt");

        const count = await Subscription.countDocuments(query);

        res.json({
            subscriptions,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (err) {
        next(err);
    }
};

const getSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id).populate("customer", "name email");
        if (!subscription) {
            const error = new Error("Subscription not found");
            error.statusCode = 404;
            throw error;
        }
        res.json(subscription);
    } catch (err) {
        next(err);
    }
};

const createSubscription = async (req, res, next) => {
    try {
        const subscription = new Subscription(req.body);
        // Auto calc nextBillingDate logic is in pre-save hook if not provided
        await subscription.save();
        res.status(201).json(subscription);
    } catch (err) {
        next(err);
    }
};

const updateStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const subscription = await Subscription.findById(req.params.id);
        if (!subscription) {
            const error = new Error("Subscription not found");
            error.statusCode = 404;
            throw error;
        }
        subscription.status = status;
        if (status === "cancelled") {
            subscription.cancellationDate = new Date();
        }
        await subscription.save();
        res.json(subscription);
    } catch (err) {
        next(err);
    }
};

const subscriptionValidators = [
    body("customer").notEmpty().withMessage("Customer ID is required"),
    body("planName").notEmpty(),
    body("amount").isFloat({ min: 0 }),
    body("interval").isIn(["monthly", "quarterly", "yearly"])
];

const statusValidator = [
    body("status").isIn(["active", "paused", "cancelled"]).withMessage("Invalid status")
];

module.exports = {
    getSubscriptions,
    getSubscription,
    createSubscription,
    updateStatus,
    subscriptionValidators,
    statusValidator
};
