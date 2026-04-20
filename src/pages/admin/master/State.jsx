import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../api/axiosInstance';

const State = () => {
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [countryId, setCountryId] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // 1. Component load hote hi Countries fetch karein
    useEffect(() => {
        axiosInstance.get('/Electricity/location/countries')
            .then(res => setCountries(res.data))
            .catch(err => console.error("Error fetching countries:", err));
    }, []);

    // 2. Jab Country select ho, tabhi uske States fetch karein
    useEffect(() => {
        if (countryId) {
            setIsLoading(true);
            axiosInstance.get(`/Electricity/location/states/${countryId}`)
                .then(res => setStates(res.data))
                .catch(err => console.error("Error fetching states:", err))
                .finally(() => setIsLoading(false));
        } else {
            setStates([]); // Agar country hata di toh states clear kar do
        }
    }, [countryId]);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">State Management</h2>
                <button className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
                    + Add New State
                </button>
            </div>

            {/* Filter Section */}
            <div className="mb-6 w-full md:w-1/3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Country</label>
                <select 
                    className="w-full border rounded-md p-2" 
                    value={countryId}
                    onChange={(e) => setCountryId(e.target.value)}
                >
                    <option value="">-- Select Country --</option>
                    {countries.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">State Name</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {isLoading ? (
                            <tr><td colSpan="3" className="py-4 text-center text-gray-500">Loading states...</td></tr>
                        ) : states.length > 0 ? (
                            states.map((state, index) => (
                                <tr key={state.id} className="hover:bg-gray-50">
                                    <td className="py-4 px-6 text-sm text-gray-500">{index + 1}</td>
                                    <td className="py-4 px-6 text-sm text-gray-900 font-medium">{state.name}</td>
                                    <td className="py-4 px-6 text-sm">
                                        <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                                        <button className="text-red-600 hover:text-red-900">Delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="py-8 text-center text-gray-500">
                                    {countryId ? "No states found for this country." : "Please select a country to view states."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default State;