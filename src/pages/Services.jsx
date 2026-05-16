import React from "react";
import {
  Zap, Landmark, Sprout, HeartPulse, GraduationCap, ShoppingBag, 
  ChevronRight, HelpCircle, CheckCircle, Info
} from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

function Services() {
  const allServices = [
    {
      title: "साथी मार्केट (SathiMarket)",
      desc: "Buy fresh produce and handmade goods directly from rural artisans and local village shops.",
      icon: <ShoppingBag size={24} />,
      color: "#ff9933", // Saffron
      bg: "#fff4e6",
      path: "/sathi-market",
      featured: true
    },
    {
      title: "बिजली ट्रैकिंग (Power Tracker)",
      desc: "Monitor real-time power supply status and report electrical faults within your region using IoT data.",
      icon: <Zap size={24} />,
      color: "#000080", // Navy Blue
      bg: "#f1f5f9",
      path: "/services/electricity"
    },
    {
      title: "सरकारी योजनाएं (Govt. Schemes)",
      desc: "Simplified access to PM-Kisan, Awas Yojana, and verified scheme alerts for your profile.",
      icon: <Landmark size={24} />,
      color: "#128807", // Green
      bg: "#e6f3e6",
      path: "/services/GovernmentSchemes"
    },
    {
      title: "स्मार्ट खेती (Smart Farming)",
      desc: "AI-driven crop suggestions, soil monitoring, and real-time Mandi price tracking.",
      icon: <Sprout size={24} />,
      color: "#128807",
      bg: "#e6f3e6",
      path: "/services/FarmerHelp"
    },
    {
      title: "स्वास्थ्य कनेक्ट (Health Connect)",
      desc: "Locate medical centers, book appointments, and access 24/7 emergency ambulance contacts.",
      icon: <HeartPulse size={24} />,
      color: "#d9534f", // Emergency Red
      bg: "#fdf2f2",
      path: "/services/healthcare"
    },
    {
      title: "डिजिटल शिक्षा (Digital Education)",
      desc: "Free skill development courses for rural youth and digital literacy workshops.",
      icon: <GraduationCap size={24} />,
      color: "#000080",
      bg: "#f1f5f9",
      path: "/services/education"
    }
  ];

  return (
    <main className="animate-fade-in pb-5" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Helmet>
        <title>Official Services Portal | VillageSathi Digital Bharat Mission</title>
        <meta name="description" content="Access verified digital services including SathiMarket, Sarkari Yojana Hub, and IoT Power Tracking." />
      </Helmet>

      {/* --- OFFICIAL GOVT HERO --- */}
      <header className="services-hero-govt py-5 position-relative">
        <div className="container px-4 text-center">
          <div className="d-inline-flex align-items-center govt-badge px-3 py-1 mb-3">
            <span className="small fw-bold">डिजिटल सेवा केंद्र | Digital Service Centre</span>
          </div>
          <h1 className="govt-title mb-2">
            Unified <span className="text-saffron">Digital</span> Solutions for <span className="text-green">Rural Bharat</span>
          </h1>
          <p className="govt-subtitle mx-auto mb-0" style={{ maxWidth: '750px' }}>
            VillageSathi bridges the information gap by bringing governance, commerce, and essential utilities directly to your village doorstep through a single window.
          </p>
        </div>
      </header>

      {/* --- OFFICIAL STATUS BAR --- */}
      <section className="bg-navy py-2 shadow-sm text-white">
        <div className="container px-4 d-flex align-items-center gap-2">
          <Info size={16} className="text-saffron" />
          <marquee className="small fw-medium opacity-90">
            Official Announcement: New Agri-Input Calculators are now live • Register as a SathiMarket Vendor to sell produce directly • Verified PM-Kisan status tracking active.
          </marquee>
        </div>
      </section>

      {/* --- SERVICES GRID --- */}
      <section className="container-fluid px-md-5 mt-5">
        <div className="row g-4">
          {allServices.map((service, index) => (
            <div className="col-xl-4 col-md-6" key={index}>
              <div className="govt-service-card h-100 bg-white border shadow-sm p-4 position-relative overflow-hidden transition-hover">
                {service.featured && <div className="govt-featured-label">LIVE & POPULAR</div>}
                
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="icon-wrap-govt d-flex align-items-center justify-content-center" 
                       style={{ backgroundColor: service.bg, color: service.color }}>
                    {service.icon}
                  </div>
                  <h5 className="fw-bold text-navy mb-0">{service.title}</h5>
                </div>
                
                <p className="text-muted small mb-4 lh-base" style={{ minHeight: '3.6rem' }}>
                  {service.desc}
                </p>

                <Link to={service.path} className="btn btn-navy-outline w-100 rounded-1 py-2 fw-bold small d-flex align-items-center justify-content-center gap-2">
                  Access Service <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- GOVT HELP REQUEST SECTION --- */}
      <section className="container-fluid px-md-5 mt-5">
        <div className="p-4 bg-white border border-left-saffron shadow-sm text-center text-lg-start">
          <div className="row align-items-center">
            <div className="col-lg-1 d-none d-lg-block">
               <HelpCircle size={48} className="text-navy opacity-20" />
            </div>
            <div className="col-lg-7 mb-3 mb-lg-0">
               <h4 className="fw-bold text-navy mb-1">Custom Digital Service Request?</h4>
               <p className="small text-muted mb-0">If your Gram Panchayat requires a specific digital tool or tracker, submit an official request.</p>
            </div>
            <div className="col-lg-4 text-lg-end">
               <button className="btn btn-govt-secondary rounded-1 px-4 fw-bold">Request Service Tool</button>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        /* Official Color Palette */
        .text-saffron { color: #ff9933; }
        .text-green { color: #128807; }
        .text-navy { color: #000080; }
        .bg-navy { background-color: #000080; }
        
        /* Hero Styling */
        .services-hero-govt {
          background-color: #ffffff;
          background-image: linear-gradient(180deg, #fef2e0 0%, #ffffff 100%);
          border-top: 3px solid #ff9933;
        }
        .govt-badge { background-color: #f1f5f9; border: 1px solid #cbd5e1; color: #475569; border-radius: 4px; }
        .govt-title { font-weight: 800; font-size: 2.2rem; color: #000080; }
        .govt-subtitle { color: #475569; font-size: 1rem; line-height: 1.6; }

        /* Card Styling */
        .govt-service-card {
          border-radius: 4px;
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
        }
        .govt-service-card:hover {
          border-color: #ff9933;
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,128,0.05) !important;
        }
        .icon-wrap-govt {
          width: 50px;
          height: 50px;
          border-radius: 8px;
        }
        .border-left-saffron { border-left: 6px solid #ff9933 !important; }
        
        /* Labels & Buttons */
        .govt-featured-label {
          position: absolute;
          top: 0;
          right: 0;
          background: #ff9933;
          color: white;
          font-size: 0.6rem;
          font-weight: 800;
          padding: 4px 12px;
          border-bottom-left-radius: 8px;
        }
        .btn-navy-outline {
          border: 1px solid #000080;
          color: #000080;
          transition: 0.2s;
        }
        .btn-navy-outline:hover {
          background: #000080;
          color: white;
        }
        .btn-govt-secondary {
          background-color: #ff9933;
          color: white;
          border: none;
        }

        @media (max-width: 768px) {
          .govt-title { font-size: 1.7rem !important; }
          .btn { width: 100%; margin-bottom: 5px; }
        }
      `}</style>
    </main>
  );
}

export default Services;