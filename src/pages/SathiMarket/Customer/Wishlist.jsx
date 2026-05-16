import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
    Heart, Trash2, ShoppingCart, ArrowLeft, 
    ShoppingBag, Star, ChevronRight 
} from 'lucide-react';
import { useCart } from '../../../context/CartContext'; // Assuming you have a cart context
import { toast } from 'react-toastify';

const Wishlist = () => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [wishlistItems, setWishlistItems] = useState([]);
    const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_URL;

    // Load wishlist from localStorage on mount
    useEffect(() => {
        const storedWishlist = JSON.parse(localStorage.getItem('customerWishlist') || '[]');
        setWishlistItems(storedWishlist);
    }, []);

    const removeFromWishlist = (id) => {
        const updated = wishlistItems.filter(item => (item.itemID || item.ItemID) !== id);
        setWishlistItems(updated);
        localStorage.setItem('customerWishlist', JSON.stringify(updated));
        toast.info("Removed from wishlist");
    };

    const handleMoveToCart = (item) => {
        addToCart(item);
        removeFromWishlist(item.itemID || item.ItemID);
        toast.success("Moved to basket!");
    };

    const getMediaUrl = (mediaList) => {
        const DEFAULT_IMAGE = "https://placehold.co/400x400?text=No+Image";
        if (!mediaList || mediaList.length === 0) return DEFAULT_IMAGE;

        const primary = mediaList.find(m => m.isPrimary || m.IsPrimary) || mediaList[0];
        let path = primary.mediaURL || primary.MediaURL;

        if (!path) return DEFAULT_IMAGE;
        if (path.startsWith("http")) return path;

        path = path.replace(/\\/g, '/').replace(/^\/?wwwroot/i, "");
        const cleanPath = path.startsWith("/") ? path : `/${path}`;
        const cleanBase = IMAGE_BASE_URL?.endsWith("/") ? IMAGE_BASE_URL.slice(0, -1) : IMAGE_BASE_URL;

        return `${cleanBase}${cleanPath}`;
    };

    return (
        <main className="min-vh-100 pb-5" style={{ backgroundColor: '#f8f9fa' }}>
            <Helmet>
                <title>My Wishlist | VillageSathi Market</title>
            </Helmet>

            <style>{`
                .slim-header { background: #721a61; color: white; padding: 15px 0; border-bottom: 3px solid #ffc200; position: sticky; top: 0; z-index: 1000; }
                .wishlist-card { background: white; border-radius: 12px; border: 1px solid #eee; overflow: hidden; transition: 0.3s; }
                .wishlist-card:hover { border-color: #721a61; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
                .img-box { width: 100%; height: 180px; background: #fafafa; position: relative; }
                .img-box img { width: 100%; height: 100%; object-fit: contain; padding: 10px; }
                .btn-add-cart { background: #721a61; color: white; border: none; font-weight: 700; font-size: 13px; width: 100%; padding: 10px; border-radius: 0 0 0 0; transition: 0.2s; }
                .btn-add-cart:hover { opacity: 0.9; }
                .remove-icon { position: absolute; top: 10px; right: 10px; background: white; color: #ff4d4d; padding: 6px; border-radius: 50%; box-shadow: 0 2px 5px rgba(0,0,0,0.1); cursor: pointer; z-index: 5; }
            `}</style>

            <header className="slim-header shadow-sm">
                <div className="container d-flex align-items-center">
                    <button onClick={() => navigate(-1)} className="btn text-white p-0 me-3 border-0 shadow-none"><ArrowLeft size={24}/></button>
                    <h1 className="h6 mb-0 fw-bold">My Wishlist ({wishlistItems.length})</h1>
                </div>
            </header>

            <div className="container mt-4">
                {wishlistItems.length > 0 ? (
                    <div className="row g-3 g-md-4">
                        {wishlistItems.map((item) => (
                            <div className="col-6 col-md-4 col-lg-3 col-xl-2" key={item.itemID || item.ItemID}>
                                <div className="wishlist-card h-100 d-flex flex-column">
                                    <div className="img-box">
                                        <div className="remove-icon" onClick={() => removeFromWishlist(item.itemID || item.ItemID)}>
                                            <Trash2 size={16} />
                                        </div>
                                        <img 
                                            src={getMediaUrl(item.mediaList || item.MediaList)} 
                                            alt={item.itemName}
                                            onError={(e) => { e.target.src = "https://placehold.co/400x400?text=Product"; }}
                                        />
                                    </div>
                                    <div className="p-3 flex-grow-1">
                                        <h2 className="small fw-bold text-dark text-truncate mb-1">{item.itemName || item.ItemName}</h2>
                                        <div className="d-flex align-items-center gap-1 mb-2">
                                            <span className="badge bg-success" style={{fontSize: '9px'}}>4.2 <Star size={8} fill="white" /></span>
                                            <span className="text-muted extra-small" style={{fontSize: '10px'}}>Sathi Assured</span>
                                        </div>
                                        <div className="fw-bold text-dark">₹{item.price || item.Price}</div>
                                    </div>
                                    <button className="btn-add-cart d-flex align-items-center justify-content-center gap-2" onClick={() => handleMoveToCart(item)}>
                                        <ShoppingCart size={16} /> Add to Basket
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-5 bg-white rounded-4 border border-dashed">
                        <div className="mb-3 d-inline-block p-4 rounded-circle" style={{ backgroundColor: '#fdf0f9' }}>
                            <Heart size={50} style={{ color: '#721a61' }} />
                        </div>
                        <h5 className="fw-bold">Your wishlist is empty!</h5>
                        <p className="text-muted small">Save items you like to buy them later.</p>
                        <Link to="/sathi-market" className="btn text-white px-4 fw-bold mt-2" style={{ backgroundColor: '#721a61' }}>
                            Discover Products
                        </Link>
                    </div>
                )}
            </div>
        </main>
    );
};

export default Wishlist;