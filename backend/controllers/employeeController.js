const { Employee, generateEmployeeID } = require("../models/Employee");

// Add a new employee
exports.addEmployee = async (req, res) => {
  try {
    const { name, nic, dob, email, address, gender, phone, status, role } = req.body;
    const emid = await generateEmployeeID(); // Generate unique employee ID

    const newEmployee = new Employee({ emid, name, nic, dob, email, address, gender, phone, status, role });

    await newEmployee.save();
    res.status(201).json({ message: "Employee added successfully", employee: newEmployee });
  } catch (err) {
    console.error("Error adding employee:", err);
    res.status(500).json({ error: "Failed to add employee", details: err.message });
  }
};

// Get all employees
exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (err) {
    console.error("Error fetching employees:", err);
    res.status(500).json({ error: "Failed to fetch employees" });
  }
};

// Get employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findOne({ emid: req.params.id });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.status(200).json(employee);
  } catch (err) {
    console.error("Error fetching employee:", err);
    res.status(500).json({ error: "Failed to fetch employee", details: err.message });
  }
};

// Update employee details
exports.updateEmployee = async (req, res) => {
  const { id } = req.params;
  const updatedEmployee = req.body;

  try {
    const employee = await Employee.findByIdAndUpdate(id, updatedEmployee, {
      new: true,
      runValidators: true,
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({ message: "Employee updated successfully", employee });
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json({ message: "Error updating employee" });
  }
};

// Delete employee
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (err) {
    console.error("Error deleting employee:", err);
    res.status(500).json({ message: "Error deleting employee" });
  }
};
