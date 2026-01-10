"use strict";

const Category = require("../models/Category");
const { body } = require("express-validator");

const getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find().sort("name");
        res.json(categories);
    } catch (err) {
        next(err);
    }
};

const getCategory = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            const error = new Error("Category not found");
            error.statusCode = 404;
            throw error;
        }
        res.json(category);
    } catch (err) {
        next(err);
    }
};

const createCategory = async (req, res, next) => {
    try {
        const category = new Category(req.body);
        await category.save();
        res.status(201).json(category);
    } catch (err) {
        next(err);
    }
};

const updateCategory = async (req, res, next) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!category) {
            const error = new Error("Category not found");
            error.statusCode = 404;
            throw error;
        }
        res.json(category);
    } catch (err) {
        next(err);
    }
};

const deleteCategory = async (req, res, next) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            const error = new Error("Category not found");
            error.statusCode = 404;
            throw error;
        }
        res.json({ message: "Category deleted successfully" });
    } catch (err) {
        next(err);
    }
};

const categoryValidators = [
    body("name").trim().notEmpty().withMessage("Category name is required")
];

module.exports = {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    categoryValidators
};
