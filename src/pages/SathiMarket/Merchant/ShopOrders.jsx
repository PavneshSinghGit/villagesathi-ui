import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../../api/axiosInstance';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    ClipboardList, Search, Filter, CheckCircle2,
    XCircle, Clock, User, IndianRupee, Lock,
    ArrowLeft, Loader2, Package, TrendingUp, AlertCircle
} from 'lucide-react';

/* ─────────────────────────────────────────
   SATHIMARKET EXACT COLOR TOKENS
   Source: Customer UI screenshot
   Navbar  → #3D0030 / #6B0F4A / #8C1560
   Gold    → #D4A017 / #F5C518
   Panel   → #1C1230
   Page bg → #F5F0FF  (lavender)
   Purple  → #5B2D8E
───────────────────────────────────────── */
const SM = {
    bgDeep:     '#3D0030',
    bgMid:      '#6B0F4A',
    bgLight:    '#8C1560',
    gold:       '#D4A017',
    goldBright: '#F5C518',
    goldSoft:   'rgba(212,160,23,0.14)',
    pageBg:     '#F5F0FF',
    purpleText: '#5B2D8E',
    purpleSoft: '#EDE9FF',
    mutedText:  '#8B6FAE',
    border:     'rgba(91,45,142,0.14)',
    white:      '#FFFFFF',
};

