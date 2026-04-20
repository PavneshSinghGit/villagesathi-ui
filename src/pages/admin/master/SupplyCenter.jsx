import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../api/axiosInstance';

const SupplyCenter = () => {
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [centers, setCenters] = useState([]);
    
    const [countryId, setCountryId] = useState("");
    const [stateId, setStateId] = useState("");
    const [districtId, setDistrictId] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // 1. Load Countries
    useEffect(() => {
        axiosInstance.get('/Electricity/location/countries')
            .then(res => setCountries(res.data)).catch(console.error);
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

    // 4. Load Supply Centers (Table Data)
    useEffect(() => {
        if (districtId) {
            setIsLoading(true);
            axiosInstance.get(`/Electricity/supply-centers/${districtId}`)
                .then(res => setCenters(res.data))
                .catch(err => console.error("Error fetching supply centers:", err))
                .finally(() => setIsLoading(false));
        } else {
            setCenters([]);
        }
    }, [districtId]);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Supply Center Management</h2>
                <button className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
                    + Add New Center
                </button>
            </div>

            {/* Filter Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <select className="w-full border rounded-md p-2" value={countryId}
                        onChange={(e) => {
                            setCountryId(e.target.value);
                            setStateId(""); setDistrictId("");
                            setStates([]); setDistricts([]); setCenters([]);
                        }}>
                        <option value="">Select</option>
                        {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <select className="w-full border rounded-md p-2" value={stateId} disabled={!countryId}
                        onChange={(e) => {
                            setStateId(e.target.value);
                            setDistrictId("");
                            setDistricts([]); setCenters([]);
                        }}>
                        <option value="">Select</option>
                        {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                    <select className="w-full border rounded-md p-2" value={districtId} disabled={!stateId}
                        onChange={(e) => setDistrictId(e.target.value)}>
                        <option value="">Select</option>
                        {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                </div>
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">Center Name</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {isLoading ? (
                            <tr><td colSpan="3" className="py-4 text-center text-gray-500">Loading centers...</td></tr>
                        ) : centers.length > 0 ? (
                            centers.map((center, index) => (
                                <tr key={center.id} className="hover:bg-gray-50">
                                    <td className="py-4 px-6 text-sm text-gray-500">{index + 1}</td>
                                    <td className="py-4 px-6 text-sm text-gray-900 font-medium">{center.name}</td>
                                    <td className="py-4 px-6 text-sm">
                                        <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                                        <button className="text-red-600 hover:text-red-900">Delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="py-8 text-center text-gray-500">
                                    {districtId ? "No supply centers found." : "Select a district to view centers."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SupplyCenter;