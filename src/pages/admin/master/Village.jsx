import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../api/axiosInstance';

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
    const [isLoading, setIsLoading] = useState(false);

    // Load Data Effects (Cascading)
    useEffect(() => {
        axiosInstance.get('/Electricity/location/countries').then(res => setCountries(res.data)).catch(console.error);
    }, []);

    useEffect(() => {
        if (countryId) axiosInstance.get(`/Electricity/location/states/${countryId}`).then(res => setStates(res.data)).catch(console.error);
    }, [countryId]);

    useEffect(() => {
        if (stateId) axiosInstance.get(`/Electricity/location/districts/${stateId}`).then(res => setDistricts(res.data)).catch(console.error);
    }, [stateId]);

    useEffect(() => {
        if (districtId) axiosInstance.get(`/Electricity/supply-centers/${districtId}`).then(res => setCenters(res.data)).catch(console.error);
    }, [districtId]);

    // Fetch Villages (Table Data)
    useEffect(() => {
        if (centerId) {
            setIsLoading(true);
            axiosInstance.get(`/Electricity/villages/${centerId}`)
                .then(res => setVillages(res.data))
                .catch(err => console.error("Error fetching villages:", err))
                .finally(() => setIsLoading(false));
        } else {
            setVillages([]);
        }
    }, [centerId]);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Village Management</h2>
                <button className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
                    + Add New Village
                </button>
            </div>

            {/* Filter Section - 4 Columns grid for better layout */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <select className="w-full border rounded-md p-2" value={countryId}
                        onChange={(e) => {
                            setCountryId(e.target.value);
                            setStateId(""); setDistrictId(""); setCenterId("");
                            setStates([]); setDistricts([]); setCenters([]); setVillages([]);
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
                            setDistrictId(""); setCenterId("");
                            setDistricts([]); setCenters([]); setVillages([]);
                        }}>
                        <option value="">Select</option>
                        {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                    <select className="w-full border rounded-md p-2" value={districtId} disabled={!stateId}
                        onChange={(e) => {
                            setDistrictId(e.target.value);
                            setCenterId("");
                            setCenters([]); setVillages([]);
                        }}>
                        <option value="">Select</option>
                        {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Supply Center</label>
                    <select className="w-full border rounded-md p-2" value={centerId} disabled={!districtId}
                        onChange={(e) => setCenterId(e.target.value)}>
                        <option value="">Select</option>
                        {centers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">Village Name</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {isLoading ? (
                            <tr><td colSpan="3" className="py-4 text-center text-gray-500">Loading villages...</td></tr>
                        ) : villages.length > 0 ? (
                            villages.map((village, index) => (
                                <tr key={village.id} className="hover:bg-gray-50">
                                    <td className="py-4 px-6 text-sm text-gray-500">{index + 1}</td>
                                    <td className="py-4 px-6 text-sm text-gray-900 font-medium">{village.name}</td>
                                    <td className="py-4 px-6 text-sm">
                                        <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                                        <button className="text-red-600 hover:text-red-900">Delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="py-8 text-center text-gray-500">
                                    {centerId ? "No villages found." : "Select a supply center to view villages."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Village;