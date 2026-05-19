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
    SlidersHorizontal, Zap, ChevronDown
} from 'lucide-react';
import ProductDetailsModal from './ProductDetailsModal';

const CheckIcon = () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
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

    if (loading) return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#fafaf8' }}>
            <div style={{ position: 'relative', width: 64, height: 64 }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', border: '3px solid #f0e8f5', borderTopColor: '#7c1a5e', animation: 'sd-spin 0.9s linear infinite', position: 'absolute' }} />
                <div style={{ width: 42, height: 42, borderRadius: '50%', border: '3px solid #f0e8f5', borderBottomColor: '#b5388e', animation: 'sd-spin 1.4s linear infinite reverse', position: 'absolute', top: 11, left: 11 }} />
            </div>
            <p style={{ marginTop: 22, fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 15, fontWeight: 700, letterSpacing: 3, color: '#7c1a5e', textTransform: 'uppercase' }}>SathiMarket</p>
            <p style={{ fontSize: 12, color: '#bbb', marginTop: 5 }}>Loading shop…</p>
            <style>{`@keyframes sd-spin{to{transform:rotate(360deg)}}`}</style>
        </div>
    );

    const shopName = shop?.shopName || 'Shop';
    const shopCity = shop?.shopAddress || '';
    const shopState = shop?.state || 'India';

    return (
        <main style={{ backgroundColor: '#f7f6f3', minHeight: '100vh', fontFamily: "'Outfit','DM Sans',system-ui,sans-serif" }}>
            <Helmet>
                <title>{shopName} | SathiMarket</title>
                <meta name="description" content={`Shop at ${shopName} in ${shopCity}. Browse ${filteredItems.length}+ verified products.`} />
                <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Cormorant+Garamond:wght@600;700&display=swap" rel="stylesheet" />
            </Helmet>

            <style>{`
                *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

                /* ── HEADER ── */
                .sd-header{background:#fff;border-bottom:1px solid #ece9e4;position:sticky;top:0;z-index:200}
                .sd-header-inner{max-width:1280px;margin:0 auto;padding:10px 14px;display:flex;align-items:center;gap:10px}
                .sd-back{
                    width:36px;height:36px;border-radius:9px;border:1.5px solid #ece9e4;
                    cursor:pointer;background:#fafaf8;color:#4a3040;
                    display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all 0.18s;
                }
                .sd-back:hover{background:#fdf5fc;border-color:#8B1A6B;color:#8B1A6B}
                .sd-search-shell{flex:1;position:relative}
                .sd-search{
                    width:100%;height:40px;background:#f5f4f1;border:1.5px solid #ece9e4;border-radius:11px;
                    padding:0 12px 0 38px;font-size:13px;color:#1a0a14;font-family:inherit;outline:none;
                    transition:border-color 0.2s,background 0.2s,box-shadow 0.2s;
                }
                .sd-search::placeholder{color:#b0a8aa}
                .sd-search:focus{background:#fff;border-color:#8B1A6B;box-shadow:0 0 0 3px rgba(139,26,107,0.08)}
                .sd-search-ico{position:absolute;left:11px;top:50%;transform:translateY(-50%);color:#b0a8aa;pointer-events:none}
                .sd-cart-btn{
                    position:relative;width:36px;height:36px;border-radius:9px;border:1.5px solid #ece9e4;
                    cursor:pointer;background:#fafaf8;color:#4a3040;
                    display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all 0.18s;
                }
                .sd-cart-btn:hover{background:#fdf5fc;border-color:#8B1A6B;color:#8B1A6B}
                .sd-cart-badge{
                    position:absolute;top:-5px;right:-5px;width:17px;height:17px;border-radius:50%;
                    background:#8B1A6B;color:#fff;font-size:9px;font-weight:800;
                    display:flex;align-items:center;justify-content:center;border:2px solid #fff;
                }

                /* ── SHOP INFO STRIP (mobile: compact sticky bar below header) ── */
                .sd-shop-strip{
                    background:#fff;
                    border-bottom:1px solid #ece9e4;
                    position:sticky;top:60px;z-index:150;
                }
                .sd-strip-inner{
                    max-width:1280px;margin:0 auto;
                    padding:8px 14px;
                    display:flex;align-items:center;gap:10px;
                }
                .sd-strip-avatar{
                    width:34px;height:34px;border-radius:8px;flex-shrink:0;
                    background:linear-gradient(135deg,#6B1152,#8B1A6B);
                    display:flex;align-items:center;justify-content:center;
                    color:#ffd200;font-family:'Cormorant Garamond',Georgia,serif;
                    font-size:16px;font-weight:700;
                }
                .sd-strip-name{font-size:13px;font-weight:700;color:#1a0a14;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1;min-width:0}
                .sd-strip-pills{display:flex;gap:5px;flex-shrink:0}
                .sd-strip-pill{
                    display:flex;align-items:center;gap:3px;
                    padding:3px 8px;border-radius:20px;font-size:9.5px;font-weight:700;white-space:nowrap;
                }
                .sd-strip-pill.green{background:#f0fdf4;color:#16a34a;border:1px solid #bbf7d0}
                .sd-strip-pill.gold{background:#fffbeb;color:#d97706;border:1px solid #fde68a}

                /* ── SHOP HERO (desktop only) ── */
                .sd-shop-hero{
                    background:linear-gradient(105deg,#5a0d44 0%,#7c1a5e 42%,#9d2578 100%);
                    padding:28px 20px 48px;position:relative;overflow:hidden;
                }
                .sd-shop-hero::after{
                    content:'';position:absolute;bottom:-1px;left:0;right:0;height:28px;
                    background:#f7f6f3;border-radius:28px 28px 0 0;
                }
                .sd-shop-hero::before{
                    content:'';position:absolute;inset:0;
                    background:radial-gradient(ellipse 80% 80% at 70% 50%,rgba(255,210,0,0.09),transparent 60%);
                }
                .sd-shop-hero-inner{max-width:1280px;margin:0 auto;display:flex;align-items:center;gap:18px;position:relative}
                .sd-shop-avatar{
                    width:68px;height:68px;border-radius:16px;
                    background:rgba(255,255,255,0.12);border:2px solid rgba(255,210,0,0.4);
                    display:flex;align-items:center;justify-content:center;
                    color:#ffd200;font-size:26px;font-weight:700;
                    font-family:'Cormorant Garamond',Georgia,serif;flex-shrink:0;
                }
                .sd-shop-info{flex:1;min-width:0}
                .sd-shop-name{font-family:'Cormorant Garamond',Georgia,serif;font-size:1.5rem;font-weight:700;color:#fff;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
                .sd-shop-loc{display:flex;align-items:center;gap:5px;color:rgba(255,255,255,0.7);font-size:12.5px;margin-top:5px}
                .sd-shop-meta{display:flex;gap:8px;margin-top:10px;flex-wrap:wrap}
                .sd-meta-pill{display:flex;align-items:center;gap:4px;padding:4px 11px;border-radius:20px;font-size:10.5px;font-weight:700}
                .sd-meta-pill.green{background:rgba(22,163,74,0.22);color:#4ade80;border:1px solid rgba(74,222,128,0.25)}
                .sd-meta-pill.gold{background:rgba(255,210,0,0.18);color:#ffd200;border:1px solid rgba(255,210,0,0.3)}

                /* ── TOOLBAR ── */
                .sd-toolbar{background:#fff;border-bottom:1px solid #ece9e4;position:sticky;top:103px;z-index:100}
                .sd-toolbar-inner{max-width:1280px;margin:0 auto;padding:8px 14px;display:flex;align-items:center;justify-content:space-between;gap:10px}
                .sd-result-txt{font-size:12.5px;font-weight:600;color:#7a7068;white-space:nowrap}
                .sd-result-txt span{color:#8B1A6B;font-weight:800}
                .sd-sort-wrap{display:flex;align-items:center;gap:5px}
                .sd-sort{
                    height:32px;padding:0 10px;border-radius:8px;border:1.5px solid #e8e4df;background:#fafaf8;
                    font-size:12px;font-weight:600;color:#4a3040;font-family:inherit;outline:none;appearance:none;
                    cursor:pointer;transition:border-color 0.18s;
                }
                .sd-sort:focus{border-color:#8B1A6B}

                /* ── LAYOUT ── */
                .sd-layout{max-width:1280px;margin:0 auto;padding:14px 14px 60px;display:grid;gap:18px;grid-template-columns:1fr}
                @media(min-width:1024px){.sd-layout{grid-template-columns:1fr 260px;padding:20px 20px 60px}}

                /* ── PRODUCT CARD (horizontal) ── */
                .sd-product{
                    background:#fff;border-radius:14px;border:1px solid #ece9e4;
                    overflow:hidden;display:flex;
                    transition:transform 0.22s,box-shadow 0.22s,border-color 0.22s;
                    animation:sd-fadeup 0.35s ease both;
                }
                .sd-product:hover{transform:translateY(-3px);box-shadow:0 10px 28px rgba(139,26,107,0.11);border-color:#d4a0c8}
                @keyframes sd-fadeup{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}

                /* image */
                .sd-prod-img-wrap{
                    width:110px;min-width:110px;
                    cursor:pointer;overflow:hidden;position:relative;
                    background:#fdf4fb;display:flex;align-items:center;justify-content:center;flex-shrink:0;
                }
                @media(min-width:480px){.sd-prod-img-wrap{width:140px;min-width:140px}}
                @media(min-width:640px){.sd-prod-img-wrap{width:160px;min-width:160px}}
                .sd-prod-img-wrap img{width:100%;height:100%;object-fit:contain;transition:transform 0.35s}
                .sd-product:hover .sd-prod-img-wrap img{transform:scale(1.06)}
                .sd-img-badge{
                    position:absolute;top:6px;left:6px;padding:2px 7px;border-radius:5px;
                    background:#8B1A6B;color:#fff;font-size:8.5px;font-weight:800;letter-spacing:0.4px;text-transform:uppercase;
                }
                .sd-wish-btn{
                    position:absolute;top:6px;right:6px;width:26px;height:26px;border-radius:50%;
                    border:none;cursor:pointer;background:rgba(255,255,255,0.92);
                    display:flex;align-items:center;justify-content:center;
                    transition:transform 0.18s;box-shadow:0 1px 5px rgba(0,0,0,0.10);
                }
                .sd-wish-btn:hover{transform:scale(1.15)}

                /* body */
                .sd-prod-body{flex:1;padding:12px 13px;display:flex;flex-direction:column;justify-content:space-between;min-width:0}
                @media(min-width:480px){.sd-prod-body{padding:14px 16px}}

                .sd-prod-tag{display:inline-flex;align-items:center;gap:3px;padding:2px 8px;border-radius:20px;background:#fdf0f9;color:#8B1A6B;font-size:9.5px;font-weight:700;border:1px solid #e8c0e0;margin-bottom:6px}
                .sd-prod-name{font-size:13px;font-weight:700;color:#1a0a14;line-height:1.35;margin-bottom:5px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
                @media(min-width:480px){.sd-prod-name{font-size:14.5px}}
                .sd-prod-desc{font-size:11.5px;color:#9ca3af;line-height:1.5;margin-bottom:8px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
                /* hide desc on very small screens */
                @media(max-width:400px){.sd-prod-desc{display:none}.sd-prod-perks{display:none !important}}
                .sd-prod-perks{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:10px}
                .sd-perk{display:flex;align-items:center;gap:3px;font-size:10.5px;font-weight:600;color:#16a34a}
                /* hide perks on small mobile */
                @media(max-width:480px){.sd-prod-perks{display:none}}

                /* footer price + cta */
                .sd-prod-footer{display:flex;align-items:flex-end;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-top:auto}
                .sd-price{font-size:1.15rem;font-weight:800;color:#8B1A6B;font-family:'Cormorant Garamond',Georgia,serif;line-height:1}
                @media(min-width:480px){.sd-price{font-size:1.35rem}}
                .sd-price-mrp{font-size:10px;color:#b0a8aa;text-decoration:line-through;margin-top:1px}
                .sd-price-save{font-size:10px;color:#16a34a;font-weight:700}
                .sd-free-del{font-size:9.5px;color:#16a34a;font-weight:600;display:flex;align-items:center;gap:2px;margin-top:2px}

                .sd-add-btn{
                    display:flex;align-items:center;gap:5px;
                    padding:8px 13px;border-radius:9px;border:none;cursor:pointer;
                    font-family:inherit;font-size:11.5px;font-weight:800;
                    text-transform:uppercase;letter-spacing:0.4px;transition:all 0.22s;white-space:nowrap;flex-shrink:0;
                }
                @media(min-width:480px){.sd-add-btn{padding:9px 16px;font-size:12.5px}}
                .sd-add-btn.default{background:linear-gradient(135deg,#6B1152,#8B1A6B);color:#fff;box-shadow:0 3px 12px rgba(139,26,107,0.28)}
                .sd-add-btn.default:hover{background:linear-gradient(135deg,#FFD200,#FFA500);color:#1a1a2e;box-shadow:0 3px 12px rgba(255,165,0,0.3)}
                .sd-add-btn.added{background:linear-gradient(135deg,#16a34a,#22c55e);color:#fff}

                /* ── SIDEBAR (desktop only) ── */
                .sd-sidebar-card{
                    background:#fff;border-radius:16px;border:1px solid #ece9e4;
                    padding:20px;position:sticky;top:130px;
                    box-shadow:0 4px 16px rgba(0,0,0,0.05);
                }
                .sd-sidebar-head{text-align:center;padding-bottom:14px;border-bottom:1px solid #f0efec;margin-bottom:14px}
                .sd-sidebar-avatar{
                    width:56px;height:56px;border-radius:13px;
                    background:linear-gradient(135deg,#6B1152,#8B1A6B);
                    display:flex;align-items:center;justify-content:center;
                    color:#ffd200;font-size:22px;font-weight:700;
                    font-family:'Cormorant Garamond',Georgia,serif;margin:0 auto 10px;
                }
                .sd-sidebar-name{font-size:14px;font-weight:700;color:#1a0a14;margin-bottom:3px}
                .sd-sidebar-loc{display:flex;align-items:center;justify-content:center;gap:4px;color:#a0879a;font-size:11.5px}
                .sd-rating-row{display:flex;align-items:center;justify-content:center;gap:3px;margin-top:8px}
                .sd-trust-item{display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid #f5f4f1}
                .sd-trust-item:last-child{border-bottom:none;padding-bottom:0}
                .sd-trust-icon{width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
                .sd-trust-text{font-size:12.5px;font-weight:600;color:#374151}
                .sd-trust-sub{font-size:10.5px;color:#a0879a;margin-top:1px}
                .sd-share-btn{
                    width:100%;margin-top:12px;padding:10px;border-radius:9px;
                    border:1.5px solid #e8e4df;background:#fafaf8;cursor:pointer;
                    font-family:inherit;font-size:12.5px;font-weight:700;color:#4a3040;
                    display:flex;align-items:center;justify-content:center;gap:6px;transition:all 0.18s;
                }
                .sd-share-btn:hover{border-color:#8B1A6B;color:#8B1A6B;background:#fdf5fc}

                /* ── EMPTY ── */
                .sd-empty{text-align:center;padding:52px 20px;background:#fff;border-radius:14px;border:1px solid #ece9e4}
                .sd-empty h3{font-family:'Cormorant Garamond',Georgia,serif;font-size:1.2rem;color:#374151;margin-top:12px;margin-bottom:5px}
                .sd-empty p{font-size:12.5px;color:#a0879a}
                .sd-empty-btn{
                    margin-top:14px;padding:9px 22px;border-radius:8px;border:none;
                    background:#8B1A6B;color:#fff;font-weight:700;cursor:pointer;
                    font-family:inherit;font-size:13px;transition:opacity 0.2s;
                }
                .sd-empty-btn:hover{opacity:0.88}

                /* ── RESPONSIVE HIDE/SHOW ── */
                /* desktop: hide strip, show hero */
                @media(min-width:601px){
                    .sd-shop-strip{display:none}
                    .sd-toolbar{top:67px}
                }
                /* mobile: hide hero + sidebar, show strip */
                @media(max-width:600px){
                    .sd-shop-hero{display:none}
                    .sd-sidebar{display:none}
                    .sd-toolbar{top:103px}
                }
                @media(max-width:1023px){.sd-sidebar{display:none}}
            `}</style>

            {/* ── HEADER ── */}
            <header className="sd-header" role="banner">
                <div className="sd-header-inner">
                    <button className="sd-back" onClick={() => navigate(-1)} aria-label="Go back">
                        <ArrowLeft size={18} />
                    </button>

                    <div className="sd-search-shell">
                        <Search size={14} className="sd-search-ico" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#b0a8aa', pointerEvents: 'none' }} />
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
                        <ShoppingBag size={18} />
                        {totalCartCount > 0 && <span className="sd-cart-badge">{totalCartCount}</span>}
                    </button>
                </div>
            </header>

            {/* ── COMPACT SHOP STRIP (mobile only) ── */}
            <div className="sd-shop-strip" aria-label="Shop info">
                <div className="sd-strip-inner">
                    <div className="sd-strip-avatar">{shopName.charAt(0).toUpperCase()}</div>
                    <span className="sd-strip-name">{shopName}</span>
                     <span className="sd-strip-name">{shopCity}</span>
                    <div className="sd-strip-pills">
                        <span className="sd-strip-pill green">
                            <BadgeCheck size={9} /> Verified
                        </span>
                        <span className="sd-strip-pill gold">
                            <Star size={9} fill="currentColor" /> 4.2
                        </span>
                    </div>
                </div>
            </div>

            {/* ── SHOP HERO (desktop only) ── */}
            <section className="sd-shop-hero" aria-label="Shop information">
                <div className="sd-shop-hero-inner">
                    <div className="sd-shop-avatar">{shopName.charAt(0).toUpperCase()}</div>
                    <div className="sd-shop-info">
                        <h1 className="sd-shop-name">{shopName}</h1>
                        <div className="sd-shop-loc">
                            <MapPin size={12} />
                            {shopCity}{shopCity && ', '}{shopState}
                        </div>
                        <div className="sd-shop-meta">
                            <span className="sd-meta-pill green"><CheckIcon /> Sathi Verified</span>
                            <span className="sd-meta-pill gold"><Star size={10} fill="currentColor" /> 4.2 Rating</span>
                            <span className="sd-meta-pill green"><Truck size={10} /> Free Delivery</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── TOOLBAR ── */}
            <div className="sd-toolbar" role="toolbar">
                <div className="sd-toolbar-inner">
                    <p className="sd-result-txt">
                        <span>{filteredItems.length}</span> product{filteredItems.length !== 1 ? 's' : ''}
                    </p>
                    <div className="sd-sort-wrap">
                        <SlidersHorizontal size={13} color="#8B1A6B" />
                        <select className="sd-sort" value={sortBy} onChange={e => setSortBy(e.target.value)} aria-label="Sort">
                            <option value="default">Default</option>
                            <option value="price-asc">Price ↑</option>
                            <option value="price-desc">Price ↓</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* ── MODAL ── */}
            <ProductDetailsModal
                isOpen={isModalOpen}
                item={selectedProduct}
                onClose={() => setIsModalOpen(false)}
                onAddToCart={(item) => handleAddToCart(null, item)}
            />

            {/* ── MAIN LAYOUT ── */}
            <div className="sd-layout">

                {/* Products */}
                <section aria-label="Product listings">
                    {filteredItems.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
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
                                        style={{ animationDelay: `${Math.min(idx * 50, 350)}ms` }}
                                        aria-label={item.itemName || item.ItemName}
                                    >
                                        {/* Image */}
                                        <div
                                            className="sd-prod-img-wrap"
                                            onClick={() => { setSelectedProduct(item); setIsModalOpen(true); }}
                                            role="button"
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
                                                aria-label={inWish ? 'Remove from wishlist' : 'Save'}
                                            >
                                                <Heart size={12} color={inWish ? '#ef4444' : '#9ca3af'} fill={inWish ? '#ef4444' : 'none'} />
                                            </button>
                                        </div>

                                        {/* Body */}
                                        <div className="sd-prod-body">
                                            <div>
                                                <div className="sd-prod-tag">
                                                    <BadgeCheck size={9} /> Sathi Verified
                                                </div>
                                                <h2 className="sd-prod-name">{item.itemName || item.ItemName}</h2>
                                                <p className="sd-prod-desc">
                                                    {item.itemDescription || 'Premium quality product from a verified SathiMarket partner shop.'}
                                                </p>
                                                <div className="sd-prod-perks">
                                                    <span className="sd-perk"><Truck size={10} /> Free Delivery</span>
                                                    <span className="sd-perk"><ShieldCheck size={10} /> Quality Assured</span>
                                                    <span className="sd-perk"><Zap size={10} /> Quick Dispatch</span>
                                                </div>
                                            </div>

                                            <div className="sd-prod-footer">
                                                <div>
                                                    <div className="sd-price">₹{price.toLocaleString('en-IN')}</div>
                                                    <div className="sd-price-mrp">MRP ₹{mrp.toLocaleString('en-IN')}</div>
                                                    <div className="sd-price-save">{save}% off</div>
                                                    <div className="sd-free-del"><Truck size={9} /> Free delivery</div>
                                                </div>
                                                <button
                                                    className={`sd-add-btn ${isAdded ? 'added' : 'default'}`}
                                                    onClick={e => handleAddToCart(e, item)}
                                                    aria-label={`Add ${item.itemName || item.ItemName} to cart`}
                                                >
                                                    {isAdded
                                                        ? <><CheckIcon /> Added!</>
                                                        : <><ShoppingBag size={13} /> Add</>
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
                            <Package size={48} color="#d1d5db" />
                            <h3>No Products Found</h3>
                            <p>Try a different search term or clear the filter.</p>
                            <button className="sd-empty-btn" onClick={() => setSearchTerm('')}>Clear Search</button>
                        </div>
                    )}
                </section>

                {/* Sidebar (desktop only) */}
                <aside className="sd-sidebar" aria-label="Shop info sidebar">
                    <div className="sd-sidebar-card">
                        <div className="sd-sidebar-head">
                            <div className="sd-sidebar-avatar">{shopName.charAt(0)}</div>
                            <div className="sd-sidebar-name">{shopName}</div>
                            <div className="sd-sidebar-loc"><MapPin size={11} /> {shopCity}{shopCity && ', '}{shopState}</div>
                            <div className="sd-rating-row">
                                {[1,2,3,4].map(i => <Star key={i} size={12} fill="#ffd200" color="#ffd200" />)}
                                <Star size={12} fill="#e5e7eb" color="#e5e7eb" />
                                <span style={{ fontSize: 11.5, color: '#7a7068', marginLeft: 4, fontWeight: 600 }}>4.2</span>
                            </div>
                        </div>

                        <div>
                            {[
                                { icon: <BadgeCheck size={15} color="#16a34a" />, bg: '#f0fdf4', title: 'Verified Partner', sub: 'Identity & docs verified' },
                                { icon: <ShieldCheck size={15} color="#2563eb" />, bg: '#eff6ff', title: 'Safe Payments', sub: '100% secure checkout' },
                                { icon: <Truck size={15} color="#8B1A6B" />, bg: '#fdf4fb', title: 'Fast Delivery', sub: 'Same/next day near you' },
                                { icon: <Clock size={15} color="#ea580c" />, bg: '#fff7ed', title: 'Open Now', sub: 'Mon–Sat, 9 AM–8 PM' },
                            ].map((t, i) => (
                                <div className="sd-trust-item" key={i}>
                                    <div className="sd-trust-icon" style={{ background: t.bg }}>{t.icon}</div>
                                    <div>
                                        <div className="sd-trust-text">{t.title}</div>
                                        <div className="sd-trust-sub">{t.sub}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="sd-share-btn" onClick={() => navigator.share?.({ title: shopName, url: window.location.href })}>
                            <Share2 size={13} /> Share this Shop
                        </button>
                    </div>
                </aside>
            </div>
        </main>
    );
};

export default ShopDetails;