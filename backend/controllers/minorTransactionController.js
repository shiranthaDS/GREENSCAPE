const MinorTransaction = require("../models/MinorTransaction");

// Add Minor Transaction
exports.addMinorTransaction = async (req, res) => {
  try {
    const newTransaction = new MinorTransaction(req.body);
    const savedTransaction = await newTransaction.save();
    res.status(201).json(savedTransaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all Minor Transactions
exports.getMinorTransactions = async (req, res) => {
  try {
    const transactions = await MinorTransaction.find();
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single Minor Transaction by ID
exports.getMinorTransactionById = async (req, res) => {
  try {
    const transaction = await MinorTransaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ error: "Transaction not found" });
    res.status(200).json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Minor Transaction
exports.deleteMinorTransaction = async (req, res) => {
  try {
    await MinorTransaction.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Update Minor Transaction
exports.updateMinorTransaction = async (req, res) => {
  try {
    const updatedTransaction = await MinorTransaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTransaction) return res.status(404).json({ error: "Transaction not found" });
    res.status(200).json(updatedTransaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
