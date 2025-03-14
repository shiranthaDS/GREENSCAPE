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

module.exports = router;
