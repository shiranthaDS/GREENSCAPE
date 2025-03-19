import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Menu, X, ChevronLeft, ChevronRight, Leaf, Droplet, Shovel, Scissors, MapPin, Mail, Phone, Facebook, Instagram, Twitter } from "lucide-react";
import "./Home.css";
import { LogIn, User } from "lucide-react";
import AppointmentForm from "./AppointmentForm";


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
      afterImage: "/imges/p-2.png",
    },
    {
      id: 2,
      title: "Luxury Patio Design",
      description: "Creating outdoor living spaces that inspire",
      beforeImage: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=1200&q=80",
      afterImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
    },
    {
      id: 3,
      title: "Water Feature Installation",
      description: "Adding tranquility and elegance to any landscape",
      beforeImage: "https://images.unsplash.com/photo-1558452919-08ae4aea8e29?w=1200&q=80",
      afterImage: "https://images.unsplash.com/photo-1536195892759-c8a3c8e1945e?w=1200&q=80",
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
            <img
              src="/logo.svg"
              alt="GreenScape Logo"
              className="logo"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/150x50?text=GreenScape";
              }}
            />
            <span className="logo-text">GreenScape</span>
          </div>

          <div className="desktop-nav">
            <a href="/home" className="nav-link">Home</a>
            <a href="/services" className="nav-link">Services</a>
            <a href="/about" className="nav-link">About Us</a>
            <a href="/contact" className="nav-link">Contact Us</a>
            <a href="/feedbacks" className="nav-link">Feedbacks</a>
            
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
            <a href="/feedbacks" className="mobile-nav-link">Feedbacks</a>
          
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
          <button className="hero-cta" onClick={() => scrollToSection("#contact")}>
            Get a Free Quote
          </button>
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
      <AppointmentForm />
      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <h2>Get in Touch</h2>
        <p>Have a project in mind? Fill out the form below and we'll get back to you within 24 hours.</p>
        <div className="contact-container">
          <div className="contact-form">
            <form>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" placeholder="Your name" />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" placeholder="Your email" />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input type="text" id="phone" placeholder="Your phone number" />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" placeholder="Tell us about your project" rows={5} />
              </div>
              <button type="submit">Send Message</button>
            </form>
          </div>
          <div className="contact-info">
            <div className="map-placeholder">
              <MapPin size={40} className="map-icon" />
            </div>
            <div className="info-card">
              <h3>Contact Information</h3>
              <div className="info-item">
                <MapPin size={18} />
                <span>123 Green Avenue, Gardenville, GV 12345</span>
              </div>
              <div className="info-item">
                <Mail size={18} />
                <span>info@greenscape.com</span>
              </div>
              <div className="info-item">
                <Phone size={18} />
                <span>(555) 123-4567</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-section">
            <h3>GreenScape</h3>
            <p>Transforming outdoor spaces with expert landscaping and garden management services since 2005.</p>
            <div className="social-links">
              <a href="https://facebook.com" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="https://instagram.com" aria-label="Instagram">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <button onClick={() => scrollToSection("#home")}>Home</button>
              </li>
              <li>
                <button onClick={() => scrollToSection("#services")}>Services</button>
              </li>
              <li>
                <button onClick={() => scrollToSection("#testimonials")}>Testimonials</button>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>More</h3>
            <ul>
              <li>
                <button onClick={() => scrollToSection("#contact")}>Contact</button>
              </li>
              <li>
                <button onClick={() => scrollToSection("#about")}>About Us</button>
              </li>
              <li>
                <button onClick={() => scrollToSection("#projects")}>Projects</button>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Contact Us</h3>
            <div className="contact-details">
              <div className="info-item">
                <MapPin size={18} />
                <span>123 Garden Way, Greenville, CA 94301</span>
              </div>
              <div className="info-item">
                <Phone size={18} />
                <span>(555) 123-4567</span>
              </div>
              <div className="info-item">
                <Mail size={18} />
                <span>info@greenscape.com</span>
              </div>
            </div>
            <button className="footer-cta">Get In Touch</button>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} GreenScape. All rights reserved.</p>
          <ul>
            <li>
              <button>Privacy Policy</button>
            </li>
            <li>
              <button>Terms of Service</button>
            </li>
            <li>
              <button>Sitemap</button>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
};

export default Home;