import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../../../api/axiosInstance';
import { useCart } from '../../../context/CartContext';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import SATHI_LOGO from '../../../assets/Images/sathiMarketLogo.png';
import {
    Search, ArrowLeft, Star, Heart, Share2, ShoppingBag,
    MapPin, Clock, ShieldCheck, Truck, BadgeCheck, Package,
    ChevronDown, Filter, SlidersHorizontal, Zap
} from 'lucide-react';
import ProductDetailsModal from './ProductDetailsModal';

/* ─── tiny inline SVG icons not in lucide ─── */
const CheckIcon = () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);
const ShieldIcon = ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);

const ShopDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { addToCart, cartItems } = useCart();

    const [shop, setShop] = useState(null);
    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [wishlist, setWishlist] = useState(new Set());
    const [sortBy, setSortBy] = useState('default');
    const [addedItems, setAddedItems] = useState(new Set());

    const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_URL;

    const getMediaUrl = (mediaList) => {
        const DEFAULT = 'https://placehold.co/400x400/f8f0f7/8B1A6B?text=No+Image';
        if (!mediaList || mediaList.length === 0) return DEFAULT;
        const primary = mediaList.find(m => m.isPrimary || m.IsPrimary) || mediaList[0];
        let path = primary.mediaURL || primary.MediaURL;
        if (!path) return DEFAULT;
        if (path.startsWith('http')) return path;
        path = path.replace(/\\/g, '/').replace(/^\/?wwwroot/i, '');
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        const cleanBase = IMAGE_BASE_URL?.endsWith('/') ? IMAGE_BASE_URL.slice(0, -1) : IMAGE_BASE_URL;
        return `${cleanBase}${cleanPath}`;
    };

    const handleAddToCart = (e, item) => {
        if (e?.stopPropagation) e.stopPropagation();
        const user = localStorage.getItem('customerUser');
        if (!user) {
            toast.warn('Please login to add items');
            navigate('/customer-login', { state: { from: location } });
            return;
        }
        addToCart(item);
        const itemId = item.itemID || item.ItemID;
        setAddedItems(prev => new Set([...prev, itemId]));
        setTimeout(() => setAddedItems(prev => { const n = new Set(prev); n.delete(itemId); return n; }), 1800);
        toast.success(`${item.itemName} added!`, { autoClose: 600, position: 'bottom-center' });
    };

    const toggleWishlist = (e, id) => {
        e.stopPropagation();
        setWishlist(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
    };

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const [shopRes, itemsRes] = await Promise.all([
                    axiosInstance.get(`/Shops/GetById/${id}`),
                    axiosInstance.get(`/ShopItems/GetByShop/${id}`)
                ]);
                setShop(shopRes.data.Data || shopRes.data.data || shopRes.data);
                setItems(itemsRes.data.Data || itemsRes.data.data || itemsRes.data);
            } catch {
                toast.error('Failed to load shop details');
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    const filteredItems = useMemo(() => {
        let data = Array.isArray(items) ? items : [];
        data = data.filter(item =>
            (item.itemName || item.ItemName)?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (sortBy === 'price-asc') data = [...data].sort((a, b) => (a.price || a.Price) - (b.price || b.Price));
        if (sortBy === 'price-desc') data = [...data].sort((a, b) => (b.price || b.Price) - (a.price || a.Price));
        return data;
    }, [searchTerm, items, sortBy]);

    const totalCartCount = cartItems?.reduce((s, i) => s + (i.quantity || 1), 0) || 0;

    /* ── Loading ── */
    if (loading) return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#fff' }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', border: '4px solid #f0e6ef', borderTopColor: '#8B1A6B', animation: 'sd-spin 0.75s linear infinite' }} />
            <p style={{ marginTop: 14, fontFamily: "'Playfair Display', serif", color: '#8B1A6B', fontWeight: 700, letterSpacing: 2, fontSize: 13 }}>SATHI MARKET</p>
            <p style={{ color: '#aaa', fontSize: 12, marginTop: 3 }}>Loading shop…</p>
            <style>{`@keyframes sd-spin{to{transform:rotate(360deg)}}`}</style>
        </div>
    );

    const shopName = shop?.shopName || 'Shop';
    const shopCity = shop?.city || '';
    const shopState = shop?.state || 'India';

    return (
        <main style={{ backgroundColor: '#f5f6fa', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif" }}>
            <Helmet>
                <title>{shopName} | SathiMarket – Local Shop in {shopCity}</title>
                <meta name="description" content={`Shop at ${shopName} in ${shopCity}, ${shopState}. Browse ${filteredItems.length}+ verified products. Fast delivery via SathiMarket.`} />
                <meta name="keywords" content={`${shopName}, ${shopCity} shop, SathiMarket, local shopping, ${shopState}`} />
                <meta property="og:title" content={`${shopName} on SathiMarket`} />
                <meta property="og:description" content={`Explore products from ${shopName}. Verified rural marketplace.`} />
                <meta property="og:type" content="website" />
                <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet" />
            </Helmet>

            <style>{`
                *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

                /* ── HEADER ── */
                .sd-header{
                    background:linear-gradient(135deg,#6B1152 0%,#8B1A6B 55%,#A0206E 100%);
                    position:sticky;top:0;z-index:1050;
                    box-shadow:0 4px 20px rgba(107,17,82,0.28);
                }
                .sd-header-inner{
                    max-width:1280px;margin:0 auto;
                    padding:12px 16px;display:flex;align-items:center;gap:12px;
                }
                .sd-back{
                    width:38px;height:38px;border-radius:10px;border:none;cursor:pointer;
                    background:rgba(255,255,255,0.15);color:#fff;display:flex;align-items:center;
                    justify-content:center;flex-shrink:0;transition:background 0.2s;
                    backdrop-filter:blur(4px);
                }
                .sd-back:hover{background:rgba(255,255,255,0.25)}

                .sd-search-wrap{flex:1;position:relative}
                .sd-search{
                    width:100%;height:42px;border-radius:10px;
                    border:2px solid rgba(255,255,255,0.2);
                    background:rgba(255,255,255,0.12);backdrop-filter:blur(8px);
                    color:#fff;font-size:14px;padding:0 14px 0 42px;outline:none;
                    transition:all 0.25s;font-family:'DM Sans',sans-serif;
                }
                .sd-search::placeholder{color:rgba(255,255,255,0.55)}
                .sd-search:focus{border-color:#FFD200;background:rgba(255,255,255,0.2)}
                .sd-search-icon{position:absolute;left:13px;top:50%;transform:translateY(-50%);color:rgba(255,255,255,0.6);pointer-events:none}

                .sd-cart-btn{
                    position:relative;width:42px;height:42px;border-radius:10px;border:none;
                    cursor:pointer;background:rgba(255,255,255,0.15);color:#fff;
                    display:flex;align-items:center;justify-content:center;
                    flex-shrink:0;transition:background 0.2s;
                }
                .sd-cart-btn:hover{background:rgba(255,255,255,0.25)}
                .sd-cart-badge{
                    position:absolute;top:-5px;right:-5px;width:18px;height:18px;
                    border-radius:50%;background:#FFD200;color:#1a1a2e;font-size:10px;
                    font-weight:800;display:flex;align-items:center;justify-content:center;
                    border:2px solid #8B1A6B;
                }

                /* ── SHOP HERO BAND ── */
                .sd-shop-hero{
                    background:linear-gradient(135deg,#6B1152 0%,#8B1A6B 100%);
                    padding:20px 16px 52px;position:relative;overflow:hidden;
                }
                .sd-shop-hero::after{
                    content:'';position:absolute;bottom:-1px;left:0;right:0;height:32px;
                    background:#f5f6fa;border-radius:32px 32px 0 0;
                }
                .sd-shop-hero-inner{max-width:1280px;margin:0 auto;display:flex;align-items:center;gap:16px;position:relative}
                .sd-shop-avatar{
                    width:72px;height:72px;border-radius:16px;
                    background:rgba(255,255,255,0.15);border:2.5px solid rgba(255,194,0,0.5);
                    display:flex;align-items:center;justify-content:center;color:#FFD200;
                    font-size:28px;font-weight:800;font-family:'Playfair Display',serif;
                    flex-shrink:0;backdrop-filter:blur(6px);
                }
                .sd-shop-info{flex:1;min-width:0}
                .sd-shop-name{font-family:'Playfair Display',serif;font-size:1.4rem;font-weight:800;color:#fff;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
                .sd-shop-loc{display:flex;align-items:center;gap:5px;color:rgba(255,255,255,0.75);font-size:13px;margin-top:5px}
                .sd-shop-meta{display:flex;gap:10px;margin-top:10px;flex-wrap:wrap}
                .sd-meta-pill{
                    display:flex;align-items:center;gap:5px;padding:4px 12px;border-radius:20px;
                    font-size:11px;font-weight:700;letter-spacing:0.3px;
                }
                .sd-meta-pill.green{background:rgba(22,163,74,0.25);color:#4ade80;border:1px solid rgba(74,222,128,0.3)}
                .sd-meta-pill.gold{background:rgba(255,210,0,0.2);color:#FFD200;border:1px solid rgba(255,210,0,0.35)}

                /* ── TOOLBAR ── */
                .sd-toolbar{
                    background:#fff;border-bottom:1px solid #e9ecef;
                    position:sticky;top:67px;z-index:1040;
                }
                .sd-toolbar-inner{
                    max-width:1280px;margin:0 auto;padding:10px 16px;
                    display:flex;align-items:center;justify-content:space-between;gap:12px;
                }
                .sd-result-txt{font-size:13px;font-weight:600;color:#6b7280;white-space:nowrap}
                .sd-result-txt span{color:#8B1A6B;font-weight:800}
                .sd-sort{
                    display:flex;align-items:center;gap:6px;padding:7px 14px;border-radius:8px;
                    border:1.5px solid #e5e7eb;background:#f9fafb;cursor:pointer;
                    font-size:13px;font-weight:600;color:#374151;font-family:'DM Sans',sans-serif;
                    outline:none;appearance:none;transition:border-color 0.2s;
                }
                .sd-sort:focus{border-color:#8B1A6B}

                /* ── LAYOUT ── */
                .sd-layout{max-width:1280px;margin:0 auto;padding:20px 16px 60px;display:grid;gap:20px;grid-template-columns:1fr}
                @media(min-width:1024px){.sd-layout{grid-template-columns:1fr 280px}}

                /* ── PRODUCT CARD ── */
                .sd-product{
                    background:#fff;border-radius:16px;border:1.5px solid #f0f0f5;
                    overflow:hidden;display:flex;gap:0;transition:transform 0.25s,box-shadow 0.25s,border-color 0.25s;
                    animation:sd-fadeup 0.4s ease both;
                }
                .sd-product:hover{transform:translateY(-3px);box-shadow:0 12px 32px rgba(139,26,107,0.12);border-color:#d4a0c8}
                @keyframes sd-fadeup{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}

                .sd-prod-img-wrap{
                    width:160px;min-width:160px;height:180px;cursor:pointer;
                    overflow:hidden;position:relative;background:#fdf4fb;
                    display:flex;align-items:center;justify-content:center;flex-shrink:0;
                }
                @media(max-width:520px){.sd-prod-img-wrap{width:120px;min-width:120px;height:140px}}
                .sd-prod-img-wrap img{width:100%;height:100%;object-fit:contain;transition:transform 0.35s}
                .sd-product:hover .sd-prod-img-wrap img{transform:scale(1.07)}

                .sd-img-badge{
                    position:absolute;top:8px;left:8px;padding:3px 8px;border-radius:6px;
                    background:linear-gradient(135deg,#6B1152,#8B1A6B);color:#fff;
                    font-size:9px;font-weight:800;letter-spacing:0.5px;text-transform:uppercase;
                }
                .sd-wish-btn{
                    position:absolute;top:8px;right:8px;width:28px;height:28px;border-radius:50%;
                    border:none;cursor:pointer;background:rgba(255,255,255,0.9);
                    backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;
                    transition:transform 0.2s;box-shadow:0 2px 8px rgba(0,0,0,0.12);
                }
                .sd-wish-btn:hover{transform:scale(1.15)}

                .sd-prod-body{flex:1;padding:16px 18px;display:flex;flex-direction:column;justify-content:space-between;min-width:0}
                @media(max-width:520px){.sd-prod-body{padding:12px}}

                .sd-prod-tag{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:20px;background:#fdf0f9;color:#8B1A6B;font-size:10px;font-weight:700;border:1px solid #e8c0e0;margin-bottom:8px}
                .sd-prod-name{font-size:15px;font-weight:800;color:#1a1a2e;line-height:1.3;margin-bottom:6px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
                @media(max-width:520px){.sd-prod-name{font-size:13px}}
                .sd-prod-desc{font-size:12px;color:#9ca3af;line-height:1.5;margin-bottom:10px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
                @media(max-width:520px){.sd-prod-desc{display:none}}
                .sd-prod-perks{display:flex;gap:14px;flex-wrap:wrap;margin-bottom:12px}
                .sd-perk{display:flex;align-items:center;gap:4px;font-size:11px;font-weight:600;color:#16a34a}

                .sd-prod-footer{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;flex-wrap:wrap}
                .sd-price-block{}
                .sd-price{font-size:1.4rem;font-weight:800;color:#8B1A6B;font-family:'Playfair Display',serif;line-height:1}
                @media(max-width:520px){.sd-price{font-size:1.1rem}}
                .sd-price-mrp{font-size:11px;color:#9ca3af;text-decoration:line-through;margin-top:2px}
                .sd-price-save{font-size:11px;color:#16a34a;font-weight:700}
                .sd-free-del{font-size:10px;color:#16a34a;font-weight:600;display:flex;align-items:center;gap:3px;margin-top:3px}

                .sd-add-btn{
                    display:flex;align-items:center;gap:6px;padding:10px 18px;border-radius:10px;
                    border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:800;
                    text-transform:uppercase;letter-spacing:0.5px;transition:all 0.25s;white-space:nowrap;
                    flex-shrink:0;
                }
                .sd-add-btn.default{background:linear-gradient(135deg,#6B1152,#8B1A6B);color:#fff;box-shadow:0 4px 14px rgba(139,26,107,0.3)}
                .sd-add-btn.default:hover{background:linear-gradient(135deg,#FFD200,#FFA500);color:#1a1a2e;box-shadow:0 4px 16px rgba(255,210,0,0.4)}
                .sd-add-btn.added{background:linear-gradient(135deg,#16a34a,#22c55e);color:#fff}
                @media(max-width:400px){.sd-add-btn{padding:9px 12px;font-size:11px}}

                /* ── SIDEBAR ── */
                .sd-sidebar{}
                .sd-sidebar-card{
                    background:#fff;border-radius:16px;border:1.5px solid #f0f0f5;
                    padding:20px;position:sticky;top:120px;
                    box-shadow:0 4px 16px rgba(0,0,0,0.06);
                }
                .sd-sidebar-head{text-align:center;padding-bottom:16px;border-bottom:1px solid #f0f0f5;margin-bottom:16px}
                .sd-sidebar-avatar{
                    width:60px;height:60px;border-radius:14px;
                    background:linear-gradient(135deg,#6B1152,#8B1A6B);
                    display:flex;align-items:center;justify-content:center;
                    color:#FFD200;font-size:22px;font-weight:800;
                    font-family:'Playfair Display',serif;margin:0 auto 10px;
                }
                .sd-sidebar-name{font-size:15px;font-weight:800;color:#1a1a2e;font-family:'Playfair Display',serif;margin-bottom:4px}
                .sd-sidebar-loc{display:flex;align-items:center;justify-content:center;gap:4px;color:#9ca3af;font-size:12px}
                .sd-rating-row{display:flex;align-items:center;justify-content:center;gap:3px;margin-top:8px}
                .sd-trust-item{display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid #f5f5f5}
                .sd-trust-item:last-child{border-bottom:none;padding-bottom:0}
                .sd-trust-icon{width:32px;height:32px;border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
                .sd-trust-text{font-size:13px;font-weight:600;color:#374151}
                .sd-trust-sub{font-size:11px;color:#9ca3af;margin-top:1px}

                .sd-share-btn{
                    width:100%;margin-top:14px;padding:11px;border-radius:10px;
                    border:1.5px solid #e5e7eb;background:#f9fafb;cursor:pointer;
                    font-family:'DM Sans',sans-serif;font-size:13px;font-weight:700;color:#374151;
                    display:flex;align-items:center;justify-content:center;gap:7px;transition:all 0.2s;
                }
                .sd-share-btn:hover{border-color:#8B1A6B;color:#8B1A6B;background:#fdf4fb}

                /* ── EMPTY ── */
                .sd-empty{text-align:center;padding:60px 20px;background:#fff;border-radius:16px;border:1.5px solid #f0f0f5}
                .sd-empty h3{font-family:'Playfair Display',serif;font-size:1.2rem;color:#374151;margin-top:14px;margin-bottom:6px}
                .sd-empty p{font-size:13px;color:#9ca3af}
                .sd-empty-btn{
                    margin-top:16px;padding:10px 24px;border-radius:9px;border:none;
                    background:#8B1A6B;color:#fff;font-weight:700;cursor:pointer;
                    font-family:'DM Sans',sans-serif;font-size:13px;transition:opacity 0.2s;
                }
                .sd-empty-btn:hover{opacity:0.88}

                @media(max-width:1023px){.sd-sidebar{display:none}}
            `}</style>

            {/* ── HEADER ── */}
            <header className="sd-header" role="banner">
                <div className="sd-header-inner">
                    <button className="sd-back" onClick={() => navigate(-1)} aria-label="Go back">
                        <ArrowLeft size={20} />
                    </button>

                    <div className="sd-search-wrap">
                        <Search size={16} className="sd-search-icon" />
                        <input
                            type="search"
                            className="sd-search"
                            placeholder={`Search in ${shopName}…`}
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            aria-label="Search products"
                            autoComplete="off"
                        />
                    </div>

                    <button className="sd-cart-btn" onClick={() => navigate('/cart')} aria-label={`Cart – ${totalCartCount} items`}>
                        <ShoppingBag size={20} />
                        {totalCartCount > 0 && <span className="sd-cart-badge">{totalCartCount}</span>}
                    </button>
                </div>
            </header>

            {/* ── SHOP HERO BAND ── */}
            <section className="sd-shop-hero" aria-label="Shop information">
                <div className="sd-shop-hero-inner">
                    <div className="sd-shop-avatar">
                        {shopName.charAt(0).toUpperCase()}
                    </div>
                    <div className="sd-shop-info">
                        <h1 className="sd-shop-name">{shopName}</h1>
                        <div className="sd-shop-loc">
                            <MapPin size={13} />
                            {shopCity}{shopCity && ', '}{shopState}
                        </div>
                        <div className="sd-shop-meta">
                            <span className="sd-meta-pill green">
                                <CheckIcon /> Sathi Verified
                            </span>
                            <span className="sd-meta-pill gold">
                                <Star size={10} fill="currentColor" /> 4.2 Rating
                            </span>
                            <span className="sd-meta-pill green">
                                <Truck size={10} /> Free Delivery
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── TOOLBAR ── */}
            <div className="sd-toolbar" role="toolbar" aria-label="Filter and sort">
                <div className="sd-toolbar-inner">
                    <p className="sd-result-txt">
                        <span>{filteredItems.length}</span> product{filteredItems.length !== 1 ? 's' : ''} found
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <SlidersHorizontal size={14} color="#8B1A6B" />
                        <select className="sd-sort" value={sortBy} onChange={e => setSortBy(e.target.value)} aria-label="Sort products">
                            <option value="default">Default</option>
                            <option value="price-asc">Price: Low → High</option>
                            <option value="price-desc">Price: High → Low</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* ── PRODUCT MODAL ── */}
            <ProductDetailsModal
                isOpen={isModalOpen}
                item={selectedProduct}
                onClose={() => setIsModalOpen(false)}
                onAddToCart={(item) => handleAddToCart(null, item)}
            />

            {/* ── MAIN LAYOUT ── */}
            <div className="sd-layout">
                {/* Products column */}
                <section aria-label="Product listings">
                    {filteredItems.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            {filteredItems.map((item, idx) => {
                                const itemId = item.itemID || item.ItemID;
                                const price = item.price || item.Price || 0;
                                const mrp = Math.round(price * 1.18);
                                const save = Math.round(((mrp - price) / mrp) * 100);
                                const inWish = wishlist.has(itemId);
                                const isAdded = addedItems.has(itemId);

                                return (
                                    <article
                                        key={itemId}
                                        className="sd-product"
                                        style={{ animationDelay: `${Math.min(idx * 60, 400)}ms` }}
                                        aria-label={item.itemName || item.ItemName}
                                    >
                                        {/* Image */}
                                        <div
                                            className="sd-prod-img-wrap"
                                            onClick={() => { setSelectedProduct(item); setIsModalOpen(true); }}
                                            role="button"
                                            aria-label={`View details for ${item.itemName || item.ItemName}`}
                                            tabIndex={0}
                                            onKeyDown={e => e.key === 'Enter' && (setSelectedProduct(item), setIsModalOpen(true))}
                                        >
                                            <img
                                                src={getMediaUrl(item.mediaList || item.MediaList)}
                                                alt={item.itemName || item.ItemName || 'Product'}
                                                loading="lazy"
                                                onError={e => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x400/f8f0f7/8B1A6B?text=No+Image'; }}
                                            />
                                            <span className="sd-img-badge">Verified</span>
                                            <button
                                                className="sd-wish-btn"
                                                onClick={e => toggleWishlist(e, itemId)}
                                                aria-label={inWish ? 'Remove from wishlist' : 'Add to wishlist'}
                                            >
                                                <Heart size={13} color={inWish ? '#ef4444' : '#9ca3af'} fill={inWish ? '#ef4444' : 'none'} />
                                            </button>
                                        </div>

                                        {/* Body */}
                                        <div className="sd-prod-body">
                                            <div>
                                                <div className="sd-prod-tag">
                                                    <BadgeCheck size={10} /> Sathi Verified
                                                </div>
                                                <h2 className="sd-prod-name">{item.itemName || item.ItemName}</h2>
                                                <p className="sd-prod-desc">
                                                    {item.itemDescription || 'Premium quality product from a verified SathiMarket partner shop.'}
                                                </p>
                                                <div className="sd-prod-perks">
                                                    <span className="sd-perk"><Truck size={11} /> Free Delivery</span>
                                                    <span className="sd-perk"><ShieldIcon size={11} /> Quality Assured</span>
                                                    <span className="sd-perk"><Zap size={11} /> Quick Dispatch</span>
                                                </div>
                                            </div>

                                            <div className="sd-prod-footer">
                                                <div className="sd-price-block">
                                                    <div className="sd-price">₹{price.toLocaleString('en-IN')}</div>
                                                    <div className="sd-price-mrp">M.R.P ₹{mrp.toLocaleString('en-IN')}</div>
                                                    <div className="sd-price-save">{save}% off</div>
                                                    <div className="sd-free-del"><Truck size={10} /> Free delivery</div>
                                                </div>
                                                <button
                                                    className={`sd-add-btn ${isAdded ? 'added' : 'default'}`}
                                                    onClick={e => handleAddToCart(e, item)}
                                                    aria-label={`Add ${item.itemName || item.ItemName} to cart`}
                                                >
                                                    {isAdded
                                                        ? <><CheckIcon /> Added!</>
                                                        : <><ShoppingBag size={14} /> Add to Cart</>
                                                    }
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="sd-empty" role="status">
                            <Package size={52} color="#d1d5db" />
                            <h3>No Products Found</h3>
                            <p>Try a different search term or clear the filter.</p>
                            <button className="sd-empty-btn" onClick={() => setSearchTerm('')}>
                                Clear Search
                            </button>
                        </div>
                    )}
                </section>

                {/* Sidebar */}
                <aside className="sd-sidebar" aria-label="Shop information sidebar">
                    <div className="sd-sidebar-card">
                        <div className="sd-sidebar-head">
                            <div className="sd-sidebar-avatar">{shopName.charAt(0)}</div>
                            <div className="sd-sidebar-name">{shopName}</div>
                            <div className="sd-sidebar-loc">
                                <MapPin size={12} /> {shopCity}{shopCity && ', '}{shopState}
                            </div>
                            <div className="sd-rating-row">
                                {[1,2,3,4].map(i => <Star key={i} size={13} fill="#FFD200" color="#FFD200" />)}
                                <Star size={13} fill="#e5e7eb" color="#e5e7eb" />
                                <span style={{ fontSize: 12, color: '#6b7280', marginLeft: 4, fontWeight: 600 }}>4.2</span>
                            </div>
                        </div>

                        <div>
                            <div className="sd-trust-item">
                                <div className="sd-trust-icon" style={{ background: '#f0fdf4' }}>
                                    <BadgeCheck size={16} color="#16a34a" />
                                </div>
                                <div>
                                    <div className="sd-trust-text">Verified Partner</div>
                                    <div className="sd-trust-sub">Identity & documents verified</div>
                                </div>
                            </div>
                            <div className="sd-trust-item">
                                <div className="sd-trust-icon" style={{ background: '#eff6ff' }}>
                                    <ShieldCheck size={16} color="#2563eb" />
                                </div>
                                <div>
                                    <div className="sd-trust-text">Safe Payments</div>
                                    <div className="sd-trust-sub">100% secure checkout</div>
                                </div>
                            </div>
                            <div className="sd-trust-item">
                                <div className="sd-trust-icon" style={{ background: '#fdf4fb' }}>
                                    <Truck size={16} color="#8B1A6B" />
                                </div>
                                <div>
                                    <div className="sd-trust-text">Fast Delivery</div>
                                    <div className="sd-trust-sub">Same/next day in your area</div>
                                </div>
                            </div>
                            <div className="sd-trust-item">
                                <div className="sd-trust-icon" style={{ background: '#fff7ed' }}>
                                    <Clock size={16} color="#ea580c" />
                                </div>
                                <div>
                                    <div className="sd-trust-text">Open Now</div>
                                    <div className="sd-trust-sub">Mon – Sat, 9 AM – 8 PM</div>
                                </div>
                            </div>
                        </div>

                        <button className="sd-share-btn" onClick={() => navigator.share?.({ title: shopName, url: window.location.href })}>
                            <Share2 size={14} /> Share this Shop
                        </button>
                    </div>
                </aside>
            </div>
        </main>
    );
};

export default ShopDetails;