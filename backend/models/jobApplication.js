const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const jobApplicationSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    nic: { type: String, required: true },
    tel: { type: String, required: true },
    job: { type: String, required: true },
    resume: { type: String, required: false },
    status: { type: String, default: "Pending" },  // New field for status
  },
  {
    timestamps: true,
  }
);

const JobApplication = mongoose.model("JobApplication", jobApplicationSchema);

module.exports = JobApplication;
