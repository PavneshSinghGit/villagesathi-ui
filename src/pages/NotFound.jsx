import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Home, Search, ArrowLeft, MessageCircle } from "lucide-react";

const NotFound = () => {
  return (
    <div className="error-wrapper d-flex align-items-center justify-content-center" 
         style={{ minHeight: '100vh', backgroundColor: '#020617', color: 'white' }}>
      <Helmet>
        <title>404 - Page Not Found | VillageSathi</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      {/* Background Decorative Elements */}
      <div className="position-absolute top-0 start-0 w-100 h-100 overflow-hidden" style={{ zIndex: 1 }}>
        <div className="hero-sphere-1" style={{ top: '10%', left: '-10%', opacity: 0.2 }}></div>
        <div className="hero-sphere-2" style={{ bottom: '10%', right: '-10%', opacity: 0.1 }}></div>
      </div>

      <div className="container text-center position-relative" style={{ zIndex: 2 }}>
        <div className="mb-4 display-1 fw-bold text-accent-gradient animate-bounce">404</div>
        <h1 className=" text-white h2 fw-bold mb-3">Oops! Maafi Chahte Hain.</h1>
        <p className="lead opacity-75 mb-5 mx-auto" style={{ maxWidth: '600px' }}>
          Jo page aap dhund rahe hain wo shayad hataya ja chuka hai ya uska naam badal gaya hai. 
          Niche diye gaye buttons se aap wapas sahi raste par ja sakte hain.
        </p>

        <div className="d-flex flex-wrap justify-content-center gap-3">
          <Link to="/" className="btn btn-warning rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2 shadow-lg">
            <Home size={18} /> Back to Home
          </Link>
          <Link to="/contact" className="btn btn-outline-light rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2">
            <MessageCircle size={18} /> Contact Support
          </Link>
        </div>

        <div className="mt-5 pt-4">
          <p className="small opacity-50">Popular Links: 
            <Link to="/sathi-market" className="text-warning ms-2 text-decoration-none small">SathiMarket</Link> | 
            <Link to="/services/GovernmentSchemes" className="text-warning ms-2 text-decoration-none small">Govt Schemes</Link>
          </p>
        </div>
      </div>

      <style>{`
        .text-accent-gradient {
          background: linear-gradient(135deg, #ea580c 0%, #f97316 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .animate-bounce {
          animation: bounce 2s infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .hero-sphere-1, .hero-sphere-2 {
          position: absolute; width: 500px; height: 500px;
          background: radial-gradient(circle, #ea580c 0%, transparent 70%);
          filter: blur(80px);
        }
      `}</style>
    </div>
  );
};

export default NotFound;