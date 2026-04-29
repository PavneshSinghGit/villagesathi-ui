import React from "react";
import { Link } from "react-router-dom";
import { PhoneCall, Globe, Users, Mail, MapPin, ArrowRight } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-4" style={{ borderTop: "4px solid #ffc107" }}>
      <div className="container">
        <div className="row g-4">
          
          {/* Brand Section */}
          <div className="col-lg-4 col-md-6">
            <h4 className="fw-bold text-warning mb-3 d-flex align-items-center">
              VILLAGESATHI <span className="ms-2">🌾</span>
            </h4>
            <p className="text-secondary small lh-lg">
              <img 
                src="https://flagcdn.com/w20/in.png" 
                alt="India" 
                className="me-2"
                style={{ width: '18px', borderRadius: '2px' }} 
              />
              Empowering rural India through digital innovation. We bridge the gap 
              between technology and grassroots communities for a sustainable future.
            </p>
            <div className="mt-4 d-flex flex-column gap-2 small">
              <div className="d-flex align-items-center text-secondary">
                <MapPin size={16} className="me-2 text-warning" />
                <span>Main Market, Kakaraha, Mitauli, Kheri (U.P.)</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-6 ps-lg-5">
            <h6 className="fw-bold mb-4 text-uppercase small letter-spacing-1">Company</h6>
            <ul className="list-unstyled">
              {["Home", "About", "Services", "Blog"].map((item) => (
                <li key={item} className="mb-2">
                  <Link 
                    to={`/${item.toLowerCase().replace(' ', '')}`} 
                    className="text-secondary text-decoration-none small d-flex align-items-center link-hover"
                  >
                    <ArrowRight size={12} className="me-1 opacity-0 arrow-icon" /> {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Section */}
          <div className="col-lg-3 col-6">
            <h6 className="fw-bold mb-4 text-uppercase small letter-spacing-1">Help Center</h6>
            <div className="d-flex flex-column gap-3">
              <a href="tel:+919305492516" className="text-decoration-none text-secondary small d-flex align-items-center">
                <div className="bg-secondary bg-opacity-25 p-2 rounded-3 me-3">
                    <PhoneCall size={16} className="text-warning" />
                </div>
                +91 9305492516
              </a>
              <a href="mailto:support@villagesathi.in" className="text-decoration-none text-secondary small d-flex align-items-center">
                <div className="bg-secondary bg-opacity-25 p-2 rounded-3 me-3">
                    <Mail size={16} className="text-warning" />
                </div>
                <span className="text-truncate">pavneshsinghlmp@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Social & Newsletter */}
          <div className="col-lg-3 col-md-6 text-md-end text-center">
            <h6 className="fw-bold mb-4 text-uppercase small letter-spacing-1">Follow Our Journey</h6>
            <div className="d-flex justify-content-md-end justify-content-center gap-2">
              {[Globe, Users, Mail].map((Icon, idx) => (
                <a 
                  key={idx} 
                  href="#" 
                  className="btn btn-outline-warning border-0 bg-secondary bg-opacity-10 rounded-circle p-2"
                  style={{ transition: '0.3s' }}
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
            <p className="mt-4 small text-secondary">Join 5000+ Villagers</p>
          </div>

        </div>

        <hr className="my-4 border-secondary opacity-25" />

        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <p className="small text-secondary mb-0">
              © {new Date().getFullYear()} <strong>VillageSathi Platforms Pvt. Ltd.</strong>
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <p className="small text-secondary mb-0" style={{ fontSize: '0.75rem' }}>
              Designed for Rural Innovation | <span className="text-warning">Digital India</span>
            </p>
          </div>
        </div>
      </div>

      {/* Extra CSS for hover effects (Aap apni CSS file mein daal sakte hain) */}
      <style>{`
        .link-hover { transition: all 0.3s ease; }
        .link-hover:hover { color: #ffc107 !important; padding-left: 5px; }
        .link-hover:hover .arrow-icon { opacity: 1 !important; }
        .letter-spacing-1 { letter-spacing: 1px; }
      `}</style>
    </footer>
  );
};

export default Footer;