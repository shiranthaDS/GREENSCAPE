const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");


// Import your routes
const employeeRouter = require("./routes/employee.js");
const taskRouter = require("./routes/taskRoutes.js");
const workRouter = require("./routes/work.js");
const jobRouter = require("./routes/jobs");
const jobApplicationRouter = require("./routes/JobApplication.js");

// Initialize the app
const app = express();
dotenv.config();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads")); // Serve uploaded files


// MongoDB connection
const URL = process.env.MONGODB_URL;

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

app.locals.sendEmail = async (recipient, subject, text) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL,
      to: recipient,
      subject: subject,
      text: text,
    };
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully.");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// Routes
app.use("/employee", employeeRouter);
app.use("/task", taskRouter);
app.use("/work",workRouter);
app.use("/jobs", jobRouter);
app.use("/jobApplications", jobApplicationRouter);


// Start server
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
