import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../api/axiosInstance';

const ElectricityHistory = () => {
    // --- DROPDOWN DATA STATES ---
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [centers, setCenters] = useState([]);
    const [villages, setVillages] = useState([]);

    // --- SELECTED VALUES STATES ---
    const [countryId, setCountryId] = useState("");
    const [stateId, setStateId] = useState("");
    const [districtId, setDistrictId] = useState("");
    const [centerId, setCenterId] = useState("");
    const [villageId, setVillageId] = useState("");

    // --- HISTORY DATA STATES ---
    const [historyData, setHistoryData] = useState([]); // List storage
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // 1. Load Countries on Mount
    useEffect(() => {
        axiosInstance.get('/Electricity/location/countries')
            .then(res => setCountries(res.data))
            .catch(err => console.error("Error fetching countries:", err));
    }, []);

    // 2. Load States
    useEffect(() => {
        if (countryId) {
            axiosInstance.get(`/Electricity/location/states/${countryId}`)
                .then(res => setStates(res.data)).catch(console.error);
        }
    }, [countryId]);

    // 3. Load Districts
    useEffect(() => {
        if (stateId) {
            axiosInstance.get(`/Electricity/location/districts/${stateId}`)
                .then(res => setDistricts(res.data)).catch(console.error);
        }
    }, [stateId]);

    // 4. Load Supply Centers
    useEffect(() => {
        if (districtId) {
            axiosInstance.get(`/Electricity/supply-centers/${districtId}`)
                .then(res => setCenters(res.data)).catch(console.error);
        }
    }, [districtId]);

    // 5. Load Villages
    useEffect(() => {
        if (centerId) {
            axiosInstance.get(`/Electricity/villages/${centerId}`)
                .then(res => setVillages(res.data)).catch(console.error);
        }
    }, [centerId]);

    // 6. Fetch History Logic
    const handleFetchHistory = async () => {
        if (!villageId) {
            setError("Please select a village first.");
            return;
        }

        setIsLoading(true);
        setError("");
        setHistoryData([]); 

        try {
            const res = await axiosInstance.get(`/Electricity/history/${villageId}`);
            // Agar backend single object bhej raha hai toh use array mein wrap karein list dikhane ke liye
            const data = Array.isArray(res.data.data) ? res.data.data : [res.data.data];
            setHistoryData(data);
        } catch (err) {
            setError("Failed to fetch history. Please try again.");
            console.error("Fetch history error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    // Helper to format status badges
    const getStatusBadge = (status) => {
        const s = Number(status);
        if (s === 1) return <span className="badge rounded-pill bg-success">⚡ ON / Available</span>;
        if (s === 2) return <span className="badge rounded-pill bg-warning text-dark">🔧 Maintenance</span>;
        if (s === 3) return <span className="badge rounded-pill bg-danger">🌑 OFF / Cut</span>;
        return <span className="badge rounded-pill bg-secondary">Unknown</span>;
    };

    return (
        <div className="container-fluid mt-4">
            <div className="card shadow-sm border-0 rounded-4">
                <div className="card-header bg-white border-0 py-3">
                    <h4 className="mb-0 fw-bold text-dark">📜 Electricity Status History</h4>
                    <p className="text-muted small mb-0">Select a village to view previous power logs.</p>
                </div>

                <div className="card-body p-4">
                    {/* Error Alert */}
                    {error && (
                        <div className="alert alert-danger border-0 shadow-sm mb-4" role="alert">
                            <strong>Oops!</strong> {error}
                        </div>
                    )}

                    {/* --- FILTERS SECTION --- */}
                    <div className="row g-3 mb-4 p-3 bg-light rounded-3">
                        <div className="col-md">
                            <label className="form-label small fw-bold text-secondary">Country</label>
                            <select className="form-select border-0 shadow-sm" value={countryId}
                                onChange={(e) => {
                                    setCountryId(e.target.value);
                                    setStates([]); setDistricts([]); setCenters([]); setVillages([]);
                                    setStateId(""); setDistrictId(""); setCenterId(""); setVillageId("");
                                }}>
                                <option value="">Select Country</option>
                                {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="col-md">
                            <label className="form-label small fw-bold text-secondary">State</label>
                            <select className="form-select border-0 shadow-sm" value={stateId} disabled={!countryId}
                                onChange={(e) => {
                                    setStateId(e.target.value);
                                    setDistricts([]); setCenters([]); setVillages([]);
                                    setDistrictId(""); setCenterId(""); setVillageId("");
                                }}>
                                <option value="">Select State</option>
                                {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                        <div className="col-md">
                            <label className="form-label small fw-bold text-secondary">District</label>
                            <select className="form-select border-0 shadow-sm" value={districtId} disabled={!stateId}
                                onChange={(e) => {
                                    setDistrictId(e.target.value);
                                    setCenters([]); setVillages([]);
                                    setCenterId(""); setVillageId("");
                                }}>
                                <option value="">Select District</option>
                                {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                            </select>
                        </div>
                        <div className="col-md">
                            <label className="form-label small fw-bold text-secondary">Supply Center</label>
                            <select className="form-select border-0 shadow-sm" value={centerId} disabled={!districtId}
                                onChange={(e) => {
                                    setCenterId(e.target.value);
                                    setVillages([]); setVillageId("");
                                }}>
                                <option value="">Select Center</option>
                                {centers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="col-md">
                            <label className="form-label small fw-bold text-secondary text-primary">Village</label>
                            <select className="form-select border-primary border-opacity-25 shadow-sm fw-bold" value={villageId} disabled={!centerId}
                                onChange={(e) => setVillageId(e.target.value)}>
                                <option value="">Select Village</option>
                                {villages.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                            </select>
                        </div>
                        <div className="col-md-auto d-flex align-items-end">
                            <button 
                                onClick={handleFetchHistory} 
                                disabled={isLoading || !villageId}
                                className="btn btn-primary px-4 fw-bold shadow-sm w-100"
                            >
                                {isLoading ? <span className="spinner-border spinner-border-sm me-2"></span> : "Get History"}
                            </button>
                        </div>
                    </div>

                    {/* --- DATA TABLE --- */}
                    <div className="table-responsive rounded-3 border">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-dark">
                                <tr>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3">Expected Time</th>
                                    <th className="py-3">Reason / Description</th>
                                    <th className="py-3">Last Updated</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historyData.length > 0 && historyData[0] !== null ? (
                                    historyData.map((record, index) => (
                                        <tr key={index}>
                                            <td className="px-4">{getStatusBadge(record.Status)}</td>
                                            <td className="fw-semibold text-primary">{record.ExpectedTime || "N/A"}</td>
                                            <td className="text-muted small" style={{maxWidth: '300px'}}>{record.Description || "No notes provided."}</td>
                                            <td>
                                                <div className="text-dark fw-bold small">
                                                    {new Date(record.LastUpdated).toLocaleDateString()}
                                                </div>
                                                <div className="text-muted" style={{fontSize: '11px'}}>
                                                    {new Date(record.LastUpdated).toLocaleTimeString()}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="py-5 text-center">
                                            {isLoading ? (
                                                <div className="text-primary">
                                                    <div className="spinner-border spinner-border-sm me-2"></div>
                                                    Loading log history...
                                                </div>
                                            ) : (
                                                <div className="text-muted">
                                                    <i className="bi bi-info-circle me-2"></i>
                                                    No history found. Select a village and click the button.
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ElectricityHistory;