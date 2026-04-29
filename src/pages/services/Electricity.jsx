import React, { useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import {
  Zap, MapPin, RefreshCw, AlertTriangle, ShieldCheck,
  Phone, Lightbulb, Receipt, BarChart3
} from "lucide-react";
import "../../styles/servicesStyles.css";

const apiClient = axios.create({ baseURL: import.meta.env.VITE_API_URL });

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

  // Location Fetching Logic
  useEffect(() => {
    apiClient.get("/Electricity/location/countries")
      .then(res => setCountries(res.data))
      .catch(err => console.error("Error fetching countries:", err));
  }, []);

  useEffect(() => {
    if (countryId) {
      apiClient.get(`/Electricity/location/states/${countryId}`).then(res => setStates(res.data)).catch(console.error);
    }
  }, [countryId]);

  useEffect(() => {
    if (stateId) {
      apiClient.get(`/Electricity/location/districts/${stateId}`).then(res => setDistricts(res.data)).catch(console.error);
    }
  }, [stateId]);

  useEffect(() => {
    if (districtId) {
      apiClient.get(`/Electricity/supply-centers/${districtId}`).then(res => setCenters(res.data)).catch(console.error);
    }
  }, [districtId]);

  useEffect(() => {
    if (centerId) {
      apiClient.get(`/Electricity/villages/${centerId}`).then(res => setVillages(res.data)).catch(console.error);
    }
  }, [centerId]);

  const handleCheck = async () => {
    if (!centerId || !villageId) {
      setError("Please select both Supply Center and Village.");
      return;
    }
    setIsLoading(true);
    setError("");
    setStatusData(null);
    try {
      const res = await apiClient.get('/Electricity/status', {
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
    <div className="electricity-page container-fluid container-md py-4 py-md-5">
      <Helmet>
        <title>Electricity Monitor | VillageSathi</title>
        <meta name="description" content="Check real-time power status and billing for your village." />
      </Helmet>

      {/* HEADER */}
      <div className="text-center mb-4 mb-md-5 px-2">
        <div className="d-flex align-items-center justify-content-center flex-column flex-sm-row gap-2 gap-md-3 mb-3">
          <div className="icon-badge bg-success-light text-success m-0 shadow-sm">
            <Zap size={32} className="pulse-animation" />
          </div>
          <h1 className="fw-bold fs-2 fs-md-1 m-0 text-dark tracking-tight">Village Power Monitor</h1>
        </div>
        <p className="text-muted fs-6 fs-md-5 mx-auto" style={{ maxWidth: '800px' }}>
          Real-time Power Status, Billing, and Usage history.
        </p>
      </div>

      {/* TABS - Responsive Scrollable */}
      <div className="row justify-content-center mb-4 px-2">
        <div className="col-12 col-md-10 col-lg-8">
          {/* Container: Mobile par padding-1 aur Laptop par padding-2 */}
          <div className="d-flex justify-content-between justify-content-md-center gap-1 gap-md-2 bg-white p-1 p-md-2 rounded-pill shadow-sm border">

            <button
              onClick={() => setActiveTab("status")}
              className={`btn flex-fill flex-md-grow-0 rounded-pill px-2 px-md-4 py-2 fw-bold text-nowrap transition-all border-0 ${activeTab === 'status' ? 'btn-success text-white shadow' : 'btn-light text-secondary'
                }`}
              style={{ fontSize: 'clamp(0.75rem, 3vw, 1rem)' }}
            >
              <Zap size={16} className="me-1 d-none d-sm-inline" /> Status
            </button>

            <button
              onClick={() => setActiveTab("bill")}
              className={`btn flex-fill flex-md-grow-0 rounded-pill px-2 px-md-4 py-2 fw-bold text-nowrap transition-all border-0 ${activeTab === 'bill' ? 'btn-success text-white shadow' : 'btn-light text-secondary'
                }`}
              style={{ fontSize: 'clamp(0.75rem, 3vw, 1rem)' }}
            >
              <Receipt size={16} className="me-1 d-none d-sm-inline" /> Bill
            </button>

            <button
              onClick={() => setActiveTab("usage")}
              className={`btn flex-fill flex-md-grow-0 rounded-pill px-2 px-md-4 py-2 fw-bold text-nowrap transition-all border-0 ${activeTab === 'usage' ? 'btn-success text-white shadow' : 'btn-light text-secondary'
                }`}
              style={{ fontSize: 'clamp(0.75rem, 3vw, 1rem)' }}
            >
              <BarChart3 size={16} className="me-1 d-none d-sm-inline" /> Usage
            </button>

          </div>
        </div>
      </div>

      {/* MAIN CARD */}
      <div className="card main-card shadow-sm border-0 rounded-4 overflow-hidden mb-4 mx-1">
        <div className="card-header bg-dark text-white py-3 text-center border-0">
          <span className="fw-bold small text-uppercase tracking-wider">
            <MapPin size={16} className="me-2 text-warning" /> Location Verification
          </span>
        </div>

        <div className="card-body p-3 p-md-5">
          {error && <div className="alert alert-danger rounded-3 mb-4 d-flex align-items-center shadow-sm small">
            <AlertTriangle size={18} className="me-2 flex-shrink-0" /> {error}
          </div>}

          {/* SELECTORS GRID */}
          <div className="row g-3">
            <div className="col-12 col-md-4">
              <label className="form-label small fw-bold text-secondary">Country</label>
              <select className="form-select form-select-md shadow-sm" value={countryId} onChange={(e) => setCountryId(e.target.value)}>
                <option value="">Select</option>
                {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="col-6 col-md-4">
              <label className="form-label small fw-bold text-secondary">State</label>
              <select className="form-select form-select-md shadow-sm" value={stateId} disabled={!countryId} onChange={(e) => setStateId(e.target.value)}>
                <option value="">Select</option>
                {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="col-6 col-md-4">
              <label className="form-label small fw-bold text-secondary">District</label>
              <select className="form-select form-select-md shadow-sm" value={districtId} disabled={!stateId} onChange={(e) => setDistrictId(e.target.value)}>
                <option value="">Select</option>
                {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label small fw-bold text-success">Supply Center</label>
              <select className="form-select form-select-md shadow-sm border-success border-opacity-25" value={centerId} disabled={!districtId} onChange={(e) => setCenterId(e.target.value)}>
                <option value="">Select Center</option>
                {centers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label small fw-bold text-success">Village</label>
              <select className="form-select form-select-md shadow-sm border-success border-opacity-25" value={villageId} disabled={!centerId} onChange={(e) => setVillageId(e.target.value)}>
                <option value="">Select Village</option>
                {villages.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
              </select>
            </div>
          </div>

          {/* STATUS SECTION */}
          {activeTab === "status" && (
            <div className="text-center mt-4">
              <div className="row justify-content-center">
                <div className="col-12 col-md-6 px-4">
                  <button
                    className="btn btn-success w-100 py-3 shadow-sm rounded-pill d-flex align-items-center justify-content-center fw-bold"
                    onClick={handleCheck}
                    disabled={isLoading || !villageId}
                  >
                    {isLoading ? <RefreshCw className="spinner-animation me-2" size={20} /> : <><Zap size={20} className="me-2" /> Check Status</>}
                  </button>
                </div>
              </div>

              {statusData && (
                <div className="status-result mt-4 animate-fade-in px-2 px-md-0">
                  {/* Step 1: Pehle status value nikal lo (Case insensitive aur Number safe) */}
                  {(() => {
                    // Status dhundne ke liye logic (chahe key 'status' ho ya 'Status')
                    const rawStatus = Object.entries(statusData).find(([k]) => k.toLowerCase() === 'status')?.[1];
                    const s = Number(rawStatus);

                    // Card ka color decide karo
                    const bannerClass = s === 1 ? "bg-success border-success text-white"
                      : s === 2 ? "bg-warning border-warning text-dark"
                        : s === 3 ? "bg-danger border-danger text-white"
                          : "bg-secondary border-secondary text-white";

                    return (
                      <div
                        className={`status-banner rounded-4 text-center border shadow-lg mx-auto transition-all p-3 p-md-4 ${bannerClass}`}
                        style={{ maxWidth: '550px', width: '100%' }}
                      >
                        {Object.entries(statusData).map(([key, value]) => {
                          if (value === null || value === '') return null;

                          // --- 2. MATCHING THE KEY 'status' ---
                          if (key.toLowerCase() === 'status') {
                            const val = Number(value);
                            return (
                              <div key={key} className="mb-3">
                                <div className={`d-inline-block rounded-circle p-3 mb-2 ${val === 2 ? "bg-dark bg-opacity-10" : "bg-white bg-opacity-25"
                                  }`}>
                                  <Zap size={32} className="pulse-animation" />
                                </div>
                                <h2 className="fs-3 fs-md-2 fw-bolder mb-0 tracking-tight">
                                  {val === 1 ? "POWER ACTIVE" : val === 2 ? "MAINTENANCE" : val === 3 ? "POWER OFF" : "UNKNOWN"}
                                </h2>
                                <p className="small opacity-75 mb-0 fw-medium">
                                  {val === 1 ? "🟢 Available" : val === 2 ? "🟠 Work in Progress" : val === 3 ? "🔴 Cut" : ""}
                                </p>
                              </div>
                            );
                          }

                          // --- 3. MATCHING VILLAGE NAME ---
                          if (key.toLowerCase() === 'villagename') {
                            return (
                              <div key={key} className="py-2 mb-3 border-top border-bottom border-white border-opacity-25 bg-black bg-opacity-10 rounded-2">
                                <span className="fw-bold text-uppercase tracking-wider small">
                                  📍 Village: {value}
                                </span>
                              </div>
                            );
                          }

                          // --- 4. OTHER DATA ROWS ---
                          const isDate = key.toLowerCase().includes('date') || key.toLowerCase().includes('updated');
                          return (
                            <div key={key} className="d-flex justify-content-between align-items-center py-2 border-bottom border-white border-opacity-10">
                              <span className="small opacity-75 fw-bold text-uppercase text-start" style={{ fontSize: '0.65rem' }}>
                                {formatKey(key)}
                              </span>
                              <span className="small fw-bolder text-end ms-2">
                                {isDate ? new Date(value).toLocaleDateString() : value}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}

          {/* BILL SECTION */}
          {activeTab === "bill" && (
            <div className="mt-4 animate-fade-in">
              <div className="card border-0 shadow-sm rounded-4 bg-light overflow-hidden">
                <div className="row g-0">
                  <div className="col-12 col-lg-5 bg-success text-white p-4 d-flex flex-column justify-content-center">
                    <h4 className="fw-bold mb-2">Bill Inquiry</h4>
                    <p className="small opacity-75 mb-0">Get instant access to your electricity billing details.</p>
                  </div>
                  <div className="col-12 col-lg-7 bg-white p-4">
                    <form className="row g-2 align-items-end" onSubmit={(e) => e.preventDefault()}>
                      <div className="col-12 col-sm-8">
                        <label className="form-label small fw-bold text-secondary">Consumer Number</label>
                        <input type="text" className="form-control" placeholder="10-12 digit ID" />
                      </div>
                      <div className="col-12 col-sm-4">
                        <button className="btn btn-success w-100 py-2 rounded-pill fw-bold">Fetch Bill</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* USAGE SECTION */}
          {activeTab === "usage" && (
            <div className="mt-4 text-center animate-fade-in py-5 border rounded-4 bg-light">
              <BarChart3 size={48} className="text-success opacity-25 mb-3" />
              <h5 className="fw-bold">Consumption Analytics</h5>
              <p className="text-muted small">Analytics will be available once your smart meter is linked.</p>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER WIDGETS */}
      <div className="row g-3 px-2">
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card h-100 border-0 shadow-sm p-3 border-start border-4 border-danger">
            <h6 className="fw-bold mb-2 small"><Phone size={16} className="me-2 text-danger" /> Emergency</h6>
            <strong className="text-danger fs-5">1912</strong>
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card h-100 border-0 shadow-sm p-3 bg-dark text-white rounded-4">
            <h6 className="fw-bold small mb-1"><Lightbulb size={16} className="me-2 text-warning" /> Power Grid</h6>
            <small className="opacity-75">Status: Stable</small>
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-6">
          <div className="card h-100 border-0 shadow-sm p-3 bg-white border-top border-4 border-success">
            <h6 className="fw-bold small"><ShieldCheck className="text-success me-2" size={16} /> Safety Reminder</h6>
            <p className="extra-small text-muted mb-0">Never touch loose wires. Report hazards immediately to 1912.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Electricity;