"use strict";

const Product = require("../models/Product");
const { body } = require("express-validator");

const getProducts = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, search, category, status } = req.query;
        const query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { sku: { $regex: search, $options: "i" } }
            ];
        }
        if (category) {
            query.category = category;
        }
        if (status) {
            query.status = status;
        }

        const products = await Product.find(query)
            .populate("category", "name slug")
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort("-createdAt");

        const count = await Product.countDocuments(query);

        res.json({
            products,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (err) {
        next(err);
    }
};

const getProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).populate("category", "name slug");
        if (!product) {
            const error = new Error("Product not found");
            error.statusCode = 404;
            throw error;
        }
        res.json(product);
    } catch (err) {
        next(err);
    }
};

const createProduct = async (req, res, next) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        next(err);
    }
};

const updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!product) {
            const error = new Error("Product not found");
            error.statusCode = 404;
            throw error;
        }
        res.json(product);
    } catch (err) {
        next(err);
    }
};

const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            const error = new Error("Product not found");
            error.statusCode = 404;
            throw error;
        }
        res.json({ message: "Product deleted successfully" });
    } catch (err) {
        next(err);
    }
};

const updateStock = async (req, res, next) => {
    try {
        const { quantity } = req.body;
        const product = await Product.findById(req.params.id);
        if (!product) {
            const error = new Error("Product not found");
            error.statusCode = 404;
            throw error;
        }
        product.stock = quantity;
        if (product.stock <= 0) product.stock = 0;
        await product.save();
        res.json(product);
    } catch (err) {
        next(err);
    }
};

const getLowStock = async (req, res, next) => {
    try {
        const threshold = req.query.threshold || 5;
        const products = await Product.find({ stock: { $lte: threshold }, status: "active" });
        res.json(products);
    } catch (err) {
        next(err);
    }
};

const productValidators = [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("sku").trim().notEmpty().withMessage("SKU is required"),
    body("category").notEmpty().withMessage("Category is required"),
    body("price").isFloat({ min: 0 }).withMessage("Price must be a positive number"),
    body("stock").optional().isInt({ min: 0 })
];

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    getLowStock,
    productValidators,
    stockValidator: [
        body("quantity").isInt({ min: 0 }).withMessage("Quantity must be a non-negative integer")
    ]
};
