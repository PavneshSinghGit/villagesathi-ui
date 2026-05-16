import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { 
  FileText, Calculator, Zap, ArrowRight, 
  Briefcase, ShieldCheck, Globe, Info, Scale, ChevronRight
} from "lucide-react";

const ToolsHome = () => {
  const tools = [
    {
      id: "resume-builder",
      title: "Professional Resume Builder",
      subtitle: "बायोडाटा मेकर",
      desc: "Gaon ke youth ke liye professional resume banayein aur rojgar ke avsar payein.",
      icon: <FileText size={24} />,
      path: "/tools/resume-builder",
      color: "#000080", // Navy Blue
      badge: "POPULAR"
    },    
   {
      id: "agri-calculator",
      title: "Agri-Input Calculator",
      subtitle: "कृषि गणना यंत्र",
      desc: "Khet ke liye sahi matra mein urea aur DAP ki ganana karein aur lagat kam karein.",
      icon: <Calculator size={24} />,
      path: "/tools/agri-calc",
      color: "#128807", // Green
      badge: "NEW LIVE" 
    },
    {
      id: "power-status",
      title: "Smart Power Tracker",
      subtitle: "बिजली ट्रैकर",
      desc: "Apne gaon ki bijli ka live status aur grid health check karein IoT sensors ke dwara.",
      icon: <Zap size={24} />,
      path: "/services/electricity",
      color: "#ff9933", // Saffron
      badge: "VERIFIED"
    }
  ];

  return (
    <main className="animate-fade-in pb-5" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Helmet>
        <title>Utility Hub | Official Rural Digital Tools | VillageSathi</title>
        <meta name="description" content="Access official digital tools for rural Bharat including Agri-calculators, Resume builders, and Power trackers." />
      </Helmet>

      {/* --- OFFICIAL GOVT STYLE HERO --- */}
      <header className="tools-hero-govt py-5 text-center position-relative">
        <div className="container px-4">
          <div className="d-inline-flex align-items-center govt-badge px-3 py-1 mb-3">
            <Scale size={14} className="text-navy me-2" />
            <span className="small fw-bold text-uppercase">डिजिटल टूलकिट | Rural Digital Toolkit</span>
          </div>
          <h1 className="govt-title mb-2">
            Digital <span className="text-navy">Utility</span> Hub
          </h1>
          <p className="govt-subtitle mx-auto mb-0" style={{ maxWidth: '750px' }}>
            VillageSathi ke verified digital tools ka upyog karke apne dainik karyon ko saral banayein. 
            Sarkari yojanaon se lekar career tak, sabhi samadhan ek jagah.
          </p>
        </div>
      </header>

      {/* --- OFFICIAL STATUS BAR --- */}
      <section className="bg-navy py-2 text-white shadow-sm">
        <div className="container px-4 d-flex align-items-center gap-2">
          <Info size={16} className="text-saffron" />
          <marquee className="small fw-medium opacity-90">
            Latest: Agri-Input Calculator now supports regional soil variants • Professional Resume Builder updated with new job-ready templates • Live Power Tracker active for 500+ Panchayats.
          </marquee>
        </div>
      </section>

      {/* --- TOOLS GRID --- */}
      <section className="container py-5">
        <div className="row g-4">
          {tools.map((tool) => (
            <div className="col-lg-4 col-md-6" key={tool.id}>
              <div className="govt-tool-card h-100 bg-white border shadow-sm p-4 transition-hover position-relative overflow-hidden">
                {tool.badge && (
                  <div className="govt-badge-tool" style={{ backgroundColor: tool.color }}>
                    {tool.badge}
                  </div>
                )}
                
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div className="icon-wrap-govt d-flex align-items-center justify-content-center" 
                       style={{ backgroundColor: `${tool.color}10`, color: tool.color }}>
                    {tool.icon}
                  </div>
                  <div>
                    <h5 className="fw-bold text-navy mb-0">{tool.title}</h5>
                    <span className="text-muted fw-bold" style={{ fontSize: '0.65rem' }}>{tool.subtitle}</span>
                  </div>
                </div>
                
                <p className="text-muted small mb-4 lh-base" style={{ minHeight: '3rem' }}>
                  {tool.desc}
                </p>
                
                <Link 
                  to={tool.path} 
                  className="btn btn-navy-outline w-100 rounded-1 py-2 fw-bold small d-flex align-items-center justify-content-center gap-2 transition-all"
                >
                  टूल का उपयोग करें (Open Tool) <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* --- TRUST & MISSION SIGNALS (For AdSense Approval) --- */}
        <div className="mt-5 p-4 bg-white border shadow-sm rounded-1 text-center">
           <h6 className="text-navy fw-bold mb-4 text-uppercase border-bottom pb-2 d-inline-block">Digital India Mission Support</h6>
           <div className="row g-3 justify-content-center opacity-75">
              <div className="col-6 col-md-3">
                 <div className="d-flex align-items-center justify-content-center gap-2">
                    <ShieldCheck size={18} className="text-green" />
                    <span className="small fw-bold text-navy">100% SECURE</span>
                 </div>
              </div>
              <div className="col-6 col-md-3">
                 <div className="d-flex align-items-center justify-content-center gap-2">
                    <Globe size={18} className="text-navy" />
                    <span className="small fw-bold text-navy">RURAL CONNECT</span>
                 </div>
              </div>
              <div className="col-6 col-md-3">
                 <div className="d-flex align-items-center justify-content-center gap-2">
                    <Briefcase size={18} className="text-saffron" />
                    <span className="small fw-bold text-navy">CAREER ASSIST</span>
                 </div>
              </div>
           </div>
        </div>
      </section>

      <style>{`
        /* Official Color Palette */
        .text-navy { color: #000080; }
        .text-saffron { color: #ff9933; }
        .text-green { color: #128807; }
        .bg-navy { background-color: #000080; }
        
        /* Hero Styling */
        .tools-hero-govt {
          background-color: #ffffff;
          background-image: linear-gradient(180deg, #fef2e0 0%, #ffffff 100%);
          border-top: 3px solid #ff9933;
        }
        .govt-badge { background-color: #f1f5f9; border: 1px solid #cbd5e1; color: #475569; border-radius: 4px; }
        .govt-title { font-weight: 800; font-size: 2.2rem; color: #000080; }
        .govt-subtitle { color: #475569; font-size: 1rem; line-height: 1.6; }

        /* Card Styling */
        .govt-tool-card {
          border-radius: 4px;
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
        }
        .govt-tool-card:hover {
          border-color: #000080;
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,128,0.05) !important;
        }
        .icon-wrap-govt {
          width: 52px;
          height: 52px;
          border-radius: 8px;
        }

        .govt-badge-tool {
          position: absolute;
          top: 0;
          right: 0;
          color: white;
          font-size: 0.55rem;
          font-weight: 900;
          padding: 3px 10px;
          border-bottom-left-radius: 8px;
          letter-spacing: 1px;
        }

        .btn-navy-outline {
          border: 1px solid #000080;
          color: #000080;
          background: transparent;
        }
        .btn-navy-outline:hover {
          background: #000080;
          color: white;
        }

        @media (max-width: 768px) {
          .govt-title { font-size: 1.7rem !important; }
          .container { padding-left: 15px; padding-right: 15px; }
        }
      `}</style>
    </main>
  );
};

export default ToolsHome;