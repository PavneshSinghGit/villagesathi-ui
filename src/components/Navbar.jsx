import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/navbar.css";
import logo from "../assets/Images/villagesathi-logo.png";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function Navbar() {
  const location = useLocation();

  // Helper function to check active route
  const isActive = (path) => location.pathname === path ? "active-nav-link" : "";

  return (
    <>
      {/* --- OFFICIAL GOVT TOP BAR --- */}
      <div className="gov-top-bar py-1 d-none d-md-block" style={{ background: "#f8f9fa", borderBottom: "1px solid #ddd", fontSize: "12px" }}>
        <div className="container d-flex justify-content-between align-items-center">
          <div className="gov-india-text text-uppercase fw-bold text-secondary">
            <img src="flag.svg" alt="flag" style={{ height: '10px', marginRight: '5px' }} />
            भारत सरकार | Government of India
          </div>
          <div className="gov-links d-flex gap-4">
            <a href="#main" className="text-decoration-none text-dark">Skip to main content</a>
            <span className="fw-bold cursor-pointer">A+ A-</span>
            <span className="lang-toggle fw-bold text-primary cursor-pointer">English | हिंदी</span>
          </div>
        </div>
      </div>

      {/* --- MAIN NAVBAR --- */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm p-0 border-bottom-orange">
        <div className="container">

          <Link className="navbar-brand d-flex align-items-center py-2" to="/">
            <img src={logo} alt="VillageSathi Logo" className="logo-img me-2" style={{ height: "50px", transition: "0.3s" }} />
            <div className="brand-text-wrapper">
              <span className="brand-main d-block fw-bold" style={{ letterSpacing: "1px", color: "#003366" }}>VILLAGESATHI</span>
              <span className="brand-sub text-muted" style={{ fontSize: "10px", fontWeight: "600" }}>ग्रामीण सशक्तिकरण की एक पहल</span>
            </div>
          </Link>

          <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav align-items-center">
              <li className="nav-item">
                <Link className={`nav-link nav-link-custom ${isActive('/home')}`} to="/home">HOME</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link nav-link-custom ${isActive('/about')}`} to="/about">ABOUT</Link>
              </li>

              {/* SERVICES DROPDOWN - MEGA MENU */}
              <li className="nav-item dropdown has-megamenu">
                <a
                  className="nav-link nav-link-custom dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  SERVICES
                </a>

                <div className="dropdown-menu mega-menu-custom border-0 shadow-lg p-3 animate slideIn" aria-labelledby="navbarDropdown">
                  <div className="row g-3" style={{ minWidth: '550px' }}>
                    {[
                      { to: "/services/Electricity", icon: "⚡", title: "Electricity", desc: "Bills & Status" },
                      { to: "/services/GovernmentSchemes", icon: "🏛", title: "Govt Schemes", desc: "Benefits & Apply" },
                      { to: "/services/Weather", icon: "🌦", title: "Weather", desc: "Local Updates" },
                      { to: "/services/FarmerHelp", icon: "🌾", title: "Farmer Help", desc: "Agri Support" }
                    ].map((service, index) => (
                      <div className="col-6" key={index}>
                        <Link to={service.to} className="dropdown-item service-box d-flex align-items-start p-3 rounded shadow-sm-hover">
                          <span className="fs-3 me-3">{service.icon}</span>
                          <div>
                            <strong className="d-block text-dark">{service.title}</strong>
                            <span className="small text-muted">{service.desc}</span>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </li>

              <li className="nav-item">
                <Link className={`nav-link nav-link-custom ${isActive('/contact')}`} to="/contact">CONTACT</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link nav-link-custom ${isActive('/blog')}`} to="/blog">BLOG</Link>
              </li>
              <li className="nav-item ms-lg-4">
                <Link className="btn btn-login-modern px-4 py-2" to="/admin/login">
                  ADMIN LOGIN
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;