const ShopOrders = () => {
    const { user, isBusiness, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [orders, setOrders]         = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [dataLoading, setDataLoading] = useState(true);
    const [filter, setFilter]         = useState('all');
    const [updatingId, setUpdatingId] = useState(null);

    const shopId = user?.shopId || user?.ShopId;

    const fetchShopOrders = useCallback(async () => {
        if (authLoading || !isBusiness || !shopId) return;
        try {
            setDataLoading(true);
            const res  = await axiosInstance.get(`/Orders/GetByShop/${shopId}`);
            const data = res.data?.Data || res.data || [];
            setOrders(Array.isArray(data) ? [...data].reverse() : []);
        } catch { toast.error('Failed to load orders'); }
        finally  { setDataLoading(false); }
    }, [shopId, isBusiness, authLoading]);

    useEffect(() => {
        if (!authLoading && (!isBusiness || !shopId)) {
            navigate('/merchant-login', { replace: true });
            return;
        }
        fetchShopOrders();
    }, [fetchShopOrders, authLoading, isBusiness, shopId, navigate]);

    const updateOrderStatus = async (orderID, newStatus) => {
        const label = newStatus === 1 ? 'Complete' : 'Cancel';
        if (!window.confirm(`Are you sure you want to ${label} order #VS-${orderID}?`)) return;
        setUpdatingId(orderID);
        try {
            await axiosInstance.post('/Orders/UpdateStatus', { orderID, status: newStatus });
            toast.success(`Order ${label}d successfully!`);
            fetchShopOrders();
        } catch { toast.error('Status update failed'); }
        finally  { setUpdatingId(null); }
    };

    const filteredOrders = orders.filter(order => {
        const matchesFilter = filter === 'all' || String(order.orderStatus) === filter;
        const matchesSearch =
            (order.orderID  || order.OrderID)?.toString().includes(searchTerm) ||
            (order.userID   || order.UserId)?.toString().includes(searchTerm);
        return matchesFilter && matchesSearch;
    });

    // Stats
    const total     = orders.length;
    const pending   = orders.filter(o => Number(o.orderStatus) === 0).length;
    const completed = orders.filter(o => Number(o.orderStatus) === 1).length;
    const cancelled = orders.filter(o => Number(o.orderStatus) === 2).length;

    /* ── LOADING ── */
    if (authLoading || dataLoading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: SM.pageBg }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: `linear-gradient(135deg, ${SM.bgDeep}, ${SM.bgMid})`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14, boxShadow: '0 8px 24px rgba(61,0,48,0.3)' }}>
                    <Loader2 size={26} color={SM.goldBright} style={{ animation: 'so-spin 1s linear infinite' }} />
                </div>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', color: SM.mutedText }}>
                    Loading Orders...
                </span>
                <style>{`@keyframes so-spin { from { transform:rotate(0deg) } to { transform:rotate(360deg) } }`}</style>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: SM.pageBg, minHeight: '100vh', padding: '24px 16px' }}>
            <style>{`
                @keyframes so-spin { from { transform:rotate(0deg) } to { transform:rotate(360deg) } }

                .so-wrap { max-width: 1200px; margin: 0 auto; }

                /* ── HERO ── */
                .so-hero {
                    background: linear-gradient(135deg, ${SM.bgDeep} 0%, ${SM.bgMid} 55%, ${SM.bgLight} 100%);
                    border-radius: 20px;
                    padding: 26px 30px 22px;
                    border-bottom: 3px solid ${SM.gold};
                    box-shadow: 0 12px 40px rgba(61,0,48,0.28);
                    margin-bottom: 16px;
                }
                .so-hero-back {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    background: transparent;
                    border: none;
                    color: rgba(255,255,255,0.55);
                    font-size: 0.68rem;
                    font-weight: 800;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    cursor: pointer;
                    margin-bottom: 14px;
                    padding: 0;
                    transition: color 0.15s;
                }
                .so-hero-back:hover { color: ${SM.goldBright}; }
                .so-hero-inner  { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
                .so-hero-left   { display: flex; align-items: center; gap: 16px; }
                .so-hero-icon   { width: 50px; height: 50px; border-radius: 13px; background: rgba(212,160,23,0.18); border: 1.5px solid rgba(212,160,23,0.35); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
                .so-hero-title  { font-size: 1.25rem; font-weight: 900; color: #fff; margin: 0 0 3px; }
                .so-hero-sub    { font-size: 0.62rem; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; color: rgba(255,255,255,0.5); margin: 0; }
                .so-hero-badge  { background: ${SM.goldSoft}; border: 1px solid rgba(212,160,23,0.3); border-radius: 50px; padding: 7px 18px; }
                .so-hero-badge span { font-size: 0.8rem; font-weight: 800; color: ${SM.goldBright}; }

                /* ── STATS ROW ── */
                .so-stats {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 12px;
                    margin-bottom: 16px;
                }
                .so-stat {
                    background: ${SM.white};
                    border-radius: 14px;
                    border: 1px solid ${SM.border};
                    padding: 16px 18px;
                    box-shadow: 0 2px 12px rgba(91,45,142,0.07);
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    transition: transform 0.18s;
                }
                .so-stat:hover { transform: translateY(-2px); }
                .so-stat-icon {
                    width: 38px; height: 38px; border-radius: 10px;
                    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
                }
                .so-stat-val   { font-size: 1.4rem; font-weight: 900; color: #1a1a2e; line-height: 1; }
                .so-stat-label { font-size: 0.65rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: ${SM.mutedText}; margin-top: 3px; }

                /* ── CONTROL PANEL ── */
                .so-controls {
                    background: ${SM.white};
                    border-radius: 16px;
                    border: 1px solid ${SM.border};
                    padding: 14px 20px;
                    margin-bottom: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    gap: 12px;
                    box-shadow: 0 2px 12px rgba(91,45,142,0.07);
                }
                .so-controls-left { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

                /* Search */
                .so-search {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: ${SM.purpleSoft};
                    border: 1px solid ${SM.border};
                    border-radius: 50px;
                    padding: 8px 16px;
                    min-width: 220px;
                }
                .so-search input {
                    border: none; background: transparent; outline: none;
                    font-size: 0.82rem; font-weight: 600; color: ${SM.purpleText}; width: 100%;
                }
                .so-search input::placeholder { color: ${SM.mutedText}; }

                /* Filter Tabs */
                .so-tabs { display: flex; align-items: center; gap: 4px; }
                .so-tab {
                    padding: 7px 14px;
                    border-radius: 50px;
                    font-size: 0.74rem;
                    font-weight: 800;
                    border: 1px solid transparent;
                    cursor: pointer;
                    transition: all 0.18s;
                    background: transparent;
                    color: ${SM.mutedText};
                }
                .so-tab:hover { background: ${SM.purpleSoft}; color: ${SM.purpleText}; }
                .so-tab.so-tab-active {
                    background: linear-gradient(135deg, ${SM.bgDeep}, ${SM.bgMid});
                    color: ${SM.goldBright};
                    border-color: transparent;
                    box-shadow: 0 3px 10px rgba(61,0,48,0.25);
                }
                .so-count-label { font-size: 0.74rem; font-weight: 700; color: ${SM.mutedText}; white-space: nowrap; }

                /* ── TABLE CARD ── */
                .so-table-card {
                    background: ${SM.white};
                    border-radius: 18px;
                    border: 1px solid ${SM.border};
                    box-shadow: 0 4px 20px rgba(91,45,142,0.08);
                    overflow: hidden;
                }
                .so-table { width: 100%; border-collapse: collapse; }
                .so-thead tr { background: linear-gradient(135deg, ${SM.purpleSoft}, #F3EFFF); }
                .so-thead th {
                    padding: 14px 14px;
                    font-size: 0.63rem; font-weight: 900;
                    letter-spacing: 1.2px; text-transform: uppercase;
                    color: ${SM.mutedText}; border: none; white-space: nowrap;
                }
                .so-thead th:first-child { padding-left: 24px; }
                .so-thead th:last-child  { padding-right: 24px; text-align: right; }

                .so-tbody tr {
                    border-bottom: 1px solid rgba(91,45,142,0.07);
                    transition: background 0.15s;
                }
                .so-tbody tr:hover { background: #FDFBFF; }
                .so-tbody tr:last-child { border-bottom: none; }
                .so-tbody td { padding: 14px 14px; vertical-align: middle; }
                .so-tbody td:first-child { padding-left: 24px; }
                .so-tbody td:last-child  { padding-right: 24px; text-align: right; }

                /* Order ID */
                .so-order-id {
                    font-size: 0.88rem; font-weight: 900;
                    color: ${SM.purpleText};
                    background: ${SM.purpleSoft};
                    border: 1px solid ${SM.border};
                    border-radius: 8px;
                    padding: 4px 10px;
                    display: inline-block;
                }

                /* Date */
                .so-date { font-size: 0.78rem; font-weight: 600; color: #555; }

                /* Customer chip */
                .so-customer {
                    display: inline-flex; align-items: center; gap: 7px;
                    background: ${SM.purpleSoft}; border: 1px solid ${SM.border};
                    border-radius: 50px; padding: 5px 12px;
                }
                .so-customer-av {
                    width: 24px; height: 24px; border-radius: 50%;
                    background: linear-gradient(135deg, ${SM.bgDeep}, ${SM.bgMid});
                    display: flex; align-items: center; justify-content: center;
                    flex-shrink: 0;
                }
                .so-customer span { font-size: 0.75rem; font-weight: 800; color: ${SM.purpleText}; }

                /* Amount */
                .so-amount {
                    display: flex; align-items: center; gap: 4px;
                    font-size: 0.92rem; font-weight: 900; color: ${SM.purpleText};
                }
                .so-amount-icon { color: ${SM.gold}; }

                /* Status pills */
                .so-pill {
                    display: inline-flex; align-items: center; gap: 5px;
                    padding: 5px 12px; border-radius: 50px;
                    font-size: 0.65rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px;
                }
                .so-pill-pending   { background: rgba(234,179,8,0.12);  color: #854d0e; border: 1px solid rgba(234,179,8,0.25); }
                .so-pill-completed { background: rgba(34,197,94,0.12);  color: #166534; border: 1px solid rgba(34,197,94,0.25); }
                .so-pill-cancelled { background: rgba(239,68,68,0.1);   color: #991b1b; border: 1px solid rgba(239,68,68,0.2); }

                /* Action Buttons */
                .so-btn-deliver {
                    display: inline-flex; align-items: center; gap: 5px;
                    background: linear-gradient(135deg, #15803d, #16a34a);
                    color: white; border: none; border-radius: 9px;
                    padding: 7px 14px; font-size: 0.73rem; font-weight: 900;
                    cursor: pointer; transition: all 0.2s;
                    box-shadow: 0 3px 10px rgba(22,163,74,0.25);
                }
                .so-btn-deliver:hover:not(:disabled) { background: linear-gradient(135deg, #14532d, #15803d); transform: translateY(-1px); box-shadow: 0 5px 14px rgba(22,163,74,0.35); }
                .so-btn-deliver:disabled { opacity: 0.6; cursor: not-allowed; }

                .so-btn-cancel {
                    display: inline-flex; align-items: center; gap: 5px;
                    background: transparent;
                    color: #dc2626; border: 1.5px solid #dc2626; border-radius: 9px;
                    padding: 6px 12px; font-size: 0.73rem; font-weight: 900;
                    cursor: pointer; transition: all 0.2s;
                }
                .so-btn-cancel:hover:not(:disabled) { background: #dc2626; color: white; transform: translateY(-1px); }
                .so-btn-cancel:disabled { opacity: 0.6; cursor: not-allowed; }

                .so-finalized {
                    display: inline-flex; align-items: center; gap: 5px;
                    font-size: 0.7rem; font-weight: 800; color: ${SM.mutedText};
                    opacity: 0.6; text-transform: uppercase; letter-spacing: 0.5px;
                }

                /* Empty */
                .so-empty { text-align: center; padding: 60px 20px; }
                .so-empty-box {
                    width: 70px; height: 70px; border-radius: 18px;
                    background: ${SM.purpleSoft}; display: flex;
                    align-items: center; justify-content: center; margin: 0 auto 14px;
                }
                .so-empty-title { font-size: 0.78rem; font-weight: 800; color: ${SM.mutedText}; text-transform: uppercase; letter-spacing: 1px; margin: 0; }

                /* Responsive */
                @media (max-width: 900px) {
                    .so-stats { grid-template-columns: repeat(2,1fr); }
                }
                @media (max-width: 600px) {
                    .so-stats  { grid-template-columns: repeat(2,1fr); }
                    .so-hero   { padding: 18px; }
                    .so-controls { padding: 12px 14px; }
                    .so-thead th:first-child { padding-left: 14px; }
                    .so-tbody td:first-child { padding-left: 14px; }
                    .so-tabs { display: none; }
                }
            `}</style>

            <div className="so-wrap">

                {/* ── HERO ── */}
                <div className="so-hero">
                    <button className="so-hero-back" onClick={() => navigate('/merchant/dashboard')}>
                        <ArrowLeft size={13} /> Dashboard
                    </button>
                    <div className="so-hero-inner">
                        <div className="so-hero-left">
                            <div className="so-hero-icon">
                                <ClipboardList size={24} color={SM.goldBright} />
                            </div>
                            <div>
                                <p className="so-hero-title">Order Management</p>
                                <p className="so-hero-sub">Real-time Sales Processing · SathiMarket</p>
                            </div>
                        </div>
                        <div className="so-hero-badge">
                            <span>{total} Total Orders</span>
                        </div>
                    </div>
                </div>

                {/* ── STATS ── */}
                <div className="so-stats">
                    <div className="so-stat">
                        <div className="so-stat-icon" style={{ background: SM.purpleSoft }}>
                            <Package size={18} color={SM.purpleText} />
                        </div>
                        <div>
                            <div className="so-stat-val">{total}</div>
                            <div className="so-stat-label">All Orders</div>
                        </div>
                    </div>
                    <div className="so-stat">
                        <div className="so-stat-icon" style={{ background: 'rgba(234,179,8,0.12)' }}>
                            <Clock size={18} color="#a16207" />
                        </div>
                        <div>
                            <div className="so-stat-val" style={{ color: '#a16207' }}>{pending}</div>
                            <div className="so-stat-label">Pending</div>
                        </div>
                    </div>
                    <div className="so-stat">
                        <div className="so-stat-icon" style={{ background: 'rgba(34,197,94,0.1)' }}>
                            <CheckCircle2 size={18} color="#15803d" />
                        </div>
                        <div>
                            <div className="so-stat-val" style={{ color: '#15803d' }}>{completed}</div>
                            <div className="so-stat-label">Completed</div>
                        </div>
                    </div>
                    <div className="so-stat">
                        <div className="so-stat-icon" style={{ background: 'rgba(239,68,68,0.09)' }}>
                            <XCircle size={18} color="#dc2626" />
                        </div>
                        <div>
                            <div className="so-stat-val" style={{ color: '#dc2626' }}>{cancelled}</div>
                            <div className="so-stat-label">Cancelled</div>
                        </div>
                    </div>
                </div>

                {/* ── CONTROLS ── */}
                <div className="so-controls">
                    <div className="so-controls-left">
                        {/* Search */}
                        <div className="so-search">
                            <Search size={15} color={SM.mutedText} />
                            <input
                                type="text"
                                placeholder="Search by Order ID or Customer..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Filter Tabs */}
                        <div className="so-tabs">
                            {[
                                { val: 'all', label: 'All' },
                                { val: '0',   label: 'Pending'   },
                                { val: '1',   label: 'Completed' },
                                { val: '2',   label: 'Cancelled' },
                            ].map(tab => (
                                <button
                                    key={tab.val}
                                    className={`so-tab ${filter === tab.val ? 'so-tab-active' : ''}`}
                                    onClick={() => setFilter(tab.val)}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <span className="so-count-label">
                        {filteredOrders.length} record{filteredOrders.length !== 1 ? 's' : ''}
                    </span>
                </div>

                {/* ── TABLE ── */}
                <div className="so-table-card">
                    <div style={{ overflowX: 'auto' }}>
                        <table className="so-table">
                            <thead className="so-thead">
                                <tr>
                                    <th>Order Ref</th>
                                    <th>Date & Time</th>
                                    <th>Customer</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody className="so-tbody">
                                {filteredOrders.length > 0 ? filteredOrders.map(order => {
                                    const status     = Number(order.orderStatus);
                                    const isUpdating = updatingId === order.orderID;

                                    return (
                                        <tr key={order.orderID}>
                                            {/* Order ID */}
                                            <td>
                                                <span className="so-order-id">#VS-{order.orderID}</span>
                                            </td>

                                            {/* Date */}
                                            <td>
                                                <span className="so-date">
                                                    {new Date(order.orderDate).toLocaleString('en-IN', {
                                                        day: '2-digit', month: 'short',
                                                        hour: '2-digit', minute: '2-digit'
                                                    })}
                                                </span>
                                            </td>

                                            {/* Customer */}
                                            <td>
                                                <div className="so-customer">
                                                    <div className="so-customer-av">
                                                        <User size={12} color={SM.goldBright} />
                                                    </div>
                                                    <span>ID: {order.userID}</span>
                                                </div>
                                            </td>

                                            {/* Amount */}
                                            <td>
                                                <div className="so-amount">
                                                    <IndianRupee size={14} className="so-amount-icon" />
                                                    {order.totalAmount?.toLocaleString('en-IN')}
                                                </div>
                                            </td>

                                            {/* Status */}
                                            <td>
                                                {status === 1 ? (
                                                    <span className="so-pill so-pill-completed">
                                                        <CheckCircle2 size={11} /> Completed
                                                    </span>
                                                ) : status === 2 ? (
                                                    <span className="so-pill so-pill-cancelled">
                                                        <XCircle size={11} /> Cancelled
                                                    </span>
                                                ) : (
                                                    <span className="so-pill so-pill-pending">
                                                        <Clock size={11} /> Pending
                                                    </span>
                                                )}
                                            </td>

                                            {/* Actions */}
                                            <td>
                                                {status === 0 ? (
                                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                                                        <button
                                                            className="so-btn-deliver"
                                                            disabled={isUpdating}
                                                            onClick={() => updateOrderStatus(order.orderID, 1)}
                                                        >
                                                            {isUpdating
                                                                ? <Loader2 size={13} style={{ animation: 'so-spin 1s linear infinite' }} />
                                                                : <CheckCircle2 size={13} />
                                                            }
                                                            Deliver
                                                        </button>
                                                        <button
                                                            className="so-btn-cancel"
                                                            disabled={isUpdating}
                                                            onClick={() => updateOrderStatus(order.orderID, 2)}
                                                        >
                                                            <XCircle size={13} />
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                        <span className="so-finalized">
                                                            <Lock size={11} /> Finalized
                                                        </span>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan="6">
                                            <div className="so-empty">
                                                <div className="so-empty-box">
                                                    <ClipboardList size={30} color={SM.mutedText} />
                                                </div>
                                                <p className="so-empty-title">
                                                    {searchTerm || filter !== 'all'
                                                        ? 'No orders match your filter'
                                                        : 'No orders received yet'}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ShopOrders;