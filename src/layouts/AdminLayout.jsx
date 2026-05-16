import React, { useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { LogOut, ExternalLink, Menu, X, ShieldCheck, UserCircle } from 'lucide-react';

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleLogout = () => {
        if (window.confirm("Terminate secure administrative session?")) {
            localStorage.clear();
            navigate("/admin/login", { replace: true });
        }
    };

    const pageTitle = useMemo(() => {
        const path = location.pathname.split('/').filter(Boolean).pop();
        if (!path || path === 'admin') return "System Overview";
        return path.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }, [location.pathname]);

    return (
        <div className="d-flex" style={{ height: '100vh', width: '100vw', overflow: 'hidden', backgroundColor: '#f8fafc' }}>
            
            <style>{`
                .admin-header-btn {
                    width: 38px;
                    height: 38px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 10px;
                    background: #f1f5f9;
                    color: #0f172a;
                    border: 1px solid #e2e8f0;
                    transition: 0.2s;
                }
                .admin-header-btn:hover {
                    background: #0f172a;
                    color: #fff;
                    border-color: #0f172a;
                }
                .btn-live-site {
                    background: #fff7ed;
                    color: #ea580c;
                    border: 1px solid #ffedd5;
                    font-weight: 700;
                    font-size: 0.75rem;
                    transition: 0.2s;
                }
                .btn-live-site:hover {
                    background: #ea580c;
                    color: #fff;
                }
                .profile-badge {
                    background: #0f172a;
                    color: #ea580c;
                    font-size: 0.6rem;
                    font-weight: 800;
                    padding: 2px 8px;
                    border-radius: 4px;
                    letter-spacing: 0.5px;
                }
            `}</style>

            {/* SIDEBAR ASIDE */}
            <aside 
                style={{ 
                    width: isSidebarOpen ? '270px' : '0px',
                    overflow: 'hidden',
                    transition: 'width 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                    flexShrink: 0, 
                    height: '100%', 
                    backgroundColor: '#090f1e',
                    boxShadow: isSidebarOpen ? '10px 0 30px rgba(0,0,0,0.05)' : 'none',
                    zIndex: 100
                }} 
            >
                <div style={{ width: '270px' }}> 
                    <Sidebar />
                </div>
            </aside>

            {/* MAIN VIEWPORT */}
            <div className="d-flex flex-column flex-grow-1" style={{ minWidth: 0 }}>

                {/* PREMIUM ADMIN HEADER */}
                <header style={{ 
                    height: '75px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    padding: '0 30px', 
                    backgroundColor: '#fff', 
                    borderBottom: '1px solid #e2e8f0', 
                    flexShrink: 0 
                }}>
                    
                    <div className="d-flex align-items-center gap-3">
                        <button 
                            className="admin-header-btn shadow-sm"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        >
                            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>

                        <div className="d-none d-md-block ms-2">
                            <h4 className="fw-900 text-dark mb-0" style={{ fontSize: '1.15rem', letterSpacing: '-0.5px' }}>{pageTitle}</h4>
                            <div className="d-flex align-items-center gap-1 text-muted" style={{ fontSize: '0.65rem', fontWeight: '800' }}>
                                <span>ADMIN</span>
                                <span className="opacity-50">/</span>
                                <span className="text-orange" style={{color: '#ea580c'}}>{pageTitle?.toUpperCase()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="d-flex align-items-center gap-4">
                        <Link to="/home" className="btn btn-sm btn-live-site rounded-pill px-3 d-none d-lg-flex align-items-center gap-2 shadow-sm">
                            <ExternalLink size={14} /> VIEW PUBLIC SITE
                        </Link>
                        
                        <div className="d-flex align-items-center gap-3 border-start ps-4">
                            <div className="text-end d-none d-sm-block">
                                <div className="d-flex align-items-center gap-2 justify-content-end">
                                    <span className="profile-badge">SUPER ADMIN</span>
                                    <p className="m-0 fw-bold text-dark" style={{ fontSize: '0.85rem' }}>Pavnesh Singh</p>
                                </div>
                                <p className="m-0 fw-bold" style={{ fontSize: '0.65rem', color: '#10b981' }}>SYSTEM SECURE • ONLINE</p>
                            </div>
                            
                            <div className="dropdown">
                                <button 
                                    className="btn p-0 border-0"
                                    onClick={handleLogout}
                                    title="Security Logout"
                                >
                                    <div className="bg-light rounded-circle d-flex align-items-center justify-content-center border" style={{ width: '42px', height: '42px' }}>
                                        <LogOut size={18} className="text-danger" />
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* DYNAMIC SCROLLABLE CONTENT */}
                <main style={{ 
                    flex: 1, 
                    overflowY: 'auto', 
                    padding: '30px', 
                    backgroundColor: '#f8fafc',
                    backgroundImage: 'radial-gradient(#e2e8f0 0.5px, transparent 0.5px)',
                    backgroundSize: '24px 24px'
                }}>
                    <div className="container-fluid p-0">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;