import React from 'react';
import { Outlet } from 'react-router-dom';
import MerchantNavbar from '../components/MerchantNavbar'; 
import { useAuth } from '../context/AuthContext';
import { Store, ShieldCheck, Activity, Globe } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const MerchantLayout = () => {
    const { user } = useAuth();

    return (
        <div className="merchant-layout-wrapper d-flex flex-column" style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
            <Helmet>
                <title>{user?.shopName ? `${user.shopName} | Merchant OS` : 'Merchant Portal'}</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <style>{`
                .merchant-dashboard-header { background: #fff; border-bottom: 1px solid #e2e8f0; }
                .verified-badge { color: #16a34a; background: rgba(22, 163, 74, 0.08); padding: 2px 10px; border-radius: 50px; font-size: 0.65rem; font-weight: 800; }
                .store-status-pill { background: #fff; border: 1px solid #e2e8f0; padding: 8px 16px; border-radius: 50px; font-size: 0.75rem; display: flex; align-items: center; gap: 10px; }
                .pulse-dot { width: 8px; height: 8px; background: #22c55e; border-radius: 50%; animation: pulse 2s infinite; }
                @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); } 70% { box-shadow: 0 0 0 8px rgba(34, 197, 94, 0); } 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); } }
            `}</style>

            <MerchantNavbar />

            {/* Sub-Header Section */}
            <header className="merchant-dashboard-header py-3 px-4 px-lg-5 mb-4">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <div className="d-flex align-items-center gap-3">
                        <div className="p-3 rounded-4 shadow-sm bg-light border">
                            <Store size={26} color="#0f172a" />
                        </div>
                        <div>
                            <h1 className="fw-bold mb-1 h5">{user?.shopName || 'Merchant Store'}</h1>
                            <div className="verified-badge"><ShieldCheck size={12} /> KYC VERIFIED</div>
                        </div>
                    </div>
                    <div className="store-status-pill">
                        <span className="pulse-dot"></span>
                        <span className="d-none d-sm-inline">Store Online</span>
                        <Globe size={14} className="text-muted" />
                    </div>
                </div>
            </header>

            <main className="flex-grow-1 container-fluid px-4 px-lg-5 pb-5">
                <Outlet />
            </main>
            
            <footer className="py-4 px-4 px-lg-5 border-top bg-white">
                <div className="d-flex justify-content-between align-items-center small text-muted">
                    <div>&copy; {new Date().getFullYear()} <b>VillageSathi Merchant OS</b></div>
                    <div className="d-flex align-items-center gap-2">
                        <Activity size={14} className="text-success" /> <span className="fw-bold">NODE ACTIVE</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default MerchantLayout;