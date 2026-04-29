import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const District = () => {
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [districts, setDistricts] = useState([]);

    const [countryId, setCountryId] = useState("");
    const [stateId, setStateId] = useState("");
    const [districtName, setDistrictName] = useState(""); // For Add/Update
    const [editId, setEditId] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const API_BASE_URL = import.meta.env.VITE_API_URL;

    // 1. Load Countries on Mount
    useEffect(() => {
        axios.get(`${API_BASE_URL}/Master/GetAll/Country`)
            .then(res => {
                const result = Array.isArray(res.data) ? res.data : (res.data.data || []);
                setCountries(result);
            })
            .catch(err => console.error("Error fetching countries:", err));
    }, []);

    // 2. Load States when Country changes
    useEffect(() => {
        if (countryId) {
            axios.get(`${API_BASE_URL}/Master/GetDropdown/State/${countryId}`)
                .then(res => {
                    const result = Array.isArray(res.data) ? res.data : (res.data.data || []);
                    setStates(result);
                })
                .catch(err => console.error("Error fetching states:", err));
        } else {
            setStates([]);
            setStateId("");
        }
    }, [countryId]);

    // 3. Load Districts when State changes (For List Table)
    useEffect(() => {
        if (stateId) {
            fetchDistricts();
        } else {
            setDistricts([]);
        }
    }, [stateId]);

    const fetchDistricts = async () => {
        setIsLoading(true);
        try {
            // Humne MasterController mein 'District' type banaya tha
            const res = await axios.get(`${API_BASE_URL}/Master/GetAll/District`);
            // Filter districts based on selected stateId
            const result = Array.isArray(res.data) ? res.data : (res.data.data || []);
            const filtered = result.filter(d => d.StateId === parseInt(stateId));
            setDistricts(filtered);
        } catch (err) {
            console.error("Error fetching districts:", err);
        } finally {
            setIsLoading(false);
        }
    };

    // 4. Save/Update Logic
    const handleSave = async (e) => {
        e.preventDefault();
        if (!stateId || !districtName) {
            return Swal.fire('Error', 'Please select state and enter district name', 'error');
        }

        try {
            const payload = {
                id: editId,
                name: districtName,
                stateId: parseInt(stateId)
            };
            await axios.post(`${API_BASE_URL}/Master/SaveDistrict`, payload);
            Swal.fire('Success', 'District saved successfully', 'success');
            setDistrictName("");
            setEditId(0);
            fetchDistricts(); // Refresh table
        } catch (err) {
            Swal.fire('Error', 'Save failed', 'error');
        }
    };

    const handleEdit = (item) => {
        setEditId(item.Id || item.id);
        setDistrictName(item.Name || item.name);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">District Management</h2>

                {/* Input & Filter Section */}
                <form onSubmit={handleSave} className="form-section mb-8">
                    <div className="row">
                        <div className="col-md-4 mb-4">
                            <label className="form-label">Country</label>
                            <select className="form-select" value={countryId} onChange={(e) => setCountryId(e.target.value)}                        >
                                <option value="">-- Select Country --</option>
                                {Array.isArray(countries) && countries.map(c => (
                                    <option key={c.Id || c.id} value={c.Id || c.id}>
                                        {c.Name || c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-4 mb-4">
                            <label className="form-label">State</label>
                            <select className="form-select" value={stateId} disabled={!countryId} onChange={(e) => setStateId(e.target.value)}                        >
                                <option value="">-- Select State --</option>
                                {Array.isArray(states) && states.map(s => (
                                    <option key={s.Id || s.id} value={s.Id || s.id}>
                                        {s.Name || s.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-4 mb-4">
                            <label className="form-label">District Name</label>
                            <input type="text" className="form-control" placeholder="Enter District Name" value={districtName} onChange={(e) => setDistrictName(e.target.value)} />
                        </div>

                        <div className="col-md-4 mb-4 flex items-end gap-2">
                            <button type="submit" className="btn btn-primary">{editId > 0 ? 'Update' : 'Add'}</button>
                            {editId > 0 && (
                                <button type="button" onClick={() => { setEditId(0); setDistrictName(""); }} className="btn btn-secondary">
                                    X
                                </button>
                            )}
                        </div>
                    </div>
                </form>

                {/* Data Table */}
                <div className="table-responsive border rounded-lg">
                    <table className="table table-hover w-full">
                        <thead className="table-dark">
                            <tr>
                                <th className="py-3 px-6 text-left text-xs font-bold text-gray-600 uppercase">SR No.</th>
                                <th className="py-3 px-6 text-left text-xs font-bold text-gray-600 uppercase">District Name</th>
                                <th className="py-3 px-6 text-right text-xs font-bold text-gray-600 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {isLoading ? (
                                <tr><td colSpan="3" className="py-10 text-center text-gray-500">Loading districts...</td></tr>
                            ) : districts.length > 0 ? (
                                districts.map((district, index) => (
                                    <tr key={district.Id || district.id} className="hover:bg-blue-50/50 transition">
                                        <td className="text-sm text-gray-500">{index + 1}</td>
                                        <td className="text-sm text-gray-900 font-semibold">{district.Name || district.name}</td>
                                        <td className="text-sm text-right">
                                            <button onClick={() => handleEdit(district)} className="btn btn-sm btn-outline-primary">Edit</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="py-10 text-center text-gray-400">
                                        {stateId ? "No districts found." : "Select a state to see districts."}
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

export default District;