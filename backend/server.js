const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const path = require("path");



// Load environment variables
dotenv.config();

// Initialize the app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Nodemailer Email Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Email utility function (usable globally)
app.locals.sendEmail = async (recipient, subject, text) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL,
      to: recipient,
      subject: subject,
      text: text,
    };
    await transporter.sendMail(mailOptions);
    console.log("📧 Email sent successfully.");
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};

// Importing routes
const authRoutes = require("./routes/auth");
const serviceRoutes = require("./routes/serviceRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const employeeRouter = require("./routes/employee");
const taskRouter = require("./routes/taskRoutes");
const workRouter = require("./routes/work");
const jobRouter = require("./routes/jobs");
const jobApplicationRouter = require("./routes/JobApplication");
const feedbackRouter = require("./routes/feedbackRoutes");


// Route Usage
app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/employee", employeeRouter);
app.use("/api/task", taskRouter);
app.use("/api/work", workRouter);
app.use("/api/jobs", jobRouter);
app.use("/api/jobApplications", jobApplicationRouter);
app.use("/api/feedback", feedbackRouter); 

// Test Route
app.get("/", (req, res) => {
  res.send("🌿 MERN Garden & Landscape API is running...");
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port: ${PORT}`);
});
