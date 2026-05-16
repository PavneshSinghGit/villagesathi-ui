import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../../context/AuthContext';
import { Helmet } from 'react-helmet-async';
import axiosInstance from '../../../api/axiosInstance';
import {
    LogOut, ShieldCheck, Bell, Store, Package,
    MapPin, Heart, Settings, Wallet, ChevronRight,
    Smartphone, Fingerprint, Star, Truck, Clock,
    CheckCircle2, XCircle, Percent, TrendingUp
} from 'lucide-react';

// ─────────────────────────────────────────────
// Helpers — same pattern as MyOrders
// ─────────────────────────────────────────────

const getId     = (o) => o?.orderID     ?? o?.OrderID     ?? o?.orderId;
const getDate   = (o) => o?.orderDate   ?? o?.OrderDate   ?? o?.createdAt;
const getStatus = (o) => o?.orderStatus ?? o?.OrderStatus ?? 0;
const getAmount = (o) => o?.totalAmount ?? o?.TotalAmount ?? 0;

const formatDate = (raw) => {
    if (!raw) return 'N/A';
    const d = new Date(raw);
    return isNaN(d) ? raw : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
};

// ─────────────────────────────────────────────
// Status config — identical to MyOrders
// ─────────────────────────────────────────────

const STATUS_MAP = {
    0: { label: 'Pending',   Icon: Clock,        color: '#ea580c', bg: '#fff7ed' },
    1: { label: 'Confirmed', Icon: CheckCircle2, color: '#2563eb', bg: '#eff6ff' },
    2: { label: 'Delivered', Icon: CheckCircle2, color: '#16a34a', bg: '#f0fdf4' },
    3: { label: 'Cancelled', Icon: XCircle,      color: '#ef4444', bg: '#fef2f2' },
};
const getStatusInfo = (status) =>
    STATUS_MAP[Number(status)] ?? { label: 'In Transit', Icon: Truck, color: '#721a61', bg: '#fdf0f9' };

// ─────────────────────────────────────────────
// Menu items config
// ─────────────────────────────────────────────

const MENU_ITEMS = [
    {
        to: '/sathi-market',
        Icon: Store,
        title: 'Sathi Market',
        sub: 'Browse 1,200+ local products',
        iconBg: '#fff8e1',
        iconColor: '#854f0b',
        wide: true,
    },
    { to: '/my-orders',        Icon: Package,  title: 'My Orders',  sub: 'Track deliveries',      iconBg: '#fdf0f9', iconColor: '#721a61' },
    { to: '/manage-addresses', Icon: MapPin,   title: 'Addresses',  sub: 'Delivery spots',        iconBg: '#e1f5f0', iconColor: '#0f6e56' },
    { to: '/wishlist',         Icon: Heart,    title: 'Wishlist',   sub: 'Saved items',            iconBg: '#fdeef3', iconColor: '#993556' },
    { to: '/settings',         Icon: Settings, title: 'Settings',   sub: 'Security & profile',    iconBg: '#fdf0f9', iconColor: '#721a61' },
    { to: null, Icon: Wallet, title: 'Wallet', sub: 'Coming soon',  iconBg: '#fff8e1', iconColor: '#854f0b', disabled: true },
];

// ─────────────────────────────────────────────
// Skeleton — same shimmer style as MyOrders
// ─────────────────────────────────────────────

const DashSkeleton = () => (
    <div className="vstack gap-0">
        {[1, 2, 3].map(n => (
            <div key={n} className="order-mini-card d-flex align-items-center gap-3 p-3">
                <div className="skeleton rounded-circle" style={{ width: 42, height: 42, flexShrink: 0 }} />
                <div className="flex-grow-1 vstack gap-2">
                    <div className="skeleton" style={{ height: 12, width: '40%', borderRadius: 4 }} />
                    <div className="skeleton" style={{ height: 10, width: '25%', borderRadius: 4 }} />
                </div>
                <div className="skeleton" style={{ height: 24, width: 80, borderRadius: 4 }} />
            </div>
        ))}
    </div>
);

// ─────────────────────────────────────────────
// Order mini-row (links to MyOrders)
// ─────────────────────────────────────────────

