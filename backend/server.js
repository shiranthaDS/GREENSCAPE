const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables from .env
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Sample Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Routes
const employeeRouter = require("./routes/employee.js");
const taskRouter = require("./routes/taskRoutes.js");
const workRouter = require("./routes/work.js");

app.use("/employee", employeeRouter);
app.use("/task", taskRouter);
app.use("/work", workRouter);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, (err) => {
  if (err) {
    console.error(`❌ Error starting server: ${err.message}`);
  } else {
    console.log(`🚀 Server running on port ${PORT}`);
  }
});