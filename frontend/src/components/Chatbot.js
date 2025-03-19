import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FaCommentDots, FaPaperPlane } from "react-icons/fa";
import "./Chatbot.css";

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I'm GreenScape Bot. How can I assist you today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleChatbot = () => {
    setOpen(!open);
  };

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await axios.post("http://localhost:5000/chatbot", {
        messages: [
          ...messages.map((msg) => ({
            role: msg.sender === "bot" ? "assistant" : "user",
            content: msg.text,
          })),
          { role: "user", content: input },
        ],
      });

      const botReply = response.data.reply;
      setMessages((prev) => [...prev, { text: botReply, sender: "bot" }]);

      // Check if the bot is ending the conversation
      if (botReply.toLowerCase().includes("goodbye") || botReply.toLowerCase().includes("bye")) {
        setTimeout(() => {
          setMessages([{ text: "Hello! I'm GreenScape Bot. How can I assist you today?", sender: "bot" }]);
        }, 2000);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [...prev, { text: "Sorry, something went wrong.", sender: "bot" }]);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-icon" onClick={toggleChatbot}>
        <FaCommentDots size={30} color="#fff" />
      </div>
      {open && (
        <div className="chatbot-popup animate-popup">
          <h3>GreenScape Chat</h3>
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`chatbot-message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="chatbot-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
            />
            <button onClick={handleSendMessage}>
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
