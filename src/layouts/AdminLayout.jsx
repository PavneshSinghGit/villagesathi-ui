import React, { useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            localStorage.clear();
            navigate("/admin/login", { replace: true });
        }
    };

    const pageTitle = useMemo(() => {
        const path = location.pathname.split('/').filter(Boolean).pop();
        if (!path || path === 'admin') return "Dashboard";
        return path.replace(/[-_]/g, ' ')
                   .replace(/\b\w/g, l => l.toUpperCase());
    }, [location.pathname]);

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', backgroundColor: '#f9fafb', fontFamily: 'Inter, sans-serif' }}>
            
            <aside style={{ flexShrink: 0, height: '100%', zIndex: 50, background: '#fff', borderRight: '1px solid #e5e7eb' }}>
                <Sidebar />
            </aside>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', minWidth: 0 }}>
                
                {/* Improved Header with Profile & Logout */}
                <header style={{ 
                    height: '70px',
                    padding: '0 24px', 
                    backgroundColor: 'white', 
                    borderBottom: '1px solid #e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    zIndex: 40
                }}>
                    {/* Left: Breadcrumbs */}
                    <div>
                        <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: '#111827' }}>{pageTitle}</h2>
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Admin / {pageTitle}</span>
                    </div>

                    {/* Right: Profile & Logout Group */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingRight: '20px', borderRight: '1px solid #e5e7eb' }}>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#111827' }}>Pavnesh Singh</div>
                                <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: '500' }}>● Online</div>
                            </div>
                            <div style={{ 
                                width: '40px', height: '40px', borderRadius: '10px', 
                                background: '#3b82f6', color: '#fff', 
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 'bold', fontSize: '1rem',
                                boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)'
                            }}>
                                P
                            </div>
                        </div>

                        <button 
                            onClick={handleLogout}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '8px 14px', backgroundColor: 'transparent',
                                color: '#ef4444', border: '1px solid #fee2e2',
                                borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600',
                                cursor: 'pointer', transition: '0.2s'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fef2f2'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                        >
                            <span>🚪</span> Logout
                        </button>
                    </div>
                </header>

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