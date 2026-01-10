"use strict";

const Invoice = require("../models/Invoice");
const AuditLog = require("../models/AuditLog");

const createInvoice = async (data, performedBy) => {
  const invoice = await Invoice.create(data);
  await AuditLog.create({
    action: "CREATE_INVOICE",
    entity: "Invoice",
    entityId: invoice._id.toString(),
    performedBy,
    metadata: data
  });
  return invoice;
};

const getInvoiceById = async (id) => Invoice.findById(id);

const getAllInvoices = async () => Invoice.find().sort({ createdAt: -1 });

const getUnpaidInvoices = async () => Invoice.find({ status: { $ne: "PAID" } });

const updateInvoiceStatus = async (id, status, performedBy) => {
  const invoice = await Invoice.findByIdAndUpdate(id, { status }, { new: true });
  if (invoice) {
    await AuditLog.create({
      action: "UPDATE_INVOICE_STATUS",
      entity: "Invoice",
      entityId: id,
      performedBy,
      metadata: { status }
    });
  }
  return invoice;
};

const deleteInvoice = async (id, performedBy) => {
  const invoice = await Invoice.findByIdAndDelete(id);
  if (invoice) {
    await AuditLog.create({
      action: "DELETE_INVOICE",
      entity: "Invoice",
      entityId: id,
      performedBy
    });
  }
  return invoice;
};

module.exports = {
  createInvoice,
  getInvoiceById,
  getAllInvoices,
  getUnpaidInvoices,
  updateInvoiceStatus,
  deleteInvoice
};

