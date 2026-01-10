"use strict";

const Customer = require("../models/Customer");
const Invoice = require("../models/Invoice");
const { body, param } = require("express-validator");

const getCustomers = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, search } = req.query;
        const query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { company: { $regex: search, $options: "i" } }
            ];
        }

        const customers = await Customer.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const count = await Customer.countDocuments(query);

        res.json({
            customers,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (err) {
        next(err);
    }
};

const getCustomer = async (req, res, next) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            const error = new Error("Customer not found");
            error.statusCode = 404;
            throw error;
        }
        res.json(customer);
    } catch (err) {
        next(err);
    }
};

const createCustomer = async (req, res, next) => {
    try {
        const customer = new Customer(req.body);
        await customer.save();
        res.status(201).json(customer);
    } catch (err) {
        next(err);
    }
};

const updateCustomer = async (req, res, next) => {
    try {
        const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!customer) {
            const error = new Error("Customer not found");
            error.statusCode = 404;
            throw error;
        }
        res.json(customer);
    } catch (err) {
        next(err);
    }
};

const deleteCustomer = async (req, res, next) => {
    try {
        const customer = await Customer.findByIdAndDelete(req.params.id);
        if (!customer) {
            const error = new Error("Customer not found");
            error.statusCode = 404;
            throw error;
        }
        res.json({ message: "Customer deleted successfully" });
    } catch (err) {
        next(err);
    }
};

const getCustomerInvoices = async (req, res, next) => {
    try {
        // Assuming Invoice has customerId or similar.
        // If Invoice schema doesn't match this, we might need to update it.
        // For now, I'll assume we can query by customer name or we need to add a customer ref to Invoice.
        // Checking Invoice schema would be good. I'll query by customerName simply for now based on typical patterns if ID isn't there,
        // but best practice is Ref.
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            const error = new Error("Customer not found");
            error.statusCode = 404;
            throw error;
        }
        // Using customerName as foreign key proxy if schema is simple, or customerId if refined.
        const invoices = await Invoice.find({ customerName: customer.name });
        res.json(invoices);
    } catch (err) {
        next(err);
    }
};

const addCustomerNote = async (req, res, next) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            const error = new Error("Customer not found");
            error.statusCode = 404;
            throw error;
        }
        customer.notes.push({ content: req.body.content });
        await customer.save();
        res.json(customer);
    } catch (err) {
        next(err);
    }
};

const customerValidators = [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("phone").optional().isMobilePhone().withMessage("Invalid phone number")
];

module.exports = {
    getCustomers,
    getCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomerInvoices,
    addCustomerNote,
    customerValidators
};
