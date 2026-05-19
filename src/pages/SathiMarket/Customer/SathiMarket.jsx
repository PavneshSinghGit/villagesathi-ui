import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axiosInstance from '../../../api/axiosInstance';
import { toast } from 'react-toastify';
import SathiLogo from "../../../assets/Images/sathimarket.png";
import {
    Search, Store, Building2, Smartphone, Stethoscope,
    ShoppingBag, Star, MapPin, ChevronRight, Sparkles,
    Heart, Clock, Tag, ArrowRight, Grid3X3, List,
    TrendingUp, ShieldCheck, Zap, ChevronDown, Filter,
    Package, Award, Users
} from 'lucide-react';

/* ─── tiny hook: intersection observer for card reveal ─── */
function useReveal() {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.08 });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);
    return [ref, visible];
}

/* ─── category meta ─── */
const getCategoryMeta = (category) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('medical') || cat.includes('health') || cat.includes('pharma'))
        return { icon: <Stethoscope size={18} />, color: '#0d9488', light: '#f0fdf9', accent: '#ccfbf1' };
    if (cat.includes('grocery') || cat.includes('food') || cat.includes('kirana'))
        return { icon: <Store size={18} />, color: '#d97706', light: '#fffbeb', accent: '#fef3c7' };
    if (cat.includes('mobile') || cat.includes('tech') || cat.includes('electron'))
        return { icon: <Smartphone size={18} />, color: '#6366f1', light: '#f5f3ff', accent: '#ede9fe' };
    if (cat.includes('fashion') || cat.includes('cloth') || cat.includes('garment'))
        return { icon: <Tag size={18} />, color: '#db2777', light: '#fdf2f8', accent: '#fce7f3' };
    if (cat.includes('hardware') || cat.includes('tool'))
        return { icon: <Package size={18} />, color: '#0284c7', light: '#f0f9ff', accent: '#e0f2fe' };
    return { icon: <Building2 size={18} />, color: '#7c3aed', light: '#faf5ff', accent: '#ede9fe' };
};

/* ─── CARD COMPONENT ─── */
function ShopCard({ shop, inWishlist, onWishlist, onClick, idx }) {
    const [ref, visible] = useReveal();
    const id = shop.shopID || shop.ShopID;
    const meta = getCategoryMeta(shop.categoryName);
    const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_URL;
    const [imgError, setImgError] = useState(false);

    const getShopImageUrl = (imageUrl) => {
        if (!imageUrl) return null;
        if (imageUrl.startsWith("http")) return imageUrl;
        const path = imageUrl.replace(/\\/g, '/').replace(/^\/?wwwroot/i, "");
        const cleanPath = path.startsWith("/") ? path : `/${path}`;
        const cleanBase = IMAGE_BASE_URL?.endsWith("/") ? IMAGE_BASE_URL.slice(0, -1) : IMAGE_BASE_URL;
        return `${cleanBase}${cleanPath}`;
    };

    const imgUrl = getShopImageUrl(shop.shopImage || shop.ShopImage);

    return (
        <article
            ref={ref}
            className="sm2-card"
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(24px)',
                transition: `opacity 0.45s ease ${idx * 0.06}s, transform 0.45s ease ${idx * 0.06}s`,
            }}
            onClick={onClick}
            role="listitem"
            aria-label={`${shop.shopName} – ${shop.categoryName || 'Shop'}`}
        >
            {/* image block */}
            <div className="sm2-card-img-wrap">
                {imgUrl && !imgError ? (
                    <img
                        src={imgUrl}
                        alt={`${shop.shopName} store`}
                        loading="lazy"
                        className="sm2-card-img"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="sm2-card-img-fallback" style={{ background: `linear-gradient(135deg, ${meta.color}cc, ${meta.color})` }}>
                        <div style={{ opacity: 0.9, color: '#fff' }}>{meta.icon}</div>
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', marginTop: 6, fontWeight: 600, letterSpacing: 0.5 }}>
                            {shop.categoryName || 'Shop'}
                        </span>
                    </div>
                )}

                {/* overlay gradient */}
                <div className="sm2-img-overlay" />

                {/* category pill */}
                <div className="sm2-cat-pill" style={{ background: meta.color }}>
                    <span style={{ marginRight: 4, display: 'flex', alignItems: 'center' }}>{React.cloneElement(meta.icon, { size: 10 })}</span>
                    {shop.categoryName || 'General'}
                </div>

                {/* wishlist */}
                <button
                    className={`sm2-wish-btn ${inWishlist ? 'wished' : ''}`}
                    onClick={e => { e.stopPropagation(); onWishlist(e, id); }}
                    aria-label={inWishlist ? 'Remove from wishlist' : 'Save shop'}
                >
                    <Heart size={13} fill={inWishlist ? '#ef4444' : 'none'} color={inWishlist ? '#ef4444' : '#fff'} strokeWidth={2.5} />
                </button>
            </div>

            {/* body */}
            <div className="sm2-card-body">
                <h3 className="sm2-card-name" title={shop.shopName}>{shop.shopName}</h3>

                <div className="sm2-card-row">
                    <span className="sm2-rating-badge">
                        <Star size={9} fill="#fff" color="#fff" />
                        4.2
                    </span>
                    <span className="sm2-verified">
                        <ShieldCheck size={11} color="#16a34a" strokeWidth={2.5} />
                        Verified
                    </span>
                </div>

                <div className="sm2-card-cta" style={{ borderColor: meta.color + '30', color: meta.color }}>
                    Visit Store
                    <ArrowRight size={12} strokeWidth={2.5} />
                </div>
            </div>
        </article>
    );
}

