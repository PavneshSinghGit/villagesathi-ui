import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import {
  Search, BookOpen, UserCheck, FileText,
  ExternalLink, Landmark, HeartPulse, GraduationCap, Tractor, CheckCircle, AlertCircle
} from "lucide-react";
import "../../styles/servicesStyles.css";

function GovernmentSchemes() {
  const [schemes, setSchemes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/GovtSchemes/GetAll`);
        // Backend se data.data check karein
        setSchemes(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (err) {
        console.error("Error fetching schemes:", err);
        setError("Could not load schemes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchSchemes();
  }, []);

  // Filter Logic - useMemo optimized
  const filteredSchemes = useMemo(() => {
    return schemes.filter(scheme => {
      const nameMatch = scheme.schemeName?.toLowerCase().includes(searchTerm.toLowerCase());
      const categoryMatch = scheme.category?.toLowerCase().includes(searchTerm.toLowerCase());
      return nameMatch || categoryMatch;
    });
  }, [schemes, searchTerm]);

  // Helper to render Category Icon
  const getCategoryIcon = (category) => {
    const cat = category?.toLowerCase();
    switch (cat) {
      case "agriculture": return <Tractor size={14} className="me-1" />;
      case "health": return <HeartPulse size={14} className="me-1" />;
      case "education": return <GraduationCap size={14} className="me-1" />;
      default: return <BookOpen size={14} className="me-1" />;
    }
  };

  if (loading) return (
    <div className="text-center py-5 my-5">
      <div className="spinner-border text-success" role="status"></div>
      <p className="mt-2 text-muted fw-bold">Fetching Schemes...</p>
    </div>
  );

  if (error) return (
    <div className="text-center py-5 my-5">
      <AlertCircle size={48} className="text-danger mb-3" />
      <h3 className="text-dark">{error}</h3>
      <button className="btn btn-success mt-3" onClick={() => window.location.reload()}>Retry</button>
    </div>
  );

  return (
    <div className="schemes-page py-5 bg-light">
      <Helmet>
        <title>Government Schemes | VillageSathi</title>
        <meta name="description" content="Official information about PM-Kisan, Awas Yojana, and other welfare initiatives." />
      </Helmet>

      <div className="container">
        {/* --- HERO SECTION --- */}
        <div className="text-center mb-5">
          <h5 className="fw-bold display-4 mb-3">Government Schemes 🏛️</h5>
          <p className="lead text-muted mx-auto" style={{ maxWidth: '700px' }}>
            Official information about major central and state welfare initiatives for rural empowerment.
          </p>

          <div className="row justify-content-center mt-4">
            <div className="col-md-6 col-12">
              <div className="search-wrapper position-relative">
                <Search
                  size={20}
                  className="position-absolute text-muted"
                  style={{ left: '20px', top: '50%', transform: 'translateY(-50%)', zIndex: '5' }}
                />
                <input
                  type="text"
                  className="form-control ps-5 py-3 shadow-sm border-2"
                  placeholder="Search schemes (e.g. PM Kisan)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ borderRadius: '50px', borderColor: '#dee2e6', fontSize: '1.1rem' }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-lg-8">
            <div className="row g-4">
              {filteredSchemes.length > 0 ? (
                filteredSchemes.map(scheme => (
                  <div className="col-12" key={scheme.id}>
                    <div className="card border-0 shadow-sm h-100 rounded-4 overflow-hidden border-start border-4 border-success bg-white">
                      <div className="card-body p-4">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill d-flex align-items-center">
                            {getCategoryIcon(scheme.category)}
                            {scheme.category || "General"}
                          </span>
                          <a href={scheme.link} target="_blank" rel="noreferrer" className="btn btn-sm btn-success rounded-pill px-3 fw-bold shadow-sm">
                            Apply Official <ExternalLink size={14} className="ms-1" />
                          </a>
                        </div>

                        <h3 className="h4 fw-bold text-dark mb-3">{scheme.schemeName}</h3>

                        <p className="text-muted small mb-4" style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>
                          {scheme.description || "Information currently being updated."}
                        </p>

                        <div className="row g-3 pt-3 border-top">
                          <div className="col-md-6 border-end-md">
                            <h6 className="fw-bold small text-uppercase text-primary d-flex align-items-center mb-2">
                              <UserCheck size={16} className="me-2" /> Eligibility
                            </h6>
                            <div className="small text-muted" style={{ whiteSpace: 'pre-line' }}>
                              {scheme.eligibility || "Standard eligibility rules apply."}
                            </div>
                          </div>
                          <div className="col-md-6 ps-md-4">
                            <h6 className="fw-bold small text-uppercase text-success d-flex align-items-center mb-2">
                              <BookOpen size={16} className="me-2" /> Key Benefits
                            </h6>
                            <ul className="list-unstyled mb-0">
                              {scheme.benefits ? (
                                scheme.benefits.split(',').map((benefit, i) => (
                                  <li key={i} className="small text-muted mb-2 d-flex align-items-start">
                                    <CheckCircle size={14} className="text-success me-2 mt-1 flex-shrink-0" />
                                    {benefit.trim()}
                                  </li>
                                ))
                              ) : (
                                <li className="small text-muted opacity-75">Contact nearest CSC for benefit details.</li>
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-5 bg-white rounded-4 shadow-sm">
                  <p className="text-muted mb-0">No schemes found matching "{searchTerm}"</p>
                </div>
              )}
            </div>
          </div>

          {/* --- SIDEBAR --- */}
          <div className="col-lg-4">
            <div className="sticky-top" style={{ top: '20px', zIndex: '1' }}>
              <div className="card border-0 shadow-sm rounded-4 mb-4 bg-dark text-white p-4">
                <h5 className="fw-bold mb-3 text-warning">Required Documents</h5>
                <ul className="list-unstyled small mb-0 opacity-75">
                  <li className="mb-2">● Aadhaar Card (Linked with Mobile)</li>
                  <li className="mb-2">● Land Ownership Records (Bhulekh)</li>
                  <li className="mb-2">● Active Bank Passbook</li>
                  <li className="mb-2">● Income & Domicile Certificate</li>
                  <li>● Recent Passport Size Photographs</li>
                </ul>
              </div>

              <div className="card border-0 shadow-sm rounded-4 p-4 text-center border-top border-4 border-warning bg-white">
                <h5 className="fw-bold mb-3"><Landmark size={20} className="me-2 text-warning" /> Find CSC Center</h5>
                <p className="small text-muted mb-4">
                  Visit your nearest <strong>Jan Seva Kendra</strong> for biometric verification and application support.
                </p>
                <a href="https://locator.csccloud.in/" target="_blank" rel="noreferrer" className="btn btn-warning w-100 rounded-pill fw-bold py-2 shadow-sm">
                  Locate CSC Center
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GovernmentSchemes;