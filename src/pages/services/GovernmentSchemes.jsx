import React, { useState, useEffect } from "react";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import {
  Search, BookOpen, UserCheck, FileText,
  ExternalLink, Landmark, HeartPulse, GraduationCap, Tractor, CheckCircle
} from "lucide-react";
import "../../styles/servicesStyles.css";

function GovernmentSchemes() {
  const [schemes, setSchemes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const res = await axios.get("https://localhost:7092/api/GovtSchemes/GetActiveSchemes");
        setSchemes(res.data.data);
      } catch (err) {
        console.error("Error fetching schemes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSchemes();
  }, []);

  // Filter Logic - Null checks added for category
  const filteredSchemes = schemes.filter(scheme =>
    scheme.schemeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (scheme.category && scheme.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Helper to render Category Icon
  const getCategoryIcon = (category) => {
    if (!category) return <Tractor size={14} className="me-1" />; // Default for your current data
    switch (category) {
      case "Agriculture": return <Tractor size={14} className="me-1" />;
      case "Health": return <HeartPulse size={14} className="me-1" />;
      case "Education": return <GraduationCap size={14} className="me-1" />;
      default: return <BookOpen size={14} className="me-1" />;
    }
  };

  if (loading) return (
    <div className="text-center py-5 my-5">
      <div className="spinner-border text-success" role="status"></div>
      <p className="mt-2">Fetching Schemes...</p>
    </div>
  );

  return (
    <div className="schemes-page py-5 bg-light">
      <Helmet>
        <title>Government Schemes | VillageSathi</title>
      </Helmet>

      <div className="container">
        {/* --- HERO SECTION --- */}
        <div className="text-center mb-5">
          <h1 className="fw-bold display-4 mb-3">Government Schemes 🏛️</h1>
          <p className="lead text-muted mx-auto" style={{ maxWidth: '700px' }}>
            Official information about major central and state welfare initiatives.
          </p>

          <div className="row justify-content-center mt-4">
            <div className="col-md-6 col-12">
              {/* Search Wrapper: Isme border aur rounding handle hogi */}
              <div className="search-wrapper position-relative">

                {/* Search Icon: Isko absolute position kiya hai */}
                <Search
                  size={20}
                  className="position-absolute text-muted"
                  style={{ left: '20px', top: '50%', transform: 'translateY(-50%)', zIndex: '5' }}
                />

                {/* Input Field: Full Width aur standard Border-2 ke saath */}
                <input
                  type="text"
                  className="form-control ps-5 py-3 shadow-sm border-2"
                  placeholder="Search schemes (e.g. PM Kisan)..."
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    borderRadius: '50px',
                    borderColor: '#dee2e6',
                    fontSize: '1.1rem'
                  }}
                />

                {/* Optional: Clear button ya Search button andar rakhna ho toh yahan aa sakta hai */}
              </div>

              <div className="text-center mt-2">
                <small className="text-muted">
                  <i className="fa fa-lightbulb-o me-1"></i>
                  Tip: You can search by Category (Agriculture, Health) or Scheme Name.
                </small>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-lg-8">
            <div className="row g-4">
              {filteredSchemes.map(scheme => (
                <div className="col-12" key={scheme.id}>
                  <div className="card border-0 shadow-sm h-100 rounded-4 overflow-hidden border-start border-4 border-success">
                    <div className="card-body p-4">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <span className="badge bg-success bg-opacity-10 text-white px-3 py-2 rounded-pill">
                          {getCategoryIcon(scheme.category)}
                          {scheme.category || "Agriculture"}
                        </span>
                        <a href={scheme.link} target="_blank" rel="noreferrer" className="btn btn-sm btn-success rounded-pill px-3 fw-bold">
                          Apply Official <ExternalLink size={14} className="ms-1" />
                        </a>
                      </div>

                      <h3 className="h4 fw-bold text-dark mb-3">{scheme.schemeName}</h3>

                      {/* Using white-space: pre-line to handle \r\n from database */}
                      <p className="text-muted small mb-4" style={{ whiteSpace: 'pre-line' }}>
                        {scheme.description}
                      </p>

                      <div className="row g-3 pt-3 border-top">
                        <div className="col-md-6 border-end">
                          <h6 className="fw-bold small text-uppercase text-primary d-flex align-items-center">
                            <UserCheck size={16} className="me-2" /> Eligibility
                          </h6>
                          <div className="small text-muted" style={{ whiteSpace: 'pre-line' }}>
                            {scheme.eligibility}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <h6 className="fw-bold small text-uppercase text-success d-flex align-items-center">
                            <BookOpen size={16} className="me-2" /> Key Benefits
                          </h6>
                          <ul className="list-unstyled mb-0 mt-2">
                            {scheme.benefits ? (
                              scheme.benefits.split(',').map((benefit, i) => (
                                <li key={i} className="small text-muted mb-2 d-flex align-items-start">
                                  <CheckCircle size={14} className="text-success me-2 mt-1 flex-shrink-0" />
                                  {benefit.trim()}
                                </li>
                              ))
                            ) : (
                              <li className="small text-muted font-italic opacity-75">Click 'Apply Official' for detailed benefits.</li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 mb-4 bg-dark text-white p-4">
              <h5 className="fw-bold mb-3 text-warning">Required Documents</h5>
              <ul className="list-unstyled small mb-0 opacity-75">
                <li className="mb-2">● Aadhaar Card (Linked with Mobile)</li>
                <li className="mb-2">● Land Ownership Records</li>
                <li className="mb-2">● Bank Passbook</li>
                <li className="mb-2">● Income Certificate</li>
                <li>● Passport Size Photographs</li>
              </ul>
            </div>

            <div className="card border-0 shadow-sm rounded-4 p-4 text-center border-top border-4 border-warning bg-white">
              <h5 className="fw-bold mb-3"><Landmark size={20} className="me-2 text-warning" /> Find CSC Center</h5>
              <p className="small text-muted mb-4">
                Visit your nearest <strong>Common Service Center (CSC)</strong> for biometric verification and application help.
              </p>
              <button className="btn btn-warning w-100 rounded-pill fw-bold py-2 shadow-sm">Locate Jan Seva Kendra</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GovernmentSchemes;