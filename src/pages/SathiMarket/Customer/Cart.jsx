import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axiosInstance from '../../../api/axiosInstance';
import { useCart } from '../../../context/CartContext';
import { toast } from 'react-toastify';
import {
    ShoppingBag, Trash2, ShieldCheck, ArrowLeft,
    Minus, Plus, MapPin, CheckCircle2, Package, Tag
} from 'lucide-react';

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

const getItemId = (item) => item?.itemID ?? item?.ItemID;
const getShopId  = (item) => item?.shopID ?? item?.ShopID ?? item?.shopId ?? item?.ShopId ?? item?.shop_id ?? null;

const resolveMediaUrl = (mediaList, baseUrl) => {
    const FALLBACK = 'https://placehold.co/200?text=No+Image';
    if (!mediaList || mediaList.length === 0) return FALLBACK;
    const primary = mediaList.find(m => m.isPrimary || m.IsPrimary) ?? mediaList[0];
    let path = primary.mediaURL ?? primary.MediaURL;
    if (!path) return FALLBACK;
    if (path.startsWith('http')) return path;
    path = path.replace(/\\/g, '/').replace(/^\/?wwwroot/i, '');
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const cleanBase = baseUrl?.endsWith('/') ? baseUrl.slice(0, -1) : (baseUrl ?? '');
    return `${cleanBase}${cleanPath}`;
};

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

const CartSkeleton = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[1, 2, 3].map(n => (
            <div key={n} className="c-skeleton-card">
                <div className="c-skeleton-thumb" />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div className="c-skeleton" style={{ height: 13, width: '65%' }} />
                    <div className="c-skeleton" style={{ height: 16, width: '30%' }} />
                    <div className="c-skeleton" style={{ height: 28, width: 90 }} />
                </div>
            </div>
        ))}
    </div>
);

const AddressCard = ({ addr, isSelected, onSelect }) => (
    <div
        onClick={() => onSelect(addr)}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && onSelect(addr)}
        className={`c-addr-option${isSelected ? ' c-addr-selected' : ''}`}
    >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
            <div style={{ minWidth: 0 }}>
                <div className="c-addr-full">{addr.FullAddress}</div>
                <div className="c-addr-sub">{addr.City}, {addr.Pincode}</div>
            </div>
            {isSelected && <CheckCircle2 size={17} style={{ color: 'var(--maroon)', flexShrink: 0 }} />}
        </div>
    </div>
);

// ─────────────────────────────────────────────
// Order Summary Panel (reused in desktop + mobile)
// ─────────────────────────────────────────────

const OrderSummary = ({ total, savings, cartItems, isPlacingOrder, onCheckout, compact }) => (
    <div className={compact ? 'c-summary-compact' : 'c-summary-panel'}>
        {!compact && (
            <div className="c-summary-title">Order Summary</div>
        )}

        <div className="c-summary-row">
            <span className="c-summary-label">MRP Total</span>
            <span className="c-summary-strike">₹{total + savings}</span>
        </div>
        <div className="c-summary-row c-summary-green">
            <span>Discount (20%)</span>
            <span>− ₹{savings}</span>
        </div>
        <div className="c-summary-row c-summary-green">
            <span>Delivery</span>
            <span style={{ fontWeight: 700 }}>FREE</span>
        </div>
        <div className="c-summary-total-row">
            <span>Total Payable</span>
            <span className="c-total-amt">₹{total}</span>
        </div>

        {savings > 0 && !compact && (
            <div className="c-savings-pill">
                <Tag size={12} /> You save ₹{savings} on this order!
            </div>
        )}

        <button
            className="c-place-btn"
            onClick={onCheckout}
            disabled={isPlacingOrder || cartItems.length === 0}
        >
            {isPlacingOrder ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <span className="c-spinner" /> Processing...
                </span>
            ) : (
                compact ? `Place Order  ₹${total}` : 'Place My Order'
            )}
        </button>

        {!compact && (
            <p className="c-secure-note">
                <ShieldCheck size={13} style={{ color: '#16a34a' }} /> Secure Checkout
            </p>
        )}
    </div>
);

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────

