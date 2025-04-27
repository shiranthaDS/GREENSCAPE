const express = require("express");
const router = express.Router();
const {
  createFeedback,
  getAllFeedbacks,
  deleteFeedback,
} = require("../controllers/feedbackController");

// POST /api/feedback/create
router.post("/create", createFeedback);

// GET /api/feedback/all
router.get("/all", getAllFeedbacks);

// DELETE /api/feedback/delete/:id
router.delete("/delete/:id", deleteFeedback);

module.exports = router;
