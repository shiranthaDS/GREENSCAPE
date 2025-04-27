const express = require("express");
const router = express.Router();
const usageController = require("../controllers/usageController.js");

router.get("/", usageController.getAllUsage);
router.post("/", usageController.addUsageReport);
router.get("/:id", usageController.getById);
router.put("/:id", usageController.updateUsageReport);
router.delete("/:id", usageController.deleteUsageReport);

module.exports = router;