const Cart = () => {
    const { cartItems, removeFromCart, getCartTotal, clearCart, updateQuantity } = useCart();
    const navigate = useNavigate();
    const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_URL;

    const [addresses,       setAddresses]       = useState([]);
    const [selectedAddress, setSelectedAddress]  = useState(null);
    const [showAddressModal,setShowAddressModal] = useState(false);
    const [loadingAddresses,setLoadingAddresses] = useState(true);
    const [isPlacingOrder,  setIsPlacingOrder]   = useState(false);

    // ── Fetch addresses ──────────────────────
    const fetchUserAddresses = useCallback(async () => {
        try {
            setLoadingAddresses(true);
            const userData = JSON.parse(localStorage.getItem('customerUser') || '{}');
            const userId = userData.userId ?? userData.UserId;
            if (!userId) return;

            const res = await axiosInstance.post('/Customer/ManageAddress', {
                actionType: 3, userId, addressId: 0,
                fullAddress: '', landmark: '', city: '', state: '', pincode: ''
            });

            if (Array.isArray(res.data) && res.data.length > 0) {
                setAddresses(res.data);
                setSelectedAddress(res.data[0]);
            }
        } catch (err) {
            console.error('Failed to fetch addresses:', err);
            toast.error('Could not load your saved addresses.');
        } finally {
            setLoadingAddresses(false);
        }
    }, []);

    useEffect(() => { fetchUserAddresses(); }, [fetchUserAddresses]);

    // ── Checkout ─────────────────────────────
    const handleCheckout = async () => {
        if (cartItems.length === 0) return;

        if (!selectedAddress) {
            toast.warn('Please select a delivery address first.');
            setShowAddressModal(true);
            return;
        }

        const rawShopIds    = cartItems.map(getShopId);
        const definedShopIds = [...new Set(rawShopIds.filter(id => id != null))];

        if (definedShopIds.length > 1) {
            toast.error('Your cart has items from multiple shops. Please order from one shop at a time.');
            return;
        }

        const resolvedShopId = definedShopIds[0] ?? 0;
        setIsPlacingOrder(true);

        try {
            const userData = JSON.parse(localStorage.getItem('customerUser') || '{}');
            const userId   = userData.userId ?? userData.UserId;

            const orderPayload = {
                userId,
                shopId: resolvedShopId,
                addressId: selectedAddress.Id,
                totalAmount: getCartTotal(),
                orderStatus: 0,
                isActive: true,
                orderItems: cartItems.map(item => ({
                    itemId:     getItemId(item),
                    quantity:   item.quantity,
                    unitPrice:  item.price,
                    totalPrice: item.price * item.quantity
                }))
            };

            const res = await axiosInstance.post('/Orders/PlaceOrder', orderPayload);
            const success =
                res.data?.orderID ||
                res.data?.OrderID ||
                res.data?.message?.toLowerCase().includes('success');

            if (success) {
                toast.success('🎉 Order placed successfully!');
                clearCart();
                navigate('/my-orders');
            } else {
                throw new Error('Unexpected response from server.');
            }
        } catch (err) {
            console.error('Order error:', err);
            toast.error('Could not place your order. Please try again.');
        } finally {
            setIsPlacingOrder(false);
        }
    };

    // ─────────────────────────────────────────
    const total   = getCartTotal();
    const savings = cartItems.reduce((acc, item) => acc + Math.round(item.price * 0.2 * item.quantity), 0);

    return (
        <main style={{ minHeight: '100vh', background: '#f8f0f6', paddingBottom: 80 }}>
            <Helmet>
                <title>My Cart | SathiMarket</title>
                <meta name="description" content="Secure checkout for your rural marketplace needs." />
            </Helmet>

            <style>{`
                /* ── Tokens ── */
                :root {
                    --maroon:      #721a61;
                    --maroon-dk:   #561249;
                    --gold:        #ffc200;
                    --surface:     #ffffff;
                    --bg:          #f8f0f6;
                    --border:      #e8d5e4;
                    --muted:       #6b7280;
                    --success:     #16a34a;
                    --radius:      8px;
                    --radius-lg:   12px;
                }

                /* ── Skeleton ── */
                .c-skeleton {
                    border-radius: 4px;
                    background: linear-gradient(90deg,#f0e8ee 25%,#e8d8e4 50%,#f0e8ee 75%);
                    background-size: 200% 100%;
                    animation: shimmer 1.4s infinite;
                }
                .c-skeleton-card {
                    display: flex; gap: 12px; align-items: flex-start;
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: var(--radius);
                    padding: 12px;
                }
                .c-skeleton-thumb {
                    width: 70px; height: 70px; flex-shrink: 0;
                    border-radius: 6px;
                    background: linear-gradient(90deg,#f0e8ee 25%,#e8d8e4 50%,#f0e8ee 75%);
                    background-size: 200% 100%;
                    animation: shimmer 1.4s infinite;
                }
                @keyframes shimmer {
                    0%   { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }

                /* ── Header ── */
                .c-header {
                    background: var(--maroon);
                    color: white;
                    padding: 10px 0;
                    position: sticky; top: 0; z-index: 1000;
                    border-bottom: 3px solid var(--gold);
                    box-shadow: 0 2px 8px rgba(114,26,97,.3);
                }
                .c-header-inner {
                    max-width: 1200px; margin: 0 auto;
                    padding: 0 16px;
                    display: flex; align-items: center; gap: 12px;
                }
                .c-back-btn {
                    background: none; border: none; color: white;
                    padding: 4px; display: flex; align-items: center;
                    cursor: pointer;
                }
                .c-header-title { font-size: 1rem; font-weight: 700; margin: 0; }
                .c-header-badge {
                    background: rgba(255,255,255,.2); color: white;
                    font-size: 0.68rem; font-weight: 600;
                    padding: 2px 8px; border-radius: 20px;
                    margin-left: 6px;
                }

                /* ── Layout ── */
                .c-layout {
                    max-width: 1200px; margin: 0 auto;
                    padding: 14px 16px 0;
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 14px;
                }
                @media (min-width: 900px) {
                    .c-layout {
                        grid-template-columns: 1fr 340px;
                        align-items: start;
                        padding: 20px 24px 0;
                    }
                }
                @media (min-width: 1100px) {
                    .c-layout { grid-template-columns: 1fr 360px; }
                }

                /* ── Address bar ── */
                .c-addr-bar {
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-left: 4px solid var(--maroon);
                    border-radius: var(--radius);
                    padding: 12px 14px;
                    display: flex; align-items: center;
                    justify-content: space-between; gap: 10px;
                    margin-bottom: 10px;
                }
                .c-addr-label {
                    font-size: 9px; text-transform: uppercase;
                    font-weight: 700; letter-spacing: .5px;
                    color: var(--muted); display: block;
                }
                .c-addr-name {
                    font-weight: 700; font-size: 0.82rem;
                    color: #111; display: block;
                    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
                    max-width: 220px;
                }
                @media (min-width: 500px) { .c-addr-name { max-width: 340px; } }
                @media (min-width: 900px) { .c-addr-name { max-width: 400px; } }

                .c-addr-city {
                    font-size: 0.72rem; color: var(--muted);
                }
                .c-addr-warning {
                    font-size: 0.78rem; font-weight: 700; color: #dc2626;
                }
                .c-change-btn {
                    background: none;
                    border: 1.5px solid var(--maroon);
                    color: var(--maroon);
                    font-weight: 700; font-size: 0.7rem;
                    padding: 4px 10px; border-radius: 4px;
                    white-space: nowrap; cursor: pointer;
                    flex-shrink: 0;
                    transition: background .15s;
                }
                .c-change-btn:hover { background: #fdf5fb; }

                /* ── Cart item card ── */
                .c-item-card {
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: var(--radius);
                    padding: 12px;
                    display: flex; gap: 12px;
                    align-items: flex-start;
                    margin-bottom: 8px;
                    transition: box-shadow .2s;
                }
                .c-item-card:hover { box-shadow: 0 3px 10px rgba(114,26,97,.08); }

                .c-img-box {
                    flex-shrink: 0;
                    width: 72px; height: 72px;
                    border-radius: 6px; overflow: hidden;
                    background: #fafafa; border: 1px solid #eee;
                }
                @media (min-width: 500px) {
                    .c-img-box { width: 82px; height: 82px; }
                }
                @media (min-width: 768px) {
                    .c-img-box { width: 90px; height: 90px; }
                    .c-item-card { padding: 14px; gap: 14px; }
                }
                .c-img-box img { width: 100%; height: 100%; object-fit: contain; display: block; }

                .c-item-name {
                    font-size: 0.82rem; font-weight: 700; color: #111;
                    margin: 0 0 4px; line-height: 1.3;
                    display: -webkit-box; -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical; overflow: hidden;
                }
                @media (min-width: 500px) { .c-item-name { font-size: 0.88rem; } }

                .c-price-row {
                    display: flex; align-items: center;
                    flex-wrap: wrap; gap: 6px; margin-bottom: 8px;
                }
                .c-price-main {
                    font-size: 1rem; font-weight: 700; color: #111;
                }
                .c-price-mrp {
                    font-size: 0.75rem; color: var(--muted);
                    text-decoration: line-through;
                }
                .c-off-badge {
                    background: #dcfce7; color: #15803d;
                    font-size: 0.65rem; font-weight: 700;
                    padding: 1px 7px; border-radius: 20px;
                }

                /* ── Qty control ── */
                .c-qty {
                    display: inline-flex; align-items: center;
                    border: 1px solid var(--border); border-radius: 4px;
                    overflow: hidden;
                }
                .c-qty-btn {
                    background: #f8f0f6; border: none;
                    color: var(--maroon);
                    width: 28px; height: 28px;
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer; transition: background .15s;
                    flex-shrink: 0;
                }
                .c-qty-btn:hover:not(:disabled) { background: #eedde9; }
                .c-qty-btn:disabled { opacity: .4; cursor: not-allowed; }
                .c-qty-val {
                    width: 32px; text-align: center;
                    font-weight: 700; font-size: 0.85rem;
                    border-left: 1px solid var(--border);
                    border-right: 1px solid var(--border);
                    background: white; line-height: 28px;
                    user-select: none;
                }

                .c-remove-btn {
                    background: none; border: none; padding: 0;
                    color: #dc2626; cursor: pointer;
                    font-size: 0.72rem; font-weight: 700;
                    display: flex; align-items: center; gap: 4px;
                    margin-top: 6px;
                    transition: opacity .15s;
                }
                .c-remove-btn:hover { opacity: .75; }

                /* ── Bottom row of item (qty + remove, inline on wider screens) ── */
                .c-item-actions {
                    display: flex; align-items: center;
                    gap: 14px; flex-wrap: wrap;
                }

                /* ── Empty state ── */
                .c-empty {
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-lg);
                    padding: 40px 20px; text-align: center;
                }
                .c-empty-icon { opacity: .2; color: var(--maroon); margin-bottom: 14px; }
                .c-empty-title { font-size: 1rem; font-weight: 700; color: #111; margin: 0 0 6px; }
                .c-empty-sub { font-size: 0.82rem; color: var(--muted); margin: 0 0 20px; }
                .c-shop-btn {
                    background: var(--maroon); color: white;
                    border: none; padding: 10px 24px;
                    font-weight: 700; font-size: 0.85rem;
                    border-radius: var(--radius); cursor: pointer;
                    display: inline-flex; align-items: center; gap: 6px;
                    transition: background .2s;
                }
                .c-shop-btn:hover { background: var(--maroon-dk); }

                /* ── Summary panel (desktop sidebar) ── */
                .c-summary-panel {
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-lg);
                    padding: 18px;
                    position: sticky; top: 70px;
                }
                .c-summary-title {
                    font-size: 0.9rem; font-weight: 700; color: #111;
                    padding-bottom: 12px;
                    border-bottom: 1px solid var(--border);
                    margin-bottom: 12px;
                }
                .c-summary-row {
                    display: flex; justify-content: space-between;
                    font-size: 0.8rem; color: var(--muted);
                    margin-bottom: 8px;
                }
                .c-summary-strike { text-decoration: line-through; }
                .c-summary-green { color: #16a34a; font-weight: 600; }
                .c-summary-total-row {
                    display: flex; justify-content: space-between;
                    font-size: 1rem; font-weight: 700; color: #111;
                    border-top: 1px solid var(--border);
                    padding-top: 12px; margin: 4px 0 14px;
                }
                .c-total-amt { color: var(--maroon); }

                /* ── Compact summary (mobile footer) ── */
                .c-summary-compact {
                    /* no visual container — just used as a logic grouping */
                }

                .c-savings-pill {
                    background: #dcfce7; color: #15803d;
                    font-size: 0.72rem; font-weight: 700;
                    padding: 6px 12px; border-radius: 20px;
                    text-align: center; margin-bottom: 14px;
                    display: flex; align-items: center;
                    justify-content: center; gap: 5px;
                }

                /* ── Place order button ── */
                .c-place-btn {
                    width: 100%; background: var(--maroon); color: white;
                    border: none; border-radius: var(--radius);
                    padding: 12px; font-weight: 700; font-size: 0.9rem;
                    cursor: pointer; letter-spacing: .3px;
                    transition: background .2s, transform .1s;
                }
                .c-place-btn:hover:not(:disabled) {
                    background: var(--maroon-dk); transform: translateY(-1px);
                }
                .c-place-btn:disabled { opacity: .6; cursor: not-allowed; }

                .c-secure-note {
                    font-size: 0.72rem; color: var(--muted); text-align: center;
                    display: flex; align-items: center; justify-content: center;
                    gap: 4px; margin: 10px 0 0;
                }

                /* ── Spinner ── */
                .c-spinner {
                    width: 15px; height: 15px;
                    border: 2px solid rgba(255,255,255,.4);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: spin .7s linear infinite;
                    display: inline-block;
                }
                @keyframes spin { to { transform: rotate(360deg); } }

                /* ── Mobile sticky footer ── */
                .c-mob-footer {
                    display: none;
                    position: fixed; bottom: 0; left: 0; right: 0;
                    background: var(--surface);
                    border-top: 2px solid var(--gold);
                    box-shadow: 0 -3px 12px rgba(0,0,0,.1);
                    z-index: 1001;
                    padding: 10px 16px;
                    align-items: center; justify-content: space-between; gap: 12px;
                }
                @media (max-width: 899px) {
                    .c-mob-footer { display: flex; }
                    .c-desktop-summary { display: none !important; }
                    main { padding-bottom: 80px !important; }
                }
                .c-mob-price { font-size: 1.1rem; font-weight: 700; color: #111; }
                .c-mob-sub   { font-size: 0.68rem; color: #16a34a; font-weight: 600; }

                /* Tablet adjustments */
                @media (min-width: 600px) and (max-width: 899px) {
                    .c-layout { padding: 16px 20px 0; }
                    .c-item-card { padding: 14px; gap: 14px; }
                    .c-item-name { font-size: 0.9rem; }
                    .c-price-main { font-size: 1.05rem; }
                }

                /* ── Address Modal ── */
                .c-modal-overlay {
                    position: fixed; inset: 0;
                    background: rgba(0,0,0,.65);
                    z-index: 2000;
                    display: flex; align-items: flex-end; justify-content: center;
                }
                @media (min-width: 500px) {
                    .c-modal-overlay { align-items: center; }
                }
                .c-modal {
                    background: var(--surface);
                    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
                    width: 100%; max-width: 480px;
                    max-height: 80vh; overflow-y: auto;
                    padding: 20px 16px;
                }
                @media (min-width: 500px) {
                    .c-modal { border-radius: var(--radius-lg); }
                }
                .c-modal-header {
                    display: flex; align-items: center;
                    justify-content: space-between;
                    margin-bottom: 16px;
                    padding-bottom: 12px;
                    border-bottom: 1.5px solid #f0e0ec;
                }
                .c-modal-title {
                    font-size: 0.9rem; font-weight: 700;
                    color: var(--maroon);
                    display: flex; align-items: center; gap: 6px;
                }
                .c-close-btn {
                    background: none; border: none; cursor: pointer;
                    color: var(--muted); padding: 2px;
                    display: flex; align-items: center;
                }
                .c-addr-option {
                    border: 1.5px solid var(--border);
                    border-radius: 6px; padding: 10px 12px;
                    margin-bottom: 8px; cursor: pointer;
                    transition: border-color .15s, background .15s;
                }
                .c-addr-option:hover { border-color: var(--maroon); background: #fdf5fb; }
                .c-addr-selected { border-color: var(--maroon) !important; background: #fdf5fb !important; }
                .c-addr-full { font-weight: 700; font-size: 0.82rem; color: #111; }
                .c-addr-sub  { font-size: 0.7rem; color: var(--muted); margin-top: 2px; }
                .c-add-addr-btn {
                    width: 100%; background: none;
                    border: 1.5px dashed var(--maroon);
                    color: var(--maroon); font-weight: 700;
                    font-size: 0.8rem; padding: 10px;
                    border-radius: 6px; cursor: pointer;
                    margin-top: 6px; transition: background .15s;
                }
                .c-add-addr-btn:hover { background: #fdf5fb; }

                /* ── Misc ── */
                * { box-sizing: border-box; }
            `}</style>

            {/* ── Header ── */}
            <header className="c-header">
                <div className="c-header-inner">
                    <button onClick={() => navigate(-1)} className="c-back-btn" aria-label="Go back">
                        <ArrowLeft size={21} />
                    </button>
                    <h1 className="c-header-title">
                        My Cart
                        {cartItems.length > 0 && (
                            <span className="c-header-badge">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</span>
                        )}
                    </h1>
                </div>
            </header>

            {/* ── Main Layout ── */}
            <div className="c-layout">

                {/* ── LEFT: Address + Items ── */}
                <section>

                    {/* Address bar */}
                    <div className="c-addr-bar">
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, flex: 1, minWidth: 0 }}>
                            <MapPin size={16} style={{ color: 'var(--maroon)', marginTop: 2, flexShrink: 0 }} />
                            <div style={{ minWidth: 0 }}>
                                {loadingAddresses ? (
                                    <div className="c-skeleton" style={{ height: 13, width: 180 }} />
                                ) : selectedAddress ? (
                                    <>
                                        <span className="c-addr-label">Delivering to</span>
                                        <span className="c-addr-name">{selectedAddress.FullAddress}</span>
                                        <span className="c-addr-city">{selectedAddress.City}, {selectedAddress.Pincode}</span>
                                    </>
                                ) : (
                                    <span className="c-addr-warning">⚠ Select a delivery address</span>
                                )}
                            </div>
                        </div>
                        <button className="c-change-btn" onClick={() => setShowAddressModal(true)}>
                            {addresses.length > 0 ? 'CHANGE' : 'ADD'}
                        </button>
                    </div>

                    {/* Cart items */}
                    {loadingAddresses && cartItems.length === 0 ? (
                        <CartSkeleton />
                    ) : cartItems.length > 0 ? (
                        cartItems.map(item => {
                            const itemId   = getItemId(item);
                            const name     = item.itemName ?? item.ItemName ?? 'Product';
                            const imgSrc   = resolveMediaUrl(item.mediaList ?? item.MediaList, IMAGE_BASE_URL);
                            const lineTotal = item.price * item.quantity;
                            const lineMrp   = Math.round(item.price * 1.2 * item.quantity);

                            return (
                                <article className="c-item-card" key={itemId}>
                                    <div className="c-img-box">
                                        <img
                                            src={imgSrc} alt={name} loading="lazy"
                                            onError={e => { e.target.src = 'https://placehold.co/200?text=No+Image'; }}
                                        />
                                    </div>

                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <h2 className="c-item-name">{name}</h2>

                                        <div className="c-price-row">
                                            <span className="c-price-main">₹{lineTotal}</span>
                                            <span className="c-price-mrp">₹{lineMrp}</span>
                                            <span className="c-off-badge">20% off</span>
                                        </div>

                                        <div className="c-item-actions">
                                            <div className="c-qty">
                                                <button
                                                    className="c-qty-btn"
                                                    onClick={() => updateQuantity(itemId, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                    aria-label="Decrease quantity"
                                                >
                                                    <Minus size={13} />
                                                </button>
                                                <span className="c-qty-val">{item.quantity}</span>
                                                <button
                                                    className="c-qty-btn"
                                                    onClick={() => updateQuantity(itemId, item.quantity + 1)}
                                                    aria-label="Increase quantity"
                                                >
                                                    <Plus size={13} />
                                                </button>
                                            </div>

                                            <button
                                                className="c-remove-btn"
                                                onClick={() => removeFromCart(itemId)}
                                                aria-label={`Remove ${name}`}
                                            >
                                                <Trash2 size={12} /> Remove
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            );
                        })
                    ) : (
                        <div className="c-empty">
                            <div className="c-empty-icon"><ShoppingBag size={44} /></div>
                            <h5 className="c-empty-title">Your cart is empty</h5>
                            <p className="c-empty-sub">Browse SathiMarket and add fresh products from local farmers.</p>
                            <button className="c-shop-btn" onClick={() => navigate('/sathi-market')}>
                                <Package size={15} /> Shop Now
                            </button>
                        </div>
                    )}
                </section>

                {/* ── RIGHT: Desktop Summary Panel ── */}
                {cartItems.length > 0 && (
                    <aside className="c-desktop-summary">
                        <OrderSummary
                            total={total} savings={savings}
                            cartItems={cartItems}
                            isPlacingOrder={isPlacingOrder}
                            onCheckout={handleCheckout}
                            compact={false}
                        />
                    </aside>
                )}
            </div>

            {/* ── Mobile sticky footer ── */}
            {cartItems.length > 0 && (
                <div className="c-mob-footer">
                    <div>
                        <div className="c-mob-price">₹{total}</div>
                        <div className="c-mob-sub">FREE delivery · Save ₹{savings}</div>
                    </div>
                    <button
                        className="c-place-btn"
                        style={{ width: 'auto', padding: '11px 22px', fontSize: '0.85rem' }}
                        onClick={handleCheckout}
                        disabled={isPlacingOrder}
                    >
                        {isPlacingOrder
                            ? <span style={{ display:'flex',alignItems:'center',gap:6 }}><span className="c-spinner"/>Wait...</span>
                            : 'Place Order →'}
                    </button>
                </div>
            )}

            {/* ── Address Modal ── */}
            {showAddressModal && (
                <div
                    className="c-modal-overlay"
                    onClick={e => { if (e.target === e.currentTarget) setShowAddressModal(false); }}
                >
                    <div className="c-modal">
                        <div className="c-modal-header">
                            <div className="c-modal-title">
                                <MapPin size={15} /> Select Delivery Address
                            </div>
                            <button className="c-close-btn" onClick={() => setShowAddressModal(false)} aria-label="Close">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                                </svg>
                            </button>
                        </div>

                        {loadingAddresses ? (
                            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                <span className="c-spinner" style={{ borderTopColor: 'var(--maroon)', borderColor: '#e8d5e4' }} />
                            </div>
                        ) : addresses.length > 0 ? (
                            addresses.map(addr => (
                                <AddressCard
                                    key={addr.Id} addr={addr}
                                    isSelected={selectedAddress?.Id === addr.Id}
                                    onSelect={a => { setSelectedAddress(a); setShowAddressModal(false); }}
                                />
                            ))
                        ) : (
                            <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.82rem', padding: '16px 0' }}>
                                No saved addresses found.
                            </p>
                        )}

                        <button
                            className="c-add-addr-btn"
                            onClick={() => { setShowAddressModal(false); navigate('/manage-addresses'); }}
                        >
                            + Add New Address
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Cart;