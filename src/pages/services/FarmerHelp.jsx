import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  PhoneCall, MessageSquare, Sprout, TestTube, AlertCircle,
  HelpingHand, Tractor, Bug, Lightbulb, Users, ArrowRight,
  Leaf, ShieldCheck, Phone, CheckCircle2, Microscope, Wrench, 
  CalendarCheck, BookOpen, Info, Zap, ChevronRight, Clock, Scale
} from "lucide-react";

function FarmerHelp() {
  const [activeCategory, setActiveCategory] = useState(null);

  const categories = [
    { 
      id: "seed", 
      title: "Seed Selection", 
      subtitle: "बीज चयन",
      icon: <Sprout size={18} />, 
      color: "#128807", // Green
      detail: "Mitti aur mausam ke hisaab se best quality hybrid aur organic seeds ki jaankari taaki germination rate 95% se zyada ho."
    },
    { 
      id: "pest", 
      title: "Pest Control", 
      subtitle: "कीट नियंत्रण",
      icon: <Bug size={18} />, 
      color: "#ff9933", // Saffron
      detail: "Bio-pesticides aur sahi chemical balance ki salah jo fasal ko bachaye aur mitti ki fertility ko nuksan na pahunchaye."
    },
    { 
      id: "modern", 
      title: "Modern Farming", 
      subtitle: "आधुनिक खेती",
      icon: <Tractor size={18} />, 
      color: "#000080", // Navy Blue
      detail: "Drip irrigation, greenhouse farming, aur advanced techniques seekhein kam paani aur kam lagat mein zyada munafe ke liye."
    },
    { 
      id: "innov", 
      title: "Innovation", 
      subtitle: "कृषि नवाचार",
      icon: <Lightbulb size={18} />, 
      color: "#d9534f", // Alert/New
      detail: "Drone mapping aur AI tools ka upyog karke paramparagat kheti se hatkar ek 'Smart Farmer' banein."
    }
  ];

  return (
    <main className="animate-fade-in pb-5" style={{ backgroundColor: '#f8fafc', minHeight: '100vh', overflowX: 'hidden' }}>
      <Helmet>
        <title>Kisan Sahayata Hub | Official Farmer Advisory Portal | VillageSathi</title>
        <meta name="description" content="Official advisory for rural Indian farmers. Get expert guidance on seed selection, pest control, and modern agriculture techniques." />
      </Helmet>

      {/* --- OFFICIAL GOVT HERO SECTION --- */}
      <header className="hero-govt-slim py-4 py-md-5 position-relative" style={{ borderTop: '3px solid #128807' }}>
        <div className="container px-4 px-md-5">
          <div className="row align-items-center g-4">
            <div className="col-lg-7 text-center text-lg-start">
               <div className="d-inline-flex align-items-center govt-badge px-3 py-1 mb-3">
                 <Scale size={14} className="text-navy me-2" />
                 <span className="small fw-bold text-uppercase">कृषि परामर्श केंद्र | Agriculture Advisory Desk</span>
               </div>
               <h1 className="govt-title mb-2">
                 Kisan <span className="text-green">Sahayata</span> Hub
               </h1>
               <p className="govt-subtitle mb-0">Official Agriculture Advisory & Farmer Support Ecosystem for Rural Digital Transformation.</p>
            </div>
            <div className="col-lg-5 text-lg-end">
               <div className="d-inline-flex align-items-center bg-white border border-navy-soft p-2 px-3 shadow-sm">
                  <Clock size={16} className="text-green me-2 animate-pulse" />
                  <span className="text-navy fw-bold small" style={{ fontSize: '0.7rem' }}>LIVE: EXPERT ADVISORY ACTIVE</span>
               </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- ANNOUNCEMENT BAR --- */}
      <section className="bg-navy py-2 shadow-sm text-white">
        <div className="container px-4 px-md-5 d-flex align-items-center gap-2">
          <Zap size={14} className="text-saffron" />
          <marquee className="small fw-medium opacity-90">
            Important Notice: Soil Testing is mandatory for Fertilizer Subsidy • New CHC Machinery Booking is open for Kharif Season • Call 1800-XX-XXXX for immediate crop failure reporting.
          </marquee>
        </div>
      </section>

      <div className="container-fluid px-md-5 mt-4">
        <div className="row g-4">
          
          {/* --- SIDEBAR: OFFICIAL CHANNELS --- */}
          <aside className="col-lg-3">
            <div className="vstack gap-3 sticky-sidebar">
              
              {/* WhatsApp AI Card */}
              <div className="card-govt p-4 text-white overflow-hidden border-0" style={{ background: 'linear-gradient(135deg, #004d00, #128807)' }}>
                 <div className="position-relative z-1">
                    <div className="d-flex align-items-center gap-2 mb-3">
                        <div className="p-2 bg-white bg-opacity-20 rounded-1"><Microscope size={20}/></div>
                        <h6 className="fw-bold mb-0">Smart Disease AI</h6>
                    </div>
                    <p className="mb-4 opacity-90 small lh-base">
                      Fasal ki photo WhatsApp par bhejein, AI 60 seconds mein bimari pehchan kar upchaar batayega.
                    </p>
                    <a href="https://wa.me/919305492516" target="_blank" className="btn btn-light w-100 rounded-0 fw-bold small py-2 d-flex align-items-center justify-content-center gap-2">
                       <MessageSquare size={16} className="text-green"/> Start Diagnosis
                    </a>
                 </div>
              </div>

              {/* Machinery Services */}
              <div className="p-4 bg-white border border-top-navy shadow-sm">
                <h6 className="fw-bold mb-3 small d-flex align-items-center gap-2 text-navy">
                    <Wrench size={16} className="text-saffron"/> त्वरित सेवाएं (Quick Services)
                </h6>
                <div className="vstack gap-2">
                    <button className="btn btn-govt-light text-start small border py-2 rounded-0">Tractor Rental (CHC)</button>
                    <button className="btn btn-govt-light text-start small border py-2 rounded-0">Drone Spraying Booking</button>
                    <button className="btn btn-govt-light text-start small border py-2 rounded-0">Soil Testing Request</button>
                </div>
              </div>
            </div>
          </aside>

          {/* --- MAIN ADVISORY MODULES --- */}
          <div className="col-lg-9">
            <div className="row g-3">
              
              <div className="col-12">
                <div className="bg-white border shadow-sm p-4 rounded-1">
                  <h3 className="h6 fw-bold mb-4 text-navy text-uppercase border-bottom pb-2 d-flex align-items-center gap-2">
                    <Info size={18} className="text-green" /> Professional Guidance Modules
                  </h3>
                  <div className="row g-2">
                    {categories.map((cat) => (
                      <div className="col-6 col-md-3" key={cat.id}>
                        <div 
                          className={`p-3 border-2 transition-all cursor-pointer h-100 ${activeCategory?.id === cat.id ? 'bg-govt-light shadow-sm' : 'bg-white'}`}
                          style={{ borderColor: activeCategory?.id === cat.id ? cat.color : '#f1f5f9', borderStyle: 'solid' }}
                          onClick={() => setActiveCategory(cat)}
                        >
                          <div className="d-flex flex-column align-items-center text-center">
                             <div className="p-2 rounded-1 mb-2" style={{ backgroundColor: `${cat.color}15`, color: cat.color }}>{cat.icon}</div>
                             <h6 className="fw-bold mb-0" style={{ fontSize: '0.75rem' }}>{cat.title}</h6>
                             <span className="text-muted" style={{ fontSize: '0.6rem' }}>{cat.subtitle}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {activeCategory && (
                    <div className="mt-4 p-4 animate-fade-in border-start border-5 bg-light" style={{ borderColor: activeCategory.color }}>
                       <h6 className="fw-bold mb-2 text-navy">Technical Insight (तकनीकी जानकारी):</h6>
                       <p className="small text-muted mb-0 lh-lg">{activeCategory.detail}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Schedules & Insurance */}
              <div className="col-md-6">
                 <div className="bg-white border border-left-navy p-4 h-100 shadow-sm">
                    <h6 className="fw-bold mb-3 d-flex align-items-center gap-2 text-navy">
                        <CalendarCheck size={18} className="text-green"/> क्षेत्र भ्रमण कार्यक्रम (Field Visits)
                    </h6>
                    <div className="vstack gap-2">
                       <ScheduleRow label="Kisan Mitra Visit" val="Every Tuesday" />
                       <ScheduleRow label="Soil Health Camp" val="1st & 3rd Friday" />
                       <ScheduleRow label="Kisan Gosthi" val="Monthly (20th)" />
                    </div>
                 </div>
              </div>

              <div className="col-md-6">
                 <div className="bg-white border border-left-saffron p-4 h-100 shadow-sm">
                    <h6 className="fw-bold mb-3 d-flex align-items-center gap-2 text-navy">
                        <ShieldCheck size={18} className="text-green"/> सुरक्षा एवं फसल बीमा
                    </h6>
                    <p className="text-muted small mb-0 lh-base">
                      Fasal nuksan hone par <strong>72 ghante</strong> ke andar suchit karein. VillageSathi team aapko PMFBY claim process mein poori sahayata pradan karegi.
                    </p>
                    <button className="btn btn-link p-0 text-navy fw-bold small mt-2 text-decoration-none">Read Full Policy <ChevronRight size={14}/></button>
                 </div>
              </div>

              {/* SEO Content Section */}
              <div className="col-12 mt-2">
                <article className="bg-white p-4 border shadow-sm rounded-1">
                  <h3 className="h6 fw-bold mb-3 text-navy d-flex align-items-center">
                    <BookOpen size={18} className="text-green me-2"/> 
                    Importance of Scientific Agriculture
                  </h3>
                  <div className="row g-4">
                    <div className="col-md-6">
                      <p className="small text-muted mb-0 lh-base">
                        Paramparagat kheti mein sahi mitti ki jaanch aur mausam ke anusaar fasal ka chayan na hone se lagat badh jati hai. <strong>VillageSathi</strong> kisan aur unnat technology ke beech ki kadi hai.
                      </p>
                    </div>
                    <div className="col-md-6">
                      <p className="small text-muted mb-0 lh-base">
                        Under the <strong>Digital India</strong> mission, we empower farmers with soil health data, mandi rate analysis, and organic certification help to double their income through direct market access.
                      </p>
                    </div>
                  </div>
                </article>
              </div>

            </div>
          </div>
        </div>
      </div>

      <style>{`
        .text-saffron { color: #ff9933; }
        .text-green { color: #128807; }
        .text-navy { color: #000080; }
        .bg-navy { background-color: #000080; }
        .bg-govt-light { background-color: #f1f5f9; }
        .border-navy-soft { border: 1px solid rgba(0,0,128,0.1) !important; }
        .border-top-navy { border-top: 5px solid #000080 !important; }
        .border-left-navy { border-left: 5px solid #000080 !important; }
        .border-left-saffron { border-left: 5px solid #ff9933 !important; }

        .hero-govt-slim {
          background-color: #ffffff;
          background-image: linear-gradient(180deg, #e6f3e6 0%, #ffffff 100%);
        }
        .govt-badge { background-color: #f1f5f9; border: 1px solid #cbd5e1; color: #475569; border-radius: 4px; }
        .govt-title { font-weight: 800; font-size: 2.2rem; color: #000080; }
        .govt-subtitle { color: #475569; font-size: 1rem; }

        .btn-govt-light { background: #f8fafc; color: #000080; font-weight: 600; transition: 0.2s; }
        .btn-govt-light:hover { background: #000080; color: white; }

        @media (max-width: 768px) {
          .govt-title { font-size: 1.6rem !important; }
          .sticky-sidebar { position: relative; top: 0; }
          .container-fluid { padding-left: 15px; padding-right: 15px; }
        }
      `}</style>
    </main>
  );
}

const ScheduleRow = ({ label, val }) => (
  <div className="d-flex justify-content-between align-items-center p-2 border-bottom border-light">
    <span className="small text-muted fw-bold" style={{ fontSize: '0.7rem' }}>{label}:</span>
    <span className="badge bg-light text-navy border small fw-bold">{val}</span>
  </div>
);

export default FarmerHelp;