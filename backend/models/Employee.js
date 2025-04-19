const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const employeeSchema = new Schema({
  emid: {
    type: String,
    required: true,
    unique: true, // Primary key
  },
  name: {
    type: String,
    required: true,
  },
  nic: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
});

// Function to generate auto-incremented Employee ID
async function generateEmployeeID() {
  const lastEmployee = await Employee.findOne().sort({ emid: -1 });
  if (!lastEmployee) {
    return "LE1000"; // Start from LE1000
  }
  let lastIdNumber = parseInt(lastEmployee.emid.substring(2)); // Extract numeric part
  return "LE" + (lastIdNumber + 1); // Increment
}

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = { Employee, generateEmployeeID };