const OrderMiniRow = ({ order }) => {
    const { label, Icon, color, bg } = getStatusInfo(getStatus(order));
    return (
        <Link to="/my-orders" className="order-mini-card d-flex align-items-center gap-3 p-3" style={{ textDecoration: 'none' }}>
            <div className="order-icon-wrap flex-shrink-0">
                <Package size={20} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <p className="mb-0 fw-bold text-dark" style={{ fontSize: 13 }}>
                    Order <span style={{ color: '#721a61' }}>#VS-{getId(order)}</span>
                </p>
                <p className="mb-0 text-muted" style={{ fontSize: 11 }}>{formatDate(getDate(order))}</p>
            </div>
            <div className="text-end flex-shrink-0">
                <p className="mb-1 fw-bold" style={{ fontSize: 13, color: '#721a61' }}>₹{getAmount(order)}</p>
                <span className="status-pill" style={{ backgroundColor: bg, color }}>
                    <Icon size={11} /> {label}
                </span>
            </div>
        </Link>
    );
};

// ─────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────

const CustomerDashBoard = () => {
    const navigate   = useNavigate();
    const { logout } = useAuth();

    const [userData,      setUserData]      = useState(null);
    const [recentOrders,  setRecentOrders]  = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [stats,         setStats]         = useState({ total: 0, saved: 0 });

    // ── Load user ─────────────────────────────────────────────────────────
    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('customerUser') || 'null');
        if (!data) { navigate('/customer-login', { replace: true }); return; }
        setUserData(data);
    }, [navigate]);

    // ── Fetch 3 most-recent orders ────────────────────────────────────────
    useEffect(() => {
        if (!userData) return;
        const fetchRecent = async () => {
            try {
                setOrdersLoading(true);
                const userId = userData?.userId ?? userData?.UserId;
                const res    = await axiosInstance.get(`/Orders/GetByUser/${userId}`, {
                    params: { page: 1, pageSize: 3 }
                });

                const raw   = res.data?.Data ?? res.data?.data ?? res.data ?? [];
                const arr   = Array.isArray(raw) ? raw : [];
                const total = res.data?.TotalCount ?? res.data?.totalCount ?? arr.length;

                const delivered = arr.filter(o => Number(getStatus(o)) === 2);
                const saved     = Math.round(delivered.reduce((s, o) => s + getAmount(o) * 0.05, 0));

                setRecentOrders(arr.slice(0, 3));
                setStats({ total, saved });
            } catch (err) {
                console.error('Dashboard orders fetch failed:', err);
                // Non-blocking — dashboard renders fine without orders
            } finally {
                setOrdersLoading(false);
            }
        };
        fetchRecent();
    }, [userData]);

    // ── Logout ────────────────────────────────────────────────────────────
    const handleLogout = () => {
        if (window.confirm('Are you sure you want to sign out?')) {
            localStorage.removeItem('customerUser');
            if (logout) logout();
            toast.info('Logged out successfully');
            navigate('/customer-login', { replace: true });
        }
    };

    const getInitials = (name = '') =>
        name.trim().split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'U';

    // ── Loading guard ─────────────────────────────────────────────────────
    if (!userData) return (
        <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ background: '#f8f0f6' }}>
            <div className="spinner-border" style={{ color: '#721a61' }} role="status">
                <span className="visually-hidden">Loading…</span>
            </div>
        </div>
    );

    // ─────────────────────────────────────────────────────────────────────
    // Render
    // ─────────────────────────────────────────────────────────────────────

    return (
        <main className="min-vh-100 pb-5" style={{ backgroundColor: '#f8f0f6' }}>
            <Helmet>
                <title>Dashboard | VillageSathi</title>
                <meta name="description" content="Your VillageSathi customer dashboard." />
                <link
                    href="https://fonts.googleapis.com/css2?family=Fraunces:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap"
                    rel="stylesheet"
                />
            </Helmet>

            <style>{`
                :root {
                    --maroon: #721a61;
                    --maroon-dark: #4e1143;
                    --maroon-accent: #9b2980;
                    --gold: #ffc200;
                    --border: #e8d5e4;
                }

                /* ── Shimmer skeleton (same as MyOrders) ── */
                .skeleton {
                    background: linear-gradient(90deg, #f0e8ee 25%, #e8d8e4 50%, #f0e8ee 75%);
                    background-size: 200% 100%;
                    animation: shimmer 1.4s infinite;
                }
                @keyframes shimmer {
                    0%   { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }

                /* ── Entrance animations ── */
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(12px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .anim-1 { animation: fadeUp 0.35s ease 0.05s both; }
                .anim-2 { animation: fadeUp 0.35s ease 0.12s both; }
                .anim-3 { animation: fadeUp 0.35s ease 0.19s both; }
                .anim-4 { animation: fadeUp 0.35s ease 0.26s both; }
                .anim-5 { animation: fadeUp 0.35s ease 0.33s both; }

                /* ── Sticky header ── */
                .dash-header {
                    background: var(--maroon);
                    color: white;
                    padding: 12px 0;
                    border-bottom: 3px solid var(--gold);
                    box-shadow: 0 2px 8px rgba(114,26,97,0.3);
                }
                .hdr-btn {
                    width: 36px; height: 36px; border-radius: 50%; border: none;
                    background: rgba(255,255,255,0.12); color: white; cursor: pointer;
                    display: flex; align-items: center; justify-content: center;
                    transition: background 0.15s; position: relative; flex-shrink: 0;
                }
                .hdr-btn:hover { background: rgba(255,255,255,0.22); }
                .notif-dot {
                    position: absolute; top: 6px; right: 6px;
                    width: 7px; height: 7px; background: var(--gold);
                    border-radius: 50%; border: 1.5px solid var(--maroon);
                }

                /* ── Hero ── */
                .hero-banner {
                    background: linear-gradient(135deg, var(--maroon-dark) 0%, var(--maroon) 60%, var(--maroon-accent) 100%);
                    padding: 1.5rem 0 3.5rem;
                    position: relative; overflow: hidden;
                }
                .hero-blob-1 {
                    position: absolute; top: -30px; right: -30px;
                    width: 160px; height: 160px;
                    background: rgba(255,255,255,0.05); border-radius: 50%;
                }
                .hero-blob-2 {
                    position: absolute; bottom: -50px; left: 40%;
                    width: 220px; height: 220px;
                    background: rgba(255,255,255,0.04); border-radius: 50%;
                }

                /* ── Stats float card ── */
                .stats-float-card {
                    background: white; border-radius: 12px;
                    border: 1px solid var(--border);
                    box-shadow: 0 8px 24px rgba(114,26,97,0.12);
                    margin: -2rem 0 0; position: relative; z-index: 10;
                    display: grid; grid-template-columns: repeat(3, 1fr);
                }
                .stat-col {
                    text-align: center; padding: 0.85rem 0;
                    border-right: 1px solid var(--border);
                }
                .stat-col:last-child { border-right: none; }
                .stat-num {
                    font-family: 'Fraunces', serif;
                    font-size: 21px; font-weight: 700; color: var(--maroon); line-height: 1.1;
                }
                .stat-label {
                    font-size: 10px; color: #999;
                    letter-spacing: 0.07em; text-transform: uppercase; margin-top: 2px;
                }

                /* ── Promo strip ── */
                .promo-strip {
                    background: #fff8e1; border: 1px solid #ffd84d; border-radius: 8px;
                    padding: 0.85rem 1rem; display: flex; align-items: center; gap: 10px;
                    cursor: pointer; transition: background 0.15s; text-decoration: none !important;
                }
                .promo-strip:hover { background: #fff3c0; }

                /* ── Section title ── */
                .section-title {
                    font-size: 11px; font-weight: 600;
                    letter-spacing: 0.1em; text-transform: uppercase; color: #999;
                    margin-bottom: 0.75rem;
                }

                /* ── Menu grid ── */
                .menu-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 10px;
                }
                @media (min-width: 540px) {
                    .menu-grid { grid-template-columns: repeat(3, 1fr); }
                    .menu-card-wide { grid-column: span 3 !important; }
                }

                /* ── Menu card ── */
                .menu-card {
                    background: white; border-radius: 10px;
                    border: 1px solid var(--border); padding: 1rem;
                    cursor: pointer; transition: all 0.18s ease;
                    display: flex; flex-direction: column; gap: 0.55rem;
                    text-decoration: none !important; position: relative; overflow: hidden;
                    color: inherit;
                }
                .menu-card:hover {
                    border-color: var(--maroon); transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(114,26,97,0.10);
                }
                .menu-card-wide {
                    grid-column: span 2;
                    flex-direction: row !important; align-items: center !important;
                    padding: 1rem 1.2rem !important;
                }
                .menu-card-disabled {
                    opacity: 0.55; cursor: default;
                }
                .menu-card-disabled:hover {
                    transform: none !important; box-shadow: none !important;
                    border-color: var(--border) !important;
                }
                .card-icon-wrap {
                    width: 44px; height: 44px; border-radius: 12px; flex-shrink: 0;
                    display: flex; align-items: center; justify-content: center;
                }
                .coming-soon-badge {
                    position: absolute; top: 8px; right: 8px;
                    background: #f0f0f0; color: #aaa;
                    font-size: 9px; font-weight: 700; letter-spacing: 0.05em;
                    text-transform: uppercase; padding: 2px 7px; border-radius: 4px;
                }

                /* ── Orders panel ── */
                .orders-panel {
                    background: white; border-radius: 10px;
                    border: 1px solid var(--border); overflow: hidden;
                }
                .orders-panel-header {
                    padding: 0.75rem 1rem;
                    border-bottom: 1px solid var(--border);
                    display: flex; align-items: center; justify-content: space-between;
                }
                .order-mini-card {
                    border-bottom: 1px solid var(--border);
                    transition: background 0.15s; color: inherit;
                }
                .order-mini-card:last-child { border-bottom: none; }
                .order-mini-card:hover { background: #fdf8fc; }
                .order-icon-wrap {
                    width: 42px; height: 42px; border-radius: 50%;
                    background: #fdf0f9; color: var(--maroon);
                    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
                }
                .status-pill {
                    padding: 3px 8px; border-radius: 20px;
                    font-size: 10px; font-weight: 700;
                    display: inline-flex; align-items: center; gap: 3px;
                    text-transform: uppercase; white-space: nowrap;
                }
                .view-all-btn {
                    display: flex; align-items: center; justify-content: center; gap: 4px;
                    padding: 0.65rem; border-top: 1px solid var(--border);
                    text-decoration: none !important; color: var(--maroon) !important;
                    font-size: 12px; font-weight: 700;
                    letter-spacing: 0.04em; text-transform: uppercase;
                    transition: background 0.15s;
                }
                .view-all-btn:hover { background: #fdf0f9; }

                /* ── Empty orders ── */
                .empty-orders { padding: 2rem; text-align: center; }
            `}</style>

            {/* ── Sticky header ── */}
            <header className="dash-header sticky-top anim-1">
                <div className="container">
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center gap-2">
                            <div style={{
                                width: 32, height: 32, borderRadius: '50%',
                                background: 'rgba(255,255,255,0.15)',
                                border: '1.5px solid rgba(255,255,255,0.3)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <ShieldCheck size={16} color="white" />
                            </div>
                            <h1 className="h6 mb-0 fw-bold" style={{ fontFamily: "'Fraunces', serif" }}>
                                VillageSathi
                            </h1>
                        </div>
                        <div className="d-flex gap-2">
                            <button className="hdr-btn" aria-label="Notifications">
                                <Bell size={18} />
                                <span className="notif-dot" />
                            </button>
                            <button className="hdr-btn" aria-label="Sign out" onClick={handleLogout}>
                                <LogOut size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* ── Hero banner ── */}
            <div className="hero-banner anim-1">
                <div className="hero-blob-1" />
                <div className="hero-blob-2" />
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div className="d-flex align-items-start gap-3">
                        {/* Avatar */}
                        <div style={{
                            width: 62, height: 62, borderRadius: '50%', flexShrink: 0,
                            background: 'rgba(255,255,255,0.15)',
                            border: '2.5px solid rgba(255,255,255,0.35)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <span style={{ fontFamily: "'Fraunces', serif", fontSize: 21, fontWeight: 700, color: 'white' }}>
                                {getInitials(userData?.name ?? userData?.Name)}
                            </span>
                        </div>

                        {/* Name + meta */}
                        <div style={{ flex: 1 }}>
                            <p style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 2 }}>
                                Welcome back
                            </p>
                            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 700, color: 'white', lineHeight: 1.2, marginBottom: 8 }}>
                                {userData?.name ?? userData?.Name}
                            </h2>
                            <div className="d-flex flex-wrap gap-2">
                                {[
                                    { Icon: Smartphone,   text: userData?.mobileNo ?? userData?.MobileNo },
                                    { Icon: Fingerprint,  text: `ID: ${userData?.userId ?? userData?.UserId}` },
                                ].map(({ Icon, text }) => (
                                    <span key={text} style={{
                                        display: 'inline-flex', alignItems: 'center', gap: 4,
                                        padding: '3px 10px', borderRadius: 20,
                                        background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.85)',
                                        fontSize: 11.5, border: '0.5px solid rgba(255,255,255,0.2)',
                                    }}>
                                        <Icon size={11} /> {text}
                                    </span>
                                ))}
                                <span style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 5,
                                    padding: '4px 12px', borderRadius: 20,
                                    background: '#ffc200', color: '#5a3800',
                                    fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase',
                                }}>
                                    <Star size={10} fill="#5a3800" /> Gold Member
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Body ── */}
            <div className="container">

                {/* Stats float card */}
                <div className="stats-float-card anim-2">
                    {[
                        { num: stats.total || '—', label: 'Orders' },
                        { num: stats.saved ? `₹${stats.saved}` : '—', label: 'Saved' },
                        { num: '4.8★', label: 'Rating' },
                    ].map(({ num, label }) => (
                        <div key={label} className="stat-col">
                            <div className="stat-num">{num}</div>
                            <div className="stat-label">{label}</div>
                        </div>
                    ))}
                </div>

                {/* Promo strip */}
                <div className="mt-4 anim-2">
                    <Link to="/sathi-market" className="promo-strip">
                        <div style={{
                            width: 38, height: 38, borderRadius: 8, background: '#ffc200',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                            <Percent size={18} color="#5a3800" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <p className="mb-0 fw-bold" style={{ fontSize: 13.5, color: '#5a3800' }}>
                                Festival Sale — up to 40% off
                            </p>
                            <p className="mb-0" style={{ fontSize: 11.5, color: '#a07020' }}>
                                Use code SATHI40 · Ends Sunday
                            </p>
                        </div>
                        <ChevronRight size={16} color="#c09020" />
                    </Link>
                </div>

                {/* Menu grid */}
                <div className="mt-4 anim-3">
                    <p className="section-title">Marketplace &amp; Account</p>
                    <div className="menu-grid">
                        {MENU_ITEMS.map((item, i) => {
                            const { Icon, iconBg, iconColor, to, title, sub, wide, disabled } = item;

                            const inner = (
                                <>
                                    <div className="card-icon-wrap" style={{ background: iconBg }}>
                                        <Icon size={wide ? 22 : 20} color={iconColor} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p className="mb-0 fw-bold text-dark" style={{ fontSize: 13.5 }}>{title}</p>
                                        <p className="mb-0" style={{ fontSize: 11.5, color: '#999' }}>{sub}</p>
                                    </div>
                                    {wide && <ChevronRight size={16} color="#ccc" />}
                                    {disabled && <span className="coming-soon-badge">Soon</span>}
                                </>
                            );

                            const cls   = ['menu-card', wide ? 'menu-card-wide' : '', disabled ? 'menu-card-disabled' : ''].join(' ');
                            const style = wide ? { gridColumn: 'span 2' } : {};

                            return disabled
                                ? <div key={i} className={cls} style={style}>{inner}</div>
                                : <Link key={i} to={to} className={cls} style={style}>{inner}</Link>;
                        })}
                    </div>
                </div>

                {/* Recent orders panel */}
                <div className="mt-4 anim-4">
                    <div className="orders-panel">
                        <div className="orders-panel-header">
                            <p className="section-title mb-0">Recent Orders</p>
                            <Link to="/my-orders"
                                className="d-flex align-items-center gap-1 fw-bold"
                                style={{ fontSize: 12, color: '#721a61', textDecoration: 'none' }}>
                                View all <ChevronRight size={13} />
                            </Link>
                        </div>

                        {ordersLoading ? (
                            <DashSkeleton />
                        ) : recentOrders.length > 0 ? (
                            <>
                                {recentOrders.map(order => (
                                    <OrderMiniRow key={getId(order)} order={order} />
                                ))}
                                <Link to="/my-orders" className="view-all-btn">
                                    <TrendingUp size={13} /> See full order history
                                </Link>
                            </>
                        ) : (
                            <div className="empty-orders">
                                <Package size={44} style={{ color: '#721a61', opacity: 0.15 }} className="mb-2" />
                                <p className="fw-bold text-dark mb-1" style={{ fontSize: 14 }}>No orders yet</p>
                                <p className="text-muted mb-3" style={{ fontSize: 12 }}>
                                    Buy fresh produce and goods from local Sathi shops.
                                </p>
                                <Link to="/sathi-market"
                                    className="btn btn-sm fw-bold text-white px-4"
                                    style={{ background: '#721a61', borderRadius: 6 }}>
                                    Start Shopping
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-4 text-center anim-5">
                    <p className="d-flex align-items-center justify-content-center gap-2 mb-0"
                        style={{ fontSize: 11.5, color: '#bbb' }}>
                        <ShieldCheck size={13} color="#5dcaa5" />
                        Secured by VillageSathi SSL
                    </p>
                </div>
            </div>
        </main>
    );
};

export default CustomerDashBoard;