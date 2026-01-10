"use strict";

const User = require("../models/User");
const { body } = require("express-validator");
const bcrypt = require("bcryptjs"); // Need independent bcrypt since model pre-save hook handles hashing on save, but we might want explicit checks

const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        res.json(user);
    } catch (err) {
        next(err);
    }
};

const updateProfile = async (req, res, next) => {
    try {
        const { name, email } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }
        if (name) user.name = name;
        if (email) user.email = email;
        await user.save();
        res.json(user);
    } catch (err) {
        next(err);
    }
};

const updatePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id).select("+password");

        if (!(await user.comparePassword(currentPassword))) {
            const error = new Error("Invalid current password");
            error.statusCode = 401;
            throw error;
        }

        user.password = newPassword; // Pre-save hook will hash it
        await user.save();

        res.json({ message: "Password updated successfully" });
    } catch (err) {
        next(err);
    }
};

const getSettings = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        res.json(user.settings || {});
    } catch (err) {
        next(err);
    }
};

const updateSettings = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        user.settings = { ...Object.fromEntries(user.settings || []), ...req.body };
        await user.save();
        res.json(user.settings);
    } catch (err) {
        next(err);
    }
};

// Admin routes
const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (err) {
        next(err);
    }
};

const updateUserRole = async (req, res, next) => {
    try {
        const { role } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }
        res.json(user);
    } catch (err) {
        next(err);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }
        res.json({ message: "User deleted" });
    } catch (err) {
        next(err);
    }
};

const profileValidators = [
    body("name").optional().trim().notEmpty(),
    body("email").optional().isEmail()
];

const passwordValidators = [
    body("currentPassword").notEmpty(),
    body("newPassword").isLength({ min: 6 }).withMessage("Password must be at least 6 chars")
];

module.exports = {
    getProfile,
    updateProfile,
    updatePassword,
    getSettings,
    updateSettings,
    getAllUsers,
    updateUserRole,
    deleteUser,
    profileValidators,
    passwordValidators,
    settingsValidator: [
        body().isObject().withMessage("Settings must be an object")
    ],
    roleValidator: [
        body("role").isIn(["user", "admin", "manager"]).withMessage("Invalid role")
    ]
};
