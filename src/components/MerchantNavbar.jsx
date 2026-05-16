import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MerchantNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout, user } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to securely logout from your merchant account?")) {
            logout();
            navigate('/merchant-login');
        }
    };

    const isActive = (path) => location.pathname === path;

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        setMobileOpen(false);
        setDropdownOpen(false);
    }, [location.pathname]);

    const navLinks = [
        { path: '/merchant/dashboard',        icon: 'fa-chart-line',   label: 'Dashboard'  },
        { path: '/merchant/manage-profile',   icon: 'fa-id-card',      label: 'Profile'    },
        { path: '/merchant/manage-inventory', icon: 'fa-cubes',        label: 'Inventory'  },
        { path: '/merchant/shop-orders',      icon: 'fa-receipt',      label: 'Orders',    badge: '3' },
    ];

    const shopInitials = user?.shopName
        ? user.shopName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
        : 'M';

    return (
        <>
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
            />

            <style>{`
                /* ── SATHIMARKET EXACT COLOR PALETTE ── */
                :root {
                    --sm-bg-deep:     #3D0030;
                    --sm-bg-mid:      #6B0F4A;
                    --sm-bg-light:    #8C1560;
                    --sm-gold:        #D4A017;
                    --sm-gold-bright: #F5C518;
                    --sm-gold-soft:   rgba(212,160,23,0.18);
                    --sm-dark-panel:  #1C1230;
                    --sm-dark-hover:  #2A1A42;
                    --sm-text-white:  #FFFFFF;
                    --sm-text-muted:  rgba(255,255,255,0.65);
                    --sm-active-bg:   #8B5E00;
                    --sm-radius-sm:   8px;
                    --sm-radius-md:   12px;
                    --sm-radius-lg:   18px;
                    --sm-radius-pill: 50px;
                    --sm-transition:  all 0.22s cubic-bezier(0.4,0,0.2,1);
                }

                /* ── NAVBAR ── */
                .mn-navbar {
                    background: linear-gradient(135deg, var(--sm-bg-deep) 0%, var(--sm-bg-mid) 50%, var(--sm-bg-light) 100%);
                    border-bottom: 2.5px solid var(--sm-gold);
                    position: sticky;
                    top: 0;
                    z-index: 1050;
                    height: 64px;
                    display: flex;
                    align-items: center;
                    padding: 0 1.5rem;
                    box-shadow: 0 4px 24px rgba(61,0,48,0.35);
                }

                /* ── BRAND ── */
                .mn-brand {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    text-decoration: none;
                    flex-shrink: 0;
                }
                .mn-brand-icon {
                    width: 40px;
                    height: 40px;
                    background: linear-gradient(135deg, var(--sm-gold), var(--sm-gold-bright));
                    border-radius: var(--sm-radius-sm);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                    color: var(--sm-bg-deep);
                    box-shadow: 0 3px 14px rgba(212,160,23,0.4);
                    flex-shrink: 0;
                    transition: var(--sm-transition);
                }
                .mn-brand:hover .mn-brand-icon {
                    transform: scale(1.08) rotate(-3deg);
                }
                .mn-brand-name {
                    font-size: 1.25rem;
                    font-weight: 900;
                    color: var(--sm-text-white);
                    letter-spacing: -0.3px;
                    line-height: 1.1;
                }
                .mn-brand-name span { color: var(--sm-gold-bright); }
                .mn-brand-tag {
                    font-size: 0.52rem;
                    font-weight: 700;
                    letter-spacing: 1.8px;
                    text-transform: uppercase;
                    color: rgba(245,197,24,0.65);
                    margin-top: 2px;
                }

                /* ── CENTER NAV ── */
                .mn-nav-center {
                    display: flex;
                    align-items: center;
                    gap: 2px;
                    margin: 0 auto;
                    padding: 0 1rem;
                }
                .mn-nav-link {
                    display: flex;
                    align-items: center;
                    gap: 7px;
                    padding: 7px 14px;
                    border-radius: var(--sm-radius-sm);
                    font-size: 0.8rem;
                    font-weight: 700;
                    color: var(--sm-text-muted);
                    text-decoration: none;
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    transition: var(--sm-transition);
                    white-space: nowrap;
                    position: relative;
                }
                .mn-nav-link:hover {
                    background: rgba(255,255,255,0.1);
                    color: var(--sm-text-white);
                }
                .mn-nav-link.mn-active {
                    background: var(--sm-gold-soft);
                    color: var(--sm-gold-bright);
                    border: 1px solid rgba(212,160,23,0.3);
                }
                .mn-nav-link.mn-active::after {
                    content: '';
                    position: absolute;
                    bottom: -9px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 28px;
                    height: 2.5px;
                    background: var(--sm-gold-bright);
                    border-radius: 2px;
                }
                .mn-nav-badge {
                    background: var(--sm-gold-bright);
                    color: var(--sm-bg-deep);
                    font-size: 0.58rem;
                    font-weight: 900;
                    padding: 1px 6px;
                    border-radius: 20px;
                    margin-left: 2px;
                    line-height: 1.5;
                }

                /* ── RIGHT SECTION ── */
                .mn-nav-right {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    flex-shrink: 0;
                }

                /* Notification Bell */
                .mn-notif {
                    width: 38px;
                    height: 38px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.08);
                    border: 1px solid rgba(255,255,255,0.14);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    color: var(--sm-text-muted);
                    font-size: 15px;
                    transition: var(--sm-transition);
                    position: relative;
                }
                .mn-notif:hover {
                    background: rgba(255,255,255,0.15);
                    color: var(--sm-gold-bright);
                    border-color: rgba(212,160,23,0.35);
                }
                .mn-notif-dot {
                    position: absolute;
                    top: 7px;
                    right: 7px;
                    width: 8px;
                    height: 8px;
                    background: var(--sm-gold-bright);
                    border-radius: 50%;
                    border: 2px solid var(--sm-bg-mid);
                    animation: mn-pulse 2s infinite;
                }
                @keyframes mn-pulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50%       { transform: scale(1.25); opacity: 0.75; }
                }

                /* User Pill Button */
                .mn-user-pill {
                    display: flex;
                    align-items: center;
                    gap: 9px;
                    background: rgba(28,18,48,0.7);
                    border: 1px solid rgba(255,255,255,0.14);
                    border-radius: var(--sm-radius-pill);
                    padding: 5px 13px 5px 5px;
                    cursor: pointer;
                    transition: var(--sm-transition);
                    user-select: none;
                    backdrop-filter: blur(6px);
                }
                .mn-user-pill:hover,
                .mn-user-pill.mn-open {
                    background: rgba(28,18,48,0.9);
                    border-color: rgba(212,160,23,0.45);
                    box-shadow: 0 0 0 3px rgba(212,160,23,0.1);
                }
                .mn-avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, var(--sm-gold), var(--sm-gold-bright));
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.72rem;
                    font-weight: 900;
                    color: var(--sm-bg-deep);
                    flex-shrink: 0;
                    border: 1.5px solid rgba(255,255,255,0.3);
                }
                .mn-user-name {
                    font-size: 0.8rem;
                    font-weight: 800;
                    color: var(--sm-text-white);
                    max-width: 120px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .mn-chevron {
                    font-size: 10px;
                    color: var(--sm-text-muted);
                    transition: transform 0.22s ease;
                    flex-shrink: 0;
                }
                .mn-user-pill.mn-open .mn-chevron {
                    transform: rotate(180deg);
                    color: var(--sm-gold-bright);
                }

                /* ── DROPDOWN ── */
                .mn-dropdown-wrap {
                    position: relative;
                }
                .mn-dropdown {
                    position: absolute;
                    top: calc(100% + 12px);
                    right: 0;
                    width: 275px;
                    background: var(--sm-dark-panel);
                    border-radius: var(--sm-radius-lg);
                    border: 1px solid rgba(212,160,23,0.2);
                    box-shadow: 0 24px 60px rgba(61,0,48,0.45), 0 6px 20px rgba(0,0,0,0.25);
                    overflow: hidden;
                    opacity: 0;
                    transform: translateY(-10px) scale(0.96);
                    pointer-events: none;
                    transition: opacity 0.2s ease, transform 0.22s cubic-bezier(0.34,1.4,0.64,1);
                    z-index: 9999;
                }
                .mn-dropdown.mn-open {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                    pointer-events: all;
                }

                /* Dropdown Header */
                .mn-dd-header {
                    background: linear-gradient(135deg, var(--sm-bg-deep) 0%, var(--sm-bg-mid) 100%);
                    padding: 16px 16px 14px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    border-bottom: 1px solid rgba(212,160,23,0.2);
                }
                .mn-dd-avatar {
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, var(--sm-gold), var(--sm-gold-bright));
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 900;
                    font-size: 0.88rem;
                    color: var(--sm-bg-deep);
                    border: 2px solid rgba(255,255,255,0.25);
                    flex-shrink: 0;
                }
                .mn-dd-shop-name {
                    font-size: 0.92rem;
                    font-weight: 800;
                    color: var(--sm-text-white);
                    line-height: 1.2;
                }
                .mn-dd-verified {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    font-size: 0.6rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.8px;
                    color: var(--sm-gold-bright);
                    margin-top: 3px;
                }

                /* Dropdown Items */
                .mn-dd-body { padding: 8px; }
                .mn-dd-item {
                    display: flex;
                    align-items: center;
                    gap: 11px;
                    width: 100%;
                    padding: 10px 12px;
                    border-radius: 10px;
                    font-size: 0.83rem;
                    font-weight: 700;
                    color: rgba(255,255,255,0.75);
                    text-decoration: none;
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    transition: var(--sm-transition);
                    text-align: left;
                }
                .mn-dd-item i {
                    width: 18px;
                    text-align: center;
                    flex-shrink: 0;
                    font-size: 14px;
                }
                .mn-dd-item:hover {
                    background: var(--sm-dark-hover);
                    color: var(--sm-text-white);
                    transform: translateX(4px);
                }
                .mn-dd-item.mn-dd-active {
                    background: var(--sm-active-bg);
                    color: var(--sm-gold-bright);
                }
                .mn-dd-item.mn-dd-active:hover {
                    background: #a06c00;
                    transform: translateX(4px);
                }
                .mn-dd-item.mn-dd-logout {
                    color: rgba(255,120,120,0.85);
                }
                .mn-dd-item.mn-dd-logout:hover {
                    background: rgba(220,38,38,0.15);
                    color: #ff8080;
                }
                .mn-dd-badge {
                    margin-left: auto;
                    background: rgba(212,160,23,0.2);
                    color: var(--sm-gold-bright);
                    font-size: 0.6rem;
                    font-weight: 900;
                    padding: 2px 8px;
                    border-radius: 20px;
                    border: 1px solid rgba(212,160,23,0.25);
                    flex-shrink: 0;
                }
                .mn-dd-divider {
                    height: 1px;
                    background: rgba(255,255,255,0.07);
                    margin: 5px 8px;
                }

                /* ── HAMBURGER ── */
                .mn-hamburger {
                    width: 38px;
                    height: 38px;
                    border-radius: var(--sm-radius-sm);
                    background: rgba(255,255,255,0.08);
                    border: 1px solid rgba(255,255,255,0.14);
                    display: none;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    color: rgba(255,255,255,0.8);
                    font-size: 17px;
                    transition: var(--sm-transition);
                    flex-shrink: 0;
                }
                .mn-hamburger:hover {
                    background: rgba(255,255,255,0.15);
                    color: var(--sm-gold-bright);
                }

                /* ── MOBILE MENU ── */
                .mn-mobile-menu {
                    display: none;
                    flex-direction: column;
                    background: linear-gradient(180deg, var(--sm-bg-deep) 0%, #2A0020 100%);
                    border-bottom: 2px solid rgba(212,160,23,0.3);
                    padding: 10px 12px 14px;
                    gap: 3px;
                    position: sticky;
                    top: 64px;
                    z-index: 1040;
                    box-shadow: 0 8px 24px rgba(61,0,48,0.3);
                }
                .mn-mobile-menu.mn-open { display: flex; }
                .mn-mobile-link {
                    display: flex;
                    align-items: center;
                    gap: 11px;
                    padding: 11px 14px;
                    border-radius: var(--sm-radius-sm);
                    font-size: 0.85rem;
                    font-weight: 700;
                    color: var(--sm-text-muted);
                    text-decoration: none;
                    transition: var(--sm-transition);
                    cursor: pointer;
                    border: none;
                    background: transparent;
                    width: 100%;
                    text-align: left;
                }
                .mn-mobile-link i { width: 18px; text-align: center; font-size: 15px; }
                .mn-mobile-link:hover, .mn-mobile-link.mn-active {
                    background: var(--sm-gold-soft);
                    color: var(--sm-gold-bright);
                    border: 1px solid rgba(212,160,23,0.2);
                }
                .mn-mobile-link.mn-logout-mobile {
                    color: rgba(255,120,120,0.8);
                    margin-top: 4px;
                }
                .mn-mobile-link.mn-logout-mobile:hover {
                    background: rgba(220,38,38,0.12);
                    color: #ff8080;
                    border-color: rgba(220,38,38,0.2);
                }
                .mn-mobile-divider {
                    height: 1px;
                    background: rgba(255,255,255,0.07);
                    margin: 4px 0;
                }
                .mn-mobile-badge {
                    margin-left: auto;
                    background: var(--sm-gold-bright);
                    color: var(--sm-bg-deep);
                    font-size: 0.6rem;
                    font-weight: 900;
                    padding: 2px 8px;
                    border-radius: 20px;
                }

                /* ── RESPONSIVE ── */
                @media (max-width: 900px) {
                    .mn-nav-center { display: none; }
                    .mn-hamburger  { display: flex; }
                }
                @media (max-width: 560px) {
                    .mn-user-name { display: none; }
                    .mn-brand-tag { display: none; }
                    .mn-navbar    { padding: 0 1rem; }
                }
            `}</style>

            {/* ── MAIN NAVBAR ── */}
            <header>
                <nav className="mn-navbar">

                    {/* Brand */}
                    <Link to="/merchant/dashboard" className="mn-brand">
                        <div className="mn-brand-icon">
                            <i className="fa-solid fa-shop-lock"></i>
                        </div>
                        <div>
                            <div className="mn-brand-name">
                                Sathi<span>Market</span>
                            </div>
                            <div className="mn-brand-tag">Merchant Portal</div>
                        </div>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="mn-nav-center">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`mn-nav-link ${isActive(link.path) ? 'mn-active' : ''}`}
                            >
                                <i className={`fa-solid ${link.icon}`}></i>
                                {link.label}
                                {link.badge && (
                                    <span className="mn-nav-badge">{link.badge}</span>
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Right Section */}
                    <div className="mn-nav-right">

                        {/* Notification Bell */}
                        <div className="mn-notif" title="Notifications">
                            <i className="fa-regular fa-bell"></i>
                            <div className="mn-notif-dot"></div>
                        </div>

                        {/* User Dropdown */}
                        {user ? (
                            <div className="mn-dropdown-wrap" ref={dropdownRef}>
                                <div
                                    className={`mn-user-pill ${dropdownOpen ? 'mn-open' : ''}`}
                                    onClick={() => setDropdownOpen(o => !o)}
                                >
                                    <div className="mn-avatar">{shopInitials}</div>
                                    <span className="mn-user-name">
                                        {user?.shopName || 'Merchant'}
                                    </span>
                                    <i className={`fa-solid fa-chevron-down mn-chevron`}></i>
                                </div>

                                <div className={`mn-dropdown ${dropdownOpen ? 'mn-open' : ''}`}>
                                    {/* Header */}
                                    <div className="mn-dd-header">
                                        <div className="mn-dd-avatar">{shopInitials}</div>
                                        <div>
                                            <div className="mn-dd-shop-name">
                                                {user?.shopName || 'My Store'}
                                            </div>
                                            <div className="mn-dd-verified">
                                                <i className="fa-solid fa-circle-check" style={{ fontSize: '10px' }}></i>
                                                Verified Merchant
                                            </div>
                                        </div>
                                    </div>

                                    {/* Items */}
                                    <div className="mn-dd-body">
                                        {navLinks.map((link) => (
                                            <Link
                                                key={link.path}
                                                to={link.path}
                                                className={`mn-dd-item ${isActive(link.path) ? 'mn-dd-active' : ''}`}
                                                onClick={() => setDropdownOpen(false)}
                                            >
                                                <i className={`fa-solid ${link.icon}`}></i>
                                                {link.label}
                                                {link.badge && (
                                                    <span className="mn-dd-badge">{link.badge} new</span>
                                                )}
                                            </Link>
                                        ))}

                                        <div className="mn-dd-divider"></div>

                                        <button
                                            className="mn-dd-item mn-dd-logout"
                                            onClick={handleLogout}
                                        >
                                            <i className="fa-solid fa-door-open"></i>
                                            Secure Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link
                                to="/merchant-login"
                                className="btn"
                                style={{
                                    background: 'linear-gradient(135deg, #D4A017, #F5C518)',
                                    color: '#3D0030',
                                    fontWeight: 800,
                                    borderRadius: '50px',
                                    padding: '8px 20px',
                                    fontSize: '0.82rem',
                                    border: 'none',
                                    boxShadow: '0 3px 14px rgba(212,160,23,0.4)',
                                }}
                            >
                                Join as Merchant
                            </Link>
                        )}

                        {/* Hamburger */}
                        <div
                            className="mn-hamburger"
                            onClick={() => setMobileOpen(o => !o)}
                            aria-label="Toggle menu"
                        >
                            <i className={`fa-solid ${mobileOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
                        </div>
                    </div>
                </nav>

                {/* ── MOBILE MENU ── */}
                <div className={`mn-mobile-menu ${mobileOpen ? 'mn-open' : ''}`}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`mn-mobile-link ${isActive(link.path) ? 'mn-active' : ''}`}
                            onClick={() => setMobileOpen(false)}
                        >
                            <i className={`fa-solid ${link.icon}`}></i>
                            {link.label}
                            {link.badge && (
                                <span className="mn-mobile-badge">{link.badge}</span>
                            )}
                        </Link>
                    ))}

                    <div className="mn-mobile-divider"></div>

                    <button
                        className="mn-mobile-link mn-logout-mobile"
                        onClick={handleLogout}
                    >
                        <i className="fa-solid fa-door-open"></i>
                        Secure Logout
                    </button>
                </div>
            </header>
        </>
    );
};

export default MerchantNavbar;