import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ShoppingCart, Minus, Plus, PlayCircle } from 'lucide-react';

const ProductDetailsModal = ({ isOpen, item, onClose, onAddToCart }) => {
    const [quantity, setQuantity] = useState(1);
    const [activeMedia, setActiveMedia] = useState(null);

    const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_URL;
    
    // Yahan placeholder images define karein (Aap apne local assets use kar sakte hain)
    const PLACEHOLDER_IMAGE = "https://placehold.co/600x600?text=VillageSathi+Product";
    const PLACEHOLDER_THUMB = "https://placehold.co/100x100?text=Thumb";

    const formatMediaUrl = (url) => {
        if (!url) return null; // Logic needs change to support thumb fallback
        if (url.startsWith("http")) return url;
        let path = url.replace(/\\/g, '/').replace(/^\/?wwwroot/i, "");
        const cleanPath = path.startsWith("/") ? path : `/${path}`;
        const cleanBase = IMAGE_BASE_URL?.endsWith("/") ? IMAGE_BASE_URL.slice(0, -1) : IMAGE_BASE_URL;
        return `${cleanBase}${cleanPath}`;
    };

    useEffect(() => {
        if (item && isOpen) {
            setQuantity(1);
            const mediaList = item.mediaList || item.MediaList || [];
            const primary = mediaList.find(m => m.isPrimary || m.IsPrimary) || mediaList[0];
            
            if (primary) {
                const url = formatMediaUrl(primary.mediaURL || primary.MediaURL);
                setActiveMedia({
                    url: url || PLACEHOLDER_IMAGE, // DB url but broken URL check in JSX
                    type: (primary.mediaType || primary.MediaType || 'IMAGE').toUpperCase()
                });
            } else {
                setActiveMedia({ url: PLACEHOLDER_IMAGE, type: 'IMAGE' });
            }

            document.body.style.overflow = 'hidden';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [item, isOpen, PLACEHOLDER_IMAGE]);

    if (!isOpen || !item) return null;

    // Helper to get fallback thumbs
    const getThumbUrl = (m, type) => {
        const url = formatMediaUrl(m.mediaURL || m.MediaURL);
        if (!url) {
            return type === 'VIDEO' ? null : PLACEHOLDER_THUMB;
        }
        return url;
    };

    return createPortal(
        <>
            <style>{`
                .modal-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.7); display: flex; justify-content: center; align-items: center; z-index: 999999; padding: 20px; }
                .modal-container { position: relative; background: white; width: 100%; max-width: 850px; max-height: 90vh; overflow-y: auto; border-radius: 12px; display: flex; flex-direction: column; }
                .media-display-area { width: 100%; height: 350px; background: #fff; border-radius: 8px; overflow: hidden; display: flex; align-items: center; justify-content: center; }
                .thumb-wrapper { position: relative; width: 60px; height: 60px; margin: 0 4px; }
                .thumbnail-item { width: 100%; height: 100%; object-fit: contain; border-radius: 6px; cursor: pointer; border: 2px solid #eee; background: white; }
                .thumbnail-item.active { border: 2px solid #ff9f00; }
                .video-indicator { position: absolute; top: 50%; start: 50%; transform: translate(-50%, -50%); color: rgba(255, 255, 255, 0.8); pointer-events: none; }
                .no-media-msg { color: #888; font-weight: bold; font-size: 1.2rem; }
            `}</style>

            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                    <button onClick={onClose} className="btn btn-dark rounded-circle" style={{ position: 'absolute', right: '15px', top: '15px', zIndex: 10, padding: '6px' }}>
                        <X size={20} />
                    </button>

                    <div className="row g-0">
                        {/* LEFT: Media Section */}
                        <div className="col-md-5 p-4 border-end bg-light">
                            <div className="media-display-area mb-3">
                                {activeMedia?.type === 'VIDEO' ? (
                                    <video 
                                        key={activeMedia.url}
                                        src={activeMedia.url} 
                                        controls 
                                        autoPlay 
                                        muted 
                                        loop 
                                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                        onError={(e) => {
                                            // Handle broken video URL - treat as no image fallback
                                            e.target.parentElement.innerHTML = `<div class="no-media-msg">No Media Available</div>`;
                                        }}
                                    />
                                ) : (
                                    <img 
                                        src={activeMedia?.url} 
                                        alt="Product"
                                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                        onError={(e) => { 
                                            e.target.onerror = null; 
                                            e.target.src = PLACEHOLDER_IMAGE; // Broken image fallback
                                        }}
                                    />
                                )}
                            </div>

                            {/* Thumbnails */}
                            <div className="d-flex gap-2 overflow-auto justify-content-center pt-2">
                                {(item.mediaList || item.MediaList || []).map((m, i) => {
                                    const mType = (m.mediaType || m.MediaType || 'IMAGE').toUpperCase();
                                    const mUrl = getThumbUrl(m, mType);

                                    return (
                                        <div key={i} className="thumb-wrapper" onClick={() => setActiveMedia({ url: mUrl || PLACEHOLDER_IMAGE, type: mType })}>
                                            {mType === 'VIDEO' ? (
                                                <>
                                                    {mUrl ? (
                                                         <video src={mUrl} className={`thumbnail-item ${activeMedia?.url === mUrl ? 'active' : ''}`} />
                                                    ) : (
                                                         <div className={`thumbnail-item d-flex align-items-center justify-content-center bg-white ${activeMedia?.url === PLACEHOLDER_IMAGE ? 'active' : ''}`}>Broken Video</div>
                                                    )}
                                                    <PlayCircle size={20} className="video-indicator" />
                                                </>
                                            ) : (
                                                <img 
                                                    src={mUrl} 
                                                    className={`thumbnail-item ${activeMedia?.url === mUrl ? 'active' : ''}`} 
                                                    alt="thumb"
                                                    onError={(e) => { 
                                                        e.target.onerror = null; 
                                                        e.target.src = PLACEHOLDER_THUMB; // Broken thumb fallback
                                                    }}
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* RIGHT: Product Details */}
                        <div className="col-md-7 p-4 p-lg-5">
                            <h2 className="h4 fw-bold">{item.itemName || item.ItemName}</h2>
                            <div className="h2 fw-bold text-dark my-3">₹{item.price || item.Price}</div>
                            <p className="text-secondary">{item.itemDescription || item.ItemDescription}</p>

                            <div className="mt-4">
                                <label className="small fw-bold text-uppercase text-muted mb-2 d-block">Quantity</label>
                                <div className="d-flex align-items-center border rounded-2" style={{width: 'fit-content'}}>
                                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="btn border-0 px-3"><Minus size={16}/></button>
                                    <span className="px-3 fw-bold">{quantity}</span>
                                    <button onClick={() => setQuantity(q => q + 1)} className="btn border-0 px-3"><Plus size={16}/></button>
                                </div>
                            </div>

                            <button
                                className="btn btn-warning w-100 mt-4 py-3 fw-bold"
                                style={{ background: '#ff9f00', color: 'white', border: 'none', borderRadius: '4px' }}
                                onClick={() => { onAddToCart({ ...item, quantity }); onClose(); }}
                            >
                                <ShoppingCart size={18} className="me-2" /> 
                                ADD TO BASKET • ₹{(item.price || item.Price) * quantity}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    , document.body);
};

export default ProductDetailsModal;