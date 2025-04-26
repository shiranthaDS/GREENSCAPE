const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const jobSchema = new Schema(
  {
    title: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, required: true }, // e.g., Full-Time, Part-Time
    skills: { type: String, required: true }, // Comma-separated skills
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt timestamps
  }
);

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;