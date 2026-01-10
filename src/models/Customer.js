"use strict";

const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        phone: {
            type: String,
            trim: true
        },
        company: {
            type: String,
            trim: true
        },
        address: {
            street: String,
            city: String,
            state: String,
            zip: String,
            country: String
        },
        status: {
            type: String,
            enum: ["active", "inactive", "archived"],
            default: "active"
        },
        notes: [
            {
                content: String,
                createdAt: { type: Date, default: Date.now }
            }
        ],
        metadata: {
            type: Map,
            of: String
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Customer", customerSchema);
