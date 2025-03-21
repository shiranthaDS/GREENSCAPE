const express = require("express");
const router = express.Router();
const Work = require("../models/Work");

// Add a new work record
router.post("/add", async (req, res) => {
  try {
    const { employeeId, ename, role, workingDate, otHours, leaveHours, estimateDate } = req.body;

    const newWork = new Work({
      employeeId,
      ename,
      role,
      workingDate,
      otHours,
      leaveHours,
      estimateDate,
    });

    await newWork.save();
    res.status(201).json({ message: "Work record added successfully", work: newWork });
  } catch (err) {
    console.error("Error adding work record:", err);
    res.status(500).json({ error: "Failed to add work record", details: err.message });
  }
});

// Get all work records
router.get("/", async (req, res) => {
  try {
    const works = await Work.find();
    res.status(200).json(works);
  } catch (err) {
    console.error("Error fetching work records:", err);
    res.status(500).json({ error: "Failed to fetch work records" });
  }
});

// Update a work record
router.put("/update/:id", async (req, res) => {
  try {
    const { employeeId, ename, role, workingDate, otHours, leaveHours, estimateDate } = req.body;
    const updatedWork = await Work.findByIdAndUpdate(
      req.params.id,
      { employeeId, ename, role, workingDate, otHours, leaveHours, estimateDate },
      { new: true }
    );

    if (!updatedWork) {
      return res.status(404).json({ error: "Work not found" });
    }

    res.status(200).json({ message: "Work updated successfully", task: updatedWork });
  } catch (err) {
    console.error("Error updating work:", err);
    res.status(500).json({ error: "Failed to update work", details: err.message });
  }
});
// Delete a work record
router.delete("/delete/:id", async (req, res) => {
  try {
    const deletedWork = await Work.findByIdAndDelete(req.params.id);
    if (!deletedWork) {
      return res.status(404).json({ error: "Work record not found" });
    }
    res.status(200).json({ message: "Work record deleted successfully" });
  } catch (err) {
    console.error("Error deleting work record:", err);
    res.status(500).json({ error: "Failed to delete work record", details: err.message });
  }
});

module.exports = router;