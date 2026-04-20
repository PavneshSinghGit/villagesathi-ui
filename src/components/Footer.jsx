import React from "react";
import { Link } from "react-router-dom";
import { PhoneCall, Globe, Users } from "lucide-react";

const Footer = () => {
  return (
    <footer className="footer-gov text-white pt-5 pb-3 bg-dark">
      <div className="container">
        {/* text-center (mobile) aur text-md-start (desktop) optimize kiya gaya hai */}
        <div className="row g-4 text-center text-md-start">
          
          {/* About Section */}
          <div className="col-md-4 col-12">
            <h5 className="fw-bold mb-3 text-warning">VILLAGESATHI 🌾</h5>
            <p className="small opacity-75">
              <img 
                src="https://flagcdn.com/w20/in.png" 
                alt="India Flag" 
                style={{ height: '12px', marginRight: '8px', verticalAlign: 'middle' }} 
              />
              An official effort to empower rural India with digital technology. 
              We are the bridge between governance and citizens.
            </p>
            <p className="small mt-2">
              <strong>Address:</strong> Main Market, Kakaraha, Mitauli, Kheri (U.P.)
            </p>
          </div>

          {/* Quick Links - Mobile par 2 column mein dikhega (col-6) */}
          <div className="col-md-2 col-6">
            <h6 className="fw-bold mb-3">Quick Links</h6>
            <ul className="list-unstyled footer-links small">
              <li className="mb-2"><Link to="/" className="text-white text-decoration-none opacity-75">Home</Link></li>
              <li className="mb-2"><Link to="/about" className="text-white text-decoration-none opacity-75">About Us</Link></li>
              <li className="mb-2"><Link to="/services" className="text-white text-decoration-none opacity-75">Services</Link></li>
              <li className="mb-2"><Link to="/blog" className="text-white text-decoration-none opacity-75">Patrika (Blog)</Link></li>
            </ul>
          </div>

          {/* Help Center - Mobile par 2 column mein dikhega (col-6) */}
          <div className="col-md-3 col-6">
            <h6 className="fw-bold mb-3">Help Center</h6>
            <div className="d-flex align-items-center justify-content-center justify-content-md-start mb-2 small">
              <PhoneCall size={16} className="me-2 text-warning" /> 
              <span>+91 9305492516</span>
            </div>
            <div className="d-flex align-items-center justify-content-center justify-content-md-start small">
              <Globe size={16} className="me-2 text-warning" /> 
              <span className="text-truncate">support@villagesathi.in</span>
            </div>
          </div>

          {/* Social Icons */}
          <div className="col-md-3 col-12 text-center">
            <h6 className="fw-bold mb-3">Follow Us</h6>
            <div className="d-flex justify-content-center gap-3">
              <a href="#" className="social-node bg-secondary text-white p-2 rounded-circle d-inline-flex align-items-center justify-content-center">
                <Globe size={20} />
              </a>
              <a href="#" className="social-node bg-secondary text-white p-2 rounded-circle d-inline-flex align-items-center justify-content-center">
                <Users size={20} />
              </a>
            </div>
          </div>

        </div>

        <hr className="my-4 opacity-25" />

        <div className="text-center small text-white opacity-75">
          © {new Date().getFullYear()} VillageSathi Platforms Pvt. Ltd. | Designed for Rural Innovation
        </div>
      </div>
    </footer>
  );
};

export default Footer;