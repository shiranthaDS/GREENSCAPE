const express = require("express");
const router = express.Router();
const {
  addMinorTransaction,
  getMinorTransactions,
  getMinorTransactionById,
  updateMinorTransaction,
  deleteMinorTransaction
} = require("../controllers/minorTransactionController");

router.post("/add", addMinorTransaction);
router.get("/", getMinorTransactions);
router.get("/:id", getMinorTransactionById);
router.put("/:id", updateMinorTransaction);
router.delete("/:id", deleteMinorTransaction);

module.exports = router;
