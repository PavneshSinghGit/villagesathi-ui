import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Globe, PlusCircle, Edit, X, Search, Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Country = () => {
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);
  const [formData, setFormData] = useState({ id: 0, name: '' });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const fetchCountries = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Master/GetAll/Country`);
      setCountries(Array.isArray(response.data) ? response.data : (response.data.data || []));
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      return Swal.fire({
        title: 'Wait!',
        text: 'Please enter a country name.',
        icon: 'warning',
        confirmButtonColor: '#0f172a'
      });
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/Master/SaveCountry`, formData);
      if (response.data) {
        Swal.fire({
          icon: 'success',
          title: formData.id > 0 ? 'Record Synchronized!' : 'Record Saved!',
          text: `Country data has been updated successfully.`,
          timer: 2000,
          showConfirmButton: false
        });

        setFormData({ id: 0, name: '' });
        fetchCountries();
      }
    } catch (error) {
      Swal.fire('Error', 'System synchronization failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      id: item.Id || item.id,
      name: item.Name || item.name
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredCountries = countries.filter(c => 
    (c.Name || c.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid py-4 px-md-5" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <style>{`
        .country-hero {
          background: #0f172a;
          border-radius: 20px;
          padding: 25px 30px;
          border-bottom: 4px solid #ea580c;
          margin-bottom: 30px;
        }
        .form-card-premium {
          background: white;
          border-radius: 18px;
          border: 1px solid #e2e8f0;
          padding: 20px;
          margin-top: -20px;
          position: relative;
          z-index: 10;
        }
        .input-premium-master {
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          padding: 10px 15px;
          font-size: 0.9rem;
          font-weight: 600;
          background: #f8fafc;
          transition: 0.2s;
        }
        .input-premium-master:focus {
          border-color: #ea580c;
          background: white;
          box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.05);
          outline: none;
        }
        .btn-master-save {
          background: #0f172a;
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 700;
          padding: 10px 25px;
          transition: 0.3s;
        }
        .btn-master-save:hover { background: #ea580c; transform: translateY(-1px); }
        .table-premium thead th {
          background: #f8fafc;
          font-size: 0.65rem;
          font-weight: 800;
          color: #64748b;
          letter-spacing: 1px;
          text-transform: uppercase;
          padding: 15px;
          border: none;
        }
        .search-box-master {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          display: flex;
          align-items: center;
          padding: 0 15px;
          width: 100%;
          max-width: 300px;
        }
        .search-box-master input { border: none; padding: 10px; outline: none; width: 100%; font-size: 0.85rem; }
      `}</style>

      {/* Header Area */}
      <div className="country-hero shadow-lg">
        <div className="row align-items-center">
          <div className="col-md-8">
            <button className="btn btn-link text-white-50 p-0 mb-2 text-decoration-none d-flex align-items-center small fw-bold" onClick={() => navigate('/admin/dashboard')}>
              <ArrowLeft size={14} className="me-1" /> DASHBOARD
            </button>
            <div className="d-flex align-items-center gap-3">
              <div className="p-3 rounded-4" style={{ background: 'rgba(234, 88, 12, 0.1)' }}>
                <Globe size={28} style={{ color: '#ea580c' }} />
              </div>
              <div>
                <h3 className="text-white fw-bold mb-0">Country Master</h3>
                <p className="text-white-50 small mb-0 fw-bold uppercase">Global Location Configuration</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-11">
          {/* Input Panel */}
          <div className="form-card-premium shadow-sm mb-4">
            <form onSubmit={handleSubmit}>
              <div className="row g-3 align-items-end">
                <div className="col-md-6">
                  <label className="small fw-bold text-muted mb-2 uppercase tracking-widest">Entry Name</label>
                  <input
                    type="text"
                    name="name"
                    className="input-premium-master w-100"
                    placeholder="e.g. India"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6 d-flex gap-2">
                  <button type="submit" disabled={loading} className="btn-master-save shadow-sm d-flex align-items-center gap-2 flex-grow-1 justify-content-center">
                    {loading ? <Loader2 size={18} className="animate-spin" /> : formData.id > 0 ? <Edit size={18} /> : <PlusCircle size={18} />}
                    {formData.id > 0 ? 'UPDATE COUNTRY' : 'SAVE COUNTRY'}
                  </button>
                  {formData.id > 0 && (
                    <button type="button" onClick={() => setFormData({ id: 0, name: '' })} className="btn btn-light border px-4 rounded-3 fw-bold text-muted d-flex align-items-center gap-2">
                      <X size={18} /> CANCEL
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* List Section */}
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
            <div className="p-4 border-bottom d-flex justify-content-between align-items-center flex-wrap gap-3">
              <h5 className="fw-bold m-0 text-dark">Geographic Registry</h5>
              <div className="search-box-master shadow-sm">
                <Search size={16} className="text-muted" />
                <input 
                  type="text" 
                  placeholder="Find country..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                />
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-premium align-middle m-0">
                <thead>
                  <tr>
                    <th className="ps-4">SERIAL NO.</th>
                    <th>COUNTRY NAME</th>
                    <th>ENTITY ID</th>
                    <th className="text-end pe-4">MANAGEMENT</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCountries.length > 0 ? filteredCountries.map((item, index) => (
                    <tr key={item.Id || item.id} className="border-bottom">
                      <td className="ps-4 text-muted small fw-bold">{index + 1}</td>
                      <td><div className="fw-bold text-dark">{item.Name || item.name}</div></td>
                      <td><span className="badge bg-slate-100 text-dark border p-2" style={{ fontSize: '0.65rem', background: '#f1f5f9' }}>#ID-{item.Id || item.id}</span></td>
                      <td className="text-end pe-4">
                        <button onClick={() => handleEdit(item)} className="btn btn-sm btn-light border text-primary fw-bold rounded-pill px-3 transition-all hover:bg-primary hover:text-white">
                          <Edit size={14} className="me-1" /> MODIFY
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="text-center py-5">
                        <Globe size={48} className="text-muted opacity-25 mb-2 mx-auto d-block" />
                        <p className="text-muted small fw-bold uppercase">No records found in geographic registry</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Country;