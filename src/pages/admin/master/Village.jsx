import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Village = () => {
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [centers, setCenters] = useState([]);
    const [villages, setVillages] = useState([]);

    const [countryId, setCountryId] = useState("");
    const [stateId, setStateId] = useState("");
    const [districtId, setDistrictId] = useState("");
    const [centerId, setCenterId] = useState("");
    const [villageName, setVillageName] = useState("");
    const [editId, setEditId] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const API_BASE_URL = import.meta.env.VITE_API_URL;

    // 1. Load Countries
    useEffect(() => {
        axios.get(`${API_BASE_URL}/Master/GetAll/Country`)
            .then(res => setCountries(Array.isArray(res.data) ? res.data : (res.data.data || []))).catch(console.error);
    }, []);

    // 2. Load States
    useEffect(() => {
        if (countryId) {
            axios.get(`${API_BASE_URL}/Master/GetDropdown/State/${countryId}`)
                .then(res => setStates(Array.isArray(res.data) ? res.data : (res.data.data || []))).catch(console.error);
        } else {
            setStates([]); setStateId(""); setDistricts([]); setDistrictId(""); setCenters([]); setCenterId("");
        }
    }, [countryId]);

    // 3. Load Districts
    useEffect(() => {
        if (stateId) {
            axios.get(`${API_BASE_URL}/Master/GetDropdown/District/${stateId}`)
                .then(res => setDistricts(Array.isArray(res.data) ? res.data : (res.data.data || []))).catch(console.error);
        } else {
            setDistricts([]); setDistrictId(""); setCenters([]); setCenterId("");
        }
    }, [stateId]);

    // 4. Load Supply Centers
    useEffect(() => {
        if (districtId) {
            axios.get(`${API_BASE_URL}/Master/GetDropdown/Center/${districtId}`)
                .then(res => setCenters(Array.isArray(res.data) ? res.data : (res.data.data || []))).catch(console.error);
        } else {
            setCenters([]); setCenterId("");
        }
    }, [districtId]);

    // 5. Fetch Villages (Table Data)
    const fetchVillages = async () => {
        if (!centerId) return;
        setIsLoading(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/Master/GetAll/Village`);
            // Frontend filter based on selected center
            const filtered = Array.isArray(res.data) ? res.data.filter(v => (v.CenterId || v.centerId) === parseInt(centerId)) : (res.data.data || []).filter(v => (v.CenterId || v.centerId) === parseInt(centerId));
            setVillages(filtered);
        } catch (err) {
            console.error("Error fetching villages:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchVillages();
    }, [centerId]);

    // 6. Save or Update Logic
    const handleSave = async (e) => {
        e.preventDefault();
        if (!centerId || !villageName) {
            return Swal.fire('Error', 'Center and Village Name are required!', 'error');
        }

        try {
            const payload = {
                id: editId,
                name: villageName,
                centerId: parseInt(centerId),
                isActive: true
            };

            await axios.post(`${API_BASE_URL}/Master/SaveVillage`, payload);
            Swal.fire('Success', `Village ${editId > 0 ? 'updated' : 'added'} successfully!`, 'success');

            setVillageName("");
            setEditId(0);
            fetchVillages();
        } catch (err) {
            Swal.fire('Error', 'Save failed', 'error');
        }
    };

    const handleEdit = (item) => {
        setEditId(item.Id || item.id);
        setVillageName(item.Name || item.name);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <h2 className="text-3xl font-extrabold text-gray-800 mb-8 border-b pb-4">Village Master</h2>

                {/* Multi-Level Cascading Filters & Form */}
                <div className="bg-gray-50 p-6 rounded-xl mb-8 border border-gray-200">
                    <form onSubmit={handleSave} className="form-section">
                        <div className="row">
                            <div className="col-md-3 mb-4">
                                <label className="form-label">Country</label>
                                <select className="form-select"
                                    value={countryId} onChange={(e) => setCountryId(e.target.value)}>
                                    <option value="">Select</option>
                                    {Array.isArray(countries) && countries.map(c => <option key={c.Id || c.id} value={c.Id || c.id}>{c.Name || c.name}</option>)}
                                </select>
                            </div>

                            <div className="col-md-3 mb-4">
                                <label className="form-label">State</label>
                                <select className="form-select"
                                    value={stateId} disabled={!countryId} onChange={(e) => setStateId(e.target.value)}>
                                    <option value="">Select</option>
                                    {Array.isArray(states) && states.map(s => <option key={s.Id || s.id} value={s.Id || s.id}>{s.Name || s.name}</option>)}
                                </select>
                            </div>

                            <div className="col-md-3 mb-4">
                                <label className="form-label">District</label>
                                <select className="form-select"
                                    value={districtId} disabled={!stateId} onChange={(e) => setDistrictId(e.target.value)}>
                                    <option value="">Select</option>
                                    {Array.isArray(districts) && districts.map(d => <option key={d.Id || d.id} value={d.Id || d.id}>{d.Name || d.name}</option>)}
                                </select>
                            </div>

                            <div className="col-md-3 mb-4">
                                <label className="form-label">Supply Center</label>
                                <select className="form-select"
                                    value={centerId} disabled={!districtId} onChange={(e) => setCenterId(e.target.value)}>
                                    <option value="">Select Center</option>
                                    {Array.isArray(centers) && centers.map(c => <option key={c.Id || c.id} value={c.Id || c.id}>{c.Name || c.name}</option>)}
                                </select>
                            </div>

                            <div className="col-md-3 mb-4">
                                <label className="form-label">Village Name</label>
                                <input type="text" className="form-control"
                                    placeholder="Enter Name" value={villageName} onChange={(e) => setVillageName(e.target.value)} />
                            </div>
                            <div className="col-md-3 mb-4 flex items-end gap-2">
                                <button type="submit" className={`btn btn-primary ${editId > 0 ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
                                    {editId > 0 ? 'Update' : 'Add'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Data Table */}
                <div className="table-responsive border rounded-lg">
                    <table className="table table-hover w-full">
                        <thead className="table-dark">
                            <tr>
                                <th className=" text-left text-xs font-semibold uppercase tracking-wider">#</th>
                                <th className=" text-left text-xs font-semibold uppercase tracking-wider">Village Name</th>
                                <th className=" text-right text-xs font-semibold uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr><td colSpan="3" className="py-12 text-center text-gray-400 animate-pulse">Loading villages...</td></tr>
                            ) : villages.length > 0 ? (
                                villages.map((v, index) => (
                                    <tr key={v.Id || v.id} className="hover:bg-blue-50/40 transition">
                                        <td className=" text-sm text-gray-500">{index + 1}</td>
                                        <td className="text-sm text-gray-900 font-bold">{v.Name || v.name}</td>
                                        <td className="text-sm text-right">
                                            <button onClick={() => handleEdit(v)} className="btn btn-sm btn-outline-primary">Edit</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="py-16 text-center text-gray-400 italic">
                                        {centerId ? "No villages found for this center." : "Select Country, State, District & Center to see villages."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div >
        </div >
    );
};

export default Village;