import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Edit, Trash2, Save, X, ToggleLeft, ToggleRight, Link as LinkIcon } from "lucide-react";
import Swal from "sweetalert2";

function ManageSchemes() {
  const [schemes, setSchemes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Saare columns as per your GovtSchemes Table
  const initialForm = {
    id: 0,
    schemeName: "",
    description: "",
    eligibility: "",
    link: "",
    category: "Agriculture",
    benefits: "",
    isActive: true
  };

  const [formData, setFormData] = useState(initialForm);

  // --- API CALLS ---
  const fetchSchemes = async () => {
    setLoading(true);
    try {
      // Is endpoint ko apne backend ke hisaab se check karein (GetAll ya GetActiveSchemes)
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/GovtSchemes/GetAll`); 
      setSchemes(res.data.data || []);
    } catch (err) {
      console.error("Error fetching schemes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSchemes(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      // Request Body as per your JSON requirement
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/GovtSchemes/Save`, formData);
      
      if (response.data.success) {
        Swal.fire("Saved!", "Scheme has been updated.", "success");
        setShowModal(false);
        fetchSchemes();
        setFormData(initialForm);
      }
    } catch (err) {
      Swal.fire("Error", "Failed to save scheme.", "error");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/GovtSchemes/Delete/${id}`);
        Swal.fire("Deleted!", "Scheme has been removed.", "success");
        fetchSchemes();
      } catch (err) {
        Swal.fire("Error", "Delete failed.", "error");
      }
    }
  };

  const openEditModal = (scheme) => {
    setFormData({
      id: scheme.id,
      schemeName: scheme.schemeName || "",
      description: scheme.description || "",
      eligibility: scheme.eligibility || "",
      link: scheme.link || "",
      category: scheme.category || "Agriculture",
      benefits: scheme.benefits || "",
      isActive: scheme.isActive
    });
    setShowModal(true);
  };

  return (
    <div className="container-fluid py-4" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <div className="card shadow-sm border-0 rounded-3">
        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold text-dark">🏛️ Government Schemes Manager</h5>
          <button className="btn btn-success d-flex align-items-center gap-2" onClick={() => { setFormData(initialForm); setShowModal(true); }}>
            <Plus size={18} /> Add New Scheme
          </button>
        </div>

        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Scheme Name</th>
                  <th>Category</th>
                  <th>Link</th>
                  <th>Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                   <tr><td colSpan="6" className="text-center">Loading...</td></tr>
                ) : schemes.map(s => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td><span className="fw-bold">{s.schemeName}</span></td>
                    <td><span className="badge bg-primary bg-opacity-10 text-primary">{s.category}</span></td>
                    <td>
                        {s.link ? <a href={s.link} target="_blank" rel="noreferrer"><LinkIcon size={16} /></a> : "-"}
                    </td>
                    <td>
                      {s.isActive ? 
                        <span className="text-success d-flex align-items-center gap-1"><ToggleRight size={18}/> Active</span> : 
                        <span className="text-danger d-flex align-items-center gap-1"><ToggleLeft size={18}/> Inactive</span>
                      }
                    </td>
                    <td className="text-center">
                      <button className="btn btn-sm btn-info text-white me-2" onClick={() => openEditModal(s)}>
                        <Edit size={16} />
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(s.id)}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- FULL FORM MODAL --- */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <form onSubmit={handleSave}>
                <div className="modal-header bg-dark text-white">
                  <h5 className="modal-title">{formData.id > 0 ? "✏️ Edit Scheme" : "➕ Add New Scheme"}</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    {/* Name & Category */}
                    <div className="col-md-8">
                      <label className="form-label fw-bold">Scheme Name</label>
                      <input type="text" className="form-control" value={formData.schemeName} onChange={e => setFormData({...formData, schemeName: e.target.value})} required placeholder="Enter scheme title" />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-bold">Category</label>
                      <select className="form-select" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                        <option value="Agriculture">Agriculture</option>
                        <option value="Health">Health</option>
                        <option value="Education">Education</option>
                        <option value="Finance">Finance</option>
                        <option value="Social Welfare">Social Welfare</option>
                      </select>
                    </div>

                    {/* Official Link */}
                    <div className="col-12">
                      <label className="form-label fw-bold">Official Link (URL)</label>
                      <input type="url" className="form-control" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} placeholder="https://example.gov.in" />
                    </div>

                    {/* Description */}
                    <div className="col-12">
                      <label className="form-label fw-bold">Description</label>
                      <textarea className="form-control" rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Main summary of the scheme"></textarea>
                    </div>

                    {/* Eligibility */}
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Eligibility Details</label>
                      <textarea className="form-control" rows="4" value={formData.eligibility} onChange={e => setFormData({...formData, eligibility: e.target.value})} placeholder="Who can apply?"></textarea>
                    </div>

                    {/* Benefits */}
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Benefits (Comma separated)</label>
                      <textarea className="form-control" rows="4" value={formData.benefits} onChange={e => setFormData({...formData, benefits: e.target.value})} placeholder="Benefit 1, Benefit 2, Benefit 3"></textarea>
                    </div>

                    {/* Status Toggle */}
                    <div className="col-12">
                      <div className="form-check form-switch border p-3 rounded bg-light">
                        <input className="form-check-input ms-0 me-2" type="checkbox" id="isActive" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} />
                        <label className="form-check-label fw-bold" htmlFor="isActive">Show this scheme to public (Active Status)</label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer bg-light">
                  <button type="button" className="btn btn-secondary px-4" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-success px-4 d-flex align-items-center gap-2">
                    <Save size={18} /> Save Scheme Data
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageSchemes;