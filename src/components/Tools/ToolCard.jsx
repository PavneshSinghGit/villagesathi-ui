import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const ToolCard = ({ tool }) => {
  return (
    <div className="col-md-6 col-lg-4">
      <div className="card h-100 border-0 shadow-sm rounded-4 transition-hover overflow-hidden bg-white">
        <div className="card-body p-4">
          {/* Icon & Badge Header */}
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div 
              className="p-3 rounded-3 d-flex align-items-center justify-content-center" 
              style={{ backgroundColor: `${tool.color}15`, color: tool.color }}
            >
              {tool.icon}
            </div>
            {tool.badge && (
              <span 
                className="badge rounded-pill fw-bold" 
                style={{ 
                  backgroundColor: `${tool.color}20`, 
                  color: tool.color, 
                  fontSize: '0.65rem',
                  letterSpacing: '0.5px' 
                }}
              >
                {tool.badge.toUpperCase()}
              </span>
            )}
          </div>

          {/* Content */}
          <h5 className="fw-bold text-dark mb-2">{tool.title}</h5>
          <p className="small text-muted mb-4 lh-base" style={{ minHeight: '40px' }}>
            {tool.desc}
          </p>
          
          {/* Action Link */}
          <Link 
            to={tool.path} 
            className="btn btn-light w-100 rounded-pill fw-bold small d-flex align-items-center justify-content-center gap-2 py-2 border transition-all hover-btn"
            style={{ fontSize: '0.85rem' }}
          >
            Sahi Tool Chunein <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <style>{`
        .transition-hover { 
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease; 
        }
        .transition-hover:hover { 
          transform: translateY(-8px); 
          box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important; 
        }
        .hover-btn:hover {
          background-color: #000 !important;
          color: #fff !important;
          border-color: #000 !important;
        }
      `}</style>
    </div>
  );
};

export default ToolCard;