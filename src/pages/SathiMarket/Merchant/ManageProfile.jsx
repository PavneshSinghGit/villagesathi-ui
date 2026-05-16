import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../../api/axiosInstance';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {
    Store, User, Phone, MapPin, Clock,
    Power, ShieldCheck, LayoutGrid, Loader2,
    Signal, SignalLow, ChevronLeft,
} from 'lucide-react';

/* ─── Brand Tokens — keep in sync with MerchantDashBoard & ShopOrders ────── */
const BRAND = {
    heroStart:   '#3D0030',
    heroMid:     '#6B0F4A',
    heroEnd:     '#8C1560',
    gold:        '#D4A017',
    goldLight:   '#F5D76E',
    purple:      '#7C3AED',
    purpleLight: '#EDE9FF',
    purpleSoft:  '#F5F0FF',
    success:     '#16A34A',
    danger:      '#DC2626',
};

const ManageProfile = () => {
    const { user, isBusiness, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [shop, setShop]               = useState(null);
    const [updating, setUpdating]       = useState(false);
    const [dataLoading, setDataLoading] = useState(true);

    const shopId = user?.shopId || user?.ShopId;

    const fetchShopDetails = useCallback(async () => {
        if (authLoading) return;
        if (!isBusiness || !shopId) {
            toast.error('Session expired. Please login again.');
            navigate('/merchant-login', { replace: true });
            return;
        }
        try {
            setDataLoading(true);
            const res      = await axiosInstance.get(`/Shops/GetById/${shopId}`);
            const shopData = res.data?.Data || res.data;
            shopData ? setShop(shopData) : toast.error('Shop data not found.');
        } catch {
            toast.error('Failed to load profile!');
        } finally {
            setDataLoading(false);
        }
    }, [shopId, isBusiness, authLoading, navigate]);

    useEffect(() => { fetchShopDetails(); }, [fetchShopDetails]);

    const handleToggleStatus = async () => {
        if (updating || !shop) return;
        setUpdating(true);
        const newStatus = !shop.isOpen;
        try {
            const updated = { ...shop, isOpen: newStatus, shopId };
            await axiosInstance.post('/Shops/UpdateShop', updated);
            setShop(updated);
            toast.success(newStatus ? 'Store is now LIVE!' : 'Store is now OFFLINE!');
        } catch {
            toast.error('Failed to update status.');
        } finally {
            setUpdating(false);
        }
    };

    /* ── Loading screen ── */
    if (authLoading || dataLoading) {
        return (
            <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', minHeight: '100vh', background: BRAND.purpleSoft,
            }}>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                <Loader2 size={42} style={{ color: BRAND.gold, animation: 'spin 1s linear infinite' }} />
                <span style={{
                    marginTop: 12, fontWeight: 700, fontSize: '.8rem', color: BRAND.purple,
                    letterSpacing: '.1em', textTransform: 'uppercase',
                }}>
                    Loading Business Profile…
                </span>
            </div>
        );
    }

    if (!shop) return null;

    /* ═══════════════════════════ RENDER ═════════════════════════════════════ */
    return (
        <div style={{ background: BRAND.purpleSoft, minHeight: '100vh', fontFamily: 'system-ui,sans-serif' }}>

            {/* ══ Global CSS ══════════════════════════════════════════════ */}
            <style>{`
                @keyframes spin      { to { transform: rotate(360deg); } }
                @keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:.35} }

                /* Back button */
                .mp-back {
                    background: transparent;
                    border: 2px solid rgba(212,160,23,.4);
                    color: ${BRAND.goldLight};
                    border-radius: 50px;
                    padding: 6px 15px;
                    font-size: .73rem;
                    font-weight: 800;
                    letter-spacing: .06em;
                    text-transform: uppercase;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    transition: all .2s;
                    white-space: nowrap;
                    flex-shrink: 0;
                }
                .mp-back:hover { background: ${BRAND.gold}; color: #1a0011; border-color: ${BRAND.gold}; }

                /* White card base */
                .mp-card {
                    background: #fff;
                    border-radius: 20px;
                    border: 1px solid ${BRAND.purpleLight};
                    box-shadow: 0 4px 24px rgba(124,58,237,.07);
                }
                .mp-card-online  { border-color: ${BRAND.success}; box-shadow: 0 8px 28px rgba(22,163,74,.13); }
                .mp-card-offline { border-color: ${BRAND.danger};  box-shadow: 0 8px 28px rgba(220,38,38,.13); }

                /* Label + value */
                .mp-label {
                    font-size: .6rem;
                    font-weight: 800;
                    letter-spacing: .13em;
                    text-transform: uppercase;
                    color: #94a3b8;
                    margin-bottom: 5px;
                }
                .mp-value {
                    font-weight: 700;
                    color: #1e1b4b;
                    font-size: .9rem;
                    line-height: 1.45;
                    word-break: break-word;
                }

                /* Purple icon box */
                .mp-icon-box {
                    width: 34px; height: 34px; border-radius: 10px;
                    background: ${BRAND.purpleLight};
                    display: flex; align-items: center; justify-content: center;
                    flex-shrink: 0;
                }

                /* Time pill */
                .mp-time-pill {
                    background: ${BRAND.purpleLight};
                    border-radius: 14px;
                    padding: 14px 16px;
                    border-left: 4px solid ${BRAND.gold};
                    flex: 1;
                    min-width: 130px;
                }

                /* Toggle button */
                .mp-toggle {
                    border: none; border-radius: 14px;
                    padding: 14px 20px;
                    font-weight: 800; font-size: .82rem;
                    letter-spacing: .08em; text-transform: uppercase;
                    color: #fff; width: 100%; cursor: pointer;
                    display: flex; align-items: center; justify-content: center;
                    gap: 9px; margin-top: 24px;
                    transition: transform .2s, filter .2s;
                }
                .mp-toggle:hover:not(:disabled) { transform: translateY(-2px); filter: brightness(1.1); }
                .mp-toggle:disabled { opacity: .7; cursor: not-allowed; }
                .mp-toggle-offline { background: linear-gradient(135deg,${BRAND.danger},#b91c1c); }
                .mp-toggle-online  { background: linear-gradient(135deg,${BRAND.success},#15803d); }

                /* Divider */
                .mp-hr { border: none; border-top: 1px solid ${BRAND.purpleLight}; margin: 18px 0; }

                /* Verified chip */
                .mp-verified {
                    display: inline-flex; align-items: center; gap: 5px;
                    background: rgba(212,160,23,.12);
                    border: 1px solid rgba(212,160,23,.3);
                    border-radius: 50px; padding: 4px 12px;
                    font-size: .67rem; font-weight: 800;
                    color: ${BRAND.goldLight}; letter-spacing: .04em;
                    white-space: nowrap;
                }

                /* Category badge */
                .mp-cat {
                    background: linear-gradient(135deg,${BRAND.purple},${BRAND.gold});
                    color: #fff; border-radius: 50px;
                    padding: 5px 14px; font-size: .67rem;
                    font-weight: 800; letter-spacing: .07em;
                    text-transform: uppercase; white-space: nowrap;
                }

                /* Live dot */
                .mp-dot {
                    width:9px; height:9px; border-radius:50%;
                    display:inline-block;
                    animation: pulse-dot 1.8s ease-in-out infinite;
                }

                /* ── LAYOUT: mobile first (single-column) ── */
                .mp-hero-row {
                    display: flex;
                    flex-direction: column;
                    gap: 14px;
                }
                .mp-hero-left {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                .mp-hero-toprow {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    flex-wrap: wrap;
                }
                .mp-badge-row {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                }
                .mp-hero-right {
                    display: flex;
                    justify-content: flex-start;
                }

                /* Main two-column grid */
                .mp-main {
                    display: flex;
                    flex-direction: column;
                    gap: 18px;
                }
                .mp-col-status { width: 100%; }
                .mp-col-info   { width: 100%; }

                /* Info fields grid */
                .mp-fields {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 22px;
                }
                .mp-fields-full { grid-column: 1 / -1; }

                /* Time pills row */
                .mp-time-row {
                    display: flex;
                    gap: 12px;
                    flex-wrap: wrap;
                }

                /* ── Tablet ≥ 600px ── */
                @media (min-width: 600px) {
                    .mp-hero-row {
                        flex-direction: row;
                        justify-content: space-between;
                        align-items: center;
                    }
                    .mp-hero-right { justify-content: flex-end; }
                    .mp-fields { grid-template-columns: 1fr 1fr; }
                }

                /* ── Desktop ≥ 880px ── */
                @media (min-width: 880px) {
                    .mp-main { flex-direction: row; align-items: flex-start; }
                    .mp-col-status { flex: 0 0 290px; }
                    .mp-col-info   { flex: 1; min-width: 0; }
                }
            `}</style>

            <div style={{
                maxWidth: 1080, margin: '0 auto',
                padding: 'clamp(16px,4vw,28px) clamp(14px,4vw,24px)',
            }}>

                {/* ══ HERO BANNER ══════════════════════════════════════════ */}
                <div style={{
                    background: `linear-gradient(135deg,${BRAND.heroStart} 0%,${BRAND.heroMid} 55%,${BRAND.heroEnd} 100%)`,
                    borderRadius: 22,
                    padding: 'clamp(18px,4vw,28px) clamp(18px,4vw,30px)',
                    borderBottom: `4px solid ${BRAND.gold}`,
                    boxShadow: '0 8px 32px rgba(61,0,48,.35)',
                    marginBottom: 22,
                    position: 'relative',
                    overflow: 'hidden',
                }}>
                    {/* Decorative rings */}
                    {[220, 330].map((sz, i) => (
                        <div key={i} style={{
                            position: 'absolute', top: -sz * .38, right: -sz * .38,
                            width: sz, height: sz, borderRadius: '50%',
                            border: `1.5px solid rgba(212,160,23,${i === 0 ? .1 : .055})`,
                            pointerEvents: 'none',
                        }} />
                    ))}

                    <div className="mp-hero-row">

                        {/* Left block */}
                        <div className="mp-hero-left">
                            <div className="mp-hero-toprow">
                                <button className="mp-back" onClick={() => navigate(-1)}>
                                    <ChevronLeft size={14} /> Back
                                </button>

                                {/* Shop avatar */}
                                <div style={{
                                    width: 50, height: 50, borderRadius: 14, flexShrink: 0,
                                    background: 'rgba(212,160,23,.15)',
                                    border: '1.5px solid rgba(212,160,23,.3)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <Store size={25} style={{ color: BRAND.gold }} />
                                </div>

                                <h2 style={{
                                    color: '#fff', fontWeight: 900, margin: 0,
                                    fontSize: 'clamp(.95rem,2.5vw,1.25rem)',
                                    letterSpacing: '.02em',
                                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                    minWidth: 0,
                                }}>
                                    {shop.shopName}
                                </h2>
                            </div>

                            {/* Verified + category */}
                            <div className="mp-badge-row">
                                <div className="mp-verified">
                                    <ShieldCheck size={11} /> Verified · #SM-BIZ-{shopId}
                                </div>
                                <span className="mp-cat">{shop.categoryName || 'General Store'}</span>
                            </div>
                        </div>

                        {/* Right — live indicator */}
                        <div className="mp-hero-right">
                            <div style={{
                                display: 'inline-flex', alignItems: 'center', gap: 8,
                                background: 'rgba(255,255,255,.08)',
                                border: '1px solid rgba(212,160,23,.25)',
                                borderRadius: 50, padding: '8px 16px',
                                whiteSpace: 'nowrap',
                            }}>
                                <span className="mp-dot" style={{
                                    background: shop.isOpen ? BRAND.success : BRAND.danger,
                                    boxShadow: shop.isOpen
                                        ? '0 0 0 3px rgba(22,163,74,.25)'
                                        : '0 0 0 3px rgba(220,38,38,.25)',
                                }} />
                                <span style={{ color: '#fff', fontWeight: 800, fontSize: '.76rem', letterSpacing: '.05em' }}>
                                    {shop.isOpen ? 'LIVE' : 'OFFLINE'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ══ MAIN GRID ════════════════════════════════════════════ */}
                <div className="mp-main">

                    {/* ── Visibility / Toggle Card ─────────────────────── */}
                    <div className="mp-col-status">
                        <div className={`mp-card ${shop.isOpen ? 'mp-card-online' : 'mp-card-offline'}`}
                             style={{ padding: 'clamp(20px,4vw,28px)', textAlign: 'center' }}>

                            {/* Signal icon */}
                            <div style={{
                                width: 70, height: 70, borderRadius: '50%',
                                margin: '0 auto 16px',
                                background: shop.isOpen ? 'rgba(22,163,74,.1)' : 'rgba(220,38,38,.1)',
                                border: shop.isOpen
                                    ? '2px solid rgba(22,163,74,.25)'
                                    : '2px solid rgba(220,38,38,.25)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                {shop.isOpen
                                    ? <Signal    size={32} style={{ color: BRAND.success }} />
                                    : <SignalLow size={32} style={{ color: BRAND.danger  }} />}
                            </div>

                            <h4 style={{ fontWeight: 800, color: '#1e1b4b', marginBottom: 8, fontSize: '1rem' }}>
                                Store Visibility
                            </h4>
                            <p style={{ color: '#64748b', fontSize: '.82rem', lineHeight: 1.65, margin: 0 }}>
                                {shop.isOpen
                                    ? 'Customers can find your shop and place orders in the marketplace.'
                                    : 'Your shop is currently hidden from the marketplace customers.'}
                            </p>

                            <button
                                className={`mp-toggle ${shop.isOpen ? 'mp-toggle-offline' : 'mp-toggle-online'}`}
                                onClick={handleToggleStatus}
                                disabled={updating}
                            >
                                {updating
                                    ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                                    : <Power   size={18} />}
                                {shop.isOpen ? 'Go Offline' : 'Go Online'}
                            </button>
                        </div>
                    </div>

                    {/* ── Business Info Card ────────────────────────────── */}
                    <div className="mp-col-info">
                        <div className="mp-card" style={{ padding: 'clamp(18px,4vw,28px)' }}>

                            {/* Section header */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                                <div style={{
                                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                                    background: `linear-gradient(135deg,${BRAND.purple},${BRAND.gold})`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <LayoutGrid size={17} style={{ color: '#fff' }} />
                                </div>
                                <h5 style={{ fontWeight: 800, margin: 0, color: '#1e1b4b', fontSize: '1rem' }}>
                                    Merchant Details
                                </h5>
                            </div>
                            <hr className="mp-hr" style={{ marginTop: 0 }} />

                            <div className="mp-fields">

                                {/* Owner */}
                                <div>
                                    <div className="mp-label">Merchant Owner</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                                        <div className="mp-icon-box">
                                            <User size={15} style={{ color: BRAND.purple }} />
                                        </div>
                                        <span className="mp-value">{shop.ownerName || 'Not Provided'}</span>
                                    </div>
                                </div>

                                {/* Contact */}
                                <div>
                                    <div className="mp-label">Business Contact</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                                        <div className="mp-icon-box">
                                            <Phone size={15} style={{ color: BRAND.purple }} />
                                        </div>
                                        <span className="mp-value">+91 {user?.mobileNo || '—'}</span>
                                    </div>
                                </div>

                                {/* Address — full width */}
                                <div className="mp-fields-full">
                                    <div className="mp-label">Physical Shop Location</div>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
                                        <div className="mp-icon-box" style={{ marginTop: 1 }}>
                                            <MapPin size={15} style={{ color: BRAND.purple }} />
                                        </div>
                                        <span className="mp-value">{shop.shopAddress || 'Address not listed'}</span>
                                    </div>
                                </div>

                                {/* Service Hours — full width */}
                                <div className="mp-fields-full">
                                    <div className="mp-label" style={{ marginBottom: 12 }}>Service Hours</div>
                                    <div className="mp-time-row">

                                        <div className="mp-time-pill">
                                            <div className="mp-label" style={{ color: '#64748b', marginBottom: 6 }}>
                                                Opens At
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <Clock size={17} style={{ color: BRAND.gold, flexShrink: 0 }} />
                                                <span style={{
                                                    fontWeight: 900,
                                                    fontSize: 'clamp(.95rem,2.5vw,1.15rem)',
                                                    color: '#1e1b4b',
                                                }}>
                                                    {shop.openingTime || '09:00 AM'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mp-time-pill">
                                            <div className="mp-label" style={{ color: '#64748b', marginBottom: 6 }}>
                                                Closes At
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <Clock size={17} style={{ color: BRAND.gold, flexShrink: 0 }} />
                                                <span style={{
                                                    fontWeight: 900,
                                                    fontSize: 'clamp(.95rem,2.5vw,1.15rem)',
                                                    color: '#1e1b4b',
                                                }}>
                                                    {shop.closingTime || '09:00 PM'}
                                                </span>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                            </div>{/* /mp-fields */}
                        </div>
                    </div>

                </div>{/* /mp-main */}
            </div>
        </div>
    );
};

export default ManageProfile;