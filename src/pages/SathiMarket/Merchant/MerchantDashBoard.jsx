import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../api/axiosInstance';
import { toast } from 'react-toastify';
import { useAuth } from '../../../context/AuthContext';
import {
    IndianRupee, ShoppingBag, Package, Search,
    ArrowUpRight, Clock, CheckCircle2, Store,
    LayoutDashboard, Loader2, XCircle,
    ChevronLeft, TrendingUp, ListOrdered,
} from 'lucide-react';

/* ─── Brand Tokens — keep in sync with ManageProfile & ShopOrders ─────── */
const BRAND = {
    heroStart:   '#3D0030',
    heroMid:     '#6B0F4A',
    heroEnd:     '#8C1560',
    gold:        '#D4A017',
    goldLight:   '#F5D76E',
    purple:      '#7C3AED',
    purpleLight: '#EDE9FF',
    purpleSoft:  '#F5F0FF',
    lavStrip:    'linear-gradient(90deg,#F5F0FF,#EDE9FF)',
    success:     '#16A34A',
    danger:      '#DC2626',
    pending:     '#D97706',
};

/* ─── Status helpers ──────────────────────────────────────────────────── */
const STATUS_TABS = [
    { label: 'All',       value: 'all' },
    { label: 'Pending',   value: '0'   },
    { label: 'Completed', value: '1'   },
    { label: 'Cancelled', value: '2'   },
];

const statusMeta = (raw) => {
    const c = Number(raw);
    if (c === 1) return { label: 'Completed', color: BRAND.success,  bg: '#f0fdf4', icon: <CheckCircle2 size={11} /> };
    if (c === 2) return { label: 'Cancelled', color: BRAND.danger,   bg: '#fef2f2', icon: <XCircle    size={11} /> };
    return            { label: 'Pending',   color: BRAND.pending, bg: '#fffbeb', icon: <Clock        size={11} /> };
};

