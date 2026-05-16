import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axiosInstance from '../../../api/axiosInstance';
import { useCart } from '../../../context/CartContext';
import { toast } from 'react-toastify';
import {
    ShoppingBag, Trash2, ShieldCheck, ArrowLeft,
    Minus, Plus, MapPin, CheckCircle2, Package
} from 'lucide-react';

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

/** Normalise an item's ID regardless of casing from the API */
const getItemId = (item) => item?.itemID ?? item?.ItemID;

/** Normalise an item's shop ID regardless of casing */
const getShopId = (item) => item?.shopID ?? item?.ShopID;

/** Resolve a product image URL from its mediaList array */
const resolveMediaUrl = (mediaList, baseUrl) => {
    const FALLBACK = 'https://placehold.co/200?text=No+Image';
    if (!mediaList || mediaList.length === 0) return FALLBACK;

    const primary = mediaList.find(m => m.isPrimary || m.IsPrimary) ?? mediaList[0];
    let path = primary.mediaURL ?? primary.MediaURL;
    if (!path) return FALLBACK;
    if (path.startsWith('http')) return path;

    // Strip leading backslashes / wwwroot prefix added by some .NET setups
    path = path.replace(/\\/g, '/').replace(/^\/?wwwroot/i, '');
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const cleanBase = baseUrl?.endsWith('/') ? baseUrl.slice(0, -1) : (baseUrl ?? '');
    return `${cleanBase}${cleanPath}`;
};

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

