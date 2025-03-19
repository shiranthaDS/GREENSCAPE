import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { NlpManager } from "node-nlp"; // ✅ Using NLP.js properly

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
const URL = process.env.MONGODB_URL;
mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once("open", () => {
    console.log("✅ MongoDB connection successful");
});

// Importing Routes
import feedbackRouter from "./routes/feedbackRouter.js";
import postRoutes from "./routes/route.js";

app.use("/api", feedbackRouter);
app.use(postRoutes);

// ✅ NLP.js Setup
const manager = new NlpManager({ languages: ["en"], forceNER: true });

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

// ✅ Start server
app.listen(PORT, () => {
    console.log(`✅ Server is running on port: ${PORT}`);
    console.log("✅ Routes set up");
});
