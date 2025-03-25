const express = require("express");
const router = express.Router();
const jobsController = require("../controllers/jobsController");

router.post("/add", jobsController.addJob);
router.get("/", jobsController.getAllJobs);
router.put("/update/:id", jobsController.updateJob);
router.delete("/delete/:id", jobsController.deleteJob);

module.exports = router;
