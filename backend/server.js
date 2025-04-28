const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const path = require("path");
const { NlpManager } = require("node-nlp");



 // ✅ Using NLP.js properly

// ✅ NLP.js Setup
const manager = new NlpManager({ languages: ["en"], forceNER: true });

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
app.use("/api/uploads", express.static("uploads")); // Serve cvs from the uploads directory

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
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
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
const maintenanceRouter = require("./Routes/maintenanceRoute.js");

const inventoryRouter = require("./Routes/inventoryRoute.js");
const usageRouter = require("./Routes/usageRoute.js");

const minorTransactionRoutes = require("./routes/minorTransactionRoutes");
const financialTransactionRoutes = require("./routes/financialTransactionRoutes");
const invoiceRoutes = require('./routes/invoiceRoutes');



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


app.use("/inventories", inventoryRouter);
app.use("/maintenance", maintenanceRouter);
app.use("/usage", usageRouter); 

app.use("/api/minor-transactions", minorTransactionRoutes);
app.use("/api/transactions", financialTransactionRoutes);
app.use('/api/invoices', invoiceRoutes);



// Test Route
app.get("/", (req, res) => {
  res.send("🌿 MERN Garden & Landscape API is running...");
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port: ${PORT}`);
});
//bot
// ✅ Train chatbot for GreenScape
const trainChatbot = async () => {
    console.log("🚀 Training chatbot...");

    // Greetings
    manager.addDocument("en", "hello", "greetings.hello");
    manager.addDocument("en", "hi", "greetings.hello");
    manager.addDocument("en", "hey there", "greetings.hello");
    manager.addDocument("en", "good morning", "greetings.hello");
    manager.addDocument("en", "how are you?", "greetings.howareyou");

    // Company Info
    manager.addDocument("en", "who are you?", "bot.identity");
    manager.addDocument("en", "what is your name?", "bot.identity");
    manager.addDocument("en", "what is GreenScape?", "company.about");

    // Services
    manager.addDocument("en", "what services do you offer?", "services.list");
    manager.addDocument("en", "tell me about your services", "services.list");
    manager.addDocument("en", "do you provide lawn care?", "services.lawncare");
    manager.addDocument("en", "do you offer garden design?", "services.gardendesign");
    manager.addDocument("en", "what is included in maintenance?", "services.maintenance");

   // ✅ Pricing Information
    manager.addDocument("en", "how much do your services cost?", "pricing.info");
    manager.addDocument("en", "what are your prices?", "pricing.info");
    manager.addDocument("en", "what is the price for landscaping?", "pricing.landscaping");
    manager.addDocument("en", "what is the cost of garden design?", "pricing.gardendesign");
    manager.addDocument("en", "how much for lawn care?", "pricing.lawncare");
    manager.addDocument("en", "what does maintenance cost?", "pricing.maintenance");

    // Contact Info
    manager.addDocument("en", "how can I contact you?", "contact.info");
    manager.addDocument("en", "what is your phone number?", "contact.info");
    manager.addDocument("en", "do you have an email?", "contact.info");

    // Goodbye
    manager.addDocument("en", "Thanks", "greetings.bye");
    manager.addDocument("en", "Thankyou", "greetings.bye");
    manager.addDocument("en", "bye", "greetings.bye");
    manager.addDocument("en", "goodbye", "greetings.bye");

    // ✅ Add Responses
    manager.addAnswer("en", "greetings.hello", "Hello! Welcome to GreenScape. How can I help you today?");
    manager.addAnswer("en", "greetings.howareyou", "I'm doing great! How about you?");
    
    manager.addAnswer("en", "bot.identity", "I'm GreenScape Bot, here to assist you with landscaping services!");
    manager.addAnswer("en", "company.about", "GreenScape is a professional landscaping company specializing in garden design, maintenance, and lawn care.");

    manager.addAnswer("en", "services.list", "We offer landscaping, garden design, lawn care, and full maintenance services.");
    manager.addAnswer("en", "services.lawncare", "Yes! We provide complete lawn care, including mowing, fertilization, and weed control.");
    manager.addAnswer("en", "services.gardendesign", "Yes! Our garden design service includes plant selection, layout planning, and installation.");
    manager.addAnswer("en", "services.maintenance", "Our maintenance service includes regular lawn mowing, hedge trimming, and seasonal clean-ups.");

    // ✅ Pricing Responses
    manager.addAnswer("en", "pricing.info", "Here is our pricing list:\n- Landscaping: LKR 100000 - LKR 200000 (based on area)\n- Garden Design: LKR 150000  - LKR 450000\n- Lawn Care: LKR 10000 - LKR 20000 per session\n- Maintenance: LKR 30000 - LKR 150000 per month.");
    manager.addAnswer("en", "pricing.landscaping", "Our landscaping services range from **LKR 100000 - LKR 200000**, depending on the size and complexity of the project.");
    manager.addAnswer("en", "pricing.gardendesign", "Garden design services range from **LKR 150000  - LKR 450000**, including plant selection and layout planning.");
    manager.addAnswer("en", "pricing.lawncare", "Lawn care services cost **LKR 10000 - LKR 20000 per session**, covering mowing, fertilization, and weed control.");
    manager.addAnswer("en", "pricing.maintenance", "Maintenance services start at **LKR 30000 - LKR 150000 per month**, based on the frequency and services required.");

    manager.addAnswer("en", "contact.info", "You can reach us at (+94) 123-45678 or email us at contact@greenscape.com.");

    manager.addAnswer("en", "greetings.bye", "Goodbye! Looking forward to helping you again!");

    // ✅ Train the model
    await manager.train();
    manager.save();
    console.log("✅ Chatbot training completed!");
};

// ✅ Call training function before server starts
trainChatbot();

// ✅ Chatbot API Route
app.post("/chatbot", async (req, res) => {
  try {
    const { messages } = req.body;
    const userMessage = messages[messages.length - 1]?.content;

    if (!userMessage) {
      return res.status(400).json({ reply: "I didn't understand that. Can you rephrase?" });
    }

    // Process input using NLP.js
    const response = await manager.process("en", userMessage);

    // Check if NLP.js found an intent
    const botReply = response.answer || "I'm not sure how to respond to that. Can you rephrase?";

    res.json({ reply: botReply });
  } catch (error) {
    console.error("❌ Error:", error.message);
    res.status(500).json({ reply: "Sorry, something went wrong." });
  }
});
