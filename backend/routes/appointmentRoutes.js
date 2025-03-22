const express = require("express");
const {
  bookAppointment,
  getAllAppointments,
  scheduleSiteVisit,
  updateProjectStatus,
  updateAppointmentInfo,
  deleteAppointment,
  getAppointmentsByEmail
} = require("../controllers/appointmentController");

const router = express.Router();

// Routes
router.post("/", bookAppointment);
router.get("/", getAllAppointments);
router.put("/:id/site-visit", scheduleSiteVisit);
router.put("/:id/project-status", updateProjectStatus);
router.put("/:id/update-info", updateAppointmentInfo);
router.delete("/:id", deleteAppointment);
router.get("/customer", getAppointmentsByEmail);

module.exports = router;
