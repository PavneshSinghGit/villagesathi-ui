import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axiosInstance from '../../../api/axiosInstance';
import { toast } from 'react-toastify';
import SathiLogo from "../../../assets/Images/smLogo.png";
import {
    Search, Store, Building2, Smartphone, Stethoscope,
    ShoppingBag, Star, MapPin, ChevronRight, Sparkles,
    Heart, Clock, Tag, ArrowRight
} from 'lucide-react';

const SathiMarket = () => {
    const [shops, setShops] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [loading, setLoading] = useState(true);
    const [wishlist, setWishlist] = useState(new Set());
    const navigate = useNavigate();

    const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_URL;

    useEffect(() => {
        const fetchShops = async () => {
            try {
                const response = await axiosInstance.get('/Shops/GetAll');
                const data = response.data?.Data || response.data || [];
                setShops(data);
            } catch (error) {
                toast.error("Marketplace could not be loaded");
            } finally {
                setLoading(false);
            }
        };
        fetchShops();
    }, []);

    const getShopImageUrl = (imageUrl) => {
        if (!imageUrl) return null;
        if (imageUrl.startsWith("http")) return imageUrl;
        const path = imageUrl.replace(/\\/g, '/').replace(/^\/?wwwroot/i, "");
        const cleanPath = path.startsWith("/") ? path : `/${path}`;
        const cleanBase = IMAGE_BASE_URL?.endsWith("/") ? IMAGE_BASE_URL.slice(0, -1) : IMAGE_BASE_URL;
        return `${cleanBase}${cleanPath}`;
    };

    const categories = useMemo(() => {
        return ["All", ...new Set(shops.map(s => s.categoryName || "General"))];
    }, [shops]);

    const filteredShops = useMemo(() => {
        return shops.filter(shop => {
            const name = (shop.shopName || "").toLowerCase();
            const cat = (shop.categoryName || "").toLowerCase();
            const query = searchTerm.toLowerCase();
            const matchesSearch = name.includes(query) || cat.includes(query);
            const matchesCategory = selectedCategory === "All" || shop.categoryName === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [shops, searchTerm, selectedCategory]);

    const getCategoryMeta = (category) => {
        const cat = category?.toLowerCase() || '';
        if (cat.includes('medical') || cat.includes('health')) return { icon: <Stethoscope size={20} />, gradient: 'linear-gradient(135deg, #11998e, #38ef7d)', badge: '#11998e' };
        if (cat.includes('grocery') || cat.includes('food')) return { icon: <Store size={20} />, gradient: 'linear-gradient(135deg, #f7971e, #ffd200)', badge: '#f7971e' };
        if (cat.includes('mobile') || cat.includes('tech')) return { icon: <Smartphone size={20} />, gradient: 'linear-gradient(135deg, #4776e6, #8e54e9)', badge: '#4776e6' };
        if (cat.includes('fashion') || cat.includes('cloth')) return { icon: <Tag size={20} />, gradient: 'linear-gradient(135deg, #f953c6, #b91d73)', badge: '#f953c6' };
        return { icon: <Building2 size={20} />, gradient: 'linear-gradient(135deg, #ee0979, #ff6a00)', badge: '#ee0979' };
    };

    const toggleWishlist = (e, id) => {
        e.stopPropagation();
        setWishlist(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    if (loading) return (
        <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            height: '100vh', background: '#fff'
        }}>
            <div style={{
                width: 56, height: 56, borderRadius: '50%',
                border: '4px solid #f0e6ef', borderTopColor: '#8B1A6B',
                animation: 'spin 0.8s linear infinite'
            }} />
            <p style={{ marginTop: 16, fontFamily: "'Playfair Display', serif", color: '#8B1A6B', fontWeight: 700, letterSpacing: 2, fontSize: 13 }}>
                SATHI MARKET
            </p>
            <p style={{ color: '#aaa', fontSize: 12, marginTop: 4 }}>Loading your local marketplace…</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    return (
        <main style={{ backgroundColor: '#f5f6fa', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif" }}>
            <Helmet>
                <title>SathiMarket | Shop Local – Groceries, Medicine & Electronics in Lakhimpur Kheri</title>
                <meta name="description" content="SathiMarket – Your trusted online rural marketplace in Lakhimpur Kheri. Buy groceries, medicines, mobile accessories, and more from verified local shops. Fast delivery." />
                <meta name="keywords" content="SathiMarket, VillageSathi, local shops, online shopping, Lakhimpur Kheri, grocery delivery, rural ecommerce, medicine online" />
                <meta property="og:title" content="SathiMarket – Shop Local, Live Better" />
                <meta property="og:description" content="Discover verified local shops in your area. Groceries, medicines, electronics and more." />
                <meta property="og:image" content="/og-sathi-market.jpg" />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <link rel="canonical" href="https://villagesathi.in/sathi-market" />
                <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet" />
            </Helmet>

            <style>{`
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

                /* ── HEADER ── */
                .sm-header {
                    background: linear-gradient(135deg, #6B1152 0%, #8B1A6B 50%, #A0206E 100%);
                    position: sticky; top: 0; z-index: 2;
                    box-shadow: 0 4px 24px rgba(107,17,82,0.25);
                }
                .sm-header-inner {
                    max-width: 1280px; margin: 0 auto;
                    padding: 14px 20px; display: flex; align-items: center; gap: 16px;
                }
                .sm-logo { display: flex; align-items: center; gap: 8px; cursor: pointer; text-decoration: none; flex-shrink: 0; }
                .sm-logo-badge {
                    width: 60px; height: 52px; border-radius: 10px;
                    background:linear-gradient(45deg, black, transparent);
                    display: flex; align-items: center; justify-content: center;
                    border: 1.5px solid rgba(255,255,255,0.25);
                }
                .sathi-logo { width: 100px; height: auto; }
                .sm-logo-text { font-family: 'Playfair Display', serif; font-size: 1.4rem; font-weight: 800; color: #fff; line-height: 1; }
                .sm-logo-text span { color: #FFD200; }
                .sm-logo-sub { font-size: 9px; color: rgba(255,255,255,0.6); letter-spacing: 1.5px; text-transform: uppercase; margin-top: 2px; }

                .sm-search-wrap { flex: 1; position: relative; }
                .sm-search {
                    width: 100%; height: 44px; border-radius: 10px;
                    border: 2px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.12);
                    backdrop-filter: blur(8px); color: #fff; font-size: 14px;
                    padding: 0 16px 0 44px; outline: none; transition: all 0.25s;
                    font-family: 'DM Sans', sans-serif;
                }
                .sm-search::placeholder { color: rgba(255,255,255,0.55); }
                .sm-search:focus { border-color: #FFD200; background: rgba(255,255,255,0.2); }
                .sm-search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: rgba(255,255,255,0.6); pointer-events: none; }

                .sm-header-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
                .sm-loc { display: flex; align-items: center; gap: 5px; color: rgba(255,255,255,0.8); font-size: 12px; font-weight: 500; }

                /* ── HERO BANNER ── */
                .sm-hero {
                    background: linear-gradient(135deg, #6B1152 0%, #8B1A6B 100%);
                    text-align: center; position: relative; overflow: hidden;
                }
                .sm-hero::before {
                    content: ''; position: absolute; inset: 0;
                    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Ccircle cx='30' cy='30' r='20'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
                }
                .sm-hero-title { font-family: 'Playfair Display', serif; font-size: 2rem; color: #fff; font-weight: 800; line-height: 1.2; position: relative; }
                .sm-hero-title span { color: #FFD200; }
                .sm-hero-sub { color: rgba(255,255,255,0.75); font-size: 14px; margin-top: 8px; position: relative; }
                .sm-hero-stats { display: flex; gap: 24px; justify-content: center; margin-top: 20px; position: relative; }
                .sm-stat { text-align: center; }
                .sm-stat-n { font-size: 1.4rem; font-weight: 800; color: #FFD200; font-family: 'Playfair Display', serif; }
                .sm-stat-l { font-size: 10px; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 1px; margin-top: 2px; }

                /* ── CATEGORY NAV ── */
                .sm-cat-wrap {
                    background: #fff;
                    box-shadow: 0 2px 12px rgba(0,0,0,0.08);
                    position: sticky; top: 67px; z-index: 1040;
                }
                .sm-cat-inner { max-width: 1280px; margin: 0 auto; padding: 0 20px; }
                .sm-cat-scroll { display: flex; gap: 8px; overflow-x: auto; padding: 12px 0; scrollbar-width: none; }
                .sm-cat-scroll::-webkit-scrollbar { display: none; }
                .sm-cat-btn {
                    display: flex; align-items: center; gap: 6px;
                    padding: 8px 18px; border-radius: 50px; font-size: 13px; font-weight: 600;
                    border: 1.5px solid #e5e7eb; background: #f9fafb; color: #6b7280;
                    white-space: nowrap; cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif;
                    flex-shrink: 0;
                }
                .sm-cat-btn:hover { border-color: #8B1A6B; color: #8B1A6B; background: #fdf4fb; }
                .sm-cat-btn.active { background: #8B1A6B; color: #fff; border-color: #8B1A6B; box-shadow: 0 4px 12px rgba(139,26,107,0.3); }

                /* ── SECTION ── */
                .sm-section { max-width: 1280px; margin: 0 auto; padding: 28px 20px; }
                .sm-section-head { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 20px; }
                .sm-section-title { font-family: 'Playfair Display', serif; font-size: 1.35rem; font-weight: 700; color: #1a1a2e; }
                .sm-section-title span { color: #8B1A6B; }
                .sm-section-count { font-size: 13px; color: #9ca3af; font-weight: 500; }

                /* ── SHOP GRID ── */
                .sm-grid { display: grid; gap: 16px; grid-template-columns: repeat(2, 1fr); }
                @media (min-width: 480px) { .sm-grid { grid-template-columns: repeat(2, 1fr); } }
                @media (min-width: 640px) { .sm-grid { grid-template-columns: repeat(3, 1fr); gap: 18px; } }
                @media (min-width: 900px) { .sm-grid { grid-template-columns: repeat(4, 1fr); } }
                @media (min-width: 1200px) { .sm-grid { grid-template-columns: repeat(5, 1fr); } }

                /* ── SHOP CARD ── */
                .sm-card {
                    background: #fff; border-radius: 16px; overflow: hidden;
                    border: 1.5px solid #f0f0f5; cursor: pointer;
                    transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
                    display: flex; flex-direction: column;
                    position: relative;
                }
                .sm-card:hover { transform: translateY(-5px); box-shadow: 0 16px 40px rgba(139,26,107,0.14); border-color: #c9609f; }

                .sm-card-img { height: 130px; overflow: hidden; position: relative; }
                @media (min-width: 640px) { .sm-card-img { height: 150px; } }
                .sm-card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
                .sm-card:hover .sm-card-img img { transform: scale(1.06); }
                .sm-card-img-fallback { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #fff; }

                .sm-card-badge {
                    position: absolute; top: 10px; left: 10px;
                    padding: 3px 9px; border-radius: 20px; font-size: 10px; font-weight: 700;
                    color: #fff; letter-spacing: 0.5px; backdrop-filter: blur(4px);
                }
                .sm-wishlist-btn {
                    position: absolute; top: 10px; right: 10px;
                    width: 30px; height: 30px; border-radius: 50%; border: none; cursor: pointer;
                    display: flex; align-items: center; justify-content: center;
                    background: rgba(255,255,255,0.9); backdrop-filter: blur(4px);
                    transition: all 0.2s; box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                }
                .sm-wishlist-btn:hover { transform: scale(1.15); }
                .sm-wishlist-btn.active { background: #fee2e2; }

                .sm-card-body { padding: 12px 12px 14px; flex: 1; display: flex; flex-direction: column; }
                .sm-card-cat { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; color: #8B1A6B; margin-bottom: 4px; }
                .sm-card-name { font-size: 14px; font-weight: 700; color: #1a1a2e; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 8px; flex: 1; }
                .sm-card-meta { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
                .sm-card-rating { display: flex; align-items: center; gap: 4px; }
                .sm-rating-badge { background: #16a34a; color: #fff; border-radius: 6px; font-size: 10px; font-weight: 800; padding: 2px 7px; display: flex; align-items: center; gap: 3px; }
                .sm-card-verified { display: flex; align-items: center; gap: 3px; font-size: 10px; color: #6b7280; font-weight: 500; }
                .sm-verified-dot { width: 6px; height: 6px; background: #16a34a; border-radius: 50%; }
                .sm-card-cta {
                    background: linear-gradient(135deg, #6B1152, #8B1A6B);
                    color: #fff; border: none; border-radius: 8px; font-size: 12px;
                    font-weight: 700; padding: 9px 12px; width: 100%; cursor: pointer;
                    display: flex; align-items: center; justify-content: center; gap: 6px;
                    transition: all 0.2s; font-family: 'DM Sans', sans-serif; text-transform: uppercase; letter-spacing: 0.5px;
                }
                .sm-card-cta:hover { background: linear-gradient(135deg, #FFD200, #FFA500); color: #1a1a2e; }

                /* ── PROMO BANNER ── */
                .sm-promo {
                    max-width: 1280px; margin: 0 auto 28px; padding: 0 20px;
                    display: grid; grid-template-columns: 1fr; gap: 14px;
                }
                @media (min-width: 640px) { .sm-promo { grid-template-columns: 1fr 1fr; } }
                .sm-promo-card {
                    border-radius: 16px; padding: 20px 24px; overflow: hidden;
                    position: relative; min-height: 90px; display: flex; align-items: center; justify-content: space-between;
                    cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;
                }
                .sm-promo-card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.15); }
                .sm-promo-text h3 { font-size: 16px; font-weight: 800; color: #fff; font-family: 'Playfair Display', serif; margin-bottom: 4px; }
                .sm-promo-text p { font-size: 12px; color: rgba(255,255,255,0.8); }
                .sm-promo-icon { color: rgba(255,255,255,0.25); }

                /* ── EMPTY STATE ── */
                .sm-empty { text-align: center; padding: 60px 20px; }
                .sm-empty-icon { color: #d1d5db; margin-bottom: 16px; }
                .sm-empty h3 { font-size: 18px; font-weight: 700; color: #374151; margin-bottom: 8px; font-family: 'Playfair Display', serif; }
                .sm-empty p { font-size: 14px; color: #9ca3af; }

                /* ── FOOTER PUSH ── */
                .sm-footer-push { height: 40px; }

                /* ── MOBILE LOGO HIDE ── */
                @media (max-width: 480px) {
                    .sm-logo-text-wrap { display: none; }
                    .sm-hero-title { font-size: 1.5rem; }
                    .sm-hero { padding: 20px 16px 48px; }
                    .sm-hero-stats { gap: 16px; }
                }
                @media (max-width: 360px) {
                    .sm-card-img { height: 100px; }
                }
            `}</style>

            {/* ── HEADER ── */}
            <header className="sm-header" role="banner">
                <div className="sm-header-inner">
                    <div className="sm-logo" onClick={() => navigate('/sathi-market')} aria-label="SathiMarket Home">
                        <div className="sm-logo-badge">
                            {/* <ShoppingBag size={20} color="#FFD200" /> */}
                            <img src={SathiLogo} alt="SathiMarket Logo" className="sathi-logo"/>
                        </div>                       
                    </div>

                    <div className="sm-search-wrap">
                        <Search size={16} className="sm-search-icon" />
                        <input
                            type="search"
                            className="sm-search"
                            placeholder="Search shops, categories..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            aria-label="Search shops and categories"
                            autoComplete="off"
                        />
                    </div>                   
                </div>
            </header>

            {/* ── HERO ── */}
            <section className="sm-hero" aria-label="Marketplace intro">
                <h1 className="sm-hero-title">Your Local <span>Marketplace</span></h1>
                <p className="sm-hero-sub">Verified shops · Fast delivery · Trusted by locals</p>
                <div className="sm-hero-stats">
                    <div className="sm-stat">
                        <div className="sm-stat-n">{shops.length}+</div>
                        <div className="sm-stat-l">Shops</div>
                    </div>
                    <div className="sm-stat">
                        <div className="sm-stat-n">{categories.length - 1}</div>
                        <div className="sm-stat-l">Categories</div>
                    </div>
                    <div className="sm-stat">
                        <div className="sm-stat-n">100%</div>
                        <div className="sm-stat-l">Verified</div>
                    </div>
                </div>
            </section>

            {/* ── CATEGORY NAV ── */}
            <nav className="sm-cat-wrap" aria-label="Shop categories">
                <div className="sm-cat-inner">
                    <div className="sm-cat-scroll" role="list">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={`sm-cat-btn ${selectedCategory === cat ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(cat)}
                                role="listitem"
                                aria-pressed={selectedCategory === cat}
                            >
                                {cat === "All" ? <><Sparkles size={13} /> All Shops</> : cat}
                            </button>
                        ))}
                    </div>
                </div>
            </nav>

            {/* ── PROMO BANNERS ── */}
            {selectedCategory === "All" && !searchTerm && (
                <div className="sm-promo" aria-label="Promotions">
                    <div
                        className="sm-promo-card"
                        style={{ background: 'linear-gradient(135deg, #f7971e, #ffd200)' }}
                        onClick={() => setSelectedCategory(categories.find(c => c.toLowerCase().includes('grocery')) || 'All')}
                    >
                        <div className="sm-promo-text">
                            <h3>Fresh Groceries</h3>
                            <p>Order from local kirana stores</p>
                        </div>
                        <Store size={52} className="sm-promo-icon" />
                    </div>
                    <div
                        className="sm-promo-card"
                        style={{ background: 'linear-gradient(135deg, #11998e, #38ef7d)' }}
                        onClick={() => setSelectedCategory(categories.find(c => c.toLowerCase().includes('medical')) || 'All')}
                    >
                        <div className="sm-promo-text">
                            <h3>Health & Medicines</h3>
                            <p>Certified pharmacies near you</p>
                        </div>
                        <Stethoscope size={52} className="sm-promo-icon" />
                    </div>
                </div>
            )}

            {/* ── SHOP GRID ── */}
            <section className="sm-section" aria-label="Shop listings">
                <div className="sm-section-head">
                    <h2 className="sm-section-title">
                        {selectedCategory === "All" ? <><span>All</span> Shops</> : <><span>{selectedCategory}</span> Shops</>}
                    </h2>
                    <span className="sm-section-count">{filteredShops.length} found</span>
                </div>

                {filteredShops.length > 0 ? (
                    <div className="sm-grid" role="list">
                        {filteredShops.map((shop) => {
                            const id = shop.shopID || shop.ShopID;
                            const imgUrl = getShopImageUrl(shop.shopImage || shop.ShopImage);
                            const meta = getCategoryMeta(shop.categoryName);
                            const inWishlist = wishlist.has(id);

                            return (
                                <article
                                    key={id}
                                    className="sm-card"
                                    onClick={() => navigate(`/shop-details/${id}`)}
                                    role="listitem"
                                    aria-label={`${shop.shopName} – ${shop.categoryName || 'Shop'}`}
                                >
                                    {/* Image */}
                                    <div className="sm-card-img">
                                        {imgUrl ? (
                                            <img
                                                src={imgUrl}
                                                alt={`${shop.shopName} store front`}
                                                loading="lazy"
                                                onError={(e) => {
                                                    e.target.parentElement.innerHTML = `<div class="sm-card-img-fallback" style="background:${meta.gradient}">${meta.icon.type ? '' : ''}</div>`;
                                                }}
                                            />
                                        ) : (
                                            <div className="sm-card-img-fallback" style={{ background: meta.gradient }}>
                                                {meta.icon}
                                            </div>
                                        )}

                                        {/* Category badge */}
                                        {shop.categoryName && (
                                            <span className="sm-card-badge" style={{ background: meta.badge }}>
                                                {shop.categoryName}
                                            </span>
                                        )}

                                        {/* Wishlist */}
                                        <button
                                            className={`sm-wishlist-btn ${inWishlist ? 'active' : ''}`}
                                            onClick={(e) => toggleWishlist(e, id)}
                                            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                                        >
                                            <Heart size={14} color={inWishlist ? '#ef4444' : '#9ca3af'} fill={inWishlist ? '#ef4444' : 'none'} />
                                        </button>
                                    </div>

                                    {/* Body */}
                                    <div className="sm-card-body">
                                        <p className="sm-card-cat">{shop.categoryName || 'General'}</p>
                                        <h3 className="sm-card-name" title={shop.shopName}>{shop.shopName}</h3>

                                        <div className="sm-card-meta">
                                            <div className="sm-card-rating">
                                                <span className="sm-rating-badge">
                                                    4.2 <Star size={8} fill="white" />
                                                </span>
                                            </div>
                                            <div className="sm-card-verified">
                                                <span className="sm-verified-dot" />
                                                Verified
                                            </div>
                                        </div>

                                        <button className="sm-card-cta" aria-label={`Visit ${shop.shopName}`}>
                                            Visit Store <ArrowRight size={13} />
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                ) : (
                    <div className="sm-empty" role="status">
                        <ShoppingBag size={56} className="sm-empty-icon" />
                        <h3>No shops found</h3>
                        <p>Try a different search term or browse all categories.</p>
                        <button
                            onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                            style={{
                                marginTop: 16, padding: '10px 24px', borderRadius: 8,
                                background: '#8B1A6B', color: '#fff', border: 'none',
                                fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: 14
                            }}
                        >
                            Browse All Shops
                        </button>
                    </div>
                )}
            </section>

            <div className="sm-footer-push" />
        </main>
    );
};

export default SathiMarket;