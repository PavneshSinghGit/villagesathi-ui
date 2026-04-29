import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/navbar.css";
import logo from "../assets/Images/villagesathi-logo.png";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
function Navbar() {
  const location = useLocation();
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const toggleButtonRef = useRef(null);
  const navbarCollapseRef = useRef(null);
  const dropdownRef = useRef(null);

  // Close mobile menu and dropdown when link is clicked
  const handleNavLinkClick = () => {
    if (navbarCollapseRef.current.classList.contains("show")) {
      toggleButtonRef.current.click();
    }
    setIsServicesOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getActiveClass = (path) => 
    location.pathname === path ? "nav-link active fw-bold text-warning" : "nav-link";

  return (
    <>
      {/* --- TOP BAR --- */}
      <div className="d-none d-md-block bg-light border-bottom py-1">
        <div className="container d-flex justify-content-between align-items-center" style={{ fontSize: "11px" }}>
          <div className="text-secondary fw-medium">
            भारत सरकार | GOVERNMENT OF INDIA
          </div>
          <div className="d-flex gap-3 text-secondary">
            <span>Skip to main content</span>
            <span>|</span>
            <span className="cursor-pointer">A+ A A-</span>
          </div>
        </div>
      </div>

      {/* --- MAIN NAVBAR --- */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm py-2">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center" to="/home">
            <img src={logo} alt="VillageSathi Logo" style={{ height: "45px", width: "auto" }} />
            <div className="ms-2 border-start ps-2 border-2 border-warning text-start">
              <span className="fw-bold d-block lh-1 mt-1" style={{ color: "#003366", fontSize: "1.2rem", letterSpacing: "1px" }}>
                VILLAGESATHI
              </span>
              <small className="text-muted text-uppercase tracking-tighter" style={{ fontSize: "9px", fontWeight: "600" }}>
                Digital Rural Empowerment
              </small>
            </div>
          </Link>

          <button 
            ref={toggleButtonRef}
            className="navbar-toggler border-0 shadow-none" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
            aria-controls="navbarNav" 
            aria-expanded="false" 
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse justify-content-end" id="navbarNav" ref={navbarCollapseRef}>
            <ul className="navbar-nav align-items-center gap-1">
              <li className="nav-item">
                <Link onClick={handleNavLinkClick} className={getActiveClass('/home')} to="/home">HOME</Link>
              </li>
              
              <li className="nav-item">
                <Link onClick={handleNavLinkClick} className={getActiveClass('/about')} to="/about">ABOUT</Link>
              </li>

              {/* FIXED SERVICES DROPDOWN */}
              <li 
                className={`nav-item dropdown ${isServicesOpen ? 'show' : ''}`} 
                ref={dropdownRef}
              >
                <button
                  className={`nav-link dropdown-toggle border-1 bg-transparent ${location.pathname.includes('/services') ? 'active text-warning fw-bold' : ''}`}
                  onClick={() => setIsServicesOpen(!isServicesOpen)}
                  aria-expanded={isServicesOpen}
                >
                  SERVICES
                </button>
                <ul 
                  className={`dropdown-menu border-0 shadow-lg mt-lg-3 rounded-3 ${isServicesOpen ? 'show' : ''}`}
                  style={{ display: isServicesOpen ? 'block' : 'none', right: 0 }}
                >
                  <li><Link onClick={handleNavLinkClick} className="dropdown-item py-2" to="/services/electricity">⚡ Electricity Status</Link></li>
                  <li><Link onClick={handleNavLinkClick} className="dropdown-item py-2" to="/services/governmentschemes">🏛 Govt Schemes</Link></li>
                  <li><Link onClick={handleNavLinkClick} className="dropdown-item py-2" to="/services/weather">🌦 Live Weather</Link></li>
                  <li><Link onClick={handleNavLinkClick} className="dropdown-item py-2" to="/services/farmerhelp">🌾 Farmer Help</Link></li>
                </ul>
              </li>

              <li className="nav-item">
                <Link onClick={handleNavLinkClick} className={getActiveClass('/blog')} to="/blog">BLOG</Link>
              </li>

              <li className="nav-item">
                <Link onClick={handleNavLinkClick} className={getActiveClass('/contact')} to="/contact">CONTACT</Link>
              </li>

              <li className="nav-item ms-lg-3 mt-3 mt-lg-0">
                <Link 
                  onClick={handleNavLinkClick} 
                  className="btn btn-warning fw-bold px-4 rounded-pill shadow-sm" 
                  to="/admin/login"
                  style={{ fontSize: '0.85rem' }}
                >
                  ADMIN LOGIN
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="bg-warning w-100" style={{ height: '3px' }}></div>
    </>
  );
}

export default Navbar;