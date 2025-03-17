const express = require("express");
const Appointment = require("../models/Appointment");
const nodemailer = require("nodemailer");

const router = express.Router();
const dotenv = require("dotenv");

require("dotenv").config();

router.post("/", async (req, res) => {
  try {
    const newAppointment = new Appointment(req.body);
    await newAppointment.save();

    // Send confirmation email
    await sendConfirmationEmail(newAppointment);

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


// Delete appointment
router.delete("/:id", async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting appointment" });
  }
});
//email confirmation
const sendConfirmationEmail = async (appointment) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: appointment.email,
    subject: "Appointment Confirmation",
    text: `Hello ${appointment.name},\n\nYour appointment for ${appointment.serviceType} has been booked successfully.\n\nDetails:\n📍 Address: ${appointment.address}, ${appointment.city}\n📞 Phone: ${appointment.phone}\n\nWe will contact you soon!\n\nBest Regards,\nLandscaping Services`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("📧 Email sent successfully!");
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};

// Route to get appointments by email
router.get("/customer", async (req, res) => {
  const { email } = req.query;
  try {
    const appointments = await Appointment.find({ email });
    res.json(appointments);
  } catch (error) {
    console.error("Error fetching customer appointments:", error);
    res.status(500).json({ error: "Server error" });
  } 
});

module.exports = router;
