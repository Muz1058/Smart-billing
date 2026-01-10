"use strict";

const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true
        },
        planName: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true,
            min: 0
        },
        interval: {
            type: String,
            enum: ["monthly", "quarterly", "yearly"],
            default: "monthly"
        },
        status: {
            type: String,
            enum: ["active", "paused", "cancelled", "expired"],
            default: "active"
        },
        startDate: {
            type: Date,
            default: Date.now
        },
        nextBillingDate: {
            type: Date,
            required: true
        },
        cancellationDate: Date
    },
    {
        timestamps: true
    }
);

subscriptionSchema.pre("save", function (next) {
    if (!this.nextBillingDate) {
        const now = new Date();
        if (this.interval === "monthly") now.setMonth(now.getMonth() + 1);
        if (this.interval === "quarterly") now.setMonth(now.getMonth() + 3);
        if (this.interval === "yearly") now.setFullYear(now.getFullYear() + 1);
        this.nextBillingDate = now;
    }
    next();
});

module.exports = mongoose.model("Subscription", subscriptionSchema);
