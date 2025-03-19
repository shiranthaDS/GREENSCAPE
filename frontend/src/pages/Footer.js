import React from "react";
import { Facebook, Instagram, Twitter, MapPin, Mail, Phone } from "lucide-react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>GreenScape</h3>
          <p>Transforming outdoor spaces with expert landscaping since 2005.</p>
          <div className="social-links">
            <a href="https://facebook.com"><Facebook size={20} /></a>
            <a href="https://twitter.com"><Twitter size={20} /></a>
            <a href="https://instagram.com"><Instagram size={20} /></a>
          </div>
        </div>
        <div className="footer-section">
          <h3>Contact Us</h3>
          <div className="info-item"><MapPin size={18} /> 123 Green Avenue</div>
          <div className="info-item"><Mail size={18} /> info@greenscape.com</div>
          <div className="info-item"><Phone size={18} /> (555) 123-4567</div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} GreenScape. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
