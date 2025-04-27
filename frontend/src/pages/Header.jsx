import React, { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, ChevronDown, LogIn, User } from "lucide-react";


const Header = ({ isScrolled }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <motion.nav
      className={`navigation ${isScrolled ? "scrolled" : ""}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="nav-container">
        <div className="logo-container">
          <span className="logo-text">GreenScape</span>
        </div>

        <div className="desktop-nav">
          <a href="/" className="nav-link">Home</a>
          <a href="/services" className="nav-link">Services</a>
          <a href="/about" className="nav-link">About Us</a>
          <a href="/career" className="nav-link">Career</a>
          
          {/* Feedback Dropdown */}
          <div className="dropdown">
            <button className="nav-link dropdown-toggle1">
              Feedback <ChevronDown size={16} />
            </button>
            <div className="dropdown-content">
              <a href="/fd" className="dropdown-link">Add Feedback</a>
              <a href="/feedback-list" className="dropdown-link">View Feedback</a>
            </div>
          </div>
          
          <a href="/signup" className="nav-link"> SignIn</a>
          <a href="/login" className="mobile-nav-link"><LogIn size={20} /></a>
          <a href="/customer-profile" className="nav-link"><User size={20} /></a>
        </div>

        <button 
          className="mobile-menu-button" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <motion.div
          className="mobile-menu"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <a href="/home" className="mobile-nav-link">Home</a>
          <a href="/services" className="mobile-nav-link">Services</a>
          <a href="/about" className="mobile-nav-link">About Us</a>
          <a href="/contact" className="mobile-nav-link">Contact Us</a>
          
          {/* Mobile Feedback Links */}
          <div className="mobile-feedback-section">
            <a href="/feedback/add" className="mobile-nav-link">Add Feedback</a>
            <a href="/feedback/view" className="mobile-nav-link">View Feedback</a>
          </div>
          
          <a href="/login" className="mobile-nav-link">SignIn</a>
          <a href="/signin" className="mobile-nav-link"><LogIn size={20} /></a>
          <a href="/profile" className="mobile-nav-link"><User size={20} /></a>
        </motion.div>
      )}

<style jsx>{`

/* Navigation Styles */
.navigation {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 1rem 0;
  z-index: 1000;
  transition: all 0.3s ease;
  background-color: transparent;
}

.navigation.scrolled {
  background-color: rgb(255, 255, 255);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 0.5rem 0;
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2e7d32;
  margin-left: 0.5rem;
}

/* Desktop Navigation */
.desktop-nav {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-link {
  color: #333;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.nav-link:hover {
  color: #2e7d32;
}

/* Dropdown Styles */
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-toggle1 {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: white;
  min-width: 160px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
  z-index: 1;
  border-radius: 0.5rem;
  padding: 0.5rem 0;
}

.dropdown:hover .dropdown-content {
  display: block;
}

.dropdown-link {
  color: #333;
  padding: 0.5rem 1rem;
  text-decoration: none;
  display: block;
  transition: background-color 0.3s ease;
}

.dropdown-link:hover {
  background-color:rgb(245, 245, 245);
  color: #2e7d32;
}

/* Mobile Menu Button */
.mobile-menu-button {
  display: none;
  background: none;
  border: none;
  color: #333;
  cursor: pointer;
  padding: 0.5rem;
}

/* Mobile Menu */
.mobile-menu {
  display: none;
  flex-direction: column;
  background-color: white;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.mobile-nav-link {
  padding: 0.75rem 0;
  color: #333;
  text-decoration: none;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.mobile-feedback-section {
  display: flex;
  flex-direction: column;
  padding-left: 1rem;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .desktop-nav {
    display: none;
  }

  .mobile-menu-button {
    display: block;
  }

  .mobile-menu {
    display: flex;
  }
}

/* Scrolled State Adjustments */
.navigation.scrolled .nav-link,
.navigation.scrolled .mobile-menu-button {
  color: #333;
}

.navigation.scrolled .logo-text {
  color: #2e7d32;
}

`}</style>


    </motion.nav>



  );
};

export default Header;