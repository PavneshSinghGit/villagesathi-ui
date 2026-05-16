import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Global Navbar if any
import SathiMarketNavbar from '../components/SathiMarketNavbar';
import Footer from '../components/Footer';
import { Helmet } from 'react-helmet-async';

const SathiMarketLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const customerUser = JSON.parse(localStorage.getItem('customerUser'));

    useEffect(() => {
        // Protect customer dashboard routes
        if (location.pathname.includes('/customer-dashboard') && !customerUser) {
            navigate('/customer-login', { state: { from: location }, replace: true });
        }
    }, [customerUser, location.pathname, navigate]);

    return (
        <div className="sathi-market-layout min-vh-100" style={{ backgroundColor: '#f1f3f6' }}>
            <Helmet>
                <title>SathiMarket | Premium Village Commerce</title>
            </Helmet>

            {/* Global Site Navbar (optional) */}

            {/* Premium Market Specific Navbar */}
            <SathiMarketNavbar />

            <main>
                <Outlet />
            </main>

            <Footer />
        </div>
    );
};

export default SathiMarketLayout;