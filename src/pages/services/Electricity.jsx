import React, { useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import {
  Zap, MapPin, Info, RefreshCw, AlertTriangle, ShieldCheck,
  Clock, Phone, BookOpen, Receipt, BarChart3, Search, Lightbulb
} from "lucide-react";
import "../../styles/servicesStyles.css";

const apiClient = axios.create({ baseURL: 'https://localhost:7092' });

const formatKey = (key) => {
  const result = key.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
};

const Electricity = () => {
  const [activeTab, setActiveTab] = useState("status");
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [centers, setCenters] = useState([]);
  const [villages, setVillages] = useState([]);

  const [countryId, setCountryId] = useState("");
  const [stateId, setStateId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [centerId, setCenterId] = useState("");
  const [villageId, setVillageId] = useState("");

  const [statusData, setStatusData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // --- LOCATION FETCHING LOGIC (ORIGINAL) ---
  useEffect(() => {
    apiClient.get("/api/Electricity/location/countries")
      .then(res => setCountries(res.data))
      .catch(err => console.error("Error fetching countries:", err));
  }, []);

  useEffect(() => {
    if (countryId) {
      apiClient.get(`/api/Electricity/location/states/${countryId}`).then(res => setStates(res.data)).catch(console.error);
    }
  }, [countryId]);

  useEffect(() => {
    if (stateId) {
      apiClient.get(`/api/Electricity/location/districts/${stateId}`).then(res => setDistricts(res.data)).catch(console.error);
    }
  }, [stateId]);

  useEffect(() => {
    if (districtId) {
      apiClient.get(`/api/Electricity/supply-centers/${districtId}`).then(res => setCenters(res.data)).catch(console.error);
    }
  }, [districtId]);

  useEffect(() => {
    if (centerId) {
      apiClient.get(`/api/Electricity/villages/${centerId}`).then(res => setVillages(res.data)).catch(console.error);
    }
  }, [centerId]);

  // --- POWER CHECK LOGIC (ORIGINAL) ---
  const handleCheck = async () => {
    if (!centerId || !villageId) {
      setError("Please select both Supply Center and Village.");
      return;
    }
    setIsLoading(true);
    setError("");
    setStatusData(null);
    try {
      const res = await apiClient.get('/api/Electricity/status', {
        params: { centerId, villageId }
      });
      if (res.data.success) {
        setStatusData(res.data.data);
      } else {
        setError(res.data.message || "No records found for this village.");
      }
    } catch (err) {
      setError(`Error: ${err.response?.data?.message || "Server connection failed."}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="electricity-page container py-5">
      <Helmet>
        <title>Electricity Monitor & Bill Check | VillageSathi</title>
      </Helmet>

      {/* HEADER */}
      <div className="text-center mb-5">
        <div className="d-flex align-items-center justify-content-center gap-3 mb-3">
          <div className="icon-badge bg-success-light text-success m-0">
            <Zap size={40} className="pulse-animation" />
          </div>
          <h1 className="fw-bold display-5 m-0 text-dark">Village Power Monitor</h1>
        </div>
        <p className="text-muted fs-5 mx-auto" style={{ maxWidth: '800px' }}>
          Real-time Power Status (ON/OFF), Billing details, and Usage history for your community.
        </p>
      </div>

      {/* TABS SELECTION */}
      <div className="row justify-content-center mb-4">
        <div className="col-lg-9">
          <div className="d-flex justify-content-center gap-2 bg-white p-2 rounded-pill shadow-sm border tab-container">
            <button onClick={() => setActiveTab("status")} className={`btn rounded-pill px-4 fw-bold transition-all ${activeTab === 'status' ? 'btn-success text-white' : 'btn-light'}`}>
              <Zap size={18} className="me-2" /> Live Status
            </button>
            <button onClick={() => setActiveTab("bill")} className={`btn rounded-pill px-4 fw-bold transition-all ${activeTab === 'bill' ? 'btn-success text-white' : 'btn-light'}`}>
              <Receipt size={18} className="me-2" /> Pay Bill
            </button>
            <button onClick={() => setActiveTab("usage")} className={`btn rounded-pill px-4 fw-bold transition-all ${activeTab === 'usage' ? 'btn-success text-white' : 'btn-light'}`}>
              <BarChart3 size={18} className="me-2" /> Usage History
            </button>
          </div>
        </div>
      </div>

      <div className="row">
        {/* MAIN CONTENT AREA */}
        <div className="col-lg-12">
          <div className="card main-card shadow-lg border-0 rounded-4 overflow-hidden mb-5">
            <div className="card-header bg-dark text-white p-3 text-center border-0">
              <span className="fw-bold"><MapPin size={18} className="me-2 text-warning" /> Location Verification</span>
            </div>

            <div className="card-body p-4 p-md-5">
              {error && <div className="alert alert-danger rounded-3 mb-4 d-flex align-items-center shadow-sm"><AlertTriangle size={20} className="me-2" /> {error}</div>}

              {/* SHARED LOCATION SELECTORS */}
              <div className="row g-4">
                <div className="col-md-4">
                  <label className="form-label fw-bold text-secondary">Country</label>
                  <select className="form-select shadow-sm" value={countryId} onChange={(e) => setCountryId(e.target.value)}>
                    <option value="">Select Country</option>
                    {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold text-secondary">State</label>
                  <select className="form-select shadow-sm" value={stateId} disabled={!countryId} onChange={(e) => setStateId(e.target.value)}>
                    <option value="">Select State</option>
                    {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold text-secondary">District</label>
                  <select className="form-select shadow-sm" value={districtId} disabled={!stateId} onChange={(e) => setDistrictId(e.target.value)}>
                    <option value="">Select District</option>
                    {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold text-secondary text-success">Supply Center (Block)</label>
                  <select className="form-select shadow-sm border-success border-opacity-25" value={centerId} disabled={!districtId} onChange={(e) => setCenterId(e.target.value)}>
                    <option value="">Select Center</option>
                    {centers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold text-secondary text-success">Target Village</label>
                  <select className="form-select shadow-sm border-success border-opacity-25" value={villageId} disabled={!centerId} onChange={(e) => setVillageId(e.target.value)}>
                    <option value="">Select Village</option>
                    {villages.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                  </select>
                </div>
              </div>

              {/* --- TAB CONTENT: POWER STATUS --- */}
              {activeTab === "status" && (
                <div className="text-center mt-5">
                  <button className="btn btn-success btn-lg px-5 py-3 fw-bold shadow rounded-pill btn-check-status"
                    onClick={handleCheck} disabled={isLoading || !villageId}>
                    {isLoading ? <RefreshCw className="spinner-animation me-2" size={20} /> : <><Zap size={20} className="me-2" /> Check Live Status</>}
                  </button>

                  {statusData && (
                    <div className="status-result mt-5 animate-fade-in">
                      <div className={`status-banner p-4 rounded-4 text-center border shadow-sm ${statusData.status === 1 ? "bg-success-light border-success" :
                        statusData.status === 2 ? "bg-warning-light border-warning" : "bg-danger-light border-danger"
                        }`}>
                        {Object.entries(statusData).map(([key, value]) => {
                          if (value === null || value === '') return null;
                          if (key.toLowerCase() === 'status') {
                            return (
                              <div key={key} className="mb-2">
                                <h2 className={`display-6 fw-bold ${value === 1 ? "text-success" : value === 2 ? "text-warning" : "text-danger"}`}>
                                  {value === 1 ? "⚡ Power is ACTIVE" : value === 2 ? "🛠 Under Maintenance" : "🔌 Power is DISCONNECTED"}
                                </h2>
                              </div>
                            );
                          }
                          if (key.toLowerCase() === 'villagename') {
                            return <h4 key={key} className="text-dark fw-bold mb-4 border-bottom border-secondary border-opacity-10 pb-2">Village: {value}</h4>;
                          }
                          const isDate = key.toLowerCase().includes('date') || key.toLowerCase().includes('updated');
                          const displayValue = isDate ? new Date(value).toLocaleString() : value;
                          return (
                            <div key={key} className="info-row d-flex justify-content-between border-bottom border-dark border-opacity-10 py-3 mx-auto" style={{ maxWidth: '500px' }}>
                              <span className="text-muted fw-bold">{formatKey(key)}</span>
                              <span className="text-dark fw-bold">{displayValue}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* --- TAB CONTENT: BILL CHECK --- */}
              {activeTab === "bill" && (
                <div className="mt-5 animate-fade-in">
                  <div className="card border-0 shadow-sm rounded-4 bg-light overflow-hidden">
                    <div className="row g-0">

                      {/* Left Side: Information/Instructions */}
                      <div className="col-lg-5 bg-success text-white p-4 p-md-5 d-flex flex-column justify-content-center">
                        <div className="mb-3 bg-white bg-opacity-20 rounded-circle d-inline-flex p-3 shadow-sm" style={{ width: 'fit-content' }}>
                          <Receipt size={32} className="text-white" />
                        </div>
                        <h3 className="fw-bold mb-3">Electricity Bill Inquiry</h3>
                        <p className="opacity-75 mb-0">
                          Access your village electricity billing details instantly. Secure, fast, and transparent.
                        </p>
                        <ul className="list-unstyled mt-4 small opacity-75">
                          <li className="mb-2">✅ Real-time bill fetching</li>
                          <li className="mb-2">✅ Secure payment gateway access</li>
                          <li>✅ Detailed consumption history</li>
                        </ul>
                      </div>

                      {/* Right Side: Input Form */}
                      <div className="col-lg-7 bg-white p-4 p-md-5">
                        <h5 className="fw-bold text-dark mb-2">Find Your Bill</h5>
                        <p className="text-muted small mb-4">
                          Please enter your 10 or 12 digit <strong>Consumer Connection Number</strong> found on your latest physical bill receipt.
                        </p>

                        <div className="container mt-4">
                          <form onSubmit={(e) => e.preventDefault()}>
                            {/* Simple Row - Standard Bootstrap Grid */}
                            <div className="row g-3 align-items-end">

                              {/* Input Column (Takes 8 parts of the row) */}
                              <div className="col-md-8 col-12">
                                <label className="form-label small fw-bold text-secondary ms-2">
                                  <span style={{ color: "#ff0000" }}>*</span> CONSUMER NUMBER
                                </label>                                
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter 10-12 digit number"
                                  />
                              </div>

                              {/* Button Column (Takes 4 parts of the row) */}
                              <div className="col-md-4 col-12">
                                <button className="btn btn-success w-100 py-3 rounded-pill fw-bold shadow-sm border-0">
                                  Fetch Bill
                                </button>
                              </div>

                            </div>
                          </form>
                        </div>

                        {/* Quick Help Link */}
                        <div className="mt-4 text-center">
                          <p className="extra-small text-muted mb-0">
                            Need help finding your number? <a href="#" className="text-success fw-bold text-decoration-none border-bottom border-success">Click here</a>
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              )}

              {/* --- TAB CONTENT: USAGE --- */}
              {activeTab === "usage" && (
                <div className="mt-5 text-center animate-fade-in py-5 border rounded-4 bg-light">
                  <BarChart3 size={60} className="text-success opacity-25 mb-3" />
                  <h5 className="fw-bold">Consumption Analytics</h5>
                  <p className="text-muted">Historical usage tracking and monthly charts will be available soon for this region.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-5">
        <p className="small text-muted mb-0">Disclaimer: This tool provides estimated status based on supply center data. For critical issues, always contact local authorities.</p>
        {/* SIDEBAR WIDGETS */}
        <div className="col-lg-3">
          <div className="card border-0 shadow-sm mb-4 bg-white p-3 border-start border-4 border-danger widget-hover">
            <h6 className="fw-bold text-dark"><Phone size={18} className="me-2 text-danger" /> Emergency Support</h6>
            <hr className="my-2 opacity-25" />
            <div className="mb-2">
              <small className="d-block text-muted">National Toll-Free:</small>
              <strong className="text-danger fs-4">1912</strong>
            </div>
          </div>
        </div>
        <div className="col-lg-3">
          <div className="card border-0 shadow-sm p-4 bg-dark text-white rounded-4 widget-hover mb-4">
            <h6 className="fw-bold d-flex align-items-center mb-3">
              <Lightbulb size={18} className="me-2 text-warning" /> Power Update
            </h6>
            <div className="d-flex align-items-center mb-2">
              <span className="dot bg-success me-2"></span>
              <small className="opacity-75">Grid Stability: High</small>
            </div>
            <p className="extra-small opacity-50 mb-0">99.9% Villages electrified under Digital India Mission 2026.</p>
          </div>
        </div>
      </div>
      {/* EDUCATIONAL & FAQ */}
      <div className="row g-4 mt-2">
        <div className="col-md-6">
          <div className="card h-100 border-0 shadow-sm p-4 bg-white border-top border-4 border-success">
            <ShieldCheck className="text-success mb-3" size={32} />
            <h5 className="fw-bold text-dark">Safety Protocols</h5>
            <ul className="small text-muted ps-3 leading-relaxed">
              <li>Never touch fallen power lines. Maintain a distance of 10 meters.</li>
              <li>Dial <b>1912</b> immediately to report hazardous electrical conditions.</li>
              <li>Ensure all household wiring is grounded (Earthed) correctly.</li>
            </ul>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card h-100 border-0 shadow-sm p-4 bg-white border-top border-4 border-primary">
            <BookOpen className="text-primary mb-3" size={32} />
            <h5 className="fw-bold text-dark">Quick Troubleshooting</h5>
            <p className="small text-muted leading-relaxed">If the status shows <b>ON</b> but your house is dark, please verify your local MCB/Fuse or contact your local lineman.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Electricity;