"use strict";

const Invoice = require("../models/Invoice");
const Payment = require("../models/Payment");
const Customer = require("../models/Customer");
const Subscription = require("../models/Subscription");
const User = require("../models/User");

const getDashboardStats = async (req, res, next) => {
    try {
        const [
            invoiceCount,
            paymentCount,
            customerCount,
            subscriptionCount,
            totalRevenue
        ] = await Promise.all([
            Invoice.countDocuments(),
            Payment.countDocuments(),
            Customer.countDocuments(),
            Subscription.countDocuments(),
            Payment.aggregate([
                { $match: { status: "SUCCESS" } },
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ])
        ]);

        const recentInvoices = await Invoice.find()
            .sort("-createdAt")
            .limit(5);

        res.json({
            counts: {
                invoices: invoiceCount,
                payments: paymentCount,
                customers: customerCount,
                subscriptions: subscriptionCount
            },
            revenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
            recentInvoices
        });
    } catch (err) {
        next(err);
    }
};

const getRevenueStats = async (req, res, next) => {
    try {
        const revenueByMonth = await Payment.aggregate([
            { $match: { status: "SUCCESS" } },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    total: { $sum: "$amount" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        res.json(revenueByMonth);
    } catch (err) {
        next(err);
    }
};

const getTopCustomers = async (req, res, next) => {
    try {
        const topCustomers = await Payment.aggregate([
            { $match: { status: "SUCCESS" } },
            // We need to link payment to customer via Invoice?
            // Invoice has customerName usually.
            // If payment has invoiceId, we can lookup invoice.
            // Assuming Payment has `invoiceId` which refs Invoice.
            // And Invoice has `customerName` or `customer` ref.
            {
                $lookup: {
                    from: "invoices",
                    localField: "invoiceId",
                    foreignField: "_id",
                    as: "invoice"
                }
            },
            { $unwind: "$invoice" },
            {
                $group: {
                    _id: "$invoice.customerName",
                    totalSpent: { $sum: "$amount" },
                    transactions: { $sum: 1 }
                }
            },
            { $sort: { totalSpent: -1 } },
            { $limit: 5 }
        ]);
        res.json(topCustomers);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getDashboardStats,
    getRevenueStats,
    getTopCustomers
};
