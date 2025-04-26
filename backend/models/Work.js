const mongoose = require("mongoose");

const WorkSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
  },
  ename: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  nic: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  workingDate: {
    type: Number,
    required: true,
  },
  otHours: {
    type: Number,
    required: true,
  },
  leaveHours: {
    type: Number,
    required: true,
  },
  estimateDate: {
    type: Date, 
    required: true,
  },
});

module.exports = mongoose.model("Work", WorkSchema);