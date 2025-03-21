const express = require("express");
const router = express.Router();
const { Employee, generateEmployeeID } = require("../models/Employee");

// Add a new employee
router.post("/add", async (req, res) => {
  try {
    const { name, nic, email, address, gender, phone, status, role } = req.body;
    
    // Generate a unique employee ID
    const emid = await generateEmployeeID();

    const newEmployee = new Employee({
      emid,
      name,
      nic,
      email,
      address,
      gender,
      phone,
      status,
      role,
      
    });

    await newEmployee.save();
    res.status(201).json({ message: "Employee added successfully", employee: newEmployee });
  } catch (err) {
    console.error("Error adding employee:", err);
    res.status(500).json({ error: "Failed to add employee", details: err.message });
  }
});

// Get all employees
router.get("/", async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (err) {
    console.error("Error fetching employees:", err);
    res.status(500).json({ error: "Failed to fetch employees" });
  }
});

// Get employee by ID
router.get("/:id", async (req, res) => {
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
});

// Update employee details
router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const updatedEmployee = req.body;

  try {
    const employee = await Employee.findByIdAndUpdate(id, updatedEmployee, {
      new: true, // Return the updated document
      runValidators: true, // Ensure validation rules are applied
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({ message: "Employee updated successfully", employee });
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json({ message: "Error updating employee" });
  }
});

router.route("/delete/:id").delete(async (req, res) => {
  let userId = req.params.id;

  await Employee.findByIdAndDelete(userId).then(() => {
      res.status(200).send({ status: "user deleted" });
  }).catch((err) => {
      console.log(err.message);
      res.status(500).send({ status: "error with deleting user", error: err.message });
  });
});

router.route("/get/:id").get(async (req, res) => {
  let userId = req.params.id;
  const user = await Employee.findById(userId).then((employee) => {
      res.status(200).send({ status: "user fetched", employee });
  }).catch((err) => {
      console.log(err.message);
      res.status(500).send({ status: "error with fetching user", error: err.message });
  });
});

module.exports = router;
