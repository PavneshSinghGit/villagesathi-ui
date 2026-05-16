import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ShoppingBag, Minus, Plus, PlayCircle, Star, ShieldCheck, Truck, Zap, BadgeCheck, Heart } from 'lucide-react';

const ProductDetailsModal = ({ isOpen, item, onClose, onAddToCart }) => {
    const [quantity, setQuantity] = useState(1);
    const [activeMedia, setActiveMedia] = useState(null);
    const [imgErr, setImgErr] = useState(false);

    const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_URL;
    const PLACEHOLDER = 'https://placehold.co/600x600/fdf4fb/8B1A6B?text=No+Image';

    const formatMediaUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        let path = url.replace(/\\/g, '/').replace(/^\/?wwwroot/i, '');
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        const cleanBase = IMAGE_BASE_URL?.endsWith('/') ? IMAGE_BASE_URL.slice(0, -1) : IMAGE_BASE_URL;
        return `${cleanBase}${cleanPath}`;
    };

    useEffect(() => {
        if (item && isOpen) {
            setQuantity(1);
            setImgErr(false);
            const mediaList = item.mediaList || item.MediaList || [];
            const primary = mediaList.find(m => m.isPrimary || m.IsPrimary) || mediaList[0];
            if (primary) {
                const url = formatMediaUrl(primary.mediaURL || primary.MediaURL);
                setActiveMedia({ url: url || PLACEHOLDER, type: (primary.mediaType || primary.MediaType || 'IMAGE').toUpperCase() });
            } else {
                setActiveMedia({ url: PLACEHOLDER, type: 'IMAGE' });
            }
            document.body.style.overflow = 'hidden';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [item, isOpen]);

    if (!isOpen || !item) return null;

    const price = item.price || item.Price || 0;
    const mrp = Math.round(price * 1.18);
    const save = Math.round(((mrp - price) / mrp) * 100);
    const mediaList = item.mediaList || item.MediaList || [];

    return createPortal(
        <>
            <style>{`
                .pdm-overlay{
                    position:fixed;inset:0;
                    background:rgba(10,4,8,0.72);
                    display:flex;align-items:flex-end;justify-content:center;
                    z-index:999999;
                    animation:pdm-fadein 0.2s ease;
                }
                @media(min-width:600px){
                    .pdm-overlay{align-items:center;padding:20px}
                }
                @keyframes pdm-fadein{from{opacity:0}to{opacity:1}}

                .pdm-sheet{
                    position:relative;background:#fff;
                    width:100%;max-width:820px;
                    border-radius:22px 22px 0 0;
                    max-height:92vh;overflow-y:auto;
                    animation:pdm-slideup 0.28s cubic-bezier(0.34,1.2,0.64,1);
                    font-family:'Outfit','DM Sans',system-ui,sans-serif;
                    display:flex;flex-direction:column;
                }
                @media(min-width:600px){
                    .pdm-sheet{border-radius:20px;max-height:88vh}
                }
                @keyframes pdm-slideup{from{transform:translateY(60px);opacity:0}to{transform:translateY(0);opacity:1}}

                /* drag handle (mobile) */
                .pdm-handle{
                    width:36px;height:4px;border-radius:4px;background:#e0dbd8;
                    margin:10px auto 0;flex-shrink:0;
                }
                @media(min-width:600px){.pdm-handle{display:none}}

                .pdm-close{
                    position:absolute;top:14px;right:14px;z-index:10;
                    width:32px;height:32px;border-radius:50%;border:1.5px solid #ece9e4;
                    background:#fafaf8;cursor:pointer;display:flex;align-items:center;justify-content:center;
                    color:#7a7068;transition:all 0.18s;
                }
                .pdm-close:hover{background:#fdf5fc;border-color:#8B1A6B;color:#8B1A6B}

                /* inner layout */
                .pdm-body{display:flex;flex-direction:column}
                @media(min-width:600px){.pdm-body{flex-direction:row}}

                /* ── LEFT: media ── */
                .pdm-media-col{
                    background:#fdf4fb;
                    padding:16px;display:flex;flex-direction:column;align-items:center;gap:10px;
                    flex-shrink:0;
                }
                @media(min-width:600px){.pdm-media-col{width:42%;border-right:1px solid #f0efec;padding:24px}}

                .pdm-main-img-wrap{
                    width:100%;aspect-ratio:1/1;max-height:260px;
                    background:#fff;border-radius:14px;overflow:hidden;
                    display:flex;align-items:center;justify-content:center;
                    border:1.5px solid #f0efec;
                }
                @media(min-width:600px){.pdm-main-img-wrap{max-height:300px}}
                .pdm-main-img-wrap img{max-width:100%;max-height:100%;object-fit:contain}
                .pdm-main-img-wrap video{width:100%;height:100%;object-fit:contain}

                .pdm-thumbs{display:flex;gap:7px;overflow-x:auto;padding:2px 0;scrollbar-width:none;justify-content:center;flex-wrap:wrap}
                .pdm-thumbs::-webkit-scrollbar{display:none}
                .pdm-thumb{
                    width:52px;height:52px;border-radius:9px;border:2px solid #ece9e4;
                    background:#fff;cursor:pointer;overflow:hidden;flex-shrink:0;
                    display:flex;align-items:center;justify-content:center;
                    transition:border-color 0.18s;position:relative;
                }
                .pdm-thumb.active{border-color:#8B1A6B;box-shadow:0 0 0 2px rgba(139,26,107,0.15)}
                .pdm-thumb img,.pdm-thumb video{width:100%;height:100%;object-fit:contain}
                .pdm-play-ico{position:absolute;color:rgba(255,255,255,0.85);pointer-events:none}

                /* ── RIGHT: info ── */
                .pdm-info-col{flex:1;padding:16px;overflow-y:auto}
                @media(min-width:600px){.pdm-info-col{padding:24px 28px}}

                .pdm-tag{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:20px;background:#fdf0f9;color:#8B1A6B;font-size:10px;font-weight:700;border:1px solid #e8c0e0;margin-bottom:8px}
                .pdm-name{font-family:'Cormorant Garamond',Georgia,serif;font-size:1.3rem;font-weight:700;color:#1a0a14;line-height:1.3;margin-bottom:10px}
                @media(min-width:600px){.pdm-name{font-size:1.5rem}}

                .pdm-price-row{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;margin-bottom:6px}
                .pdm-price{font-family:'Cormorant Garamond',Georgia,serif;font-size:1.7rem;font-weight:700;color:#8B1A6B;line-height:1}
                .pdm-mrp{font-size:12px;color:#b0a8aa;text-decoration:line-through}
                .pdm-save{font-size:11.5px;font-weight:700;color:#16a34a;background:#f0fdf4;padding:2px 8px;border-radius:20px}

                .pdm-perks{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0 14px}
                .pdm-perk{display:flex;align-items:center;gap:4px;font-size:11px;font-weight:600;color:#16a34a;background:#f0fdf4;padding:4px 10px;border-radius:20px}

                .pdm-desc{font-size:13px;color:#7a7068;line-height:1.65;margin-bottom:16px;border-top:1px solid #f0efec;padding-top:14px}

                /* qty */
                .pdm-qty-label{font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:#a0879a;margin-bottom:7px}
                .pdm-qty-row{display:flex;align-items:center;gap:0;border:1.5px solid #ece9e4;border-radius:10px;width:fit-content;overflow:hidden;margin-bottom:16px}
                .pdm-qty-btn{
                    width:36px;height:36px;border:none;background:#fafaf8;cursor:pointer;
                    display:flex;align-items:center;justify-content:center;color:#4a3040;
                    transition:background 0.15s;font-family:inherit;
                }
                .pdm-qty-btn:hover{background:#fdf5fc;color:#8B1A6B}
                .pdm-qty-val{padding:0 14px;font-size:14px;font-weight:700;color:#1a0a14;border-left:1px solid #ece9e4;border-right:1px solid #ece9e4;line-height:36px}

                /* CTA */
                .pdm-cta{
                    width:100%;padding:13px 20px;border:none;border-radius:12px;cursor:pointer;
                    background:linear-gradient(135deg,#6B1152,#8B1A6B);color:#fff;
                    font-family:inherit;font-size:14px;font-weight:800;text-transform:uppercase;letter-spacing:0.5px;
                    display:flex;align-items:center;justify-content:center;gap:8px;
                    transition:all 0.22s;box-shadow:0 4px 16px rgba(139,26,107,0.3);
                }
                .pdm-cta:hover{background:linear-gradient(135deg,#FFD200,#FFA500);color:#1a1a2e;box-shadow:0 4px 16px rgba(255,165,0,0.35)}
                .pdm-cta-total{opacity:0.8;font-size:12px;font-weight:600;margin-left:4px}
            `}</style>

            <div className="pdm-overlay" onClick={onClose}>
                <div className="pdm-sheet" onClick={e => e.stopPropagation()}>
                    <div className="pdm-handle" />
                    <button className="pdm-close" onClick={onClose} aria-label="Close">
                        <X size={15} />
                    </button>

                    <div className="pdm-body">
                        {/* ── LEFT: Media ── */}
                        <div className="pdm-media-col">
                            <div className="pdm-main-img-wrap">
                                {activeMedia?.type === 'VIDEO' ? (
                                    <video
                                        key={activeMedia.url}
                                        src={activeMedia.url}
                                        controls autoPlay muted loop
                                        onError={e => e.target.parentElement.innerHTML = '<p style="color:#aaa;font-size:13px">Video unavailable</p>'}
                                    />
                                ) : (
                                    <img
                                        src={imgErr ? PLACEHOLDER : (activeMedia?.url || PLACEHOLDER)}
                                        alt={item.itemName || 'Product'}
                                        onError={() => setImgErr(true)}
                                    />
                                )}
                            </div>

                            {mediaList.length > 1 && (
                                <div className="pdm-thumbs">
                                    {mediaList.map((m, i) => {
                                        const mType = (m.mediaType || m.MediaType || 'IMAGE').toUpperCase();
                                        const mUrl = formatMediaUrl(m.mediaURL || m.MediaURL) || PLACEHOLDER;
                                        const isActive = activeMedia?.url === mUrl;
                                        return (
                                            <div
                                                key={i}
                                                className={`pdm-thumb ${isActive ? 'active' : ''}`}
                                                onClick={() => setActiveMedia({ url: mUrl, type: mType })}
                                            >
                                                {mType === 'VIDEO' ? (
                                                    <>
                                                        <video src={mUrl} />
                                                        <PlayCircle size={18} className="pdm-play-ico" />
                                                    </>
                                                ) : (
                                                    <img src={mUrl} alt={`View ${i + 1}`} onError={e => { e.target.onerror = null; e.target.src = PLACEHOLDER; }} />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* ── RIGHT: Info ── */}
                        <div className="pdm-info-col">
                            <div className="pdm-tag"><BadgeCheck size={10} /> Sathi Verified</div>
                            <h2 className="pdm-name">{item.itemName || item.ItemName}</h2>

                            <div className="pdm-price-row">
                                <span className="pdm-price">₹{price.toLocaleString('en-IN')}</span>
                                <span className="pdm-mrp">MRP ₹{mrp.toLocaleString('en-IN')}</span>
                                <span className="pdm-save">{save}% off</span>
                            </div>

                            <div className="pdm-perks">
                                <span className="pdm-perk"><Truck size={11} /> Free Delivery</span>
                                <span className="pdm-perk"><ShieldCheck size={11} /> Quality Assured</span>
                                <span className="pdm-perk"><Zap size={11} /> Quick Dispatch</span>
                            </div>

                            {(item.itemDescription || item.ItemDescription) && (
                                <p className="pdm-desc">{item.itemDescription || item.ItemDescription}</p>
                            )}

                            <div className="pdm-qty-label">Quantity</div>
                            <div className="pdm-qty-row">
                                <button className="pdm-qty-btn" onClick={() => setQuantity(q => Math.max(1, q - 1))} aria-label="Decrease">
                                    <Minus size={14} />
                                </button>
                                <span className="pdm-qty-val">{quantity}</span>
                                <button className="pdm-qty-btn" onClick={() => setQuantity(q => q + 1)} aria-label="Increase">
                                    <Plus size={14} />
                                </button>
                            </div>

                            <button
                                className="pdm-cta"
                                onClick={() => { onAddToCart({ ...item, quantity }); onClose(); }}
                            >
                                <ShoppingBag size={16} />
                                Add to Cart
                                <span className="pdm-cta-total">• ₹{(price * quantity).toLocaleString('en-IN')}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>,
        document.body
    );
};

export default ProductDetailsModal;