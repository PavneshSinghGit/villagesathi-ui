import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { 
    Zap, 
    PlusCircle, 
    Edit, 
    X, 
    Search, 
    Loader2, 
    ArrowLeft, 
    Globe, 
    Navigation2, 
    MapPinned 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SupplyCenter = () => {
    const navigate = useNavigate();
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [centers, setCenters] = useState([]);

    const [countryId, setCountryId] = useState("");
    const [stateId, setStateId] = useState("");
    const [districtId, setDistrictId] = useState("");
    const [centerName, setCenterName] = useState("");
    const [editId, setEditId] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const API_BASE_URL = import.meta.env.VITE_API_URL;

    // 1. Load Countries on Mount
    useEffect(() => {
        axios.get(`${API_BASE_URL}/Master/GetAll/Country`)
            .then(res => {
                const result = Array.isArray(res.data) ? res.data : (res.data.data || []);
                setCountries(result);
            })
            .catch(err => {
                console.error("Error:", err);
                setCountries([]);
            });
    }, []);

    // 2. Load States
    useEffect(() => {
        if (countryId) {
            axios.get(`${API_BASE_URL}/Master/GetDropdown/State/${countryId}`)
                .then(res => {
                    const result = Array.isArray(res.data) ? res.data : (res.data.data || []);
                    setStates(result);
                })
                .catch(console.error);
        } else {
            setStates([]); setStateId(""); setDistricts([]); setDistrictId(""); setCenters([]);
        }
    }, [countryId]);

    // 3. Load Districts
    useEffect(() => {
        if (stateId) {
            axios.get(`${API_BASE_URL}/Master/GetDropdown/District/${stateId}`)
                .then(res => {
                    const result = Array.isArray(res.data) ? res.data : (res.data.data || []);
                    setDistricts(result);
                })
                .catch(console.error);
        } else {
            setDistricts([]); setDistrictId(""); setCenters([]);
        }
    }, [stateId]);

    // 4. Load Centers when District changes
    useEffect(() => {
        if (districtId) {
            fetchCenters(districtId);
        } else {
            setCenters([]);
        }
    }, [districtId]);

    const fetchCenters = async (dId) => {
        const idToFetch = dId || districtId;
        if (!idToFetch) return;
        setIsLoading(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/Master/GetDropdown/Center/${idToFetch}`);
            const result = Array.isArray(res.data) ? res.data : (res.data.data || []);
            setCenters(result);
        } catch (err) {
            setCenters([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!districtId || !centerName) {
            return Swal.fire({
                title: 'Required Fields',
                text: 'District and Center Name are essential.',
                icon: 'warning',
                confirmButtonColor: '#0f172a'
            });
        }

        try {
            const payload = {
                id: editId,
                name: centerName,
                districtId: parseInt(districtId),
                isActive: true
            };
            await axios.post(`${API_BASE_URL}/Master/SaveSupplyCenter`, payload);
            Swal.fire({
                icon: 'success',
                title: editId > 0 ? 'Hub Updated!' : 'Hub Registered!',
                text: 'System infrastructure registry synchronized.',
                timer: 2000,
                showConfirmButton: false
            });
            setCenterName("");
            setEditId(0);
            fetchCenters(districtId);
        } catch (err) {
            Swal.fire('Error', 'Update failed.', 'error');
        }
    };

    const handleEdit = (item) => {
        setEditId(item.Id || item.id);
        setCenterName(item.Name || item.name);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const filteredCenters = centers.filter(c => 
        (c.Name || c.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container-fluid py-4 px-md-5" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            <style>{`
                .hub-hero {
                    background: #0f172a;
                    border-radius: 20px;
                    padding: 25px 30px;
                    border-bottom: 4px solid #ea580c;
                    margin-bottom: 30px;
                }
                .form-card-premium {
                    background: white;
                    border-radius: 18px;
                    border: 1px solid #e2e8f0;
                    padding: 20px;
                    margin-top: -20px;
                    position: relative;
                    z-index: 10;
                }
                .input-premium-master {
                    border-radius: 10px;
                    border: 1px solid #e2e8f0;
                    padding: 8px 12px;
                    font-size: 0.85rem;
                    font-weight: 600;
                    background: #f8fafc;
                    transition: 0.2s;
                }
                .input-premium-master:focus {
                    border-color: #ea580c;
                    background: white;
                    box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.05);
                    outline: none;
                }
                .btn-hub-save {
                    background: #0f172a;
                    color: white;
                    border: none;
                    border-radius: 10px;
                    font-weight: 700;
                    padding: 10px 25px;
                    transition: 0.3s;
                    font-size: 0.85rem;
                }
                .btn-hub-save:hover { background: #ea580c; transform: translateY(-1px); }
                .table-premium thead th {
                    background: #f8fafc;
                    font-size: 0.65rem;
                    font-weight: 800;
                    color: #64748b;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    padding: 12px 15px;
                    border: none;
                }
                .search-box-master {
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    padding: 0 15px;
                    width: 100%;
                    max-width: 300px;
                }
                .search-box-master input { border: none; padding: 8px; outline: none; width: 100%; font-size: 0.85rem; }
                .text-xxs { font-size: 0.65rem; font-weight: 800; letter-spacing: 0.5px; }
            `}</style>

            {/* Header Area */}
            <div className="hub-hero shadow-lg">
                <div className="row align-items-center">
                    <div className="col-md-8">
                        <button className="btn btn-link text-white-50 p-0 mb-2 text-decoration-none d-flex align-items-center small fw-bold" onClick={() => navigate('/admin/dashboard')}>
                            <ArrowLeft size={14} className="me-1" /> DASHBOARD
                        </button>
                        <div className="d-flex align-items-center gap-3">
                            <div className="p-3 rounded-4" style={{ background: 'rgba(234, 88, 12, 0.1)' }}>
                                <Zap size={28} style={{ color: '#ea580c' }} />
                            </div>
                            <div>
                                <h3 className="text-white fw-bold mb-0">Supply Center Master</h3>
                                <p className="text-white-50 small mb-0 fw-bold uppercase">Infrastructure Substation Registry</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row justify-content-center">
                <div className="col-lg-12">
                    {/* Input Panel */}
                    <div className="form-card-premium shadow-sm mb-4">
                        <form onSubmit={handleSave}>
                            <div className="row g-2 align-items-end">
                                <div className="col-md">
                                    <label className="text-xxs text-muted mb-1 uppercase tracking-widest d-flex align-items-center gap-1">
                                        <Globe size={10}/> Country
                                    </label>
                                    <select className="form-select input-premium-master w-100" value={countryId} onChange={(e) => setCountryId(e.target.value)}>
                                        <option value="">Select Country</option>
                                        {countries.map(c => <option key={c.Id || c.id} value={c.Id || c.id}>{c.Name || c.name}</option>)}
                                    </select>
                                </div>
                                <div className="col-md">
                                    <label className="text-xxs text-muted mb-1 uppercase tracking-widest d-flex align-items-center gap-1">
                                        <Navigation2 size={10}/> State
                                    </label>
                                    <select className="form-select input-premium-master w-100" value={stateId} disabled={!countryId} onChange={(e) => setStateId(e.target.value)}>
                                        <option value="">Select State</option>
                                        {states.map(s => <option key={s.Id || s.id} value={s.Id || s.id}>{s.Name || s.name}</option>)}
                                    </select>
                                </div>
                                <div className="col-md">
                                    <label className="text-xxs text-muted mb-1 uppercase tracking-widest d-flex align-items-center gap-1">
                                        <MapPinned size={10}/> District
                                    </label>
                                    <select className="form-select input-premium-master w-100" value={districtId} disabled={!stateId} onChange={(e) => setDistrictId(e.target.value)}>
                                        <option value="">Select District</option>
                                        {districts.map(d => <option key={d.Id || d.id} value={d.Id || d.id}>{d.Name || d.name}</option>)}
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <label className="text-xxs text-muted mb-1 uppercase tracking-widest">Hub/Center Name</label>
                                    <input
                                        type="text"
                                        className="input-premium-master w-100"
                                        placeholder="e.g. South Substation"
                                        value={centerName}
                                        onChange={(e) => setCenterName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="col-md-auto d-flex gap-2">
                                    <button type="submit" disabled={!districtId} className="btn-hub-save shadow-sm d-flex align-items-center gap-2">
                                        {editId > 0 ? <Edit size={16} /> : <PlusCircle size={16} />}
                                        {editId > 0 ? 'UPDATE' : 'ADD HUB'}
                                    </button>
                                    {editId > 0 && (
                                        <button type="button" onClick={() => { setEditId(0); setCenterName(""); }} className="btn btn-light border rounded-3 text-muted px-2">
                                            <X size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* List Section */}
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                        <div className="p-3 border-bottom d-flex justify-content-between align-items-center flex-wrap gap-3">
                            <h6 className="fw-bold m-0 text-dark">Infrastructure Nodes</h6>
                            <div className="search-box-master shadow-sm border">
                                <Search size={14} className="text-muted" />
                                <input 
                                    type="text" 
                                    placeholder="Quick search nodes..." 
                                    value={searchTerm} 
                                    onChange={(e) => setSearchTerm(e.target.value)} 
                                />
                            </div>
                        </div>

                        <div className="table-responsive">
                            <table className="table table-premium align-middle m-0">
                                <thead>
                                    <tr>
                                        <th className="ps-4">SR NO.</th>
                                        <th>CENTER/HUB NAME</th>
                                        <th>NODE ID</th>
                                        <th className="text-end pe-4">MANAGEMENT</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr><td colSpan="4" className="text-center py-5"><Loader2 className="animate-spin mx-auto text-orange" style={{color:'#ea580c'}} /></td></tr>
                                    ) : filteredCenters.length > 0 ? filteredCenters.map((center, index) => (
                                        <tr key={center.Id || center.id} className="border-bottom hover-row">
                                            <td className="ps-4 text-muted small fw-bold">{index + 1}</td>
                                            <td><div className="fw-bold text-dark">{center.Name || center.name}</div></td>
                                            <td><span className="badge bg-slate-100 text-dark border p-2" style={{ fontSize: '0.6rem', background: '#f1f5f9' }}>#HUB-{center.Id || center.id}</span></td>
                                            <td className="text-end pe-4">
                                                <button onClick={() => handleEdit(center)} className="btn btn-sm btn-light border text-primary fw-bold rounded-pill px-3 transition-all hover:bg-primary hover:text-white">
                                                    <Edit size={14} className="me-1" /> MODIFY
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="4" className="text-center py-5">
                                                <div className="opacity-25 mb-2">
                                                    <Zap size={48} className="mx-auto" />
                                                </div>
                                                <p className="text-muted small fw-bold uppercase">
                                                    {districtId ? "No hubs mapped for this district." : "Apply location filters to load substation registry."}
                                                </p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupplyCenter;