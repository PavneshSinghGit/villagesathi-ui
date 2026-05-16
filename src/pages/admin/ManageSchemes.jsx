import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
    Plus, Edit, Trash2, Save, X, ToggleLeft, ToggleRight, 
    Link as LinkIcon, Building2, ListFilter, ClipboardCheck,
    Search, Loader2, ArrowLeft
} from "lucide-react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function ManageSchemes() {
  const navigate = useNavigate();
  const [schemes, setSchemes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const fetchSchemes = async () => {
    setLoading(true);
    try {
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
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/GovtSchemes/Save`, formData);
      if (response.data.success) {
        Swal.fire({ title: "Success!", text: "Scheme data synchronized.", icon: "success", confirmButtonColor: "#0f172a" });
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
      title: "Delete Scheme?",
      text: "This will remove the scheme from public view.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f43f5e",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete it"
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/GovtSchemes/Delete/${id}`);
        Swal.fire("Deleted!", "Scheme removed.", "success");
        fetchSchemes();
      } catch (err) {
        Swal.fire("Error", "Delete failed.", "error");
      }
    }
  };

  const openEditModal = (scheme) => {
    setFormData({ ...scheme });
    setShowModal(true);
  };

  const filteredSchemes = schemes.filter(s => 
    s.schemeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid py-4 px-md-5" style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <style>{`
        .scheme-hero {
          background: #0f172a;
          border-radius: 20px;
          padding: 25px 30px;
          border-bottom: 4px solid #ea580c;
          margin-bottom: 30px;
        }
        .search-box-scheme {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 8px 15px;
          display: flex;
          align-items: center;
          width: 100%;
          max-width: 300px;
          transition: 0.3s;
        }
        .search-box-scheme:focus-within { background: white; border-color: #ea580c; }
        .search-box-scheme input { background: transparent; border: none; outline: none; color: white; width: 100%; padding-left: 10px; font-size: 0.85rem; }
        .search-box-scheme:focus-within input { color: #0f172a; }

        .table-premium thead th {
          background: #f8fafc;
          font-size: 0.65rem;
          font-weight: 800;
          color: #64748b;
          letter-spacing: 1px;
          padding: 15px;
        }
        .status-pill { padding: 4px 12px; border-radius: 50px; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; }
        .btn-add-scheme { background: #ea580c; color: white; border: none; font-weight: 700; border-radius: 10px; padding: 10px 20px; transition: 0.3s; }
        .btn-add-scheme:hover { background: #f59e0b; transform: translateY(-2px); }
        
        .modal-premium { border-radius: 24px; overflow: hidden; }
        .modal-header-premium { background: #0f172a; color: white; border-bottom: 4px solid #ea580c; }
        .form-label-premium { font-size: 0.7rem; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 5px; }
        .input-premium { border-radius: 10px; border: 1px solid #e2e8f0; padding: 10px; font-size: 0.9rem; font-weight: 600; }
        .input-premium:focus { border-color: #ea580c; box-shadow: 0 0 0 4px rgba(234, 88, 12, 0.05); outline: none; }
      `}</style>

      {/* Header Area */}
      <div className="scheme-hero shadow-lg">
        <div className="row align-items-center g-3">
          <div className="col-md-6">
            <button className="btn btn-link text-white-50 p-0 mb-2 text-decoration-none d-flex align-items-center small fw-bold" onClick={() => navigate('/admin/dashboard')}>
                <ArrowLeft size={14} className="me-1" /> DASHBOARD
            </button>
            <div className="d-flex align-items-center gap-3">
              <Building2 className="text-orange" size={32} style={{color: '#ea580c'}} />
              <div>
                <h3 className="text-white fw-bold mb-0">Schemes Manager</h3>
                <p className="text-white-50 small mb-0 fw-bold">Welfare & Government Grant Catalog</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="d-flex justify-content-md-end align-items-center gap-3">
              <div className="search-box-scheme shadow-sm">
                <Search size={16} className="text-white-50" />
                <input type="text" placeholder="Search schemes..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <button className="btn-add-scheme d-flex align-items-center gap-2 shadow-sm" onClick={() => { setFormData(initialForm); setShowModal(true); }}>
                <Plus size={18} /> ADD NEW
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
        <div className="table-responsive">
          <table className="table table-premium align-middle m-0">
            <thead>
              <tr>
                <th className="ps-4">REFERENCE ID</th>
                <th>SCHEME NAME</th>
                <th>CATEGORY</th>
                <th>PORTAL LINK</th>
                <th>STATUS</th>
                <th className="text-end pe-4">MANAGEMENT</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center py-5"><Loader2 className="animate-spin mx-auto text-orange" style={{color:'#ea580c'}} /></td></tr>
              ) : filteredSchemes.map(s => (
                <tr key={s.id}>
                  <td className="ps-4 fw-bold text-muted">#GS-{s.id}</td>
                  <td><div className="fw-bold text-dark">{s.schemeName}</div></td>
                  <td><span className="badge bg-slate-100 text-dark border p-2" style={{fontSize:'0.65rem', background:'#f1f5f9'}}>{s.category?.toUpperCase()}</span></td>
                  <td>
                    {s.link ? <a href={s.link} target="_blank" rel="noreferrer" className="text-orange" style={{color:'#ea580c'}}><LinkIcon size={18} /></a> : <span className="text-muted opacity-50">N/A</span>}
                  </td>
                  <td>
                    <span className={`status-pill ${s.isActive ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                        {s.isActive ? "● Active" : "● Hidden"}
                    </span>
                  </td>
                  <td className="text-end pe-4">
                    <button className="btn btn-sm btn-light border me-2" onClick={() => openEditModal(s)}><Edit size={16} className="text-primary" /></button>
                    <button className="btn btn-sm btn-light border" onClick={() => handleDelete(s.id)}><Trash2 size={16} className="text-danger" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal - Optimized for Height */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', zIndex: 1060 }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content modal-premium border-0 shadow-lg">
              <form onSubmit={handleSave}>
                <div className="modal-header modal-header-premium">
                  <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                    {formData.id > 0 ? <Edit size={20}/> : <Plus size={20}/>}
                    {formData.id > 0 ? "Edit Scheme Detail" : "Register New Scheme"}
                  </h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body p-4 bg-white">
                  <div className="row g-3">
                    <div className="col-md-8">
                      <label className="form-label-premium">Scheme Title</label>
                      <input type="text" className="form-control input-premium" value={formData.schemeName} onChange={e => setFormData({...formData, schemeName: e.target.value})} required />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label-premium">Category</label>
                      <select className="form-select input-premium" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                        <option value="Agriculture">Agriculture</option>
                        <option value="Health">Health</option>
                        <option value="Education">Education</option>
                        <option value="Social Welfare">Social Welfare</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label-premium">Portal Link (URL)</label>
                      <input type="url" className="form-control input-premium" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} placeholder="https://" />
                    </div>
                    <div className="col-12">
                      <label className="form-label-premium">Brief Description</label>
                      <textarea className="form-control input-premium" rows="2" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label-premium">Eligibility Criteria</label>
                      <textarea className="form-control input-premium" rows="3" value={formData.eligibility} onChange={e => setFormData({...formData, eligibility: e.target.value})}></textarea>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label-premium">Key Benefits</label>
                      <textarea className="form-control input-premium" rows="3" value={formData.benefits} onChange={e => setFormData({...formData, benefits: e.target.value})} placeholder="Benefit 1, Benefit 2..."></textarea>
                    </div>
                    <div className="col-12">
                      <div className="form-check form-switch p-3 border rounded-3 bg-light d-flex align-items-center">
                        <input className="form-check-input ms-0 me-3" type="checkbox" id="isActive" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} />
                        <label className="form-check-label fw-bold text-dark" htmlFor="isActive">Enable Public Visibility</label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer bg-light border-0 px-4">
                  <button type="button" className="btn btn-secondary px-4 fw-bold" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-dark px-4 fw-bold d-flex align-items-center gap-2" style={{background:'#0f172a'}}>
                    <Save size={18} /> SYNC DATA
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