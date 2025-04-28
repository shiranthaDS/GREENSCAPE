// routes/financialTransactionRoutes.js
const express = require("express");
const router = express.Router();
const financialTransactionController = require("../controllers/financialTransactionController");

router.post("/", financialTransactionController.addTransaction);
router.get("/", financialTransactionController.getTransactions);
router.get("/:id", financialTransactionController.getTransactionById);
router.put("/:id", financialTransactionController.updateTransaction);
router.delete("/:id", financialTransactionController.deleteTransaction);

module.exports = router;
