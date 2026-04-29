import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Country = () => {
  const [countries, setCountries] = useState([]);
  const [formData, setFormData] = useState({ id: 0, name: '' });
  const [loading, setLoading] = useState(false);

  // .env se API URL uthana
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  // 1. Data Fetch Function
  const fetchCountries = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Master/GetAll/Country`);
      setCountries(Array.isArray(response.data) ? response.data : (response.data.data || []));
    } catch (error) {
      console.error("Error fetching countries:", error);
      // Agar API down ho ya URL galat ho
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  // 2. Form Input Handling
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Save or Update (POST)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      return Swal.fire('Wait!', 'Please enter a country name.', 'warning');
    }

    setLoading(true);
    try {
      // Dono Add aur Update isi ek POST endpoint se handle honge (Backend logic ke hisaab se)
      const response = await axios.post(`${API_BASE_URL}/Master/SaveCountry`, formData);

      if (response.data) {
        Swal.fire({
          icon: 'success',
          title: formData.id > 0 ? 'Updated!' : 'Saved!',
          text: `Country has been ${formData.id > 0 ? 'updated' : 'added'} successfully.`,
          timer: 2000,
          showConfirmButton: false
        });

        setFormData({ id: 0, name: '' }); // Reset Form
        fetchCountries(); // Refresh List
      }
    } catch (error) {
      Swal.fire('Error', 'Failed to save data. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 4. Edit Function
  const handleEdit = (item) => {
    // Dapper normally returns PascalCase fields
    setFormData({
      id: item.Id || item.id,
      name: item.Name || item.name
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">

        {/* Page Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-extrabold text-gray-800">Country Master</h2>
          <p className="text-gray-600">Setup and manage countries for Village Sathi platform.</p>
        </div>

        {/* Input Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
          <form onSubmit={handleSubmit} className="form-section">
            <div className="row">
              <div className="col-md-6 mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Country Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. India" className="form-control"/>
              </div>
              <div className="col-md-6 mb-4 flex items-end gap-2">
                <button type="submit" disabled={loading} className="btn btn-primary">
                  {loading ? 'Processing...' : formData.id > 0 ? 'Update Country' : 'Save Country'} </button>

                {formData.id > 0 && (
                  <button type="button" onClick={() => setFormData({ id: 0, name: '' })} className="btn btn-secondary">Cancel</button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* List Table */}
        <div className="table-responsive border rounded-lg">
          <table className="table table-hover w-full">
            <thead className="table-dark">
              <tr>
                <th className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sr. No.</th>
                <th className="text-xs font-bold text-gray-500 uppercase tracking-wider">Country Name</th>
                <th className="text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {countries.length > 0 ? (
                countries.map((item, index) => (
                  <tr key={item.Id || item.id} className="hover:bg-blue-50/30 transition">
                    <td className="text-sm text-gray-600">{index + 1}</td>
                    <td className="text-sm font-semibold text-gray-800">{item.Name || item.name}</td>
                    <td className="text-right">
                      <button onClick={() => handleEdit(item)} className="btn btn-warning btn-sm">Edit</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-10 text-center text-gray-400 italic">
                    No countries found in the database.
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

// YEH LINE SABSE ZARURI HAI
export default Country;