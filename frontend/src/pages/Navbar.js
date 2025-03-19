import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X, User, LogIn, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav className={`navigation ${isScrolled ? "scrolled" : ""}`}>
      <div className="nav-container">
        {/* Logo */}
        <div className="logo-container">
          <Link to="/">
            <img src="/logo.svg" alt="GreenScape" className="logo" />
            <span className="logo-text">GreenScape</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="desktop-nav">
          {["Home", "Services", "About Us", "Contact Us", "Feedbacks"].map((link, index) => (
            <Link key={index} to={`/${link.replace(/\s+/g, "").toLowerCase()}`} className="nav-link">
              {link}
            </Link>
          ))}
          <Link to="/signin" className="nav-icon">
            <LogIn size={22} />
          </Link>
          <Link to="/login" className="nav-icon">
            <LogOut size={22} />
          </Link>
          <Link to="/profile" className="nav-icon">
            <User size={22} />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="mobile-menu-button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <motion.div className="mobile-menu">
          {["Home", "Services", "About Us", "Contact Us", "Feedbacks"].map((link, index) => (
            <Link key={index} to={`/${link.replace(/\s+/g, "").toLowerCase()}`} className="mobile-nav-link">
              {link}
            </Link>
          ))}
          <Link to="/signin" className="mobile-nav-icon">
            <LogIn size={22} />
            Sign In
          </Link>
          <Link to="/login" className="mobile-nav-icon">
            <LogOut size={22} />
            Login
          </Link>
          <Link to="/profile" className="mobile-nav-icon">
            <User size={22} />
            Profile
          </Link>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
