import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    ShoppingBasket, User, LogOut, LayoutDashboard,
    Settings, Package, ChevronDown, Briefcase, Menu, X, Bell
} from 'lucide-react';
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { toast } from 'react-toastify';
import SathiLogo from "../assets/Images/sathi_market_logo.png";

const SathiMarketNavbar = () => {
    const { cartItems, clearCart } = useCart();
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const customerUser = JSON.parse(localStorage.getItem('customerUser'));

    const handleLogout = () => {
        if (window.confirm("Confirm secure sign out?")) {
            localStorage.removeItem('customerUser');
            if (clearCart) clearCart();
            if (logout) logout();
            toast.success("Signed out successfully");
            navigate('/customer-login', { replace: true });
        }
    };

    const totalItems = cartItems?.reduce((sum, i) => sum + (i.quantity || 1), 0) || 0;
    const initials = customerUser?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&display=swap');

                .sm-nav {
                    background: linear-gradient(90deg, #550b3b 30%, #9c1a6e 48%, #600936 100%);
                    position: sticky;
                    top: 0;
                    z-index: 1050;
                    font-family: 'Nunito', sans-serif;
                    box-shadow: 0 2px 24px rgba(58,7,81,0.55);
                }
                .sm-nav::after {
                    content: '';
                    display: block;
                    height: 3px;
                    background: linear-gradient(90deg, #c8970e, #f5c518, #fff176, #f5c518, #c8970e);
                    background-size: 200% auto;
                    animation: sm-shimmer 3s linear infinite;
                }
                @keyframes sm-shimmer { to { background-position: 200% center; } }

                .sm-nav-inner {
                    max-width: 1320px;
                    margin: 0 auto;
                    padding: 0 24px;
                    height: 62px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 16px;
                }

                /* LOGO */
                .sm-logo-link { display: flex; align-items: center; text-decoration: none; flex-shrink: 0; }
                .sm-logo-img {
                    height: 142px; width: auto; object-fit: contain;
                    mix-blend-mode: lighten;
                    filter: drop-shadow(0 0 6px rgba(245,197,24,0.35));
                    transition: filter 0.3s;
                }
                .sm-logo-link:hover .sm-logo-img { filter: drop-shadow(0 0 14px rgba(245,197,24,0.65)); }

                /* ACTIONS */
                .sm-actions { display: flex; align-items: center; gap: 10px; }

                /* Base pill */
                .sm-btn {
                    display: inline-flex; align-items: center; gap: 7px;
                    padding: 8px 18px; border-radius: 50px;
                    font-size: 0.8rem; font-weight: 800;
                    font-family: 'Nunito', sans-serif;
                    cursor: pointer; text-decoration: none; border: none;
                    transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
                    white-space: nowrap; letter-spacing: 0.2px;
                }
                .sm-btn:hover { transform: translateY(-2px); }
                .sm-btn:active { transform: translateY(0); }

                /* Gold — Customer */
                .sm-btn-customer {
                    background: linear-gradient(135deg, #f5c518 0%, #e8a800 100%);
                    color: #3a0751;
                    box-shadow: 0 4px 14px rgba(245,197,24,0.35);
                }
                .sm-btn-customer:hover { box-shadow: 0 8px 22px rgba(245,197,24,0.5); color: #3a0751; }

                /* Ghost — Merchant */
                .sm-btn-merchant {
                    background: rgba(255,255,255,0.10);
                    color: white;
                    border: 1.5px solid rgba(255,255,255,0.20);
                }
                .sm-btn-merchant:hover { background: rgba(255,255,255,0.18); border-color: rgba(255,255,255,0.35); color: white; }

                /* Gold — Basket */
                .sm-btn-basket {
                    background: linear-gradient(135deg, #f5c518, #e8a800);
                    color: #3a0751; font-weight: 900;
                    position: relative;
                    box-shadow: 0 4px 14px rgba(245,197,24,0.3);
                }
                .sm-btn-basket:hover { box-shadow: 0 8px 22px rgba(245,197,24,0.48); color: #3a0751; }

                .sm-cart-badge {
                    position: absolute; top: -7px; right: -7px;
                    min-width: 20px; height: 20px;
                    background: #e91e63; color: white;
                    font-size: 0.6rem; font-weight: 900;
                    border-radius: 50px; border: 2px solid #7b1fa2;
                    display: flex; align-items: center; justify-content: center; padding: 0 4px;
                    animation: sm-pop 0.3s cubic-bezier(0.34,1.56,0.64,1);
                }
                @keyframes sm-pop { from { transform: scale(0); } to { transform: scale(1); } }

                /* Bell */
                .sm-icon-btn {
                    width: 38px; height: 38px; border-radius: 50%;
                    background: rgba(255,255,255,0.10); border: 1px solid rgba(255,255,255,0.18);
                    display: flex; align-items: center; justify-content: center;
                    color: white; cursor: pointer; transition: all 0.2s; flex-shrink: 0;
                }
                .sm-icon-btn:hover { background: rgba(255,255,255,0.18); }

                /* USER TRIGGER */
                .sm-user-trigger {
                    display: flex; align-items: center; gap: 9px;
                    background: rgba(255,255,255,0.10); border: 1px solid rgba(255,255,255,0.18);
                    border-radius: 50px; padding: 5px 14px 5px 6px;
                    color: white; font-weight: 800; font-size: 0.82rem;
                    font-family: 'Nunito', sans-serif; cursor: pointer;
                    transition: all 0.25s; white-space: nowrap;
                }
                .sm-user-trigger:hover { background: rgba(255,255,255,0.18); border-color: rgba(245,197,24,0.35); }

                .sm-avatar {
                    width: 32px; height: 32px; border-radius: 50%;
                    background: linear-gradient(135deg, #ce93d8, #f48fb1);
                    border: 2px solid rgba(255,255,255,0.30);
                    display: flex; align-items: center; justify-content: center;
                    color: #3a0751; font-size: 0.68rem; font-weight: 900;
                    flex-shrink: 0; letter-spacing: 0.5px;
                }
                .sm-chevron { color: rgba(255,255,255,0.4); transition: transform 0.25s; }
                .sm-user-trigger[aria-expanded="true"] .sm-chevron { transform: rotate(180deg); }

                /* DROPDOWN */
                .sm-dropdown {
                    min-width: 245px;
                    background: #1e0a2e;
                    border: 1px solid rgba(245,197,24,0.15) !important;
                    border-radius: 18px; padding: 8px;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.55);
                    margin-top: 10px !important;
                }
                .sm-drop-header {
                    display: flex; align-items: center; gap: 11px;
                    padding: 10px 12px 14px;
                    border-bottom: 1px solid rgba(255,255,255,0.07);
                    margin-bottom: 6px;
                }
                .sm-drop-avatar {
                    width: 42px; height: 42px; border-radius: 50%;
                    background: linear-gradient(135deg, #ce93d8, #f48fb1);
                    display: flex; align-items: center; justify-content: center;
                    color: #3a0751; font-size: 0.78rem; font-weight: 900; flex-shrink: 0;
                }
                .sm-drop-name { color: white; font-size: 0.88rem; font-weight: 800; line-height: 1.2; }
                .sm-drop-role { color: #f5c518; font-size: 0.62rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px; }

                .sm-drop-item {
                    display: flex; align-items: center; gap: 11px;
                    padding: 10px 14px; border-radius: 12px;
                    color: rgba(255,255,255,0.72); font-size: 0.82rem; font-weight: 700;
                    font-family: 'Nunito', sans-serif; text-decoration: none;
                    transition: all 0.2s; border: none; background: transparent;
                    width: 100%; cursor: pointer; text-align: left;
                }
                .sm-drop-item svg { color: rgba(255,255,255,0.32); transition: color 0.2s; flex-shrink: 0; }
                .sm-drop-item:hover { background: rgba(245,197,24,0.09); color: #f5c518; transform: translateX(4px); }
                .sm-drop-item:hover svg { color: #f5c518; }
                .sm-drop-item.danger:hover { background: rgba(233,30,99,0.12); color: #f48fb1; }
                .sm-drop-item.danger:hover svg { color: #f48fb1; }
                .sm-drop-divider { border-color: rgba(255,255,255,0.07) !important; margin: 6px 0; }

                /* MOBILE TOGGLE */
                .sm-mobile-toggle {
                    display: none;
                    background: rgba(255,255,255,0.10); border: 1px solid rgba(255,255,255,0.18);
                    border-radius: 10px; padding: 8px; color: white; cursor: pointer; transition: all 0.2s;
                }
                .sm-mobile-toggle:hover { background: rgba(255,255,255,0.18); }

                @media (max-width: 660px) {
                    .sm-mobile-toggle { display: flex; align-items: center; justify-content: center; }
                    .sm-actions { display: none; }
                    .sm-nav-inner { padding: 0 16px; }
                }

                /* DRAWER */
                .sm-drawer {
                    position: fixed; top: 65px; left: 0; right: 0; bottom: 0;
                    background: linear-gradient(180deg, #2d0845 0%, #1a0430 100%);
                    z-index: 1040; padding: 20px 20px 40px;
                    display: flex; flex-direction: column; gap: 8px;
                    transform: translateY(-10px); opacity: 0; pointer-events: none;
                    transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
                    border-top: 2px solid rgba(245,197,24,0.25);
                    overflow-y: auto;
                }
                .sm-drawer.open { transform: translateY(0); opacity: 1; pointer-events: all; }

                .sm-drawer-user {
                    display: flex; align-items: center; gap: 14px;
                    padding: 16px; background: rgba(255,255,255,0.05);
                    border-radius: 16px; border: 1px solid rgba(245,197,24,0.12);
                    margin-bottom: 6px;
                }
                .sm-drawer-link {
                    display: flex; align-items: center; gap: 12px;
                    padding: 14px 18px; border-radius: 14px;
                    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
                    color: white; font-size: 0.9rem; font-weight: 700;
                    text-decoration: none; transition: all 0.2s;
                    cursor: pointer; font-family: 'Nunito', sans-serif;
                    width: 100%; text-align: left;
                }
                .sm-drawer-link:hover { background: rgba(245,197,24,0.1); border-color: rgba(245,197,24,0.25); color: #f5c518; }
                .sm-drawer-link.gold { background: rgba(245,197,24,0.10); border-color: rgba(245,197,24,0.25); color: #f5c518; }
                .sm-drawer-link.danger { background: rgba(233,30,99,0.08); border-color: rgba(233,30,99,0.2); color: #f48fb1; }
                .sm-drawer-sep { border-color: rgba(255,255,255,0.07) !important; margin: 4px 0; }
            `}</style>

            <header className="sm-nav">
                <div className="sm-nav-inner">

                    {/* Logo */}
                    <Link to="/sathi-market" className="sm-logo-link" aria-label="SathiMarket Home">
                        <img src={SathiLogo} alt="SathiMarket" className="sm-logo-img" />
                    </Link>

                    {/* Desktop Actions */}
                    <div className="sm-actions">
                        {customerUser ? (
                            <>
                                <button className="sm-icon-btn" title="Notifications">
                                    <Bell size={17} />
                                </button>

                                <Link to="/cart" className="sm-btn sm-btn-basket">
                                    <ShoppingBasket size={17} />
                                    <span>Basket</span>
                                    {totalItems > 0 && <span className="sm-cart-badge">{totalItems}</span>}
                                </Link>

                                <div className="dropdown">
                                    <button
                                        className="sm-user-trigger dropdown-toggle"
                                        type="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        <div className="sm-avatar">{initials}</div>
                                        <span>{customerUser.name?.split(' ')[0]}</span>
                                        <ChevronDown size={14} className="sm-chevron" />
                                    </button>
                                    <ul className="dropdown-menu dropdown-menu-end sm-dropdown border-0">
                                        <li>
                                            <div className="sm-drop-header">
                                                <div className="sm-drop-avatar">{initials}</div>
                                                <div>
                                                    <div className="sm-drop-name">{customerUser.name}</div>
                                                    <div className="sm-drop-role">⭐ Gold Member</div>
                                                </div>
                                            </div>
                                        </li>
                                        <li><Link className="sm-drop-item" to="/customer-dashboard"><LayoutDashboard size={16} /> My Dashboard</Link></li>
                                        <li><Link className="sm-drop-item" to="/my-orders"><Package size={16} /> Order History</Link></li>
                                        <li><Link className="sm-drop-item" to="/manage-addresses"><Settings size={16} /> Manage Addresses</Link></li>
                                        <li><hr className="dropdown-divider sm-drop-divider" /></li>
                                        <li>
                                            <button className="sm-drop-item danger" onClick={handleLogout}>
                                                <LogOut size={16} /> Secure Sign Out
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/customer-login" className="sm-btn sm-btn-customer">
                                    <User size={15} /> <span>Customer Login</span>
                                </Link>
                                <Link to="/merchant-login" className="sm-btn sm-btn-merchant">
                                    <Briefcase size={15} /> <span>Merchant Login</span>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <button className="sm-mobile-toggle" onClick={() => setMobileOpen(o => !o)} aria-label="Toggle menu">
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </header>

            {/* Mobile Drawer */}
            <div className={`sm-drawer ${mobileOpen ? 'open' : ''}`}>
                {customerUser ? (
                    <>
                        <div className="sm-drawer-user">
                            <div className="sm-avatar" style={{ width: 44, height: 44, fontSize: '0.82rem' }}>{initials}</div>
                            <div>
                                <div style={{ color: 'white', fontWeight: 800, fontSize: '0.95rem', fontFamily: 'Nunito, sans-serif' }}>{customerUser.name}</div>
                                <div style={{ color: '#f5c518', fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: 3 }}>⭐ Gold Member</div>
                            </div>
                        </div>
                        <Link to="/cart" className="sm-drawer-link gold" onClick={() => setMobileOpen(false)}>
                            <ShoppingBasket size={18} /> Basket
                            {totalItems > 0 && <span style={{ marginLeft: 'auto', background: '#e91e63', color: 'white', fontSize: '0.65rem', fontWeight: 900, borderRadius: 20, padding: '2px 8px' }}>{totalItems}</span>}
                        </Link>
                        <Link to="/customer-dashboard" className="sm-drawer-link" onClick={() => setMobileOpen(false)}><LayoutDashboard size={18} /> My Dashboard</Link>
                        <Link to="/my-orders" className="sm-drawer-link" onClick={() => setMobileOpen(false)}><Package size={18} /> Order History</Link>
                        <Link to="/manage-addresses" className="sm-drawer-link" onClick={() => setMobileOpen(false)}><Settings size={18} /> Manage Addresses</Link>
                        <hr className="sm-drawer-sep" />
                        <button className="sm-drawer-link danger" onClick={() => { setMobileOpen(false); handleLogout(); }}>
                            <LogOut size={18} /> Secure Sign Out
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/customer-login" className="sm-drawer-link gold" onClick={() => setMobileOpen(false)}><User size={18} /> Customer Login</Link>
                        <Link to="/merchant-login" className="sm-drawer-link" onClick={() => setMobileOpen(false)}><Briefcase size={18} /> Merchant Login</Link>
                    </>
                )}
            </div>
        </>
    );
};

export default SathiMarketNavbar;