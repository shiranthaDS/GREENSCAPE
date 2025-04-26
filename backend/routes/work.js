const express = require("express");
const router = express.Router();
const workController = require("../controllers/workController");

router.post("/add", workController.addWork);
router.get("/", workController.getAllWorks);
router.put("/update/:id", workController.updateWork);
router.delete("/delete/:id", workController.deleteWork);

module.exports = router;
