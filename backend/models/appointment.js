const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  appointmentId: { type: String, unique: true }, // Custom Appointment ID
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  serviceType: { type: String, required: true },
  additionalInfo: { type: String },
  receiveUpdates: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// Middleware: Auto-generate appointment ID
appointmentSchema.pre("save", async function (next) {
  if (!this.appointmentId) {
    const count = await mongoose.model("Appointment").countDocuments();
    this.appointmentId = `APPT-${(count + 1).toString().padStart(4, "0")}`;
  }
  next();
});

module.exports = mongoose.model("Appointment", appointmentSchema);
