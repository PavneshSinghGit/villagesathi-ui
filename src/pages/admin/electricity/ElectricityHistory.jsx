import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../api/axiosInstance';
import { 
    History, 
    Search, 
    Zap, 
    Wrench, 
    Moon, 
    Clock, 
    FileText, 
    Calendar,
    Loader2,
    MapPin,
    ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ElectricityHistory = () => {
    const navigate = useNavigate();
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
    const [historyData, setHistoryData] = useState([]); 
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        axiosInstance.get('/Electricity/location/countries')
            .then(res => setCountries(res.data))
            .catch(err => console.error("Error fetching countries:", err));
    }, []);

    useEffect(() => {
        if (countryId) {
            axiosInstance.get(`/Electricity/location/states/${countryId}`)
                .then(res => setStates(res.data)).catch(console.error);
        }
    }, [countryId]);

    useEffect(() => {
        if (stateId) {
            axiosInstance.get(`/Electricity/location/districts/${stateId}`)
                .then(res => setDistricts(res.data)).catch(console.error);
        }
    }, [stateId]);

    useEffect(() => {
        if (districtId) {
            axiosInstance.get(`/Electricity/supply-centers/${districtId}`)
                .then(res => setCenters(res.data)).catch(console.error);
        }
    }, [districtId]);

    useEffect(() => {
        if (centerId) {
            axiosInstance.get(`/Electricity/villages/${centerId}`)
                .then(res => setVillages(res.data)).catch(console.error);
        }
    }, [centerId]);

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
            const data = Array.isArray(res.data.data) ? res.data.data : [res.data.data];
            setHistoryData(data);
        } catch (err) {
            setError("Failed to fetch history logs.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const s = Number(status);
        const baseStyle = { padding: '4px 12px', borderRadius: '50px', fontSize: '0.7rem', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '6px' };
        
        if (s === 1) return <span style={{ ...baseStyle, backgroundColor: '#f0fdf4', color: '#16a34a' }}><Zap size={12}/> POWER ON</span>;
        if (s === 2) return <span style={{ ...baseStyle, backgroundColor: '#fff7ed', color: '#ea580c' }}><Wrench size={12}/> MAINTENANCE</span>;
        if (s === 3) return <span style={{ ...baseStyle, backgroundColor: '#fef2f2', color: '#ef4444' }}><Moon size={12}/> OUTAGE</span>;
        return <span style={{ ...baseStyle, backgroundColor: '#f1f5f9', color: '#64748b' }}>UNKNOWN</span>;
    };

    return (
        <div className="container-fluid py-4 px-md-5" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            <style>{`
                .history-hero {
                    background: #0f172a;
                    border-radius: 20px;
                    padding: 20px 30px;
                    border-bottom: 4px solid #ea580c;
                    margin-bottom: 30px;
                }
                .filter-panel-premium {
                    background: white;
                    border-radius: 16px;
                    border: 1px solid #e2e8f0;
                    padding: 15px;
                    margin-top: -20px;
                    position: relative;
                    z-index: 10;
                }
                .input-premium-history {
                    border-radius: 8px;
                    border: 1px solid #e2e8f0;
                    padding: 8px 12px;
                    font-size: 0.85rem;
                    font-weight: 600;
                    background: #f8fafc;
                }
                .input-premium-history:focus {
                    border-color: #ea580c;
                    box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.05);
                    outline: none;
                }
                .table-premium-history thead th {
                    background: #f8fafc;
                    font-size: 0.65rem;
                    font-weight: 800;
                    color: #64748b;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    padding: 12px 15px;
                    border: none;
                }
                .table-premium-history tbody td {
                    padding: 12px 15px;
                    font-size: 0.85rem;
                    border-bottom: 1px solid #f1f5f9;
                }
                .btn-history-fetch {
                    background: #0f172a;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-weight: 700;
                    font-size: 0.85rem;
                    height: 38px;
                    transition: 0.3s;
                }
                .btn-history-fetch:hover:not(:disabled) {
                    background: #ea580c;
                    transform: translateY(-1px);
                }
                .text-xxs { font-size: 0.65rem; font-weight: 800; letter-spacing: 0.5px; }
            `}</style>

            {/* Header Section */}
            <div className="history-hero shadow-lg">
                <div className="row align-items-center">
                    <div className="col-md-8">
                        <button className="btn btn-link text-white-50 p-0 mb-2 text-decoration-none d-flex align-items-center small fw-bold" onClick={() => navigate(-1)}>
                            <ArrowLeft size={14} className="me-1" /> BACK
                        </button>
                        <div className="d-flex align-items-center gap-3">
                            <div className="p-2 rounded-3" style={{background: 'rgba(234, 88, 12, 0.15)'}}>
                                <History size={24} style={{color: '#ea580c'}} />
                            </div>
                            <div>
                                <h3 className="text-white fw-bold mb-0">Power Supply Logs</h3>
                                <p className="text-white-50 small mb-0 fw-bold uppercase">Audit trail of village electricity status</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Compact Filter Panel */}
            <div className="filter-panel-premium shadow-sm mb-4">
                <div className="row g-2 align-items-end">
                    <div className="col-md">
                        <label className="text-xxs text-muted uppercase mb-1">Country</label>
                        <select className="form-select input-premium-history" value={countryId}
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
                        <label className="text-xxs text-muted uppercase mb-1">State</label>
                        <select className="form-select input-premium-history" value={stateId} disabled={!countryId}
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
                        <label className="text-xxs text-muted uppercase mb-1">District</label>
                        <select className="form-select input-premium-history" value={districtId} disabled={!stateId}
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
                        <label className="text-xxs text-muted uppercase mb-1">Center</label>
                        <select className="form-select input-premium-history" value={centerId} disabled={!districtId}
                            onChange={(e) => {
                                setCenterId(e.target.value);
                                setVillages([]); setVillageId("");
                            }}>
                            <option value="">Select Center</option>
                            {centers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div className="col-md">
                        <label className="text-xxs text-orange-600 fw-bold uppercase mb-1">Target Village</label>
                        <select className="form-select input-premium-history border-warning border-opacity-50" value={villageId} disabled={!centerId}
                            onChange={(e) => setVillageId(e.target.value)}>
                            <option value="">Choose Village</option>
                            {villages.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                        </select>
                    </div>
                    <div className="col-md-auto">
                        <button 
                            onClick={handleFetchHistory} 
                            disabled={isLoading || !villageId}
                            className="btn-history-fetch px-4 w-100 d-flex align-items-center gap-2"
                        >
                            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                            FETCH LOGS
                        </button>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="alert alert-danger border-0 shadow-sm py-2 small fw-bold mb-4">
                    ⚠️ {error}
                </div>
            )}

            {/* Data Table */}
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                <div className="table-responsive">
                    <table className="table table-premium-history align-middle m-0">
                        <thead>
                            <tr>
                                <th className="ps-4">Grid Status</th>
                                <th>Expected Recovery</th>
                                <th>Description / Reason</th>
                                <th className="pe-4">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody>
                            {historyData.length > 0 && historyData[0] !== null ? (
                                historyData.map((record, index) => (
                                    <tr key={index} className="hover-row">
                                        <td className="ps-4">{getStatusBadge(record.Status)}</td>
                                        <td>
                                            <div className="d-flex align-items-center gap-2 fw-bold text-dark">
                                                <Clock size={14} className="text-muted" />
                                                {record.ExpectedTime || "N/A"}
                                            </div>
                                        </td>
                                        <td className="text-muted" style={{ maxWidth: '350px' }}>
                                            <div className="d-flex align-items-start gap-2">
                                                <FileText size={14} className="mt-1 flex-shrink-0 opacity-50" />
                                                <span className="small">{record.Description || "System automatic update."}</span>
                                            </div>
                                        </td>
                                        <td className="pe-4">
                                            <div className="d-flex align-items-center gap-2">
                                                <Calendar size={14} className="text-orange" style={{color:'#ea580c'}} />
                                                <div>
                                                    <div className="fw-bold text-dark" style={{fontSize: '0.8rem'}}>{new Date(record.LastUpdated).toLocaleDateString('en-IN')}</div>
                                                    <div className="text-muted" style={{ fontSize: '10px', fontWeight: '800' }}>{new Date(record.LastUpdated).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-5">
                                        <div className="opacity-25 mb-2">
                                            <History size={48} className="mx-auto" />
                                        </div>
                                        <p className="text-muted small fw-bold uppercase mb-0">
                                            {isLoading ? "Consulting local substation archives..." : "No historical logs available for this selection."}
                                        </p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ElectricityHistory;