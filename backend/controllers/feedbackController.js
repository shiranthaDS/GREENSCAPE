const Feedback = require('../models/feedbackModel');

// Create Feedback
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

    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get All Feedbacks
const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ date: -1 });
    res.status(200).json({ feedbacks });
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createFeedback,
  getAllFeedbacks,
};
