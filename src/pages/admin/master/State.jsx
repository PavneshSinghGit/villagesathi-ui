import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Map, PlusCircle, Edit, X, Search, Loader2, ArrowLeft, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const State = () => {
    const navigate = useNavigate();
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [countryId, setCountryId] = useState("");
    const [stateName, setStateName] = useState("");
    const [editId, setEditId] = useState(0); 
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const API_BASE_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        axios.get(`${API_BASE_URL}/Master/GetAll/Country`)
            .then(res => setCountries(Array.isArray(res.data) ? res.data : (res.data.data || [])))
            .catch(err => console.error("Error fetching countries:", err));
    }, []);

    const fetchStates = async (cid) => {
        if (!cid) {
            setStates([]);
            return;
        }
        setIsLoading(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/Master/GetDropdown/State/${cid}`);
            setStates(Array.isArray(res.data) ? res.data : (res.data.data || []));
        } catch (err) {
            console.error("Error fetching states:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStates(countryId);
    }, [countryId]);

    const handleSave = async (e) => {
        e.preventDefault();
        if (!countryId || !stateName) {
            return Swal.fire({
                title: 'Required Fields',
                text: 'Please select a country and enter a state name.',
                icon: 'warning',
                confirmButtonColor: '#0f172a'
            });
        }

        try {
            const payload = {
                id: editId,
                name: stateName,
                countryId: parseInt(countryId)
            };

            await axios.post(`${API_BASE_URL}/Master/SaveState`, payload);

            Swal.fire({
                icon: 'success',
                title: editId > 0 ? 'State Updated!' : 'State Registered!',
                text: 'Geographic registry synchronized successfully.',
                timer: 2000,
                showConfirmButton: false
            });

            setStateName("");
            setEditId(0);
            fetchStates(countryId);
        } catch (err) {
            Swal.fire('Error', 'Registry update failed.', 'error');
        }
    };

    const handleEdit = (item) => {
        setEditId(item.Id || item.id);
        setStateName(item.Name || item.name);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const filteredStates = states.filter(s => 
        (s.Name || s.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container-fluid py-4 px-md-5" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            <style>{`
                .state-hero {
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
                    padding: 10px 15px;
                    font-size: 0.9rem;
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
                .btn-master-save {
                    background: #0f172a;
                    color: white;
                    border: none;
                    border-radius: 10px;
                    font-weight: 700;
                    padding: 10px 25px;
                    transition: 0.3s;
                }
                .btn-master-save:hover { background: #ea580c; transform: translateY(-1px); }
                .table-premium thead th {
                    background: #f8fafc;
                    font-size: 0.65rem;
                    font-weight: 800;
                    color: #64748b;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    padding: 15px;
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
                .search-box-master input { border: none; padding: 10px; outline: none; width: 100%; font-size: 0.85rem; }
                .text-xxs { font-size: 0.65rem; font-weight: 800; letter-spacing: 0.5px; }
            `}</style>

            {/* Header Area */}
            <div className="state-hero shadow-lg">
                <div className="row align-items-center">
                    <div className="col-md-8">
                        <button className="btn btn-link text-white-50 p-0 mb-2 text-decoration-none d-flex align-items-center small fw-bold" onClick={() => navigate('/admin/dashboard')}>
                            <ArrowLeft size={14} className="me-1" /> DASHBOARD
                        </button>
                        <div className="d-flex align-items-center gap-3">
                            <div className="p-3 rounded-4" style={{ background: 'rgba(234, 88, 12, 0.1)' }}>
                                <Map size={28} style={{ color: '#ea580c' }} />
                            </div>
                            <div>
                                <h3 className="text-white fw-bold mb-0">State Master</h3>
                                <p className="text-white-50 small mb-0 fw-bold uppercase">Regional Territory Configuration</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row justify-content-center">
                <div className="col-lg-11">
                    {/* Input Panel */}
                    <div className="form-card-premium shadow-sm mb-4">
                        <form onSubmit={handleSave}>
                            <div className="row g-3 align-items-end">
                                <div className="col-md-4">
                                    <label className="text-xxs text-muted mb-2 uppercase tracking-widest d-flex align-items-center gap-2">
                                        <Globe size={12}/> Parent Country
                                    </label>
                                    <select 
                                        className="form-select input-premium-master w-100" 
                                        value={countryId}
                                        onChange={(e) => { setCountryId(e.target.value); setEditId(0); setStateName(""); }}
                                        required
                                    >
                                        <option value="">Select Country</option>
                                        {countries.map(c => (
                                            <option key={c.Id || c.id} value={c.Id || c.id}>{c.Name || c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-4">
                                    <label className="text-xxs text-muted mb-2 uppercase tracking-widest">Territory Name</label>
                                    <input
                                        type="text"
                                        className="input-premium-master w-100"
                                        placeholder="e.g. Uttar Pradesh"
                                        value={stateName}
                                        onChange={(e) => setStateName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="col-md-4 d-flex gap-2">
                                    <button type="submit" className="btn-master-save shadow-sm d-flex align-items-center gap-2 flex-grow-1 justify-content-center">
                                        {editId > 0 ? <Edit size={18} /> : <PlusCircle size={18} />}
                                        {editId > 0 ? 'UPDATE STATE' : 'REGISTER STATE'}
                                    </button>
                                    {editId > 0 && (
                                        <button type="button" onClick={() => { setEditId(0); setStateName(""); }} className="btn btn-light border px-4 rounded-3 fw-bold text-muted d-flex align-items-center gap-2">
                                            <X size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* List Section */}
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                        <div className="p-4 border-bottom d-flex justify-content-between align-items-center flex-wrap gap-3">
                            <h5 className="fw-bold m-0 text-dark">State Registry</h5>
                            <div className="search-box-master shadow-sm">
                                <Search size={16} className="text-muted" />
                                <input 
                                    type="text" 
                                    placeholder="Find state in this country..." 
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
                                        <th>STATE NAME</th>
                                        <th>REGION ID</th>
                                        <th className="text-end pe-4">MANAGEMENT</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr><td colSpan="4" className="text-center py-5"><Loader2 className="animate-spin mx-auto text-orange" style={{color:'#ea580c'}} /></td></tr>
                                    ) : filteredStates.length > 0 ? filteredStates.map((state, index) => (
                                        <tr key={state.Id || state.id} className="border-bottom">
                                            <td className="ps-4 text-muted small fw-bold">{index + 1}</td>
                                            <td><div className="fw-bold text-dark">{state.Name || state.name}</div></td>
                                            <td><span className="badge bg-slate-100 text-dark border p-2" style={{ fontSize: '0.65rem', background: '#f1f5f9' }}>#ST-{state.Id || state.id}</span></td>
                                            <td className="text-end pe-4">
                                                <button onClick={() => handleEdit(state)} className="btn btn-sm btn-light border text-primary fw-bold rounded-pill px-3 transition-all hover:bg-primary hover:text-white">
                                                    <Edit size={14} className="me-1" /> MODIFY
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="4" className="text-center py-5">
                                                <div className="opacity-25 mb-2">
                                                    <Map size={48} className="mx-auto" />
                                                </div>
                                                <p className="text-muted small fw-bold uppercase">
                                                    {countryId ? "No states mapped to this country." : "Select a country to load state registry."}
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

export default State;