const CartSkeleton = () => (
    <div className="vstack gap-3">
        {[1, 2].map(n => (
            <div key={n} className="cart-item-card d-flex gap-3 bg-white rounded shadow-sm p-3">
                <div className="skeleton" style={{ width: 90, height: 90, borderRadius: 6 }} />
                <div className="flex-grow-1 vstack gap-2">
                    <div className="skeleton" style={{ height: 14, width: '70%', borderRadius: 4 }} />
                    <div className="skeleton" style={{ height: 18, width: '30%', borderRadius: 4 }} />
                    <div className="skeleton" style={{ height: 28, width: 100, borderRadius: 4 }} />
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
        className={`p-3 mb-2 rounded address-option ${isSelected ? 'selected' : ''}`}
    >
        <div className="d-flex justify-content-between align-items-center">
            <div>
                <div className="fw-bold small text-dark">{addr.FullAddress}</div>
                <div className="text-muted" style={{ fontSize: '11px' }}>{addr.City}, {addr.Pincode}</div>
            </div>
            {isSelected && <CheckCircle2 size={18} className="text-maroon" />}
        </div>
    </div>
);

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────

const Cart = () => {
    const { cartItems, removeFromCart, getCartTotal, clearCart, updateQuantity } = useCart();
    const navigate = useNavigate();
    const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_URL;

    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [loadingAddresses, setLoadingAddresses] = useState(true);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    // ── Fetch saved addresses ──────────────────
    const fetchUserAddresses = useCallback(async () => {
        try {
            setLoadingAddresses(true);
            const userData = JSON.parse(localStorage.getItem('customerUser') || '{}');
            const userId = userData.userId ?? userData.UserId;
            if (!userId) return;

            const res = await axiosInstance.post('/Customer/ManageAddress', {
                actionType: 3,
                userId,
                addressId: 0,
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

    // ── Place order ───────────────────────────
    const handleCheckout = async () => {
        if (cartItems.length === 0) return;

        if (!selectedAddress) {
            toast.warn('Please select a delivery address first.');
            setShowAddressModal(true);
            return;
        }

        // Resolve shopId — check every known casing your API might return
        const resolveShopId = (item) =>
            item?.shopID ?? item?.ShopID ?? item?.shopId ?? item?.ShopId ?? item?.shop_id ?? null;

        const rawShopIds = cartItems.map(resolveShopId);

        // Dev-only: uncomment this line temporarily to inspect what your cart items contain
        // console.table(cartItems.map(i => ({ name: i.itemName ?? i.ItemName, shopID: i.shopID, ShopID: i.ShopID, shopId: i.shopId })));

        // Filter out nulls before deduping — a missing shopId field shouldn't block checkout
        const definedShopIds = [...new Set(rawShopIds.filter(id => id != null))];

        // Only block if there are genuinely 2+ *different* shop IDs present
        if (definedShopIds.length > 1) {
            toast.error('Your cart contains items from multiple shops. Please order from one shop at a time.');
            return;
        }

        // Use the resolved shopId, falling back to 0 if the field simply doesn't exist in cart items
        const resolvedShopId = definedShopIds[0] ?? 0;

        setIsPlacingOrder(true);
        try {
            const userData = JSON.parse(localStorage.getItem('customerUser') || '{}');
            const userId = userData.userId ?? userData.UserId;

            // FIX: include orderItems so the backend knows what was ordered
            const orderPayload = {
                userId,
                shopId: resolvedShopId,
                addressId: selectedAddress.Id,
                totalAmount: getCartTotal(),
                orderStatus: 0,
                isActive: true,
                orderItems: cartItems.map(item => ({
                    itemId: getItemId(item),
                    quantity: item.quantity,
                    unitPrice: item.price,
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
    // Render
    // ─────────────────────────────────────────

    const total = getCartTotal();
    const savings = cartItems.reduce((acc, item) => acc + Math.round(item.price * 0.2 * item.quantity), 0);

    return (
        <main className="min-vh-100 pb-5" style={{ backgroundColor: '#f8f0f6' }}>
            <Helmet>
                <title>My Cart | SathiMarket</title>
                <meta name="description" content="Secure checkout for your rural marketplace needs." />
            </Helmet>

            <style>{`
                /* ─── Tokens ─── */
                :root {
                    --maroon: #721a61;
                    --maroon-dark: #561249;
                    --gold: #ffc200;
                    --surface: #ffffff;
                    --bg: #f8f0f6;
                    --border: #e8d5e4;
                    --text-muted: #6b7280;
                    --danger: #dc2626;
                    --success: #16a34a;
                    --radius: 8px;
                }

                /* ─── Skeleton loader ─── */
                .skeleton {
                    background: linear-gradient(90deg, #f0e8ee 25%, #e8d8e4 50%, #f0e8ee 75%);
                    background-size: 200% 100%;
                    animation: shimmer 1.4s infinite;
                }
                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }

                /* ─── Header ─── */
                .cart-header {
                    background: var(--maroon);
                    color: white;
                    padding: 12px 0;
                    position: sticky;
                    top: 0;
                    z-index: 1000;
                    border-bottom: 3px solid var(--gold);
                    box-shadow: 0 2px 8px rgba(114,26,97,0.3);
                }

                /* ─── Address bar ─── */
                .address-bar {
                    background: var(--surface);
                    padding: 14px 16px;
                    border: 1px solid var(--border);
                    border-left: 4px solid var(--maroon);
                    margin-bottom: 14px;
                    border-radius: var(--radius);
                    box-shadow: 0 1px 4px rgba(0,0,0,0.05);
                }

                /* ─── Cart item ─── */
                .cart-item-card {
                    background: var(--surface);
                    padding: 16px;
                    border-radius: var(--radius);
                    border: 1px solid var(--border);
                    margin-bottom: 10px;
                    display: flex;
                    gap: 14px;
                    transition: box-shadow 0.2s;
                }
                .cart-item-card:hover { box-shadow: 0 4px 12px rgba(114,26,97,0.1); }

                .item-img-box {
                    width: 90px; height: 90px;
                    flex-shrink: 0;
                    border-radius: 6px;
                    overflow: hidden;
                    background: #fafafa;
                    border: 1px solid #eee;
                }
                .item-img-box img { width: 100%; height: 100%; object-fit: contain; }

                /* ─── Qty control ─── */
                .qty-control {
                    display: inline-flex;
                    align-items: center;
                    gap: 0;
                    border: 1px solid var(--border);
                    border-radius: 4px;
                    overflow: hidden;
                    margin-top: 8px;
                }
                .qty-btn {
                    background: #f8f0f6;
                    border: none;
                    color: var(--maroon);
                    width: 30px; height: 30px;
                    display: flex; align-items: center; justify-content: center;
                    transition: background 0.15s;
                }
                .qty-btn:hover:not(:disabled) { background: #eeddea; }
                .qty-btn:disabled { opacity: 0.4; cursor: not-allowed; }
                .qty-value {
                    width: 34px; text-align: center;
                    font-weight: 700; font-size: 0.875rem;
                    border-left: 1px solid var(--border);
                    border-right: 1px solid var(--border);
                    background: white;
                    line-height: 30px;
                }

                /* ─── Price summary ─── */
                .price-details {
                    background: var(--surface);
                    padding: 20px;
                    border-radius: var(--radius);
                    border: 1px solid var(--border);
                    position: sticky;
                    top: 80px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                }
                .btn-place-order {
                    background: var(--maroon);
                    color: white;
                    border: none;
                    padding: 13px;
                    font-weight: 700;
                    font-size: 0.95rem;
                    border-radius: var(--radius);
                    width: 100%;
                    transition: background 0.2s, transform 0.1s;
                    letter-spacing: 0.3px;
                }
                .btn-place-order:hover:not(:disabled) {
                    background: var(--maroon-dark);
                    transform: translateY(-1px);
                }
                .btn-place-order:disabled { opacity: 0.65; cursor: not-allowed; }

                /* ─── Address modal ─── */
                .address-option {
                    border: 1.5px solid var(--border);
                    cursor: pointer;
                    transition: border-color 0.15s, background 0.15s;
                    border-radius: 6px;
                }
                .address-option:hover { border-color: var(--maroon); background: #fdf5fb; }
                .address-option.selected { border-color: var(--maroon); background: #fdf5fb; }

                /* ─── Mobile footer ─── */
                .mobile-sticky-footer {
                    position: fixed;
                    bottom: 0; left: 0; right: 0;
                    background: var(--surface);
                    padding: 10px 16px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    box-shadow: 0 -3px 12px rgba(0,0,0,0.1);
                    z-index: 1001;
                    border-top: 2px solid var(--gold);
                }

                /* ─── Utility ─── */
                .text-maroon { color: var(--maroon); }
                .savings-badge {
                    background: #dcfce7;
                    color: var(--success);
                    font-size: 0.7rem;
                    font-weight: 700;
                    padding: 2px 8px;
                    border-radius: 20px;
                    display: inline-block;
                }

                @media (max-width: 768px) {
                    .cart-item-card { padding: 12px; gap: 10px; }
                    .item-img-box { width: 75px; height: 75px; }
                }
            `}</style>

            {/* ── Header ── */}
            <header className="cart-header">
                <div className="container d-flex align-items-center">
                    <button onClick={() => navigate(-1)} className="btn text-white p-0 me-3" aria-label="Go back">
                        <ArrowLeft size={22} />
                    </button>
                    <h1 className="h6 mb-0 fw-bold">
                        My Cart
                        {cartItems.length > 0 && (
                            <span className="ms-2 badge rounded-pill" style={{ background: 'rgba(255,255,255,0.2)', fontSize: '0.7rem' }}>
                                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                            </span>
                        )}
                    </h1>
                </div>
            </header>

            <div className="container mt-4">
                <div className="row g-4">

                    {/* ── Left: Items + Address ── */}
                    <div className="col-lg-8">

                        {/* Delivery Address */}
                        <div className="address-bar d-flex justify-content-between align-items-center gap-2">
                            <div className="d-flex align-items-start gap-2 flex-grow-1 min-w-0">
                                <MapPin size={18} className="text-maroon mt-1 flex-shrink-0" />
                                <div className="min-w-0">
                                    {loadingAddresses ? (
                                        <div className="skeleton" style={{ height: 14, width: 200, borderRadius: 4 }} />
                                    ) : selectedAddress ? (
                                        <>
                                            <span className="text-muted d-block" style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>
                                                Delivering to
                                            </span>
                                            <span className="fw-bold small text-dark d-block text-truncate">{selectedAddress.FullAddress}</span>
                                            <span className="text-muted" style={{ fontSize: '11px' }}>
                                                {selectedAddress.City}, {selectedAddress.Pincode}
                                            </span>
                                        </>
                                    ) : (
                                        <span className="small fw-bold text-danger">⚠ Select a delivery address to continue</span>
                                    )}
                                </div>
                            </div>
                            <button
                                className="btn btn-sm fw-bold px-3 flex-shrink-0"
                                style={{ color: 'var(--maroon)', border: '1.5px solid var(--maroon)', borderRadius: 4, fontSize: '0.75rem' }}
                                onClick={() => setShowAddressModal(true)}
                            >
                                {addresses.length > 0 ? 'CHANGE' : 'ADD'}
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="mb-5">
                            {loadingAddresses && cartItems.length === 0 ? (
                                <CartSkeleton />
                            ) : cartItems.length > 0 ? (
                                cartItems.map(item => {
                                    const itemId = getItemId(item);
                                    const name = item.itemName ?? item.ItemName ?? 'Product';
                                    const imgSrc = resolveMediaUrl(item.mediaList ?? item.MediaList, IMAGE_BASE_URL);
                                    const lineTotal = item.price * item.quantity;
                                    const lineMrp = Math.round(item.price * 1.2 * item.quantity);

                                    return (
                                        <article className="cart-item-card shadow-sm" key={itemId}>
                                            <div className="item-img-box">
                                                <img
                                                    src={imgSrc}
                                                    alt={name}
                                                    loading="lazy"
                                                    onError={e => { e.target.src = 'https://placehold.co/200?text=No+Image'; }}
                                                />
                                            </div>

                                            <div className="flex-grow-1 min-w-0">
                                                <h2 className="h6 mb-1 fw-bold text-dark text-truncate">{name}</h2>

                                                <div className="d-flex align-items-center gap-2 mt-1 flex-wrap">
                                                    <span className="fw-bold text-dark" style={{ fontSize: '1.1rem' }}>₹{lineTotal}</span>
                                                    <span className="text-muted text-decoration-line-through" style={{ fontSize: '0.8rem' }}>₹{lineMrp}</span>
                                                    <span className="savings-badge">20% off</span>
                                                </div>

                                                <div className="qty-control">
                                                    <button
                                                        className="qty-btn"
                                                        onClick={() => updateQuantity(itemId, item.quantity - 1)}
                                                        disabled={item.quantity <= 1}
                                                        aria-label="Decrease quantity"
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="qty-value">{item.quantity}</span>
                                                    <button
                                                        className="qty-btn"
                                                        onClick={() => updateQuantity(itemId, item.quantity + 1)}
                                                        aria-label="Increase quantity"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>

                                                <button
                                                    className="btn text-danger p-0 mt-2 small fw-bold d-flex align-items-center gap-1"
                                                    onClick={() => removeFromCart(itemId)}
                                                    style={{ fontSize: '0.78rem' }}
                                                >
                                                    <Trash2 size={13} /> Remove
                                                </button>
                                            </div>
                                        </article>
                                    );
                                })
                            ) : (
                                <div className="p-5 text-center bg-white rounded shadow-sm">
                                    <ShoppingBag size={48} style={{ color: 'var(--maroon)', opacity: 0.25 }} className="mb-3" />
                                    <h5 className="fw-bold text-dark">Your cart is empty</h5>
                                    <p className="text-muted small mb-4">Browse SathiMarket and add fresh products from local farmers.</p>
                                    <button
                                        className="btn text-white px-4 py-2 fw-bold"
                                        style={{ background: 'var(--maroon)', borderRadius: 6 }}
                                        onClick={() => navigate('/sathi-market')}
                                    >
                                        <Package size={16} className="me-2" /> Shop Now
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Right: Price Summary (desktop) ── */}
                    <div className="col-lg-4 d-none d-lg-block">
                        <div className="price-details">
                            <h3 className="h6 fw-bold border-bottom pb-3 mb-3">Order Summary</h3>

                            <div className="d-flex justify-content-between mb-2 small">
                                <span className="text-muted">MRP Total</span>
                                <span className="text-decoration-line-through text-muted">₹{total + savings}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2 small text-success fw-bold">
                                <span>Discount</span>
                                <span>- ₹{savings}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2 small text-success">
                                <span>Delivery</span>
                                <span className="fw-bold">FREE</span>
                            </div>

                            <div className="d-flex justify-content-between border-top pt-3 fw-bold mb-4" style={{ fontSize: '1.1rem' }}>
                                <span>Total Payable</span>
                                <span className="text-maroon">₹{total}</span>
                            </div>

                            {savings > 0 && (
                                <div className="savings-badge w-100 text-center mb-4 py-1" style={{ fontSize: '0.8rem' }}>
                                    🎉 You're saving ₹{savings} on this order!
                                </div>
                            )}

                            <button
                                className="btn-place-order"
                                onClick={handleCheckout}
                                disabled={isPlacingOrder || cartItems.length === 0}
                            >
                                {isPlacingOrder ? (
                                    <span className="d-flex align-items-center justify-content-center gap-2">
                                        <span className="spinner-border spinner-border-sm" /> Processing...
                                    </span>
                                ) : 'Place My Order'}
                            </button>

                            <p className="small text-center text-muted mt-3 d-flex align-items-center justify-content-center gap-1">
                                <ShieldCheck size={14} className="text-success" /> Secure Checkout
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Mobile sticky footer ── */}
            {cartItems.length > 0 && (
                <div className="mobile-sticky-footer d-lg-none">
                    <div>
                        <div className="fw-bold text-dark" style={{ fontSize: '1.2rem' }}>₹{total}</div>
                        <div className="text-success fw-bold" style={{ fontSize: '10px' }}>FREE delivery · Save ₹{savings}</div>
                    </div>
                    <button
                        className="btn text-white px-4 py-2 fw-bold"
                        style={{ background: 'var(--maroon)', borderRadius: 6 }}
                        onClick={handleCheckout}
                        disabled={isPlacingOrder}
                    >
                        {isPlacingOrder ? 'Wait...' : 'Place Order →'}
                    </button>
                </div>
            )}

            {/* ── Address Modal ── */}
            {showAddressModal && (
                <div
                    className="modal fade show d-block"
                    tabIndex="-1"
                    style={{ background: 'rgba(0,0,0,0.65)', zIndex: 2000 }}
                    onClick={e => { if (e.target === e.currentTarget) setShowAddressModal(false); }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: 12 }}>
                            <div className="modal-header pb-0" style={{ borderBottom: '2px solid #f0e0ec' }}>
                                <h6 className="modal-title fw-bold text-maroon d-flex align-items-center gap-2">
                                    <MapPin size={16} /> Select Delivery Address
                                </h6>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowAddressModal(false)}
                                    aria-label="Close"
                                />
                            </div>
                            <div className="modal-body">
                                {loadingAddresses ? (
                                    <div className="text-center py-3">
                                        <div className="spinner-border spinner-border-sm text-maroon" />
                                    </div>
                                ) : addresses.length > 0 ? (
                                    addresses.map(addr => (
                                        <AddressCard
                                            key={addr.Id}
                                            addr={addr}
                                            isSelected={selectedAddress?.Id === addr.Id}
                                            onSelect={a => { setSelectedAddress(a); setShowAddressModal(false); }}
                                        />
                                    ))
                                ) : (
                                    <p className="text-center py-3 text-muted small">No saved addresses found.</p>
                                )}

                                <button
                                    className="btn w-100 py-2 mt-2 small fw-bold"
                                    style={{ color: 'var(--maroon)', border: '1.5px dashed var(--maroon)', borderRadius: 6 }}
                                    onClick={() => { setShowAddressModal(false); navigate('/manage-addresses'); }}
                                >
                                    + Add New Address
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Cart;