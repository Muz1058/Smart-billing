"use strict";

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        sku: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            uppercase: true
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        stock: {
            type: Number,
            default: 0,
            min: 0
        },
        description: String,
        status: {
            type: String,
            enum: ["active", "inactive", "out_of_stock"],
            default: "active"
        },
        images: [String]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Product", productSchema);
