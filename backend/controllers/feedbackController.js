const Feedback = require("../models/Feedback");

// Create feedback
const createFeedback = async (req, res) => {
  try {
    const { employeeName, employeeEmail, department, rating, feedback } = req.body;

    const newFeedback = new Feedback({
      employeeName,
      employeeEmail,
      department,
      rating,
      feedback,
    });

    await newFeedback.save();
    res.status(201).json({ message: "✅ Feedback submitted successfully." });
  } catch (error) {
    console.error("❌ Error creating feedback:", error);
    res.status(500).json({ message: "Server error while creating feedback." });
  }
};

// Get all feedbacks
const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ date: -1 });
    res.status(200).json({ feedbacks });
  } catch (error) {
    console.error("❌ Error fetching feedbacks:", error);
    res.status(500).json({ message: "Server error while retrieving feedbacks." });
  }
};

// Delete feedback by ID
const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Feedback.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Feedback not found." });
    }

    res.status(200).json({ message: "🗑️ Feedback deleted successfully." });
  } catch (error) {
    console.error("❌ Error deleting feedback:", error);
    res.status(500).json({ message: "Server error while deleting feedback." });
  }
};

module.exports = {
  createFeedback,
  getAllFeedbacks,
  deleteFeedback,
};
