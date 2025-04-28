// models/FinancialTransaction.js
const mongoose = require("mongoose");

const financialTransactionSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  type: { type: String, required: true, enum: ["Income", "Expense"] },
  subtype: { type: String, required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  payer_payee: { type: String, required: true },
  method: { type: String, required: true, enum: ["Cash", "Credit Card", "Bank Transfer"] },
});

module.exports = mongoose.model("FinancialTransaction", financialTransactionSchema);
