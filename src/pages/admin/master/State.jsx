import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const State = () => {
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [countryId, setCountryId] = useState("");
    const [stateName, setStateName] = useState("");
    const [editId, setEditId] = useState(0); // 0 matlab Add mode, >0 matlab Update mode
    const [isLoading, setIsLoading] = useState(false);

    const API_BASE_URL = import.meta.env.VITE_API_URL;

    // 1. Load Countries on Mount
    useEffect(() => {
        axios.get(`${API_BASE_URL}/Master/GetAll/Country`)
            .then(res => setCountries(Array.isArray(res.data) ? res.data : (res.data.data || [])))
            .catch(err => console.error("Error fetching countries:", err));
    }, []);

    // 2. Fetch States based on selected Country
    const fetchStates = async (cid) => {
        if (!cid) {
            setStates([]);
            return;
        }
        setIsLoading(true);
        try {
            // Hum dropdown endpoint use karenge jo humne backend mein banaya tha
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

    // 3. Save or Update logic (POST)
    const handleSave = async (e) => {
        e.preventDefault();
        if (!countryId || !stateName) {
            return Swal.fire('Error', 'Country and State Name are required!', 'error');
        }

        try {
            const payload = {
                id: editId,
                name: stateName,
                countryId: parseInt(countryId)
            };

            await axios.post(`${API_BASE_URL}/Master/SaveState`, payload);

            Swal.fire('Success', `State ${editId > 0 ? 'updated' : 'added'} successfully!`, 'success');

            // Reset fields
            setStateName("");
            setEditId(0);
            fetchStates(countryId); // List refresh karein
        } catch (err) {
            Swal.fire('Error', 'Operation failed', 'error');
        }
    };

    // 4. Edit mode trigger
    const handleEdit = (item) => {
        setEditId(item.Id || item.id);
        setStateName(item.Name || item.name);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">State Management</h2>

                {/* Add/Edit Form Section */}
                <form onSubmit={handleSave} className="form-section">
                    <div className="row">
                        <div className="col-md-4 mb-4">
                            <label className="form-label">Select Country</label>
                            <select className="form-select" value={countryId}
                                onChange={(e) => { setCountryId(e.target.value); setEditId(0); setStateName(""); }}>
                                <option value="">-- Select Country --</option>
                                {Array.isArray(countries) && countries.map(c => (
                                    <option key={c.Id || c.id} value={c.Id || c.id}>
                                        {c.Name || c.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-4 mb-4">
                            <label className="form-label">State Name</label>
                            <input type="text" className="form-control" placeholder="Enter State Name" value={stateName}
                                onChange={(e) => setStateName(e.target.value)} />
                        </div>

                        <div className="col-md-4 mb-4 flex items-end gap-2">
                            <button type="submit" className={`btn btn-primary ${editId > 0 ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
                                {editId > 0 ? 'Update State' : 'Save State'}
                            </button>
                            {editId > 0 && (
                                <button type="button" onClick={() => { setEditId(0); setStateName(""); }} className="btn btn-secondary">
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>
                </form>

                {/* Table Section */}
                <div className="table-responsive border rounded-lg">
                    <table className="table table-hover w-full">
                        <thead className="table-dark">
                            <tr>
                                <th className=" text-left text-xs font-bold text-gray-600 uppercase">SR No.</th>
                                <th className=" text-left text-xs font-bold text-gray-600 uppercase">State Name</th>
                                <th className=" text-right text-xs font-bold text-gray-600 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {isLoading ? (
                                <tr><td colSpan="3" className="py-10 text-center text-gray-500 font-medium">Loading data...</td></tr>
                            ) : states.length > 0 ? (
                                states.map((state, index) => (
                                    <tr key={state.Id || state.id} className="hover:bg-blue-50/50 transition">
                                        <td className="text-sm text-gray-500">{index + 1}</td>
                                        <td className="text-sm text-gray-900 font-semibold">{state.Name || state.name}</td>
                                        <td className="text-sm text-right">
                                            <button onClick={() => handleEdit(state)} className="btn btn-sm btn-outline-primary">Edit</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="py-10 text-center text-gray-400 italic">
                                        {countryId ? "No states found for this country." : "Please select a country to view its states."}
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

export default State;