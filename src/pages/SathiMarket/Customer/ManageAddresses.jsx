import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../../api/axiosInstance';
import { toast } from 'react-toastify';
import { 
    MapPin, Loader2, ArrowLeft, 
    Home, ShieldCheck, Trash2, PlusCircle, Edit3, X 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const ManageAddresses = () => {
    const user = JSON.parse(localStorage.getItem('customerUser'));
    const navigate = useNavigate();
    const userId = user?.userId || user?.UserId;

    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const getInitialForm = () => ({
        userId,
        actionType: 1,   // 1 = Add, 2 = Update
        addressId: 0,
        fullAddress: '',
        landmark: '',
        city: '',
        state: '',
        pincode: ''
    });

    const [formData, setFormData] = useState(getInitialForm());

  const fetchAddresses = useCallback(async () => {
    if (!userId) return;
    setFetching(true);
    try {
        const res = await axiosInstance.post('/Customer/ManageAddress', {
            userId,
            actionType: 3,
            addressId: 0, fullAddress: '', landmark: '', city: '', state: '', pincode: ''
        });
        console.log("RAW RESPONSE:", res.data); // 👈 check browser console
        if (res.data && Array.isArray(res.data)) {
            setAddresses(res.data);
        } else {
            setAddresses([]);
        }
    } catch (err) {
        console.error("Fetch error:", err.response?.data || err.message); // 👈 full error
        toast.error("Could not load addresses.");
    } finally {
        setFetching(false);
    }
}, [userId]);

    useEffect(() => { fetchAddresses(); }, [fetchAddresses]);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axiosInstance.post('/Customer/ManageAddress', formData);
            // Handle both wrapped and unwrapped responses
            const result = res.data?.Data ?? (Array.isArray(res.data) ? res.data[0] : res.data);

            if (result?.Success || result?.success) {
                toast.success(result.Message || (isEditing ? "Address updated!" : "Address added!"));
                resetForm();
                fetchAddresses();
            } else {
                toast.error(result?.Message || "Operation failed.");
            }
        } catch {
            toast.error("Server error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this address?")) return;
        try {
            const res = await axiosInstance.post('/Customer/ManageAddress', {
                actionType: 4,
                userId,
                addressId: id,
                fullAddress: '', landmark: '', city: '', state: '', pincode: ''
            });
            const result = res.data?.Data ?? (Array.isArray(res.data) ? res.data[0] : res.data);
            if (result?.Success || result?.success) {
                toast.info("Address deleted.");
                fetchAddresses();
            }
        } catch {
            toast.error("Delete failed.");
        }
    };

    // ✅ KEY FIX: actionType = 2 for edit
    const startEdit = (addr) => {
        setIsEditing(true);
        setFormData({
            userId,
            actionType: 2,          // ← UPDATE
            addressId: addr.Id,
            fullAddress: addr.FullAddress,
            landmark: addr.Landmark || '',
            city: addr.City,
            state: addr.State,
            pincode: addr.Pincode
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setIsEditing(false);
        setFormData(getInitialForm());  // ← actionType resets to 1 (Add)
    };

    return (
        <main className="pb-5 animate-fade-in" style={{ backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
            <Helmet><title>Addresses | VillageSathi</title></Helmet>

            <style>{`
                .slim-header { background: #721a61; color: white; padding: 15px 0; border-bottom: 3px solid #ffc200; position: sticky; top: 0; z-index: 1000; }
                .form-card { background: white; border-radius: 12px; padding: 24px; border: 1px solid #e0e0e0; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
                .address-item { background: white; border-radius: 12px; padding: 16px; border: 1px solid #eee; transition: 0.2s; }
                .address-item:hover { border-color: #721a61; }
                .input-field { border: 1px solid #ddd; padding: 10px; border-radius: 6px; font-size: 14px; width: 100%; outline: none; transition: 0.2s; }
                .input-field:focus { border-color: #721a61; box-shadow: 0 0 0 2px rgba(114,26,97,0.1); }
                .btn-mesho { background: #721a61; color: white; border: none; font-weight: bold; transition: 0.3s; }
                .btn-mesho:hover { background: #af64a0; color: white; }
                .icon-bg { width: 40px; height: 40px; background: #fdf0f9; color: #721a61; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
                .edit-mode-banner { background: #fff8e1; border: 1px solid #ffc200; border-radius: 8px; padding: 10px 14px; font-size: 13px; color: #7a5c00; }
            `}</style>

            <header className="slim-header shadow-sm">
                <div className="container d-flex align-items-center">
                    <button onClick={() => navigate(-1)} className="btn text-white p-0 me-3 border-0 shadow-none">
                        <ArrowLeft size={24}/>
                    </button>
                    <h1 className="h6 mb-0 fw-bold">Manage Addresses</h1>
                </div>
            </header>

            <div className="container mt-4">
                <div className="row g-4">

                    {/* ── FORM ── */}
                    <div className="col-lg-5">
                        <div className="form-card">
                            {/* Edit mode banner */}
                            {isEditing && (
                                <div className="edit-mode-banner mb-3 d-flex justify-content-between align-items-center">
                                    <span>✏️ Editing saved address</span>
                                    <button className="btn btn-sm btn-light border text-muted px-2 py-1" onClick={resetForm}>
                                        <X size={14} className="me-1"/>Cancel
                                    </button>
                                </div>
                            )}

                            <h2 className="h6 fw-bold mb-3" style={{color: '#721a61'}}>
                                {isEditing ? "Update Address" : "Add New Address"}
                            </h2>

                            <form onSubmit={handleSubmit} className="row g-3">
                                <div className="col-12">
                                    <label className="form-label extra-small fw-bold text-muted text-uppercase mb-1">
                                        Area / Street / House No <span className="text-danger">*</span>
                                    </label>
                                    <textarea
                                        className="input-field"
                                        name="fullAddress"
                                        rows="3"
                                        required
                                        placeholder="e.g. House No. 12, MG Road"
                                        value={formData.fullAddress}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-12">
                                    <label className="form-label extra-small fw-bold text-muted text-uppercase mb-1">
                                        Landmark <span className="text-muted">(Optional)</span>
                                    </label>
                                    <input
                                        className="input-field"
                                        name="landmark"
                                        type="text"
                                        placeholder="e.g. Near State Bank"
                                        value={formData.landmark}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-6">
                                    <label className="form-label extra-small fw-bold text-muted text-uppercase mb-1">
                                        Town / City <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        className="input-field"
                                        name="city"
                                        type="text"
                                        required
                                        placeholder="e.g. Lucknow"
                                        value={formData.city}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-6">
                                    <label className="form-label extra-small fw-bold text-muted text-uppercase mb-1">
                                        Pincode <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        className="input-field"
                                        name="pincode"
                                        type="text"
                                        maxLength="6"
                                        required
                                        placeholder="e.g. 226001"
                                        value={formData.pincode}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-12">
                                    <label className="form-label extra-small fw-bold text-muted text-uppercase mb-1">
                                        State <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        className="input-field"
                                        name="state"
                                        type="text"
                                        required
                                        placeholder="e.g. Uttar Pradesh"
                                        value={formData.state}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-12 mt-2">
                                    <button
                                        type="submit"
                                        className="btn btn-mesho w-100 py-2 d-flex align-items-center justify-content-center gap-2 rounded-2 shadow-sm"
                                        disabled={loading}
                                    >
                                        {loading
                                            ? <Loader2 size={18} className="spin"/>
                                            : isEditing ? <Edit3 size={18}/> : <PlusCircle size={18}/>
                                        }
                                        {loading ? "SAVING..." : isEditing ? "UPDATE ADDRESS" : "SAVE ADDRESS"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* ── ADDRESS LIST ── */}
                    <div className="col-lg-7">
                        <div className="d-flex align-items-center gap-2 mb-3 px-1">
                            <MapPin size={18} style={{color: '#721a61'}}/>
                            <h3 className="h6 fw-bold mb-0 text-muted text-uppercase">Your Saved Addresses</h3>
                            <span className="badge rounded-pill ms-auto" style={{background:'#721a61'}}>
                                {addresses.length}/5
                            </span>
                        </div>

                        {fetching ? (
                            <div className="text-center py-5">
                                <Loader2 size={30} style={{color:'#721a61'}} className="spin"/>
                            </div>
                        ) : addresses.length > 0 ? (
                            <div className="vstack gap-3">
                                {addresses.map((addr) => (
                                    <div
                                        className={`address-item shadow-sm d-flex justify-content-between align-items-start ${formData.addressId === addr.Id && isEditing ? 'border-warning' : ''}`}
                                        key={addr.Id}
                                    >
                                        <div className="d-flex align-items-start gap-3">
                                            <div className="icon-bg"><Home size={20}/></div>
                                            <div>
                                                <p className="fw-bold mb-1 text-dark small">{addr.FullAddress}</p>
                                                <p className="text-muted extra-small mb-0">
                                                    {addr.Landmark && `${addr.Landmark}, `}
                                                    {addr.City}, {addr.State} — {addr.Pincode}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="d-flex gap-1 flex-shrink-0">
                                            <button
                                                className="btn btn-link text-primary p-2"
                                                onClick={() => startEdit(addr)}
                                                title="Edit this address"
                                            >
                                                <Edit3 size={18}/>
                                            </button>
                                            <button
                                                className="btn btn-link text-danger p-2"
                                                onClick={() => handleDelete(addr.Id)}
                                                title="Delete this address"
                                            >
                                                <Trash2 size={18}/>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-5 bg-white rounded-4 border border-dashed">
                                <MapPin size={40} className="text-muted opacity-25 mb-2"/>
                                <p className="small text-muted mb-0">No addresses saved yet. Add one above!</p>
                            </div>
                        )}

                        <div className="mt-4 p-3 rounded-3 border d-flex align-items-center gap-3 bg-white">
                            <ShieldCheck size={20} className="text-success flex-shrink-0"/>
                            <p className="mb-0 extra-small fw-bold text-muted">
                                Maximum 5 addresses can be saved per account.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
};

export default ManageAddresses;