/* ─── MAIN COMPONENT ─── */
const SathiMarket = () => {
    const [shops, setShops] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [loading, setLoading] = useState(true);
    const [wishlist, setWishlist] = useState(new Set());
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
    const [searchFocused, setSearchFocused] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchShops = async () => {
            try {
                const response = await axiosInstance.get('/Shops/GetAll');
                const data = response.data?.Data || response.data || [];
                setShops(data);
            } catch {
                toast.error("Marketplace could not be loaded");
            } finally {
                setLoading(false);
            }
        };
        fetchShops();
    }, []);

    const categories = useMemo(() => ["All", ...new Set(shops.map(s => s.categoryName || "General"))], [shops]);

    const filteredShops = useMemo(() => shops.filter(shop => {
        const name = (shop.shopName || "").toLowerCase();
        const cat = (shop.categoryName || "").toLowerCase();
        const query = searchTerm.toLowerCase();
        return (name.includes(query) || cat.includes(query)) &&
            (selectedCategory === "All" || shop.categoryName === selectedCategory);
    }), [shops, searchTerm, selectedCategory]);

    const toggleWishlist = (e, id) => {
        e.stopPropagation();
        setWishlist(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
    };

    /* ─ loading ─ */
    if (loading) return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#fafaf8' }}>
            <div style={{ position: 'relative', width: 72, height: 72 }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', border: '3px solid #f0e8f5', borderTopColor: '#7c1a5e', animation: 'spin 0.9s linear infinite', position: 'absolute' }} />
                <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid #f0e8f5', borderBottomColor: '#b5388e', animation: 'spin 1.3s linear infinite reverse', position: 'absolute', top: 12, left: 12 }} />
            </div>
            <p style={{ marginTop: 24, fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 17, fontWeight: 700, letterSpacing: 3, color: '#7c1a5e', textTransform: 'uppercase' }}>SathiMarket</p>
            <p style={{ fontSize: 12, color: '#aaa', marginTop: 6 }}>Curating your local shops…</p>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
    );

    return (
        <main style={{ background: '#f7f6f3', minHeight: '100vh', fontFamily: "'Outfit', 'DM Sans', system-ui, sans-serif" }}>
            <Helmet>
                <title>SathiMarket | Shop Local – Groceries, Medicine & Electronics</title>
                <meta name="description" content="SathiMarket – Your trusted online rural marketplace in Lakhimpur Kheri." />
                <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Cormorant+Garamond:wght@600;700&display=swap" rel="stylesheet" />
            </Helmet>

            <style>{`
                *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

                /* ── HEADER ── */
                .sm2-header{background:#fff;border-bottom:1px solid #ece9e4;position:sticky;top:0;z-index:200}
                .sm2-header-inner{max-width:1320px;margin:0 auto;padding:10px 14px;display:flex;align-items:center;gap:12px}
                .sm2-brand{display:flex;align-items:center;gap:8px;cursor:pointer;flex-shrink:0}
                .sm2-brand-logo{width:138px;height:38px;border-radius:9px;background:#fdf4fb;border:1.5px solid #f0d9ed;display:flex;align-items:center;justify-content:center;overflow:hidden}
                .sm2-brand-logo img{width:130px;height:auto}
                .sm2-brand-name{font-family:'Cormorant Garamond',Georgia,serif;font-size:1.2rem;font-weight:700;color:#1a0a14;line-height:1}
                .sm2-brand-name em{color:#8B1A6B;font-style:normal}
                .sm2-brand-tag{font-size:9px;color:#a0879a;letter-spacing:1.5px;text-transform:uppercase;margin-top:1px}

                .sm2-search-shell{flex:1;position:relative}
                .sm2-search-input{
                    width:100%;height:40px;background:#f5f4f1;border:1.5px solid #ece9e4;border-radius:11px;
                    padding:0 12px 0 38px;font-size:13px;color:#1a0a14;font-family:inherit;outline:none;
                    transition:border-color 0.2s,background 0.2s,box-shadow 0.2s;
                }
                .sm2-search-input::placeholder{color:#b0a8aa}
                .sm2-search-input:focus{background:#fff;border-color:#8B1A6B;box-shadow:0 0 0 3px rgba(139,26,107,0.08)}
                .sm2-search-ico{position:absolute;left:11px;top:50%;transform:translateY(-50%);color:#b0a8aa;pointer-events:none}

                .sm2-header-actions{display:flex;align-items:center;gap:6px;flex-shrink:0}
                .sm2-view-toggle{display:flex;background:#f5f4f1;border-radius:7px;padding:2px;gap:2px}
                .sm2-vbtn{width:28px;height:28px;border:none;background:transparent;border-radius:5px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#a0879a;transition:all 0.15s}
                .sm2-vbtn.active{background:#fff;color:#8B1A6B;box-shadow:0 1px 3px rgba(0,0,0,0.08)}

                /* ── HERO — desktop only ── */
                .sm2-hero{background:linear-gradient(105deg,#5a0d44 0%,#7c1a5e 42%,#9d2578 100%);position:relative;overflow:hidden}
                .sm2-hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 80% 80% at 70% 50%,rgba(255,210,0,0.10),transparent 60%)}
                .sm2-hero-inner{max-width:1320px;margin:0 auto;padding:36px 20px 32px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:20px;position:relative}
                .sm2-hero-left{flex:1;min-width:220px}
                .sm2-hero-sup{display:inline-flex;align-items:center;gap:6px;background:rgba(255,210,0,0.15);border:1px solid rgba(255,210,0,0.3);border-radius:20px;padding:4px 12px;margin-bottom:12px}
                .sm2-hero-sup span{font-size:11px;font-weight:600;color:#ffd200;letter-spacing:0.5px;text-transform:uppercase}
                .sm2-hero-h1{font-family:'Cormorant Garamond',Georgia,serif;font-size:clamp(1.6rem,4vw,2.4rem);font-weight:700;color:#fff;line-height:1.15}
                .sm2-hero-h1 em{color:#ffd200;font-style:normal}
                .sm2-hero-sub{font-size:13px;color:rgba(255,255,255,0.68);margin-top:10px;line-height:1.6}
                .sm2-hero-right{display:flex;gap:12px;flex-shrink:0}
                .sm2-stat-card{background:rgba(255,255,255,0.10);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.15);border-radius:14px;padding:14px 20px;text-align:center;min-width:80px}
                .sm2-stat-n{font-family:'Cormorant Garamond',Georgia,serif;font-size:1.6rem;font-weight:700;color:#ffd200;line-height:1}
                .sm2-stat-l{font-size:10px;color:rgba(255,255,255,0.55);text-transform:uppercase;letter-spacing:1px;margin-top:4px}

                /* ── PROMOS — desktop only ── */
                .sm2-promos{max-width:1320px;margin:24px auto 0;padding:0 20px;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px}
                .sm2-promo-card{border-radius:16px;padding:18px 20px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;transition:transform 0.2s,box-shadow 0.2s;overflow:hidden}
                .sm2-promo-card:hover{transform:translateY(-3px);box-shadow:0 12px 28px rgba(0,0,0,0.15)}
                .sm2-promo-title{font-size:15px;font-weight:700;color:#fff;margin-bottom:3px}
                .sm2-promo-sub{font-size:11.5px;color:rgba(255,255,255,0.75)}
                .sm2-promo-ico{opacity:0.18;flex-shrink:0}

                /* ── MOBILE STATS BAR (replaces hero on mobile) ── */
                .sm2-mobile-stats{
                    display:none;
                    background:linear-gradient(90deg,#6B1152,#8B1A6B);
                    padding:8px 14px;gap:0;
                }
                .sm2-mstat{flex:1;text-align:center;border-right:1px solid rgba(255,255,255,0.15)}
                .sm2-mstat:last-child{border-right:none}
                .sm2-mstat-n{font-size:14px;font-weight:800;color:#ffd200;line-height:1}
                .sm2-mstat-l{font-size:9px;color:rgba(255,255,255,0.6);text-transform:uppercase;letter-spacing:0.8px;margin-top:1px}

                /* ── CATEGORY NAV ── */
                .sm2-cats{background:#fff;border-bottom:1px solid #ece9e4;position:sticky;top:59px;z-index:100}
                .sm2-cats-inner{max-width:1320px;margin:0 auto;padding:0 14px}
                .sm2-cats-scroll{display:flex;gap:6px;overflow-x:auto;padding:9px 0;scrollbar-width:none}
                .sm2-cats-scroll::-webkit-scrollbar{display:none}
                .sm2-cat-chip{
                    display:flex;align-items:center;gap:4px;
                    padding:6px 13px;border-radius:50px;font-size:12px;font-weight:600;
                    border:1.5px solid #e8e4df;background:#fafaf8;color:#7a7068;
                    white-space:nowrap;cursor:pointer;transition:all 0.18s;font-family:inherit;flex-shrink:0;
                }
                .sm2-cat-chip:hover{border-color:#8B1A6B;color:#8B1A6B;background:#fdf5fc}
                .sm2-cat-chip.active{background:#8B1A6B;color:#fff;border-color:#8B1A6B;box-shadow:0 3px 10px rgba(139,26,107,0.28)}

                /* ── SECTION ── */
                .sm2-section{max-width:1320px;margin:0 auto;padding:16px 14px 40px}
                .sm2-section-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;flex-wrap:wrap;gap:8px}
                .sm2-section-title{font-family:'Cormorant Garamond',Georgia,serif;font-size:1.25rem;font-weight:700;color:#1a0a14}
                .sm2-section-title em{color:#8B1A6B;font-style:normal}
                .sm2-count-badge{font-size:11.5px;background:#f0e8f5;color:#8B1A6B;font-weight:700;padding:3px 9px;border-radius:20px}

                /* ── GRID ── */
                .sm2-grid{display:grid;gap:10px;grid-template-columns:repeat(2,1fr)}
                @media(min-width:480px){.sm2-grid{grid-template-columns:repeat(3,1fr)}}
                @media(min-width:768px){.sm2-grid{grid-template-columns:repeat(4,1fr);gap:14px}}
                @media(min-width:1024px){.sm2-grid{grid-template-columns:repeat(5,1fr)}}
                @media(min-width:1280px){.sm2-grid{grid-template-columns:repeat(6,1fr)}}

                /* ── SHOP CARD ── */
                .sm2-card{
                    background:#fff;border:1px solid #ece9e4;border-radius:14px;overflow:hidden;
                    cursor:pointer;transition:transform 0.22s,box-shadow 0.22s,border-color 0.22s;
                    display:flex;flex-direction:column;
                }
                .sm2-card:hover{transform:translateY(-4px);box-shadow:0 14px 32px rgba(139,26,107,0.12);border-color:#d48fb8}
                .sm2-card-img-wrap{height:90px;position:relative;overflow:hidden;flex-shrink:0}
                @media(min-width:480px){.sm2-card-img-wrap{height:110px}}
                @media(min-width:768px){.sm2-card-img-wrap{height:130px}}
                .sm2-card-img{width:100%;height:100%;object-fit:cover;transition:transform 0.4s}
                .sm2-card:hover .sm2-card-img{transform:scale(1.07)}
                .sm2-card-img-fallback{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center}
                .sm2-img-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.4) 0%,transparent 60%)}
                .sm2-cat-pill{
                    position:absolute;bottom:6px;left:6px;display:flex;align-items:center;gap:3px;
                    padding:2px 7px;border-radius:20px;font-size:9px;font-weight:700;color:#fff;letter-spacing:0.3px;
                }
                .sm2-wish-btn{
                    position:absolute;top:6px;right:6px;width:24px;height:24px;border-radius:50%;border:none;cursor:pointer;
                    display:flex;align-items:center;justify-content:center;
                    background:rgba(0,0,0,0.28);backdrop-filter:blur(4px);transition:transform 0.18s,background 0.18s;
                }
                .sm2-wish-btn:hover{transform:scale(1.15)}
                .sm2-wish-btn.wished{background:rgba(254,226,226,0.9)}

                /* ── CARD BODY — ultra compact on mobile ── */
                .sm2-card-body{padding:8px 9px 10px;display:flex;flex-direction:column;gap:6px;flex:1}
                .sm2-card-name{font-size:12.5px;font-weight:700;color:#1a0a14;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.3}
                @media(min-width:768px){.sm2-card-name{font-size:13.5px}}
                .sm2-card-row{display:flex;align-items:center;justify-content:space-between}
                .sm2-rating-badge{display:inline-flex;align-items:center;gap:3px;background:#16a34a;color:#fff;font-size:9.5px;font-weight:800;padding:2px 6px;border-radius:5px}
                .sm2-verified{display:flex;align-items:center;gap:3px;font-size:9.5px;color:#6b7280;font-weight:500}
                .sm2-card-cta{
                    border:1.5px solid;border-radius:7px;font-size:10.5px;font-weight:700;
                    padding:5px 8px;display:flex;align-items:center;justify-content:center;gap:4px;
                    background:transparent;cursor:pointer;font-family:inherit;transition:background 0.18s,color 0.18s;
                }
                @media(min-width:768px){.sm2-card-cta{font-size:11.5px;padding:7px 10px}}
                .sm2-card:hover .sm2-card-cta{background:#8B1A6B !important;color:#fff !important;border-color:#8B1A6B !important}

                /* ── LIST VIEW ── */
                .sm2-list{display:flex;flex-direction:column;gap:8px}
                .sm2-list-card{
                    background:#fff;border:1px solid #ece9e4;border-radius:12px;
                    display:flex;align-items:center;gap:12px;padding:10px 12px;
                    cursor:pointer;transition:border-color 0.2s,box-shadow 0.2s;
                }
                .sm2-list-card:hover{border-color:#c9609f;box-shadow:0 3px 12px rgba(139,26,107,0.10)}
                .sm2-list-img{width:48px;height:48px;border-radius:9px;object-fit:cover;flex-shrink:0}
                .sm2-list-fallback{width:48px;height:48px;border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#fff}
                .sm2-list-info{flex:1;min-width:0}
                .sm2-list-name{font-size:13px;font-weight:700;color:#1a0a14;margin-bottom:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
                .sm2-list-meta{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
                .sm2-list-cta{padding:6px 13px;border-radius:7px;font-size:11.5px;font-weight:700;border:1.5px solid;background:transparent;cursor:pointer;display:flex;align-items:center;gap:4px;transition:all 0.18s;font-family:inherit;flex-shrink:0}

                /* ── EMPTY ── */
                .sm2-empty{text-align:center;padding:48px 20px}
                .sm2-empty-ico{color:#ddd;margin-bottom:14px}
                .sm2-empty h3{font-family:'Cormorant Garamond',Georgia,serif;font-size:18px;font-weight:700;color:#444;margin-bottom:6px}
                .sm2-empty p{font-size:13px;color:#a0a0a0;max-width:280px;margin:0 auto 16px;line-height:1.6}
                .sm2-empty-btn{display:inline-flex;align-items:center;gap:6px;padding:9px 20px;border-radius:9px;background:#8B1A6B;color:#fff;border:none;font-weight:700;cursor:pointer;font-size:13px;font-family:inherit;transition:background 0.2s}
                .sm2-empty-btn:hover{background:#6B1152}

                /* ── TRUST BAR ── */
                .sm2-trust{background:#fff;border-top:1px solid #ece9e4;margin-top:32px;padding:16px 14px}
                .sm2-trust-inner{max-width:1320px;margin:0 auto;display:flex;align-items:center;justify-content:center;gap:24px;flex-wrap:wrap}
                .sm2-trust-item{display:flex;align-items:center;gap:6px;font-size:11.5px;color:#7a7068;font-weight:500}

                /* ── MOBILE BREAKPOINT ── */
                @media(max-width:600px){
                    .sm2-hero{display:none}
                    .sm2-promos{display:none}
                    .sm2-mobile-stats{display:flex}
                    .sm2-cats{top:59px}
                    .sm2-header-actions{display:none}
                    .sm2-brand-tag{display:none}
                    .sm2-trust{display:none}
                    .sm2-section{padding:12px 10px 32px}
                    .sm2-section-head{margin-bottom:10px}
                }
                @media(max-width:360px){
                    .sm2-card-img-wrap{height:80px}
                    .sm2-grid{gap:8px}
                }
            `}</style>

            {/* ── HEADER ── */}
            <header className="sm2-header" role="banner">
                <div className="sm2-header-inner">
                    <div className="sm2-brand" onClick={() => navigate('/sathi-market')} aria-label="SathiMarket Home">
                        <div className="sm2-brand-logo">
                            <img src={SathiLogo} alt="SathiMarket" />
                        </div>                       
                    </div>

                    <div className="sm2-search-shell">
                        <Search size={15} className="sm2-search-ico" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#b0a8aa', pointerEvents: 'none' }} />
                        <input
                            type="search"
                            className="sm2-search-input"
                            placeholder="Search shops, categories, products…"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            aria-label="Search"
                            autoComplete="off"
                        />
                    </div>

                    <div className="sm2-header-actions">
                        <div className="sm2-view-toggle" role="group" aria-label="View mode">
                            <button className={`sm2-vbtn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')} aria-label="Grid view">
                                <Grid3X3 size={14} />
                            </button>
                            <button className={`sm2-vbtn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')} aria-label="List view">
                                <List size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* ── MOBILE STATS BAR (mobile only, replaces hero) ── */}
            <div className="sm2-mobile-stats" aria-label="Quick stats">
                <div className="sm2-mstat"><div className="sm2-mstat-n">{shops.length}+</div><div className="sm2-mstat-l">Shops</div></div>
                <div className="sm2-mstat"><div className="sm2-mstat-n">{categories.length - 1}</div><div className="sm2-mstat-l">Categories</div></div>
                <div className="sm2-mstat"><div className="sm2-mstat-n">100%</div><div className="sm2-mstat-l">Verified</div></div>
            </div>

            {/* ── HERO (desktop only via CSS) ── */}
            <section className="sm2-hero" aria-label="Marketplace intro">
                <div className="sm2-hero-inner">
                    <div className="sm2-hero-left">
                        <div className="sm2-hero-sup">
                            <Sparkles size={12} color="#ffd200" />
                            <span>Lakhimpur Kheri's #1 marketplace</span>
                        </div>
                        <h1 className="sm2-hero-h1">
                            Your Neighbourhood,<br />
                            <em>One Click Away</em>
                        </h1>
                        <p className="sm2-hero-sub">
                            Shop groceries, medicines, electronics & more from verified local stores. Fast, trusted, and always nearby.
                        </p>
                    </div>
                    <div className="sm2-hero-right">
                        <div className="sm2-stat-card">
                            <div className="sm2-stat-n">{shops.length}+</div>
                            <div className="sm2-stat-l">Shops</div>
                        </div>
                        <div className="sm2-stat-card">
                            <div className="sm2-stat-n">{categories.length - 1}</div>
                            <div className="sm2-stat-l">Categories</div>
                        </div>
                        <div className="sm2-stat-card">
                            <div className="sm2-stat-n">100%</div>
                            <div className="sm2-stat-l">Verified</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── PROMO BANNERS ── */}
            {selectedCategory === "All" && !searchTerm && (
                <div className="sm2-promos" aria-label="Featured categories">
                    <div
                        className="sm2-promo-card"
                        style={{ background: 'linear-gradient(120deg,#b45309,#d97706)' }}
                        onClick={() => setSelectedCategory(categories.find(c => c.toLowerCase().includes('grocery')) || 'All')}
                    >
                        <div>
                            <div className="sm2-promo-title">Fresh Groceries</div>
                            <div className="sm2-promo-sub">Order from local kirana stores</div>
                        </div>
                        <Store size={44} className="sm2-promo-ico" color="#fff" />
                    </div>
                    <div
                        className="sm2-promo-card"
                        style={{ background: 'linear-gradient(120deg,#0f766e,#0d9488)' }}
                        onClick={() => setSelectedCategory(categories.find(c => c.toLowerCase().includes('medical')) || 'All')}
                    >
                        <div>
                            <div className="sm2-promo-title">Health & Medicines</div>
                            <div className="sm2-promo-sub">Certified pharmacies near you</div>
                        </div>
                        <Stethoscope size={44} className="sm2-promo-ico" color="#fff" />
                    </div>
                    <div
                        className="sm2-promo-card"
                        style={{ background: 'linear-gradient(120deg,#4338ca,#6366f1)' }}
                        onClick={() => setSelectedCategory(categories.find(c => c.toLowerCase().includes('mobile') || c.toLowerCase().includes('tech')) || 'All')}
                    >
                        <div>
                            <div className="sm2-promo-title">Tech & Electronics</div>
                            <div className="sm2-promo-sub">Mobiles, accessories & more</div>
                        </div>
                        <Smartphone size={44} className="sm2-promo-ico" color="#fff" />
                    </div>
                </div>
            )}

            {/* ── CATEGORY NAV ── */}
            <nav className="sm2-cats" aria-label="Shop categories">
                <div className="sm2-cats-inner">
                    <div className="sm2-cats-scroll" role="list">
                        {categories.map(cat => {
                            const meta = getCategoryMeta(cat);
                            return (
                                <button
                                    key={cat}
                                    className={`sm2-cat-chip ${selectedCategory === cat ? 'active' : ''}`}
                                    onClick={() => setSelectedCategory(cat)}
                                    role="listitem"
                                    aria-pressed={selectedCategory === cat}
                                >
                                    {cat === "All" ? <><Sparkles size={12} />All Shops</> :
                                        <>{React.cloneElement(meta.icon, { size: 12 })}{cat}</>}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </nav>

            {/* ── SHOP LISTINGS ── */}
            <section className="sm2-section" aria-label="Shop listings">
                <div className="sm2-section-head">
                    <h2 className="sm2-section-title">
                        {selectedCategory === "All" ? <><em>All</em> Shops</> : <><em>{selectedCategory}</em> Shops</>}
                    </h2>
                    <div className="sm2-section-meta">
                        <span className="sm2-count-badge">{filteredShops.length} found</span>
                    </div>
                </div>

                {filteredShops.length > 0 ? (
                    viewMode === 'grid' ? (
                        <div className="sm2-grid" role="list">
                            {filteredShops.map((shop, idx) => {
                                const id = shop.shopID || shop.ShopID;
                                return (
                                    <ShopCard
                                        key={id}
                                        shop={shop}
                                        idx={idx}
                                        inWishlist={wishlist.has(id)}
                                        onWishlist={toggleWishlist}
                                        onClick={() => navigate(`/shop-details/${id}`)}
                                    />
                                );
                            })}
                        </div>
                    ) : (
                        /* LIST VIEW */
                        <div className="sm2-list" role="list">
                            {filteredShops.map((shop, idx) => {
                                const id = shop.shopID || shop.ShopID;
                                const meta = getCategoryMeta(shop.categoryName);
                                const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_URL;
                                const rawImg = shop.shopImage || shop.ShopImage;
                                let imgUrl = null;
                                if (rawImg) {
                                    if (rawImg.startsWith("http")) imgUrl = rawImg;
                                    else {
                                        const path = rawImg.replace(/\\/g, '/').replace(/^\/?wwwroot/i, "");
                                        const cp = path.startsWith("/") ? path : `/${path}`;
                                        const cb = IMAGE_BASE_URL?.endsWith("/") ? IMAGE_BASE_URL.slice(0, -1) : IMAGE_BASE_URL;
                                        imgUrl = `${cb}${cp}`;
                                    }
                                }
                                return (
                                    <div
                                        key={id}
                                        className="sm2-list-card"
                                        onClick={() => navigate(`/shop-details/${id}`)}
                                        role="listitem"
                                        style={{ opacity: 1, animation: `fadeUp 0.3s ease ${idx * 0.03}s both` }}
                                    >
                                        {imgUrl ? (
                                            <img src={imgUrl} alt={shop.shopName} className="sm2-list-img" onError={e => e.target.style.display = 'none'} />
                                        ) : (
                                            <div className="sm2-list-fallback" style={{ background: meta.color }}>
                                                {React.cloneElement(meta.icon, { size: 22 })}
                                            </div>
                                        )}
                                        <div className="sm2-list-info">
                                            <div className="sm2-list-name">{shop.shopName}</div>
                                            <div className="sm2-list-meta">
                                                <span style={{ fontSize: 11, background: meta.light, color: meta.color, padding: '2px 8px', borderRadius: 20, fontWeight: 700 }}>
                                                    {shop.categoryName || 'General'}
                                                </span>
                                                <span className="sm2-rating-badge"><Star size={9} fill="#fff" color="#fff" />4.2</span>
                                                <span className="sm2-verified"><ShieldCheck size={11} color="#16a34a" strokeWidth={2.5} />Verified</span>
                                            </div>
                                        </div>
                                        <button
                                            className="sm2-list-cta"
                                            style={{ borderColor: meta.color + '50', color: meta.color }}
                                            onClick={e => { e.stopPropagation(); navigate(`/shop-details/${id}`); }}
                                        >
                                            Visit <ArrowRight size={12} />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )
                ) : (
                    <div className="sm2-empty" role="status">
                        <ShoppingBag size={60} className="sm2-empty-ico" />
                        <h3>No shops found</h3>
                        <p>Try a different search term or browse all categories to discover more local stores.</p>
                        <button
                            className="sm2-empty-btn"
                            onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                        >
                            <Sparkles size={14} /> Browse All Shops
                        </button>
                    </div>
                )}
            </section>

            {/* ── TRUST BAR ── */}
            <div className="sm2-trust">
                <div className="sm2-trust-inner">
                    <div className="sm2-trust-item">
                        <ShieldCheck size={16} color="#8B1A6B" strokeWidth={2} />
                        <span>100% Verified Shops</span>
                    </div>
                    <div className="sm2-trust-item">
                        <Zap size={16} color="#d97706" strokeWidth={2} />
                        <span>Fast Local Delivery</span>
                    </div>
                    <div className="sm2-trust-item">
                        <Users size={16} color="#0d9488" strokeWidth={2} />
                        <span>Trusted by Locals</span>
                    </div>
                    <div className="sm2-trust-item">
                        <Award size={16} color="#6366f1" strokeWidth={2} />
                        <span>Quality Assured</span>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
            `}</style>
        </main>
    );
};

export default SathiMarket;