/* ═══════════════════════════════════════════════════════════════════════ */
const MerchantDashBoard = () => {
    const navigate = useNavigate();
    const { user, isBusiness, loading } = useAuth();

    const [stats, setStats]             = useState({ total:0, pending:0, completed:0, cancelled:0, revenue:0, activeItems:0 });
    const [allOrders, setAllOrders]     = useState([]);
    const [searchTerm, setSearchTerm]   = useState('');
    const [activeTab, setActiveTab]     = useState('all');
    const [dataLoading, setDataLoading] = useState(true);

    const shopId = user?.shopId || user?.ShopId;

    /* ── Fetch ── */
    useEffect(() => {
        if (loading) return;
        if (!isBusiness || !shopId) { navigate('/merchant-login', { replace: true }); return; }

        (async () => {
            try {
                const [ordersRes, itemsRes] = await Promise.all([
                    axiosInstance.get(`/Orders/GetByShop/${shopId}`),
                    axiosInstance.get(`/ShopItems/GetByShop/${shopId}`),
                ]);
                const orders = ordersRes.data?.Data || ordersRes.data || [];
                const items  = itemsRes.data?.Data  || itemsRes.data  || [];

                const revenue   = orders.reduce((a, o) => a + (o.TotalAmount || o.totalAmount || 0), 0);
                const pending   = orders.filter(o => Number(o.OrderStatus ?? o.orderStatus) === 0).length;
                const completed = orders.filter(o => Number(o.OrderStatus ?? o.orderStatus) === 1).length;
                const cancelled = orders.filter(o => Number(o.OrderStatus ?? o.orderStatus) === 2).length;

                setStats({
                    total: orders.length, pending, completed, cancelled, revenue,
                    activeItems: items.filter(i => i.IsActive || i.isActive || i.isAvailable).length,
                });
                setAllOrders(orders);
            } catch {
                toast.error('Failed to load dashboard data');
            } finally {
                setDataLoading(false);
            }
        })();
    }, [loading, isBusiness, shopId, navigate]);

    /* ── Filter + Search ── */
    const visibleOrders = allOrders
        .filter(o => {
            if (activeTab !== 'all' && String(o.OrderStatus ?? o.orderStatus) !== activeTab) return false;
            const t = searchTerm.toLowerCase();
            return (
                (o.OrderID  || o.orderID )?.toString().includes(t) ||
                (o.UserId   || o.userID  )?.toString().includes(t)
            );
        })
        .slice(0, 5);

    /* ── Loading screen ── */
    if (loading || dataLoading) {
        return (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center',
                          justifyContent:'center', minHeight:'100vh', background: BRAND.purpleSoft }}>
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                <Loader2 size={42} style={{ color: BRAND.gold, animation:'spin 1s linear infinite' }} />
                <span style={{ marginTop:12, fontWeight:700, fontSize:'.8rem', color:BRAND.purple,
                               letterSpacing:'.1em', textTransform:'uppercase' }}>
                    Syncing Dashboard…
                </span>
            </div>
        );
    }

    /* ═══════════════════════════ RENDER ════════════════════════════════ */
    return (
        <div style={{ background: BRAND.purpleSoft, minHeight:'100vh', fontFamily:'system-ui,sans-serif' }}>

            {/* ══ Global CSS ══════════════════════════════════════════════ */}
            <style>{`
                @keyframes spin { to { transform:rotate(360deg); } }

                /* Back button */
                .db-back {
                    background:transparent;
                    border:2px solid rgba(212,160,23,.4);
                    color:${BRAND.goldLight};
                    border-radius:50px; padding:6px 14px;
                    font-size:.72rem; font-weight:800;
                    letter-spacing:.06em; text-transform:uppercase;
                    cursor:pointer;
                    display:inline-flex; align-items:center; gap:5px;
                    transition:all .2s; white-space:nowrap; flex-shrink:0;
                }
                .db-back:hover { background:${BRAND.gold}; color:#1a0011; border-color:${BRAND.gold}; }

                /* Stat card */
                .db-stat {
                    background:#fff;
                    border-radius:16px;
                    border:1px solid ${BRAND.purpleLight};
                    padding:18px;
                    transition:transform .25s,box-shadow .25s;
                    cursor:default;
                }
                .db-stat:hover { transform:translateY(-3px); box-shadow:0 10px 26px rgba(124,58,237,.10); }

                /* Filter tab */
                .db-tab {
                    padding:6px 14px; border-radius:50px;
                    font-size:.7rem; font-weight:800;
                    letter-spacing:.06em; text-transform:uppercase;
                    border:2px solid transparent;
                    cursor:pointer; transition:all .2s;
                    background:transparent; color:#94a3b8;
                    white-space:nowrap;
                }
                .db-tab:hover { color:${BRAND.purple}; border-color:${BRAND.purpleLight}; }
                .db-tab.active {
                    background:linear-gradient(135deg,${BRAND.purple},${BRAND.gold});
                    color:#fff !important; border-color:transparent;
                    box-shadow:0 4px 14px rgba(124,58,237,.28);
                }

                /* Search bar */
                .db-search {
                    display:flex; align-items:center; gap:7px;
                    background:${BRAND.purpleSoft};
                    border:1.5px solid #DDD6FE; border-radius:50px;
                    padding:7px 14px;
                    width:100%; max-width:100%;
                }
                .db-search input {
                    border:none; background:transparent; outline:none;
                    font-size:.8rem; width:100%; color:#1e1b4b; min-width:0;
                }
                .db-search input::placeholder { color:#a78bfa; }

                /* Table */
                .db-table { width:100%; border-collapse:collapse; }
                .db-table thead th {
                    background:${BRAND.lavStrip};
                    font-size:.58rem; font-weight:800;
                    letter-spacing:.12em; text-transform:uppercase;
                    color:${BRAND.purple}; padding:13px 14px; border:none;
                    white-space:nowrap;
                }
                .db-table tbody tr { transition:background .15s; }
                .db-table tbody tr:hover { background:#FAFAFF; }
                .db-table tbody td {
                    padding:13px 14px; font-size:.82rem;
                    border-bottom:1px solid #F3F0FF; vertical-align:middle;
                }

                /* Order pill */
                .db-order-pill {
                    background:${BRAND.purpleLight}; color:${BRAND.purple};
                    padding:3px 10px; border-radius:50px;
                    font-size:.72rem; font-weight:800;
                    letter-spacing:.04em; white-space:nowrap;
                }

                /* Customer chip */
                .db-customer {
                    display:inline-flex; align-items:center; gap:6px;
                    background:linear-gradient(135deg,${BRAND.purpleLight},#FDF4DC);
                    border:1px solid #DDD6FE; border-radius:50px;
                    padding:4px 11px 4px 5px;
                    font-size:.75rem; font-weight:700; color:#4c1d95;
                    white-space:nowrap;
                }
                .db-avatar {
                    width:24px; height:24px; border-radius:50%;
                    background:linear-gradient(135deg,${BRAND.purple},${BRAND.gold});
                    display:flex; align-items:center; justify-content:center;
                    flex-shrink:0;
                }

                /* Status badge */
                .db-badge {
                    display:inline-flex; align-items:center; gap:4px;
                    padding:4px 11px; border-radius:50px;
                    font-size:.65rem; font-weight:800;
                    text-transform:uppercase; letter-spacing:.05em;
                    white-space:nowrap;
                }

                /* Amount gradient text */
                .db-amount {
                    font-weight:800;
                    background:linear-gradient(135deg,${BRAND.purple},${BRAND.gold});
                    -webkit-background-clip:text; -webkit-text-fill-color:transparent;
                    background-clip:text;
                }

                /* View all */
                .db-view-all {
                    background:none; border:none;
                    font-size:.78rem; font-weight:800;
                    letter-spacing:.07em; text-transform:uppercase;
                    color:${BRAND.purple}; cursor:pointer;
                    display:inline-flex; align-items:center; gap:5px;
                    transition:color .2s;
                }
                .db-view-all:hover { color:${BRAND.gold}; }

                /* ── RESPONSIVE ── */

                /* Hero row */
                .db-hero-row {
                    display:flex; flex-direction:column; gap:12px;
                }
                .db-hero-left {
                    display:flex; align-items:center; gap:10px; flex-wrap:wrap;
                }
                .db-hero-right { display:flex; justify-content:flex-start; }

                /* Stats grid — 2 cols on mobile, auto-fit on larger */
                .db-stats-grid {
                    display:grid;
                    grid-template-columns:1fr 1fr;
                    gap:12px;
                }

                /* Revenue card spans full width on mobile */
                .db-stat-revenue { grid-column:1/-1; }

                /* Table header — search below title on mobile */
                .db-table-topbar {
                    display:flex; flex-direction:column; gap:12px;
                    padding:16px; border-bottom:1px solid #F3F0FF;
                }

                /* Filter tabs row */
                .db-tabs-row {
                    display:flex; gap:6px; flex-wrap:wrap;
                    padding:10px 16px; border-bottom:1px solid #F3F0FF;
                }

                @media (min-width:540px) {
                    .db-hero-row { flex-direction:row; justify-content:space-between; align-items:center; }
                    .db-hero-right { justify-content:flex-end; }
                    .db-table-topbar { flex-direction:row; justify-content:space-between; align-items:center; }
                    .db-search { max-width:260px; }
                }

                @media (min-width:720px) {
                    .db-stats-grid { grid-template-columns:repeat(3,1fr); }
                    .db-stat-revenue { grid-column:auto; }
                }

                @media (min-width:1000px) {
                    .db-stats-grid { grid-template-columns:2fr 1fr 1fr 1fr 1fr 1fr; }
                    .db-stat-revenue { grid-column:span 2; }
                }
            `}</style>

            <div style={{ maxWidth:1080, margin:'0 auto', padding:'clamp(14px,4vw,28px) clamp(12px,4vw,24px)' }}>

                {/* ══ HERO BANNER ══════════════════════════════════════ */}
                <div style={{
                    background:`linear-gradient(135deg,${BRAND.heroStart} 0%,${BRAND.heroMid} 55%,${BRAND.heroEnd} 100%)`,
                    borderRadius:22,
                    padding:'clamp(16px,4vw,26px) clamp(16px,4vw,30px)',
                    borderBottom:`4px solid ${BRAND.gold}`,
                    boxShadow:'0 8px 32px rgba(61,0,48,.35)',
                    marginBottom:20,
                    position:'relative', overflow:'hidden',
                }}>
                    {[220,330].map((sz,i)=>(
                        <div key={i} style={{
                            position:'absolute', top:-sz*.38, right:-sz*.38,
                            width:sz, height:sz, borderRadius:'50%',
                            border:`1.5px solid rgba(212,160,23,${i===0?.1:.055})`,
                            pointerEvents:'none',
                        }}/>
                    ))}

                    <div className="db-hero-row">
                        {/* Left */}
                        <div className="db-hero-left">
                            <button className="db-back" onClick={()=>navigate(-1)}>
                                <ChevronLeft size={13}/> Back
                            </button>
                            <div style={{
                                width:46,height:46,borderRadius:13,flexShrink:0,
                                background:'rgba(212,160,23,.15)',
                                border:'1.5px solid rgba(212,160,23,.3)',
                                display:'flex',alignItems:'center',justifyContent:'center',
                            }}>
                                <LayoutDashboard size={22} style={{color:BRAND.gold}}/>
                            </div>
                            <div style={{minWidth:0}}>
                                <h3 style={{
                                    color:'#fff',fontWeight:900,margin:0,
                                    fontSize:'clamp(.95rem,2.5vw,1.2rem)',
                                    overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',
                                }}>
                                    Merchant Dashboard
                                </h3>
                                <p style={{color:'rgba(255,255,255,.5)',fontSize:'.75rem',margin:'3px 0 0',fontWeight:600}}>
                                    {user?.shopName} · {user?.roleName}
                                </p>
                            </div>
                        </div>

                        {/* Right — Shop ID chip */}
                        <div className="db-hero-right">
                            <div style={{
                                display:'inline-flex',alignItems:'center',gap:7,
                                background:'rgba(255,255,255,.08)',
                                border:'1px solid rgba(212,160,23,.25)',
                                borderRadius:50,padding:'7px 14px',whiteSpace:'nowrap',
                            }}>
                                <Store size={13} style={{color:BRAND.gold}}/>
                                <span style={{color:'#fff',fontWeight:800,fontSize:'.73rem',letterSpacing:'.05em'}}>
                                    #SM-BIZ-{shopId}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ══ STAT CARDS ════════════════════════════════════════ */}
                <div className="db-stats-grid" style={{marginBottom:20}}>

                    {/* Revenue — spans wider */}
                    <div className="db-stat db-stat-revenue">
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                            <div>
                                <div style={{fontSize:'.58rem',fontWeight:800,letterSpacing:'.12em',
                                             textTransform:'uppercase',color:'#94a3b8',marginBottom:5}}>
                                    Total Revenue
                                </div>
                                <div style={{fontSize:'clamp(1.2rem,3vw,1.55rem)',fontWeight:900,color:'#1e1b4b',lineHeight:1}}>
                                    ₹{stats.revenue.toLocaleString('en-IN')}
                                </div>
                            </div>
                            <div style={{width:40,height:40,borderRadius:11,flexShrink:0,
                                         background:'linear-gradient(135deg,#FDF4DC,#FFF7E0)',
                                         display:'flex',alignItems:'center',justifyContent:'center'}}>
                                <IndianRupee size={20} style={{color:BRAND.gold}}/>
                            </div>
                        </div>
                        <div style={{marginTop:10,display:'flex',alignItems:'center',gap:5,
                                     fontSize:'.72rem',fontWeight:700,color:BRAND.success}}>
                            <TrendingUp size={12}/> Lifetime Earnings
                        </div>
                    </div>

                    <StatCard label="All Orders"   value={stats.total}       color="#2563eb" bg="#eff6ff"           icon={<ListOrdered  size={18}/>}/>
                    <StatCard label="Pending"      value={stats.pending}     color={BRAND.pending} bg="#fffbeb"     icon={<Clock        size={18}/>}/>
                    <StatCard label="Completed"    value={stats.completed}   color={BRAND.success} bg="#f0fdf4"     icon={<CheckCircle2 size={18}/>}/>
                    <StatCard label="Cancelled"    value={stats.cancelled}   color={BRAND.danger}  bg="#fef2f2"     icon={<XCircle      size={18}/>}/>
                    <StatCard label="Catalog"      value={stats.activeItems} color={BRAND.purple}  bg={BRAND.purpleLight} icon={<Package size={18}/>} sub="Active"/>
                </div>

                {/* ══ ORDERS TABLE CARD ═════════════════════════════════ */}
                <div style={{background:'#fff',borderRadius:20,border:`1px solid #EDE9FF`,
                             boxShadow:'0 4px 24px rgba(124,58,237,.06)',overflow:'hidden'}}>

                    {/* Top bar */}
                    <div className="db-table-topbar">
                        <h5 style={{fontWeight:800,margin:0,color:'#1e1b4b',fontSize:'.95rem'}}>
                            Recent Transactions
                        </h5>
                        <div className="db-search">
                            <Search size={14} style={{color:BRAND.purple,flexShrink:0}}/>
                            <input
                                type="text"
                                placeholder="Search order / customer…"
                                value={searchTerm}
                                onChange={e=>setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Filter tabs */}
                    <div className="db-tabs-row">
                        {STATUS_TABS.map(s=>(
                            <button key={s.value}
                                className={`db-tab${activeTab===s.value?' active':''}`}
                                onClick={()=>setActiveTab(s.value)}
                            >
                                {s.label}
                                {s.value!=='all'&&(
                                    <span style={{marginLeft:4,opacity:.7}}>
                                        ({s.value==='0'?stats.pending:s.value==='1'?stats.completed:stats.cancelled})
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Table */}
                    <div style={{overflowX:'auto'}}>
                        <table className="db-table">
                            <thead>
                                <tr>
                                    <th>Order Ref</th>
                                    <th>Date &amp; Time</th>
                                    <th>Customer</th>
                                    <th>Amount</th>
                                    <th style={{textAlign:'center'}}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visibleOrders.length>0 ? visibleOrders.map(order=>{
                                    const id  = order.OrderID  || order.orderID;
                                    const uid = order.UserId   || order.userID;
                                    const amt = order.TotalAmount || order.totalAmount;
                                    const dt  = order.OrderDate  || order.orderDate;
                                    const s   = statusMeta(order.OrderStatus ?? order.orderStatus);
                                    return (
                                        <tr key={id}>
                                            <td><span className="db-order-pill">#SM-{id}</span></td>
                                            <td style={{color:'#64748b',fontSize:'.78rem',fontWeight:600,whiteSpace:'nowrap'}}>
                                                {dt ? new Date(dt).toLocaleString('en-IN',{
                                                    day:'2-digit',month:'short',year:'numeric',
                                                    hour:'2-digit',minute:'2-digit',
                                                }) : '—'}
                                            </td>
                                            <td>
                                                <div className="db-customer">
                                                    <div className="db-avatar">
                                                        <Store size={11} style={{color:'#fff'}}/>
                                                    </div>
                                                    ID: {uid}
                                                </div>
                                            </td>
                                            <td><span className="db-amount">₹{Number(amt).toLocaleString('en-IN')}</span></td>
                                            <td style={{textAlign:'center'}}>
                                                <span className="db-badge" style={{color:s.color,background:s.bg}}>
                                                    {s.icon} {s.label}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan="5" style={{textAlign:'center',padding:'44px 16px'}}>
                                            <Package size={42} style={{color:'#DDD6FE',display:'block',margin:'0 auto 12px'}}/>
                                            <p style={{color:'#a78bfa',fontWeight:700,fontSize:'.78rem',
                                                       textTransform:'uppercase',letterSpacing:'.1em',margin:0}}>
                                                {searchTerm||activeTab!=='all'
                                                    ? 'No matching orders found'
                                                    : 'No orders placed yet'}
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer */}
                    <div style={{padding:'13px 16px',background:BRAND.purpleSoft,
                                 textAlign:'center',borderTop:`1px solid #EDE9FF`}}>
                        <button className="db-view-all" onClick={()=>navigate('/business/shop-orders')}>
                            View Full Sales Ledger <ArrowUpRight size={13}/>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

/* ── Reusable Stat Card ───────────────────────────────────────────────── */
const StatCard = ({ label, value, color, bg, icon, sub }) => (
    <div className="db-stat">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
            <div style={{minWidth:0}}>
                <div style={{fontSize:'.57rem',fontWeight:800,letterSpacing:'.12em',
                             textTransform:'uppercase',color:'#94a3b8',marginBottom:5}}>
                    {label}
                </div>
                <div style={{fontSize:'clamp(1.1rem,2.5vw,1.45rem)',fontWeight:900,color:'#1e1b4b',lineHeight:1}}>
                    {value}
                </div>
            </div>
            <div style={{width:36,height:36,borderRadius:10,flexShrink:0,
                         background:bg,display:'flex',alignItems:'center',justifyContent:'center',color}}>
                {icon}
            </div>
        </div>
        {sub && <div style={{marginTop:8,fontSize:'.68rem',fontWeight:700,color:'#94a3b8'}}>{sub}</div>}
    </div>
);

export default MerchantDashBoard;