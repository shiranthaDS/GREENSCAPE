const express = require("express");
const Appointment = require("../models/Appointment");

const router = express.Router();

// Create a new appointment
router.post("/", async (req, res) => {
  try {
    const newAppointment = new Appointment(req.body);
    await newAppointment.save();
    res.status(201).json({ message: "Appointment booked successfully", appointment: newAppointment });
  } catch (error) {
    res.status(500).json({ error: "Error booking appointment" });
  }
});

// Get all appointments
router.get("/", async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: "Error fetching appointments" });
  }
});

// Update site visit date
router.put("/:id/site-visit", async (req, res) => {
  try {
    const { siteVisitDate } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, { siteVisitDate }, { new: true });
    res.json({ message: "Site visit scheduled", appointment });
  } catch (error) {
    res.status(500).json({ error: "Error updating site visit date" });
  }
});

// Update site analysis status
router.put("/:id/site-analysis", async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, { siteAnalysisStatus: "Completed" }, { new: true });
    res.json({ message: "Site analysis marked as completed", appointment });
  } catch (error) {
    res.status(500).json({ error: "Error updating site analysis status" });
  }
});

// Update project status
router.put("/:id/project-status", async (req, res) => {
  try {
    const { status } = req.body; // Expecting "Ongoing" or "Hold"
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, { projectStatus: status }, { new: true });
    res.json({ message: `Project status updated to ${status}`, appointment });
  } catch (error) {
    res.status(500).json({ error: "Error updating project status" });
  }
});

router.put("/:id/update-info", async (req, res) => {
  try {
    const { siteVisitDate, siteAnalysisStatus, projectStatus, projectId } = req.body;

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { siteVisitDate, siteAnalysisStatus, projectStatus, projectId },
      { new: true }
    );

    res.status(200).json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ error: "Error updating appointment info" });
  }
});



module.exports = router;
