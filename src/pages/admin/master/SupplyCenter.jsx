import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const SupplyCenter = () => {
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

    // 2. Load States when Country changes
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

    // 3. Load Districts when State changes
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

    // Fetch Function - reused after Save/Update
    const fetchCenters = async (dId) => {
        const idToFetch = dId || districtId;
        if (!idToFetch) return;

        setIsLoading(true);
        try {
            // Hum vahi API use kar rahe hain jo district based filter deti hai
            const res = await axios.get(`${API_BASE_URL}/Master/GetDropdown/Center/${idToFetch}`);
            const result = Array.isArray(res.data) ? res.data : (res.data.data || []);
            setCenters(result);
        } catch (err) {
            console.error("Error fetching centers:", err);
            setCenters([]);
        } finally {
            setIsLoading(false);
        }
    };

    // 5. Save or Update logic
    const handleSave = async (e) => {
        e.preventDefault();
        if (!districtId || !centerName) {
            return Swal.fire('Error', 'District and Center Name are required!', 'error');
        }

        try {
            const payload = {
                id: editId,
                name: centerName,
                districtId: parseInt(districtId),
                isActive: true
            };

            await axios.post(`${API_BASE_URL}/Master/SaveSupplyCenter`, payload);
            Swal.fire('Success', `Center ${editId > 0 ? 'updated' : 'added'} successfully!`, 'success');

            setCenterName("");
            setEditId(0);
            fetchCenters(districtId); // Refresh list for current district
        } catch (err) {
            Swal.fire('Error', 'Save operation failed', 'error');
        }
    };

    const handleEdit = (item) => {
        setEditId(item.Id || item.id);
        setCenterName(item.Name || item.name);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Supply Center Master</h2>

                <form onSubmit={handleSave} className="mb-8">
                    <div className='row'>
                        <div className="col-md-3 mb-4">
                            <label className="form-label font-semibold">Country</label>
                            <select className="form-select" value={countryId} onChange={(e) => setCountryId(e.target.value)}>
                                <option value="">Select Country</option>
                                {countries.map(c => (
                                    <option key={c.Id || c.id} value={c.Id || c.id}>{c.Name || c.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-3 mb-4">
                            <label className="form-label font-semibold">State</label>
                            <select className="form-select" value={stateId} disabled={!countryId} onChange={(e) => setStateId(e.target.value)}>
                                <option value="">Select State</option>
                                {states.map(s => (
                                    <option key={s.Id || s.id} value={s.Id || s.id}>{s.Name || s.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-3 mb-4">
                            <label className="form-label font-semibold">District</label>
                            <select className="form-select" value={districtId} disabled={!stateId} onChange={(e) => setDistrictId(e.target.value)}>
                                <option value="">Select District</option>
                                {districts.map(d => (
                                    <option key={d.Id || d.id} value={d.Id || d.id}>{d.Name || d.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-3 mb-4">
                            <label className="form-label font-semibold">Center Name</label>
                            <input type="text" className="form-control" placeholder="e.g. Main Hub" value={centerName} onChange={(e) => setCenterName(e.target.value)} />
                        </div>

                        <div className="col-md-12 flex justify-end">
                            <button type="submit" className={`btn ${editId > 0 ? 'btn-warning' : 'btn-success'} px-5`}>
                                {editId > 0 ? 'Update Center' : 'Add Center'}
                            </button>
                        </div>
                    </div>
                </form>

                {/* Table Section */}
                {/* Data Table Section */}
                <div className="table-responsive mt-4">
                    <table className="table table-hover border">
                        <thead className="table-dark">
                            <tr>
                                <th scope="col">Sr. No.</th>
                                <th scope="col">Supply Center Name</th>
                                <th scope="col" className="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="3" className="text-center py-4">Loading...</td>
                                </tr>
                            ) : centers.length > 0 ? (
                                centers.map((center, index) => (
                                    <tr key={center.Id || center.id}>
                                        <td>{index + 1}</td>
                                        <td className="fw-bold">{center.Name || center.name}</td>
                                        <td className="text-end">
                                            <button
                                                onClick={() => handleEdit(center)}
                                                className="btn btn-sm btn-outline-primary fw-bold"
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center py-5 text-muted">
                                        {districtId
                                            ? "No supply centers found in this district."
                                            : "Please select Country, State, and District to view centers."}
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

export default SupplyCenter;