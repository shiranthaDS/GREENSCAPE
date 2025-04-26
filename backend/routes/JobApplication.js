const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  addJobApplication,
  getAllApplications,
  updateStatus,
  deleteApplication,
} = require("../controllers/JobApplicationController");

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = `${file.originalname}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// Routes
router.post("/add", upload.single("resume"), addJobApplication);
router.get("/", getAllApplications);
router.put("/updateStatus/:id", updateStatus);
router.delete("/delete/:id", deleteApplication);

module.exports = router;
