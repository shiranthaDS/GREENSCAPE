const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const feedbackSchema = new Schema(
  {
    employeeName: {
      type: String,
      required: true
    },
    employeeEmail: {
      type: String,
      required: true
    },
    department: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    feedback: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;
