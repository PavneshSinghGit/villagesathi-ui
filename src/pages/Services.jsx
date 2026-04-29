import React from "react";
import {
  Zap, Landmark, Sprout, HeartPulse, GraduationCap, Truck, ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import "../styles/userStyles.css";
import { Helmet } from "react-helmet-async";
function Services() {
  const allServices = [
    {
      title: "Electricity Services",
      desc: "Monitor real-time power supply status, pay utility bills, and report electrical faults seamlessly.",
      icon: <Zap size={30} />,
      color: "text-warning",
      bg: "bg-warning-light",
      path: "/services/electricity"
    },
    {
      title: "Government Schemes",
      desc: "Access simplified details on PM-Kisan, Awas Yojana, and Ration Card updates directly from official sources.",
      icon: <Landmark size={30} />,
      color: "text-primary",
      bg: "bg-primary-light",
      path: "/services/GovernmentSchemes"
    },
    {
      title: "Smart Farming",
      desc: "Get digital soil health cards, AI-driven crop suggestions, and live Mandi (Market) price tracking.",
      icon: <Sprout size={30} />,
      color: "text-success",
      bg: "bg-success-light",
      path: "/services/FarmerHelp"
    },
    {
      title: "Healthcare Connect",
      desc: "Find verified government medical centers, check doctor schedules, and request emergency assistance.",
      icon: <HeartPulse size={30} />,
      color: "text-danger",
      bg: "bg-danger-light",
      path: "/services/healthcare"
    },
    {
      title: "Digital Education",
      desc: "Empowering rural youth with free skill development courses, digital literacy, and scholarship alerts.",
      icon: <GraduationCap size={30} />,
      color: "text-info",
      bg: "bg-info-light",
      path: "/services/education"
    },
    {
      title: "Village Logistics",
      desc: "Track regional transport, manage farm-to-market supply chains, and coordinate rural deliveries.",
      icon: <Truck size={30} />,
      color: "text-secondary",
      bg: "bg-secondary-light",
      path: "/services/logistics"
    }
  ];

  return (
    <div className="services-page py-5 bg-light">
      <Helmet>
        <title>Our Services | VillageSathi - Digital Solutions for Rural India</title>
        <meta name="description" content="Explore the range of digital services offered by VillageSathi to empower rural communities." />
      </Helmet>
      {/* --- HEADER SECTION --- */}
      <div className="container text-center mb-5">
        <h6 className="text-success fw-bold text-uppercase tracking-widest mb-2" style={{ letterSpacing: '2px' }}>
          Empowering Communities
        </h6>
        <h2 className="display-5 fw-bold text-dark mb-3">Unified Digital Solutions</h2>
        <div className="underline mx-auto mb-4" style={{ width: '60px', height: '4px', backgroundColor: '#198754', borderRadius: '2px' }}></div>
        <p className="text-muted fs-5 mx-auto" style={{ maxWidth: '800px' }}>
          VillageSathi bridges the digital divide by providing essential services tailored for the
          unique needs of rural India. Experience governance and growth in your pocket.
        </p>
      </div>

      {/* --- SERVICES GRID --- */}
      <div className="container">
        <div className="row g-4">
          {allServices.map((service, index) => (
            <div className="col-lg-4 col-md-6" key={index}>
              <div className="service-card-premium h-100 p-4 shadow-sm border-0 rounded-4 bg-white transition-all hover-shadow-lg">
                <div className={`icon-circle mb-4 rounded-circle d-flex align-items-center justify-content-center ${service.bg} ${service.color}`} style={{ width: '65px', height: '65px' }}>
                  {service.icon}
                </div>
                <h4 className="fw-bold mb-3 text-dark">{service.title}</h4>
                <p className="text-muted mb-4 leading-relaxed" style={{ fontSize: '0.95rem' }}>{service.desc}</p>

                <Link to={service.path} className="btn btn-link p-0 fw-bold text-decoration-none text-success d-flex align-items-center gap-2 group">
                  <span>Explore Service</span>
                  <ArrowRight className="transition-transform group-hover-translate-x-1" size={18} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- CALL TO ACTION --- */}
      <div className="container mt-5 pt-5">
        <div className="cta-banner p-5 rounded-5 text-center text-white shadow-lg" style={{ background: 'linear-gradient(135deg, #1a5d1a 0%, #2c7a2c 100%)' }}>
          <h3 className="fw-bold mb-3 h2">Need a Specific Service?</h3>
          <p className="mb-4 opacity-75 fs-5">
            We are constantly expanding our ecosystem. Suggest a new digital service
            to help your village grow faster!
          </p>
          <div className="d-flex justify-content-center gap-3">
            <button className="btn btn-light btn-lg px-5 fw-bold rounded-pill text-success shadow-sm">
              Contact Support
            </button>
            <button className="btn btn-outline-light btn-lg px-5 fw-bold rounded-pill">
              Feedback Form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Services;