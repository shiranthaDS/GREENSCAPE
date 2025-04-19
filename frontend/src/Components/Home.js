import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Menu, X, ChevronLeft, ChevronRight, Leaf, Droplet, Shovel, Scissors, MapPin, Mail, Phone, Facebook, Instagram, Twitter } from "lucide-react";
import "./Home.css";
import { LogIn, User ,ChevronDown} from "lucide-react";




const Home = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showAfter, setShowAfter] = useState(false);
 

  // Navigation scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hero section auto-slide and before/after toggle
  const nextSlide = useCallback(() => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        setIsTransitioning(false);
      }, 500);
    }
  }, [isTransitioning]);

  useEffect(() => {
    const toggleInterval = setInterval(() => {
      setShowAfter((prev) => !prev);
    }, 3000);
    const slideInterval = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => {
      clearInterval(toggleInterval);
      clearInterval(slideInterval);
    };
  }, [currentSlide, nextSlide]);

  const scrollToSection = (sectionId) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const slides = [
    {
      id: 1,
      title: "Modern Garden Transformation",
      description: "From overgrown to elegant - a complete backyard makeover",
      beforeImage: "/imges/bg1.jpg",
      afterImage: "/imges/bg1.jpg",
    },
    {
      id: 2,
      title: "Luxury Patio Design",
      description: "Creating outdoor living spaces that inspire",
      beforeImage: "/imges/bg1.jpg",
      afterImage: "/imges/bg1.jpg",
    },
    {
      id: 3,
      title: "Water Feature Installation",
      description: "Adding tranquility and elegance to any landscape",
      beforeImage: "/imges/bg1.jpg",
      afterImage: "/imges/bg1.jpg",
    },
  ];

  const services = [
    {
      icon: <Leaf size={32} />,
      title: "Garden Design",
      description: "Custom garden designs tailored to your space and preferences.",
    },
    {
      icon: <Droplet size={32} />,
      title: "Water Features",
      description: "Elegant water features including ponds, fountains, and waterfalls.",
    },
    {
      icon: <Shovel size={32} />,
      title: "Planting Services",
      description: "Expert planting of trees, shrubs, flowers, and ground covers.",
    },
    {
      icon: <Scissors size={32} />,
      title: "Maintenance",
      description: "Regular maintenance services to keep your landscape looking its best.",
    },
  ];

  return (
    <div className="home-container">
      {/* Navigation */}
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
      <a href="/home" className="nav-link">Home</a>
      <a href="/services" className="nav-link">Services</a>
      <a href="/about" className="nav-link">About Us</a>
      <a href="/contact" className="nav-link">Contact Us</a>
      <a href="/career" className="mobile-nav-link">Job Opportunity</a>
      
      {/* Feedback Dropdown */}
      <div className="dropdown">
        <button className="nav-link dropdown-toggle">
          Feedback <ChevronDown size={16} />
        </button>
        <div className="dropdown-content">
          <a href="/feedback/add" className="dropdown-link">Add Feedback</a>
          <a href="/feedback/view" className="dropdown-link">View Feedback</a>
        </div>
      </div>
      
      <a href="/signup" className="nav-link"> SignIn</a>
      <a href="/login" className="mobile-nav-link"><LogIn size={20} /></a>
      <a href="/customer-profile" className="nav-link"><User size={20} /></a>
    </div>

    <button className="mobile-menu-button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
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
      <a href="/career" className="mobile-nav-link">Job Opportunity</a>
      
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
</motion.nav>
      {/* Hero Section */}
      <div className="hero-section">
        <div
          className={`hero-slide ${isTransitioning ? "transitioning" : ""}`}
          style={{
            backgroundImage: `url(${showAfter ? slides[currentSlide].afterImage : slides[currentSlide].beforeImage})`,
          }}
        >
          <div className="hero-overlay"></div>
        </div>

        <div className="hero-content">
        <h1>Transform Your Outdoor Space</h1>
        <p>Professional landscaping services for the perfect garden</p>
          
        </div>

        <div className="slide-info">
          <h3>{slides[currentSlide].title}</h3>
          <p>{slides[currentSlide].description}</p>
        </div>

        <div className="slide-navigation">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`slide-dot ${index === currentSlide ? "active" : ""}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>

        <button className="nav-arrow left" onClick={nextSlide}>
          <ChevronLeft size={24} />
        </button>
        <button className="nav-arrow right" onClick={nextSlide}>
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Services Section */}
      <section id="services" className="services-section">
        <h2>Our Landscaping Services</h2>
        <p>Transform your outdoor space with our professional landscaping services</p>
        <div className="services-grid">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="service-card"
              whileHover={{ y: -10, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    
      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <h2>Get in Touch</h2>
        <p>Have a project in mind? Fill out the form below and we'll get back to you within 24 hours.</p>
        <div className="contact-container">
          <div className="contact-form">
            
          </div>
          <div className="contact-info">
            <div className="map-placeholder">
              <MapPin size={40} className="map-icon" />
            </div>
            <div className="info-card">
              <h3>Contact Information</h3>
              <div className="info-item">
                <MapPin size={18} />
                <span>NO 10,New plaza road Malabe ,Sri Lanka</span>
              </div>
              <div className="info-item">
                <Mail size={18} />
                <span>info@greenscape.com</span>
              </div>
              <div className="info-item">
                <Phone size={18} />
                <span>(057) 2246761</span>
              </div>
            </div>
          </div>
        </div>
      </section>

     {/* Footer */}
<footer className="footer">
  <div className="footer-container">
    <div className="footer-section">
      <div className="brand-info">
        <div className="logo-container">
          <img 
            src="/logo.svg" 
            alt="GreenScape Logo" 
            className="footer-logo"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/150x50?text=GreenScape";
            }}
          />
          <span className="logo-text">GreenScape</span>
        </div>
        <p className="brand-description">
          Transforming outdoor spaces with expert landscaping and garden management services since 2005.
        </p>
        <div className="social-links">
          <a href="https://facebook.com" aria-label="Facebook" className="social-icon">
            <Facebook size={20} />
          </a>
          <a href="https://twitter.com" aria-label="Twitter" className="social-icon">
            <Twitter size={20} />
          </a>
          <a href="https://instagram.com" aria-label="Instagram" className="social-icon">
            <Instagram size={20} />
          </a>
         
        </div>
      </div>
    </div>

    <div className="footer-section">
      <h3 className="footer-heading">Quick Links</h3>
      <ul className="footer-links">
        <li><a href="/home">Home</a></li>
        <li><a href="/services">Services</a></li>
        <li><a href="/testimonials">Testimonials</a></li>
        <li><a href="/gallery">Gallery</a></li>
      </ul>
    </div>

    <div className="footer-section">
      <h3 className="footer-heading">Company</h3>
      <ul className="footer-links">
        <li><a href="/about">About Us</a></li>
        <li><a href="/team">Our Team</a></li>
        <li><a href="/careers">Careers</a></li>
        <li><a href="/dashboard">Admin</a></li>
      </ul>
    </div>

    <div className="footer-section">
      <h3 className="footer-heading">Contact Us</h3>
      <div className="contact-info">
        <div className="contact-item">
          <MapPin size={18} className="contact-icon" />
          <span>NO 10,New plaza road Malabe ,Sri Lanka</span>
        </div>
        <div className="contact-item">
          <Phone size={18} className="contact-icon" />
          <span>(057) 2246761</span>
        </div>
        <div className="contact-item">
          <Mail size={18} className="contact-icon" />
          <span>info@greenscape.com</span>
        </div>
      </div>
      <a href="/contact" className="footer-cta-button">
        Get Free Quote
      </a>
    </div>
  </div>

  <div className="footer-bottom">
    <div className="copyright">
      &copy; {new Date().getFullYear()} GreenScape. All rights reserved.
    </div>
    <div className="legal-links">
      <a href="/privacy-policy">Privacy Policy</a>
      <a href="/terms">Terms of Service</a>
      <a href="/sitemap">Sitemap</a>
    </div>
  </div>
</footer>
    </div>
  );
};

export default Home;