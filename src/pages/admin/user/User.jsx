import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../api/axiosInstance'; // Path verify kar lena

const User = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // Component load hote hi users fetch karein
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setIsLoading(true);
        setError("");
        
        try {
            // NOTE: Aapki Swagger API list me "Get All Users" ka route nahi tha.
            // Maine yahan '/Auth/users' use kiya hai. Kripya apne .NET backend 
            // ke hisaab se is endpoint ko update kar lena.
            const response = await axiosInstance.get('/Auth/users');
            
            // Assume kar rahe hain response.data ek array hai
            setUsers(response.data || []);
        } catch (err) {
            console.error("Error fetching users:", err);
            // Agar API abhi ready nahi hai, toh yeh error dikhega
            setError("Failed to load users. Please check if the API endpoint is correct and running.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
                <button className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 font-medium">
                    + Add New User
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {/* Users Data Table */}
            <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile No.</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {isLoading ? (
                            <tr>
                                <td colSpan="6" className="py-8 text-center text-gray-500">
                                    Loading users data...
                                </td>
                            </tr>
                        ) : users.length > 0 ? (
                            users.map((user, index) => (
                                <tr key={user.id || index} className="hover:bg-gray-50">
                                    <td className="py-4 px-6 text-sm text-gray-500">{index + 1}</td>
                                    
                                    <td className="py-4 px-6 text-sm text-gray-900 font-medium">
                                        {user.name || "N/A"}
                                    </td>
                                    
                                    <td className="py-4 px-6 text-sm text-gray-500">
                                        {user.mobileNo || "N/A"}
                                    </td>
                                    
                                    <td className="py-4 px-6 text-sm">
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                                            {user.role || "User"}
                                        </span>
                                    </td>
                                    
                                    <td className="py-4 px-6 text-sm">
                                        {/* Status badge: Active (Green) / Inactive (Red) */}
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                                            ${user.isActive !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {user.isActive !== false ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    
                                    <td className="py-4 px-6 text-sm">
                                        <button className="text-blue-600 hover:text-blue-900 mr-3 font-medium">Edit</button>
                                        <button className="text-red-600 hover:text-red-900 font-medium">Suspend</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="py-8 text-center text-gray-500">
                                    No users found in the system. 
                                    <br/>
                                    <span className="text-xs text-gray-400">(Check if your backend API is returning data)</span>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default User;