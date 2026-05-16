import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Store, UserCog } from "lucide-react";
import logo from "../assets/Images/villagesathi-logo.png";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function Navbar() {
  const location = useLocation();
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleButtonRef = useRef(null);
  const navbarCollapseRef = useRef(null);
  const dropdownRef = useRef(null);

  // Handle Scroll Effect for Premium Glassmorphism transition
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu and dropdown when link is clicked
  const handleNavLinkClick = () => {
    if (navbarCollapseRef.current && navbarCollapseRef.current.classList.contains("show")) {
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

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <>
      <style>{`
        /* Premium Navbar Styles */
        .premium-navbar {
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            background-color: ${isScrolled ? 'rgba(255, 255, 255, 0.95)' : '#ffffff'};
            backdrop-filter: ${isScrolled ? 'blur(12px)' : 'none'};
            box-shadow: ${isScrolled ? '0 10px 30px rgba(0, 17, 51, 0.08)' : '0 2px 10px rgba(0,0,0,0.03)'};
        }
        
        .nav-item-custom {
            margin: 0 4px;
            position: relative;
        }

        .nav-link-custom {
            color: #475569 !important;
            font-weight: 600;
            font-size: 0.85rem;
            letter-spacing: 0.5px;
            padding: 8px 16px !important;
            border-radius: 50px;
            transition: all 0.3s ease;
        }

        .nav-link-custom:hover {
            color: #ea580c !important;
            background-color: rgba(234, 88, 12, 0.05);
        }

        .nav-link-custom.active {
            color: #ea580c !important;
            background-color: rgba(234, 88, 12, 0.1);
        }

        /* Services Dropdown Premium Styling */
        .dropdown-menu-premium {
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            box-shadow: 0 20px 40px rgba(0, 17, 51, 0.12);
            padding: 10px;
            min-width: 220px;
            margin-top: 15px !important;
            display: block;
            opacity: 0;
            visibility: hidden;
            transform: translateY(10px);
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .dropdown-menu-premium.show {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }

        .dropdown-item-premium {
            border-radius: 10px;
            padding: 10px 16px;
            font-size: 0.9rem;
            font-weight: 600;
            color: #334155;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            margin-bottom: 2px;
        }

        .dropdown-item-premium:hover {
            background-color: #f8fafc;
            color: #00509d;
            transform: translateX(4px);
        }

        /* Action Buttons */
        .market-btn {
            background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
            color: white !important;
            border: none;
            box-shadow: 0 4px 10px rgba(234, 88, 12, 0.3);
            transition: all 0.3s;
        }
        .market-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 15px rgba(234, 88, 12, 0.4);
        }

        .admin-btn {
            background-color: rgba(15, 23, 42, 0.05);
            color: #0f172a !important;
            border: 1px solid #e2e8f0;
            transition: all 0.3s;
        }
        .admin-btn:hover {
            background-color: #0f172a;
            color: white !important;
            border-color: #0f172a;
        }

        @media (max-width: 991px) {
            .dropdown-menu-premium {
                box-shadow: none;
                border: none;
                background: #f8fafc;
                margin-top: 5px !important;
            }
            .nav-item-custom { margin: 4px 0; }
        }
      `}</style>

      {/* --- TOP BAR (Polished GOI Banner) --- */}
      <div className="d-none d-md-block" style={{ backgroundColor: '#0f172a', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="container d-flex justify-content-between align-items-center py-1" style={{ fontSize: "11px", color: '#cbd5e1' }}>
          <div className="fw-medium d-flex align-items-center">
            <span className="me-2 text-warning">🇮🇳</span> भारत सरकार | GOVERNMENT OF INDIA
          </div>
          <div className="d-flex gap-3 align-items-center">
            <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = 'white'} onMouseOut={e => e.target.style.color = '#cbd5e1'}>Skip to main content</span>
            <span className="opacity-25">|</span>
            <span style={{ cursor: 'pointer', letterSpacing: '2px' }}>A- A A+</span>
          </div>
        </div>
      </div>

      {/* --- MAIN NAVBAR --- */}
      <nav className={`navbar navbar-expand-lg sticky-top py-2 py-lg-3 premium-navbar`}>
        <div className="container">

          {/* BRAND LOGO */}
          <Link className="navbar-brand d-flex align-items-center transition-all" to="/home" style={{ transform: isScrolled ? 'scale(0.95)' : 'scale(1)' }}>
            <img src={logo} alt="VillageSathi Logo" style={{ height: "45px", width: "auto" }} />
            <div className="ms-3 ps-3" style={{ borderLeft: '2px solid #ea580c' }}>
              <span className="fw-bolder d-block lh-1" style={{ color: "#0f172a", fontSize: "1.25rem", letterSpacing: "1px" }}>
                VILLAGE<span style={{ color: '#ea580c' }}>SATHI</span>
              </span>
              <small className="text-muted fw-bold d-block mt-1" style={{ fontSize: "0.65rem", letterSpacing: "1.5px", textTransform: 'uppercase' }}>
                Digital Rural Empowerment
              </small>
            </div>
          </Link>

          {/* MOBILE TOGGLE */}
          <button
            ref={toggleButtonRef}
            className="navbar-toggler border-0 shadow-none p-2 rounded-3"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            style={{ backgroundColor: 'rgba(15,23,42,0.05)' }}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* NAV LINKS */}
          <div className="collapse navbar-collapse justify-content-end mt-3 mt-lg-0" id="navbarNav" ref={navbarCollapseRef}>
            <ul className="navbar-nav align-items-lg-center">

              <li className="nav-item nav-item-custom">
                <Link onClick={handleNavLinkClick} className={`nav-link nav-link-custom ${isActive('/home') ? 'active' : ''}`} to="/home">HOME</Link>
              </li>

              <li className="nav-item nav-item-custom">
                <Link onClick={handleNavLinkClick} className={`nav-link nav-link-custom ${isActive('/about') ? 'active' : ''}`} to="/about">ABOUT</Link>
              </li>

              {/* SERVICES DROPDOWN */}
              <li className="nav-item nav-item-custom dropdown" ref={dropdownRef}>
                <button
                  type="button"
                  className={`btn nav-link nav-link-custom border-0 d-flex align-items-center ${isActive('/services') ? 'active' : ''}`}
                  onClick={() => setIsServicesOpen(!isServicesOpen)}
                >
                  SERVICES <ChevronDown size={14} className="ms-1" style={{ transform: isServicesOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s' }} />
                </button>

                <ul style={{ zIndex: '1080' }} className={`dropdown-menu dropdown-menu-end dropdown-menu-premium ${isServicesOpen ? 'show' : ''}`}>
                  <li className="px-3 py-1 mb-1 small fw-bold text-muted" style={{ fontSize: '0.65rem', letterSpacing: '0.5px' }}>CITIZEN SERVICES</li>
                  <li><Link onClick={handleNavLinkClick} className="dropdown-item dropdown-item-premium" to="/services/electricity"><span className="me-2 fs-6">⚡</span> Smart Power</Link></li>
                  <li><Link onClick={handleNavLinkClick} className="dropdown-item dropdown-item-premium" to="/services/governmentschemes"><span className="me-2 fs-6">🏛</span> Govt Schemes</Link></li>
                  <li><hr className="dropdown-divider opacity-25 my-1 mx-2" /></li>
                  <li className="px-3 py-1 mt-1 mb-1 small fw-bold text-muted" style={{ fontSize: '0.65rem', letterSpacing: '0.5px' }}>AGRI SUPPORT</li>
                  <li><Link onClick={handleNavLinkClick} className="dropdown-item dropdown-item-premium" to="/services/weather"><span className="me-2 fs-6">🌦</span> Live Weather</Link></li>
                  <li><Link onClick={handleNavLinkClick} className="dropdown-item dropdown-item-premium" to="/services/farmerhelp"><span className="me-2 fs-6">🌾</span> Farmer Advisory</Link></li>
                </ul>
              </li>

              <li className="nav-item nav-item-custom">
                <Link onClick={handleNavLinkClick} className={`nav-link nav-link-custom ${isActive('/blog') ? 'active' : ''}`} to="/blog">BLOG</Link>
              </li>

              <li className="nav-item nav-item-custom">
                <Link onClick={handleNavLinkClick} className={`nav-link nav-link-custom ${isActive('/tools') ? 'active' : ''}`} to="/tools">TOOLS</Link>
              </li>

              <li className="nav-item nav-item-custom me-lg-3">
                <Link onClick={handleNavLinkClick} className={`nav-link nav-link-custom ${isActive('/contact') ? 'active' : ''}`} to="/contact">CONTACT US</Link>
              </li>
              
              {/* ACTION BUTTONS */}
              <li className="nav-item mt-2 mt-lg-0 me-lg-2">
                <Link
                  onClick={handleNavLinkClick}
                  className="btn market-btn rounded-pill px-4 py-2 fw-bold d-flex align-items-center justify-content-center"
                  to="/sathi-market"
                  style={{ fontSize: '0.85rem', letterSpacing: '0.5px' }}
                >
                  <Store size={16} className="me-2" /> SATHIMARKET
                </Link>
              </li>

              <li className="nav-item mt-2 mt-lg-0">
                <Link
                  onClick={handleNavLinkClick}
                  className="btn admin-btn rounded-pill px-3 py-2 fw-bold d-flex align-items-center justify-content-center"
                  to="/admin/login"
                  style={{ fontSize: '0.8rem', letterSpacing: '0.5px' }}
                >
                  <UserCog size={16} className="me-1" /> ADMIN
                </Link>
              </li>

            </ul>
          </div>
        </div>
      </nav>

      {/* Very subtle bottom highlight instead of thick warning line */}
      <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent, #ea580c, transparent)', opacity: isScrolled ? 1 : 0, transition: 'opacity 0.3s' }}></div>
    </>
  );
}

export default Navbar;