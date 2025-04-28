const mongoose = require("mongoose");

const MinorTransactionSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  type: { type: String, required: true },
  subtype: { type: String, required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  payer_payee: { type: String, required: true },
  method: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("MinorTransaction", MinorTransactionSchema);
