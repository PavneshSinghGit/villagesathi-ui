import React, { useState, useEffect } from 'react';
import { electricityApi } from '../../../api/electricityApi';
import { MapPin,Zap, Clock, FileText, Send, Loader2, Globe, ChevronRight } from 'lucide-react';

const UpdateElectricityStatus = () => {
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [supplyCenters, setSupplyCenters] = useState([]);
    const [villages, setVillages] = useState([]);

    const [formData, setFormData] = useState({
        countryId: '', stateId: '', districtId: '', supplyCenterId: '', villageId: '',
        status: 1, expectedTime: '', description: ''
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => { fetchCountries(); }, []);

    const fetchCountries = async () => {
        try {
            const response = await electricityApi.getCountries();
            setCountries(response.data);
        } catch (error) { console.error("Error", error); }
    };

    const handleInputChange = async (e) => {
        const { name, value } = e.target;
        const finalValue = name === 'status' || name.endsWith('Id') ? (value ? parseInt(value) : '') : value;
        setFormData(prev => ({ ...prev, [name]: finalValue }));

        try {
            if (name === 'countryId') {
                setStates([]); setDistricts([]); setSupplyCenters([]); setVillages([]);
                if(value) { const res = await electricityApi.getStates(value); setStates(res.data); }
            } 
            else if (name === 'stateId') {
                setDistricts([]); setSupplyCenters([]); setVillages([]);
                if(value) { const res = await electricityApi.getDistricts(value); setDistricts(res.data); }
            }
            else if (name === 'districtId') {
                setSupplyCenters([]); setVillages([]);
                if(value) { const res = await electricityApi.getSupplyCenters(value); setSupplyCenters(res.data); }
            }
            else if (name === 'supplyCenterId') {
                setVillages([]);
                if(value) { const res = await electricityApi.getVillages(value); setVillages(res.data); }
            }
        } catch (error) { console.error(error); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const user = JSON.parse(localStorage.getItem('user'));
        try {
            const payload = {
                villageId: parseInt(formData.villageId),
                status: parseInt(formData.status),
                expectedTime: formData.expectedTime || "N/A",
                description: formData.description || "Updated by Admin",
                updatedBy: user ? user.id : 0
            };
            await electricityApi.saveStatus(payload);
            setMessage({ text: 'Power status broadcasted successfully!', type: 'success' });
            setFormData(prev => ({ ...prev, status: 1, expectedTime: '', description: '' }));
        } catch (error) {
            setMessage({ text: 'Update failed. Check system logs.', type: 'danger' });
        } finally { setLoading(false); }
    };

    return (
        <div className="container-fluid py-4 px-md-5" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            <style>{`
                .elec-hero {
                    background: #0f172a;
                    border-radius: 20px;
                    padding: 25px 30px;
                    border-bottom: 4px solid #ea580c;
                    margin-bottom: 30px;
                }
                .form-section-card {
                    background: white;
                    border-radius: 20px;
                    border: 1px solid #e2e8f0;
                    overflow: hidden;
                }
                .input-premium-elec {
                    border-radius: 10px;
                    border: 1px solid #e2e8f0;
                    padding: 10px 12px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    transition: 0.2s;
                }
                .input-premium-elec:focus {
                    border-color: #ea580c;
                    box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.1);
                    outline: none;
                }
                .step-label {
                    font-size: 0.7rem;
                    font-weight: 800;
                    color: #ea580c;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 15px;
                }
                .step-label::after {
                    content: "";
                    height: 1px;
                    flex-grow: 1;
                    background: #f1f5f9;
                }
                .btn-broadcast {
                    background: #0f172a;
                    color: white;
                    border: none;
                    border-radius: 12px;
                    padding: 14px 30px;
                    font-weight: 700;
                    transition: 0.3s;
                }
                .btn-broadcast:hover:not(:disabled) {
                    background: #ea580c;
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px rgba(234, 88, 12, 0.2);
                }
            `}</style>

            {/* Header Section */}
            <div className="elec-hero shadow-lg">
                <div className="row align-items-center">
                    <div className="col-md-8 text-center text-md-start">
                        <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-3">
                            <div className="p-3 rounded-4" style={{background: 'rgba(234, 88, 12, 0.15)'}}>
                                <Zap size={28} style={{color: '#ea580c'}} />
                            </div>
                            <div>
                                <h3 className="text-white fw-bold mb-0">Electricity Management</h3>
                                <p className="text-white-50 small mb-0 fw-bold uppercase">Broadcast real-time grid status</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row justify-content-center">
                <div className="col-lg-10">
                    <div className="form-section-card shadow-sm">
                        <div className="p-4 p-md-5">
                            {message.text && (
                                <div className={`alert alert-${message.type} border-0 shadow-sm rounded-3 mb-4 d-flex align-items-center gap-2`} role="alert">
                                    {message.type === 'success' ? <Zap size={18}/> : <Loader2 size={18}/>}
                                    <span className="fw-bold small">{message.text}</span>
                                    <button type="button" className="btn-close ms-auto" onClick={() => setMessage({text:'', type:''})}></button>
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                {/* Step 1: Location */}
                                <div className="step-label">Location Hierarchy</div>
                                <div className="row g-3 mb-5">
                                    <div className="col-md-4">
                                        <label className="small fw-bold text-muted mb-1">COUNTRY</label>
                                        <div className="position-relative">
                                            <select name="countryId" value={formData.countryId} onChange={handleInputChange} className="form-select input-premium-elec" required>
                                                <option value="">Select Country</option>
                                                {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <label className="small fw-bold text-muted mb-1">STATE</label>
                                        <select name="stateId" value={formData.stateId} onChange={handleInputChange} className="form-select input-premium-elec" disabled={!formData.countryId} required>
                                            <option value="">Select State</option>
                                            {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-md-4">
                                        <label className="small fw-bold text-muted mb-1">DISTRICT</label>
                                        <select name="districtId" value={formData.districtId} onChange={handleInputChange} className="form-select input-premium-elec" disabled={!formData.stateId} required>
                                            <option value="">Select District</option>
                                            {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="small fw-bold text-muted mb-1">SUPPLY CENTER (SUBSTATION)</label>
                                        <select name="supplyCenterId" value={formData.supplyCenterId} onChange={handleInputChange} className="form-select input-premium-elec" disabled={!formData.districtId} required>
                                            <option value="">Select Substation</option>
                                            {supplyCenters.map(sc => <option key={sc.id} value={sc.id}>{sc.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="small fw-bold text-orange mb-1">TARGET VILLAGE</label>
                                        <select name="villageId" value={formData.villageId} onChange={handleInputChange} className="form-select input-premium-elec border-primary border-opacity-50" disabled={!formData.supplyCenterId} required>
                                            <option value="">Choose Village</option>
                                            {villages.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                                        </select>
                                    </div>
                                </div>

                                {/* Step 2: Power Info */}
                                <div className="step-label">Grid Status Information</div>
                                <div className="row g-3 p-4 rounded-4 mb-4" style={{background: '#f8fafc', border: '1px solid #f1f5f9'}}>
                                    <div className="col-md-6">
                                        <label className="small fw-bold text-muted mb-1 d-flex align-items-center gap-2"><Zap size={14}/> CURRENT STATUS</label>
                                        <select name="status" value={formData.status} onChange={handleInputChange} className="form-select input-premium-elec fw-bold">
                                            <option value={1} style={{color: '#10b981'}}>🟢 Power ON (Available)</option>
                                            <option value={2} style={{color: '#f59e0b'}}>🟠 Maintenance (Work in Progress)</option>
                                            <option value={3} style={{color: '#ef4444'}}>🔴 Power OFF (Outage)</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="small fw-bold text-muted mb-1 d-flex align-items-center gap-2"><Clock size={14}/> EXPECTED RECOVERY</label>
                                        <input type="text" name="expectedTime" value={formData.expectedTime} onChange={handleInputChange} className="form-control input-premium-elec" placeholder="e.g. 2 Hours / 6:00 PM" />
                                    </div>
                                    <div className="col-12">
                                        <label className="small fw-bold text-muted mb-1 d-flex align-items-center gap-2"><FileText size={14}/> PUBLIC NOTE / REASON</label>
                                        <textarea name="description" value={formData.description} onChange={handleInputChange} className="form-control input-premium-elec" rows="2" placeholder="Explain the cause of outage or safety warnings..."></textarea>
                                    </div>
                                </div>

                                <div className="text-end">
                                    <button 
                                        type="submit" 
                                        disabled={loading || !formData.villageId}
                                        className="btn-broadcast shadow-sm d-inline-flex align-items-center gap-2"
                                    >
                                        {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                        {loading ? 'BROADCASTING...' : 'SYNC POWER STATUS'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateElectricityStatus;