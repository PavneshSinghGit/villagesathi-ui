import React, { useMemo, useState } from 'react'; // 1. useState import kiya
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { LogOut, ExternalLink, Menu, X } from 'lucide-react'; // 2. Icons add kiye

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // 3. Sidebar state (Initially true yaani open)
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleLogout = () => {
        if (window.confirm("Do you want to logout?")) {
            localStorage.clear();
            navigate("/admin/login", { replace: true });
        }
    };

    const pageTitle = useMemo(() => {
        const path = location.pathname.split('/').filter(Boolean).pop();
        if (!path || path === 'admin') return "Dashboard Overview";
        return path.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }, [location.pathname]);

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', backgroundColor: '#f9fafb' }}>
            
            {/* SIDEBAR - Dynamic Width based on state */}
            <aside 
                style={{ 
                    width: isSidebarOpen ? '260px' : '0px', // Toggle width
                    overflow: 'hidden', // Content hide karne ke liye
                    transition: 'width 0.3s ease', // Smooth transition
                    flexShrink: 0, 
                    height: '100%', 
                    backgroundColor: '#111827', 
                    borderRight: isSidebarOpen ? '1px solid #e5e7eb' : 'none' 
                }} 
            >
                <div style={{ width: '260px' }}> {/* Sidebar content width fix rakhein */}
                    <Sidebar />
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100%' }}>

                {/* HEADER */}
                <header style={{ height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', backgroundColor: '#fff', borderBottom: '1px solid #e5e7eb', flexShrink: 0 }}>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        {/* 4. TOGGLE BUTTON */}
                        <button 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '5px' }}
                        >
                            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>

                        <div>
                            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700', color: '#111827' }}>{pageTitle}</h2>
                            <span style={{ fontSize: '12px', color: '#9ca3af' }}>Admin / {pageTitle}</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <Link to="/home" className="btn btn-sm btn-outline-warning d-none d-lg-flex align-items-center gap-2 rounded-pill px-3">
                            <ExternalLink size={14} /> Live Site
                        </Link>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderLeft: '1px solid #eee', paddingLeft: '20px' }}>
                            <div className="text-end d-none d-sm-block">
                                <p style={{ margin: 0, fontSize: '13px', fontWeight: '700' }}>Pavnesh Singh</p>
                                <p style={{ margin: 0, fontSize: '10px', color: '#10b981' }}>● Online</p>
                            </div>
                            <button onClick={handleLogout} className="btn btn-light btn-sm text-danger fw-bold border">
                                <LogOut size={16} />
                            </button>
                        </div>
                    </div>
                </header>

                {/* SCROLLABLE BODY */}
                <main style={{ flex: 1, overflowY: 'auto', padding: '24px', backgroundColor: '#f3f4f6' }}>
                    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;