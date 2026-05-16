import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../api/axiosInstance';
import { 
    Users, 
    UserPlus, 
    Edit, 
    ShieldAlert, 
    Search, 
    Loader2, 
    ArrowLeft, 
    ShieldCheck, 
    Phone,
    MoreVertical,
    X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const User = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setIsLoading(true);
        setError("");
        try {
            // Updated to your suggested endpoint
            const response = await axiosInstance.get('/Auth/users');
            const data = response.data?.data || response.data || [];
            setUsers(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error fetching users:", err);
            setError("Failed to sync user registry. Please verify the Auth API endpoint.");
        } finally {
            setIsLoading(false);
        }
    };

    const filteredUsers = users.filter(user => 
        (user.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.mobileNo || "").includes(searchTerm)
    );

    const getRoleBadge = (role) => {
        const isAdmin = role?.toLowerCase() === 'admin' || role === 1;
        return (
            <span className={`badge px-3 py-1 rounded-pill ${isAdmin ? 'bg-orange-subtle text-orange' : 'bg-slate-100 text-dark border'}`} 
                  style={isAdmin ? {backgroundColor: '#fff7ed', color: '#ea580c'} : {}}>
                {isAdmin ? 'ADMIN' : 'USER'}
            </span>
        );
    };

    return (
        <div className="container-fluid py-4 px-md-5" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            <style>{`
                .user-hero {
                    background: #0f172a;
                    border-radius: 20px;
                    padding: 25px 30px;
                    border-bottom: 4px solid #ea580c;
                    margin-bottom: 30px;
                }
                .search-box-user {
                    background: rgba(255, 255, 255, 0.08);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    padding: 0 15px;
                    width: 100%;
                    max-width: 350px;
                    transition: 0.3s;
                }
                .search-box-user:focus-within { background: white; border-color: #ea580c; }
                .search-box-user input { border: none; padding: 10px; outline: none; width: 100%; font-size: 0.85rem; background: transparent; }
                .search-box-user:focus-within input { color: #0f172a; }
                
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
                .btn-add-user {
                    background: #ea580c;
                    color: white;
                    border: none;
                    border-radius: 10px;
                    font-weight: 700;
                    padding: 10px 20px;
                    transition: 0.3s;
                    font-size: 0.85rem;
                }
                .btn-add-user:hover { background: #f59e0b; transform: translateY(-1px); }
                .status-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 6px; }
            `}</style>

            {/* Header Area */}
            <div className="user-hero shadow-lg">
                <div className="row align-items-center g-3">
                    <div className="col-md-7">
                        <button className="btn btn-link text-white-50 p-0 mb-2 text-decoration-none d-flex align-items-center small fw-bold" onClick={() => navigate('/admin/dashboard')}>
                            <ArrowLeft size={14} className="me-1" /> DASHBOARD
                        </button>
                        <div className="d-flex align-items-center gap-3">
                            <div className="p-3 rounded-4" style={{ background: 'rgba(234, 88, 12, 0.1)' }}>
                                <Users size={28} style={{ color: '#ea580c' }} />
                            </div>
                            <div>
                                <h3 className="text-white fw-bold mb-0">User Directory</h3>
                                <p className="text-white-50 small mb-0 fw-bold uppercase">System Access & Identity Management</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-5 d-flex justify-content-md-end align-items-center gap-3">
                        <div className="search-box-user shadow-sm">
                            <Search size={16} className="text-white-50" />
                            <input 
                                type="text" 
                                placeholder="Search by name or phone..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="btn-add-user shadow-sm d-flex align-items-center gap-2">
                            <UserPlus size={18} /> <span className="d-none d-lg-inline">ADD USER</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="alert alert-danger border-0 shadow-sm rounded-4 d-flex align-items-center gap-3 mb-4">
                    <ShieldAlert className="text-danger" />
                    <span className="fw-bold small">{error}</span>
                </div>
            )}

            {/* List Section */}
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                <div className="table-responsive">
                    <table className="table table-premium align-middle m-0">
                        <thead>
                            <tr>
                                <th className="ps-4">IDENTITY</th>
                                <th>CONTACT</th>
                                <th>SYSTEM ROLE</th>
                                <th>ACCOUNT STATUS</th>
                                <th className="text-end pe-4">MANAGEMENT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan="5" className="text-center py-5"><Loader2 className="animate-spin mx-auto text-orange" style={{color:'#ea580c'}} /></td></tr>
                            ) : filteredUsers.length > 0 ? filteredUsers.map((user, index) => (
                                <tr key={user.id || index} className="border-bottom hover-row">
                                    <td className="ps-4">
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="bg-slate-100 rounded-circle d-flex align-items-center justify-content-center fw-bold text-slate-500" style={{width:'38px', height:'38px', background: '#f1f5f9'}}>
                                                {user.name?.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                            <div>
                                                <div className="fw-bold text-dark">{user.name || "Unknown User"}</div>
                                                <div className="text-muted" style={{fontSize: '0.7rem'}}>UID: #USR-{user.id || '00'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="d-flex align-items-center gap-2 text-muted small">
                                            <Phone size={12} /> {user.mobileNo || "N/A"}
                                        </div>
                                    </td>
                                    <td>{getRoleBadge(user.role)}</td>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <span className="status-dot" style={{ backgroundColor: user.isActive !== false ? '#10b981' : '#ef4444' }}></span>
                                            <span className="fw-bold small" style={{ color: user.isActive !== false ? '#10b981' : '#ef4444' }}>
                                                {user.isActive !== false ? 'ACTIVE' : 'SUSPENDED'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="text-end pe-4">
                                        <div className="d-flex justify-content-end gap-2">
                                            <button className="btn btn-sm btn-light border p-2" title="Edit Profile">
                                                <Edit size={14} className="text-primary" />
                                            </button>
                                            <button className="btn btn-sm btn-light border p-2" title={user.isActive !== false ? "Suspend" : "Activate"}>
                                                <ShieldCheck size={14} className={user.isActive !== false ? "text-danger" : "text-success"} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-5">
                                        <Users size={48} className="text-muted opacity-25 mb-2 mx-auto d-block" />
                                        <p className="text-muted small fw-bold uppercase">No matching users found in the system registry</p>
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

export default User;