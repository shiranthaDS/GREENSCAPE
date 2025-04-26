const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  employeeName: {
    type: String,
    required: true,
  },
  employeeEmail: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  feedback: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
