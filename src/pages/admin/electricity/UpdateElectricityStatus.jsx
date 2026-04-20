import React, { useState, useEffect } from 'react';
import { electricityApi } from '../../../api/electricityApi';

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
            setMessage({ text: '⚡ Power status updated successfully!', type: 'success' });
            setFormData(prev => ({ ...prev, status: 1, expectedTime: '', description: '' }));
        } catch (error) {
            setMessage({ text: 'Update failed. Check connection.', type: 'danger' });
        } finally { setLoading(false); }
    };

    return (
        <div className="container mt-4">
            <div className="card shadow-sm border-0 rounded-4">
                <div className="card-header bg-white border-0 py-3">
                    <div className="d-flex align-items-center">
                        <div className="bg-warning bg-opacity-10 p-2 rounded-3 me-3">
                            <span className="fs-4">⚡</span>
                        </div>
                        <div>
                            <h4 className="mb-0 fw-bold text-dark">Update Power Status</h4>
                            <small className="text-muted">Broadcast real-time electricity updates to villages</small>
                        </div>
                    </div>
                </div>

                <div className="card-body p-4">
                    {message.text && (
                        <div className={`alert alert-${message.type} alert-dismissible fade show border-0 rounded-3 shadow-sm`} role="alert">
                            <strong>{message.type === 'success' ? '✅ Success:' : '❌ Error:'}</strong> {message.text}
                            <button type="button" className="btn-close" onClick={() => setMessage({text:'', type:''})}></button>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* --- Step 1: Location Hierarchy --- */}
                        <div className="mb-5">
                            <h6 className="text-primary fw-bold text-uppercase small mb-4">Step 1: Location Details</h6>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Country</label>
                                    <select name="countryId" value={formData.countryId} onChange={handleInputChange} className="form-select" required>
                                        <option value="">Select Country</option>
                                        {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">State</label>
                                    <select name="stateId" value={formData.stateId} onChange={handleInputChange} className="form-select" disabled={!formData.countryId} required>
                                        <option value="">Select State</option>
                                        {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">District</label>
                                    <select name="districtId" value={formData.districtId} onChange={handleInputChange} className="form-select" disabled={!formData.stateId} required>
                                        <option value="">Select District</option>
                                        {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Supply Center</label>
                                    <select name="supplyCenterId" value={formData.supplyCenterId} onChange={handleInputChange} className="form-select" disabled={!formData.districtId} required>
                                        <option value="">Select Center</option>
                                        {supplyCenters.map(sc => <option key={sc.id} value={sc.id}>{sc.name}</option>)}
                                    </select>
                                </div>
                                <div className="col-12">
                                    <label className="form-label fw-semibold text-primary">Target Village</label>
                                    <select name="villageId" value={formData.villageId} onChange={handleInputChange} className="form-select form-select-lg border-primary border-opacity-25" disabled={!formData.supplyCenterId} required>
                                        <option value="">Search & Select Village</option>
                                        {villages.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* --- Step 2: Power Details --- */}
                        <div className="mb-4">
                            <h6 className="text-primary fw-bold text-uppercase small mb-4">Step 2: Status Information</h6>
                            <div className="row g-3 px-3 py-4 bg-light rounded-4">
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Current Status</label>
                                    <select name="status" value={formData.status} onChange={handleInputChange} className="form-select fw-bold border-2">
                                        <option value={1} className="text-success">🟢 Power ON (Available)</option>
                                        <option value={2} className="text-warning">🟠 Maintenance (Work in Progress)</option>
                                        <option value={3} className="text-danger">🔴 Power OFF (Cut)</option>
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Expected Recovery Time</label>
                                    <input type="text" name="expectedTime" value={formData.expectedTime} onChange={handleInputChange} className="form-control" placeholder="e.g. 2 Hours / 5:00 PM" />
                                </div>
                                <div className="col-12">
                                    <label className="form-label fw-semibold">Description / Public Note</label>
                                    <textarea name="description" value={formData.description} onChange={handleInputChange} className="form-control" rows="3" placeholder="Reason for cut or safety instructions..."></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="d-flex justify-content-end">
                            <button 
                                type="submit" 
                                disabled={loading || !formData.villageId}
                                className="btn btn-primary btn-lg px-5 py-3 rounded-pill fw-bold shadow"
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        Updating...
                                    </>
                                ) : 'Broadcast Update'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateElectricityStatus;