const Appointment = require("../models/Appointment");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send email
const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("📧 Email sent successfully!");
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};

// Book an appointment & send confirmation email
const bookAppointment = async (req, res) => {
  try {
    const newAppointment = new Appointment(req.body);
    await newAppointment.save();

    const emailText = `Hello ${newAppointment.name},\n\nYour appointment for ${newAppointment.serviceType} has been booked successfully.\n📍 Address: ${newAppointment.address}, ${newAppointment.city}\n📞 Phone: ${newAppointment.phone}\n\nWe will contact you soon!\n\nBest Regards,\nLandscaping Services`;
    await sendEmail(newAppointment.email, "Appointment Confirmation", emailText);

    res.status(201).json({ message: "Appointment booked successfully", appointment: newAppointment });
  } catch (error) {
    res.status(500).json({ error: "Error booking appointment" });
  }
};

// Get all appointments
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: "Error fetching appointments" });
  }
};

// Schedule site visit & send email
const scheduleSiteVisit = async (req, res) => {
  try {
    const { siteVisitDate } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { siteVisitDate },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    const emailText = `Hello ${appointment.name},\n\nYour site visit for ${appointment.serviceType} has been scheduled.\n📅 Site Visit Date: ${new Date(siteVisitDate).toLocaleDateString()}\n📍 Address: ${appointment.address}, ${appointment.city}\n📞 Contact: ${appointment.phone}\n\nPlease be available on the scheduled date. Let us know if you have any questions.\n\nBest Regards,\nLandscaping Services`;
    await sendEmail(appointment.email, "Site Visit Scheduled", emailText);

    res.json({ message: "Site visit scheduled and email sent", appointment });
  } catch (error) {
    res.status(500).json({ error: "Error scheduling site visit" });
  }
};

// Update project status
const updateProjectStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, { projectStatus: status }, { new: true });
    res.json({ message: `Project status updated to ${status}`, appointment });
  } catch (error) {
    res.status(500).json({ error: "Error updating project status" });
  }
};

// Update appointment details
const updateAppointmentInfo = async (req, res) => {
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
};

// Delete appointment
const deleteAppointment = async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting appointment" });
  }
};

// Get appointments by email (for customer view)
const getAppointmentsByEmail = async (req, res) => {
  const { email } = req.query;
  try {
    const appointments = await Appointment.find({ email });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  bookAppointment,
  getAllAppointments,
  scheduleSiteVisit,
  updateProjectStatus,
  updateAppointmentInfo,
  deleteAppointment,
  getAppointmentsByEmail
};
