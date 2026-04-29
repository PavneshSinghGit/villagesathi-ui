import React from "react";
import { Helmet } from "react-helmet-async";
import {
  PhoneCall, MessageSquare, Sprout, TestTube,
  HelpingHand, Tractor, Bug, Lightbulb, Users, ArrowRight
} from "lucide-react";
import "../../styles/servicesStyles.css";

function FarmerHelp() {
  const supportChannels = [
    {
      id: 1,
      title: "Kisan Call Center",
      detail: "Toll-Free: 1800-180-1551",
      icon: <PhoneCall size={28} className="text-primary" />,
      desc: "Speak directly with government agricultural experts (6 AM - 10 PM)."
    },
    {
      id: 2,
      title: "WhatsApp Advisory",
      detail: "+91 9305492516",
      icon: <MessageSquare size={28} className="text-success" />,
      desc: "Send crop photos for instant disease diagnosis and treatment plans."
    },
    {
      id: 3,
      title: "Soil Health Services",
      detail: "Digital Lab Request",
      icon: <TestTube size={28} className="text-danger" />,
      desc: "Request a professional soil test to optimize your farm's productivity."
    }
  ];

  const categories = [
    { title: "Seed Selection", icon: <Sprout size={40} /> },
    { title: "Pest Control", icon: <Bug size={40} /> },
    { title: "Modern Farming", icon: <Tractor size={40} /> },
    { title: "Smart Innovation", icon: <Lightbulb size={40} /> }
  ];

  return (
    <div className="farmer-help-page pb-5 bg-light">
      <Helmet>
        <title>Farmer Support | VillageSathi</title>
        <meta name="description" content="Get agricultural advisory and farmer support at VillageSathi." />
      </Helmet>

      {/* --- HERO SECTION --- */}
      <div className="help-hero py-5 text-white mb-5 shadow-sm" style={{ background: 'linear-gradient(135deg, #1a5d1a 0%, #2c7a2c 100%)' }}>
        <div className="container text-center py-4">
          <div className="d-flex align-items-center justify-content-center gap-3 mb-3">
            <HelpingHand size={45} className="text-warning" />
            <h1 className="display-4 fw-bold m-0 text-white">Kisan Sahayata Kendra</h1>
          </div>
          <p className="lead mx-auto opacity-90" style={{ maxWidth: '750px' }}>
            From seed selection to market access, we empower your journey.
            Get expert guidance on crop diseases, fertilizers, and modern farming techniques instantly.
          </p>
        </div>
      </div>

      <div className="container">
        {/* --- SUPPORT CARDS --- */}
        <div className="row g-4 mb-5">
          {supportChannels.map(item => (
            <div className="col-md-4" key={item.id}>
              <div className="card h-100 border-0 shadow-sm support-card p-4 text-center transition-hover">
                <div className="icon-circle mb-3 mx-auto bg-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: '70px', height: '70px' }}>
                  {item.icon}
                </div>
                <h4 className="fw-bold text-dark">{item.title}</h4>
                <p className="text-primary fw-bold fs-5 mb-2">{item.detail}</p>
                <p className="small text-muted mb-0">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* --- CROP ADVISORY SECTION --- */}
        <div className="row align-items-center mb-5 bg-white rounded-4 shadow-sm overflow-hidden g-0 border">
          <div className="col-lg-5 p-0 d-none d-lg-block">
            <img
              src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=800"
              alt="Farmer Help Desk"
              className="img-fluid h-100 object-fit-cover"
              style={{ minHeight: '400px' }}
            />
          </div>
          <div className="col-lg-7 p-4 p-md-5">
            <h2 className="fw-bold mb-2 text-dark">How can we assist your farm today?</h2>
            <p className="text-muted mb-4">Select a category to explore verified agricultural solutions.</p>
            <div className="row g-3">
              {categories.map((cat, i) => (
                <div className="col-6" key={i}>
                  <div className="category-item p-3 border rounded-3 text-center bg-light-hover transition-all cursor-pointer">
                    <div className="text-success mb-2">{cat.icon}</div>
                    <h6 className="fw-bold mb-0 text-secondary">{cat.title}</h6>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn btn-success btn-lg mt-4 w-100 rounded-pill shadow-sm fw-bold py-3">
              <Users size={20} className="me-2" /> Join Our Farmer Community
            </button>
          </div>
        </div>

        {/* --- KNOWLEDGE BASE --- */}
        <div className="mt-5">
          <div className="d-flex align-items-center gap-2 mb-4">
            <div className="bg-success rounded-pill" style={{ width: '8px', height: '30px' }}></div>
            <h3 className="fw-bold m-0">Verified Agricultural Insights</h3>
          </div>
          <div className="row g-4">
            <div className="col-md-6">
              <div className="p-4 bg-white rounded-4 h-100 border-start border-4 border-success shadow-sm">
                <h5 className="fw-bold text-success">Optimizing Fertilizer Usage</h5>
                <p className="text-muted mb-0">
                  Excessive Urea usage can lead to soil degradation. Always maintain an
                  <strong> N-P-K ratio of 4:2:1</strong> for sustainable soil health and better yields.
                </p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="p-4 bg-white rounded-4 h-100 border-start border-4 border-primary shadow-sm">
                <h5 className="fw-bold text-primary">Crop Insurance (PMFBY) Claims</h5>
                <p className="text-muted mb-0">
                  In case of damage due to weather, ensure you notify your bank or agricultural officer within
                  <strong> 72 hours</strong> to process your claim successfully.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FarmerHelp;