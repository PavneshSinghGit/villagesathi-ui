import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../api/axiosInstance';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    Boxes, PlusCircle, Search, Trash2, Eye, MoreVertical,
    PackagePlus, IndianRupee, Loader2, Info,
    Image as ImageIcon, Video, X, UploadCloud
} from 'lucide-react';

/* ─────────────────────────────────────────────
   SATHIMARKET EXACT COLOR TOKENS
   Matched pixel-perfect from screenshot:
   Navbar deep magenta → #3D0030 / #6B0F4A / #8C1560
   Gold accent          → #D4A017 / #F5C518
   Dark panel           → #1C1230
   Page lavender bg     → #F5F0FF
   Card white           → #FFFFFF
   Purple text          → #5B2D8E
───────────────────────────────────────────── */

const SM = {
    bgDeep: '#3D0030',
    bgMid: '#6B0F4A',
    bgLight: '#8C1560',
    gold: '#D4A017',
    goldBright: '#F5C518',
    goldSoft: 'rgba(212,160,23,0.12)',
    darkPanel: '#1C1230',
    pageBg: '#F5F0FF',
    purpleText: '#5B2D8E',
    purpleSoft: '#EDE9FF',
    white: '#FFFFFF',
    border: 'rgba(91,45,142,0.15)',
    mutedText: '#8B6FAE',
};

const ManageInventory = () => {
    const { user, isBusiness, loading } = useAuth();
    const navigate = useNavigate();

    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [newItem, setNewItem] = useState({ itemName: '', price: '', itemDescription: '' });
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [dataLoading, setDataLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const shopId = user?.shopId || user?.ShopId;

    useEffect(() => {
        if (loading) return;
        if (!isBusiness || !shopId) { navigate('/merchant-login', { replace: true }); return; }
        fetchItems();
    }, [loading, isBusiness, shopId]);

    const fetchItems = async () => {
        try {
            const res = await axiosInstance.get(`/ShopItems/GetByShop/${shopId}`);
            const data = res.data?.Data || res.data || [];
            setItems(Array.isArray(data) ? data : []);
        } catch { toast.error('Failed to load inventory'); }
        finally { setDataLoading(false); }
    };

    const handleFileChange = (e) => {
        setSelectedFiles(prev => [...prev, ...Array.from(e.target.files)]);
    };
    const removeFile = (i) => setSelectedFiles(prev => prev.filter((_, idx) => idx !== i));

    const handleAddItem = async (e) => {
        e.preventDefault();
        if (!selectedFiles.length) { toast.warning('Please upload at least one product image'); return; }
        setSubmitting(true);
        const fd = new FormData();
        fd.append('ShopID', Number(shopId));
        fd.append('ItemName', newItem.itemName);
        fd.append('ItemDescription', newItem.itemDescription || '');
        fd.append('Price', parseFloat(newItem.price));
        fd.append('IsAvailable', true);
        fd.append('IsActive', true);
        selectedFiles.forEach(f => fd.append('mediaFiles', f));
        try {
            await axiosInstance.post('/ShopItems/AddItem', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            toast.success('Product added to catalog!');
            setNewItem({ itemName: '', price: '', itemDescription: '' });
            setSelectedFiles([]);
            fetchItems();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add product');
        } finally { setSubmitting(false); }
    };

    const handleDeleteItem = async (itemId) => {

        if (!window.confirm('Confirm deletion of this product?')) return;

        try {

            const response = await axiosInstance.post(
                `/ShopItems/DeleteItem`,
                { id: itemId },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data?.success) {

                setItems(prev =>
                    prev.filter(item => item.itemID !== itemId)
                );

                toast.success(response.data.message);
            }
            else {
                toast.error('Delete failed');
            }

        } catch (error) {

            console.error(error);
            toast.error('Delete failed');
        }
    };

    const getMediaUrl = (url) => {
        if (!url || url === '' || url.includes('null')) return null;
        const base = axiosInstance.defaults.baseURL.split('/api')[0];
        return `${base}${url}`;
    };

    const filteredItems = items.filter(item =>
        item.itemName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading || dataLoading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: SM.pageBg }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: `linear-gradient(135deg, ${SM.bgDeep}, ${SM.bgMid})`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, boxShadow: `0 8px 24px rgba(61,0,48,0.3)` }}>
                    <Loader2 size={28} color={SM.goldBright} style={{ animation: 'spin 1s linear infinite' }} />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', color: SM.mutedText }}>
                    Loading Inventory...
                </span>
                <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: SM.pageBg, minHeight: '100vh', padding: '24px 16px' }}>
            <style>{`
                /* ── SATHIMARKET INVENTORY STYLES ── */
                .inv-wrap { max-width: 1200px; margin: 0 auto; }

                /* Hero Banner */
                .inv-hero {
                    background: linear-gradient(135deg, ${SM.bgDeep} 0%, ${SM.bgMid} 55%, ${SM.bgLight} 100%);
                    border-radius: 20px;
                    padding: 28px 32px;
                    border-bottom: 3px solid ${SM.gold};
                    box-shadow: 0 12px 40px rgba(61,0,48,0.28);
                    margin-bottom: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    gap: 16px;
                }
                .inv-hero-left    { display: flex; align-items: center; gap: 18px; }
                .inv-hero-icon    { width: 54px; height: 54px; border-radius: 14px; background: rgba(212,160,23,0.18); border: 1.5px solid rgba(212,160,23,0.35); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
                .inv-hero-title   { font-size: 1.3rem; font-weight: 900; color: #fff; margin: 0 0 4px; }
                .inv-hero-sub     { font-size: 0.65rem; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; color: rgba(255,255,255,0.55); margin: 0; }
                .inv-hero-badge   { background: rgba(245,197,24,0.15); border: 1px solid rgba(212,160,23,0.3); border-radius: 50px; padding: 8px 20px; }
                .inv-hero-badge span { font-size: 0.82rem; font-weight: 800; color: ${SM.goldBright}; }

                /* Form Card */
                .inv-form-card {
                    background: ${SM.white};
                    border-radius: 18px;
                    border: 1px solid ${SM.border};
                    box-shadow: 0 4px 20px rgba(91,45,142,0.08);
                    margin-bottom: 20px;
                    overflow: hidden;
                }
                .inv-form-header {
                    background: linear-gradient(135deg, ${SM.purpleSoft}, #F8F5FF);
                    border-bottom: 1px solid ${SM.border};
                    padding: 18px 24px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .inv-form-header-title { font-size: 0.95rem; font-weight: 800; color: ${SM.purpleText}; margin: 0; }
                .inv-form-header-icon  { width: 34px; height: 34px; border-radius: 9px; background: linear-gradient(135deg, ${SM.bgDeep}, ${SM.bgMid}); display: flex; align-items: center; justify-content: center; }
                .inv-form-body { padding: 24px; }

                /* Inputs */
                .inv-label { font-size: 0.67rem; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; color: ${SM.mutedText}; display: block; margin-bottom: 7px; }
                .inv-input {
                    width: 100%;
                    background: #FAFAFA;
                    border: 1.5px solid ${SM.border};
                    border-radius: 12px;
                    padding: 11px 15px;
                    font-size: 0.88rem;
                    font-weight: 600;
                    color: #1a1a2e;
                    transition: all 0.2s;
                    outline: none;
                    box-sizing: border-box;
                }
                .inv-input:focus {
                    border-color: ${SM.bgMid};
                    background: ${SM.white};
                    box-shadow: 0 0 0 4px rgba(107,15,74,0.1);
                }
                .inv-input::placeholder { color: #bbb; font-weight: 500; }

                /* Upload Zone */
                .inv-upload-label {
                    width: 100%;
                    min-height: 46px;
                    background: #FAFAFA;
                    border: 1.5px dashed rgba(91,45,142,0.3);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    cursor: pointer;
                    font-size: 0.82rem;
                    font-weight: 700;
                    color: ${SM.purpleText};
                    transition: all 0.2s;
                    box-sizing: border-box;
                    padding: 10px;
                }
                .inv-upload-label:hover { border-color: ${SM.bgMid}; background: ${SM.purpleSoft}; }

                /* File chips */
                .inv-file-chip {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    background: ${SM.purpleSoft};
                    border: 1px solid ${SM.border};
                    border-radius: 8px;
                    padding: 5px 10px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: ${SM.purpleText};
                }
                .inv-file-chip-remove { cursor: pointer; color: #e53e3e; transition: 0.15s; }
                .inv-file-chip-remove:hover { color: #c53030; transform: scale(1.2); }

                /* Submit Button */
                .inv-submit-btn {
                    background: linear-gradient(135deg, ${SM.bgDeep}, ${SM.bgMid});
                    color: ${SM.white};
                    border: none;
                    border-radius: 12px;
                    padding: 12px 32px;
                    font-size: 0.82rem;
                    font-weight: 900;
                    letter-spacing: 0.8px;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.25s;
                    box-shadow: 0 4px 16px rgba(61,0,48,0.25);
                    text-transform: uppercase;
                }
                .inv-submit-btn:hover:not(:disabled) {
                    background: linear-gradient(135deg, ${SM.bgMid}, ${SM.bgLight});
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(61,0,48,0.35);
                }
                .inv-submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }
                .inv-submit-btn-gold {
                    background: linear-gradient(135deg, ${SM.gold}, ${SM.goldBright});
                    color: ${SM.bgDeep};
                    box-shadow: 0 4px 16px rgba(212,160,23,0.3);
                }
                .inv-submit-btn-gold:hover:not(:disabled) {
                    background: linear-gradient(135deg, ${SM.goldBright}, #FFD93D);
                    box-shadow: 0 8px 24px rgba(212,160,23,0.45);
                }

                /* Table Card */
                .inv-table-card {
                    background: ${SM.white};
                    border-radius: 18px;
                    border: 1px solid ${SM.border};
                    box-shadow: 0 4px 20px rgba(91,45,142,0.08);
                    overflow: hidden;
                }
                .inv-table-header {
                    padding: 18px 24px;
                    border-bottom: 1px solid ${SM.border};
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 12px;
                    background: linear-gradient(135deg, #FDFBFF, ${SM.white});
                }
                .inv-table-title { font-size: 1rem; font-weight: 900; color: ${SM.purpleText}; margin: 0; }

                /* Search */
                .inv-search-wrap {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    background: ${SM.purpleSoft};
                    border: 1px solid ${SM.border};
                    border-radius: 50px;
                    padding: 8px 16px;
                    max-width: 280px;
                    flex: 1;
                }
                .inv-search-input {
                    border: none;
                    background: transparent;
                    outline: none;
                    font-size: 0.82rem;
                    font-weight: 600;
                    color: ${SM.purpleText};
                    width: 100%;
                }
                .inv-search-input::placeholder { color: ${SM.mutedText}; }

                /* Table */
                .inv-table { width: 100%; border-collapse: collapse; }
                .inv-thead tr { background: linear-gradient(135deg, ${SM.purpleSoft}, #F3EFFF); }
                .inv-thead th {
                    padding: 14px 16px;
                    font-size: 0.65rem;
                    font-weight: 900;
                    letter-spacing: 1.2px;
                    text-transform: uppercase;
                    color: ${SM.mutedText};
                    border: none;
                    white-space: nowrap;
                }
                .inv-thead th:first-child { padding-left: 24px; }
                .inv-thead th:last-child  { padding-right: 24px; text-align: right; }

                .inv-tbody tr {
                    border-bottom: 1px solid rgba(91,45,142,0.07);
                    transition: background 0.15s;
                }
                .inv-tbody tr:hover { background: #FDFBFF; }
                .inv-tbody tr:last-child { border-bottom: none; }
                .inv-tbody td { padding: 14px 16px; vertical-align: middle; }
                .inv-tbody td:first-child { padding-left: 24px; }
                .inv-tbody td:last-child  { padding-right: 24px; text-align: right; }

                /* Product thumb */
                .inv-thumb {
                    width: 52px;
                    height: 52px;
                    border-radius: 12px;
                    object-fit: cover;
                    border: 1.5px solid ${SM.border};
                    background: ${SM.purpleSoft};
                    flex-shrink: 0;
                }
                .inv-thumb-placeholder {
                    width: 52px;
                    height: 52px;
                    border-radius: 12px;
                    background: ${SM.purpleSoft};
                    border: 1.5px dashed ${SM.border};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                .inv-media-count {
                    position: absolute;
                    bottom: -4px;
                    right: -4px;
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    background: ${SM.bgMid};
                    color: ${SM.goldBright};
                    font-size: 8px;
                    font-weight: 900;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 2px solid ${SM.white};
                }
                .inv-item-name { font-size: 0.88rem; font-weight: 800; color: #1a1a2e; margin: 0 0 3px; }
                .inv-item-desc { font-size: 0.72rem; font-weight: 600; color: ${SM.mutedText}; margin: 0; display: flex; align-items: center; gap: 4px; }

                /* Price */
                .inv-price { font-size: 0.92rem; font-weight: 900; color: ${SM.purpleText}; display: flex; align-items: center; gap: 4px; }

                /* Status badge */
                .inv-status {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 4px 12px;
                    border-radius: 50px;
                    font-size: 0.65rem;
                    font-weight: 900;
                    letter-spacing: 0.5px;
                    text-transform: uppercase;
                }
                .inv-status-live { background: rgba(34,197,94,0.12); color: #166534; border: 1px solid rgba(34,197,94,0.25); }
                .inv-status-oos  { background: rgba(148,163,184,0.12); color: #64748b; border: 1px solid rgba(148,163,184,0.25); }
                .inv-status-dot  { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

                /* Action Menu */
                .inv-action-btn {
                    width: 34px;
                    height: 34px;
                    border-radius: 9px;
                    background: ${SM.purpleSoft};
                    border: 1px solid ${SM.border};
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: 0.15s;
                    color: ${SM.purpleText};
                }
                .inv-action-btn:hover { background: linear-gradient(135deg, ${SM.bgDeep}, ${SM.bgMid}); color: ${SM.white}; border-color: transparent; }

                .inv-dropdown-menu {
                    min-width: 180px;
                    border-radius: 14px;
                    border: 1px solid ${SM.border};
                    box-shadow: 0 16px 40px rgba(91,45,142,0.18);
                    padding: 6px;
                    background: ${SM.white};
                }
                .inv-dropdown-item {
                    border-radius: 9px;
                    padding: 9px 12px;
                    font-size: 0.8rem;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 9px;
                    cursor: pointer;
                    border: none;
                    background: transparent;
                    width: 100%;
                    text-align: left;
                    transition: 0.15s;
                    color: ${SM.purpleText};
                }
                .inv-dropdown-item:hover { background: ${SM.purpleSoft}; }
                .inv-dropdown-item.danger { color: #dc2626; }
                .inv-dropdown-item.danger:hover { background: #fff5f5; }

                /* Empty State */
                .inv-empty {
                    text-align: center;
                    padding: 60px 20px;
                }
                .inv-empty-icon {
                    width: 72px;
                    height: 72px;
                    border-radius: 20px;
                    background: ${SM.purpleSoft};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 16px;
                }
                .inv-empty-title { font-size: 0.82rem; font-weight: 800; color: ${SM.mutedText}; letter-spacing: 1px; text-transform: uppercase; margin: 0; }

                /* Form Grid */
                .inv-form-grid {
                    display: grid;
                    grid-template-columns: 2fr 1fr 3fr 2fr;
                    gap: 16px;
                    margin-bottom: 16px;
                }
                .inv-files-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
                .inv-form-footer { display: flex; justify-content: flex-end; }

                @media (max-width: 900px) {
                    .inv-form-grid { grid-template-columns: 1fr 1fr; }
                }
                @media (max-width: 600px) {
                    .inv-form-grid { grid-template-columns: 1fr; }
                    .inv-hero { padding: 20px; }
                    .inv-form-body { padding: 16px; }
                    .inv-form-header { padding: 14px 16px; }
                    .inv-table-header { padding: 14px 16px; }
                    .inv-thead th:first-child { padding-left: 14px; }
                    .inv-tbody td:first-child { padding-left: 14px; }
                }
            `}</style>

            <div className="inv-wrap">

                {/* ── HERO ── */}
                <div className="inv-hero">
                    <div className="inv-hero-left">
                        <div className="inv-hero-icon">
                            <Boxes size={26} color={SM.goldBright} />
                        </div>
                        <div>
                            <p className="inv-hero-title">Manage Inventory</p>
                            <p className="inv-hero-sub">Live catalog · SathiMarket Cloud</p>
                        </div>
                    </div>
                    <div className="inv-hero-badge">
                        <span>{items.length} Products Listed</span>
                    </div>
                </div>

                {/* ── ADD PRODUCT FORM ── */}
                <div className="inv-form-card">
                    <div className="inv-form-header">
                        <div className="inv-form-header-icon">
                            <PackagePlus size={16} color={SM.goldBright} />
                        </div>
                        <p className="inv-form-header-title">Add New Product</p>
                    </div>

                    <div className="inv-form-body">
                        <form onSubmit={handleAddItem}>
                            <div className="inv-form-grid">
                                {/* Product Name */}
                                <div>
                                    <label className="inv-label">Product Name</label>
                                    <input
                                        type="text"
                                        className="inv-input"
                                        placeholder="e.g., Amul Gold 500ml"
                                        value={newItem.itemName}
                                        required
                                        onChange={e => setNewItem({ ...newItem, itemName: e.target.value })}
                                    />
                                </div>

                                {/* Price */}
                                <div>
                                    <label className="inv-label">Price (₹)</label>
                                    <input
                                        type="number"
                                        className="inv-input"
                                        placeholder="0.00"
                                        value={newItem.price}
                                        required
                                        onChange={e => setNewItem({ ...newItem, price: e.target.value })}
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="inv-label">Description / Specs</label>
                                    <input
                                        type="text"
                                        className="inv-input"
                                        placeholder="Weight, Variant, or Size"
                                        value={newItem.itemDescription}
                                        onChange={e => setNewItem({ ...newItem, itemDescription: e.target.value })}
                                    />
                                </div>

                                {/* Upload */}
                                <div>
                                    <label className="inv-label">Upload Media</label>
                                    <label className="inv-upload-label">
                                        <UploadCloud size={17} />
                                        <span>Photos / Video</span>
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*,video/*"
                                            hidden
                                            onChange={handleFileChange}
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* File Chips */}
                            {selectedFiles.length > 0 && (
                                <div className="inv-files-row">
                                    {selectedFiles.map((file, idx) => (
                                        <div key={idx} className="inv-file-chip">
                                            {file.type.startsWith('video')
                                                ? <Video size={13} />
                                                : <ImageIcon size={13} />
                                            }
                                            <span>{file.name.length > 14 ? file.name.slice(0, 12) + '…' : file.name}</span>
                                            <X
                                                size={13}
                                                className="inv-file-chip-remove"
                                                onClick={() => removeFile(idx)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Submit */}
                            <div className="inv-form-footer">
                                <button
                                    type="submit"
                                    className="inv-submit-btn inv-submit-btn-gold"
                                    disabled={submitting}
                                >
                                    {submitting
                                        ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                                        : <PlusCircle size={18} />
                                    }
                                    {submitting ? 'Adding...' : 'Add to Catalog'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* ── CATALOG TABLE ── */}
                <div className="inv-table-card">
                    <div className="inv-table-header">
                        <p className="inv-table-title">
                            Product Catalog
                            <span style={{ marginLeft: 10, fontSize: '0.72rem', fontWeight: 700, color: SM.mutedText }}>
                                ({filteredItems.length} items)
                            </span>
                        </p>

                        {/* Search */}
                        <div className="inv-search-wrap">
                            <Search size={16} color={SM.mutedText} />
                            <input
                                type="text"
                                className="inv-search-input"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <X
                                    size={14}
                                    color={SM.mutedText}
                                    style={{ cursor: 'pointer', flexShrink: 0 }}
                                    onClick={() => setSearchTerm('')}
                                />
                            )}
                        </div>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table className="inv-table">
                            <thead className="inv-thead">
                                <tr>
                                    <th>Product</th>
                                    <th>Price</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody className="inv-tbody">
                                {filteredItems.length > 0 ? (
                                    filteredItems.map(item => {
                                        const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_URL;

                                        // 1. Define the URL generator safely inside the map if it needs IMAGE_BASE_URL
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

                                        // 2. Compute the URL to evaluate whether to render the <img> tag or the placeholder
                                        const currentImgUrl = getMediaUrl(item.mediaList || item.MediaList);

                                        return (
                                            <tr key={item.itemID}>
                                                {/* Product */}
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                        <div style={{ position: 'relative', flexShrink: 0 }}>
                                                            {/* 3. Fixed the variable check here */}
                                                            {currentImgUrl ? (
                                                                <img height={80} width={80}
                                                                    src={currentImgUrl}
                                                                    alt={item.itemName || item.ItemName || 'Product'}
                                                                    loading="lazy"
                                                                    onError={e => {
                                                                        e.target.onerror = null;
                                                                        e.target.src = 'https://placehold.co/400x400/f8f0f7/8B1A6B?text=No+Image';
                                                                    }}
                                                                />
                                                            ) : (
                                                                <div className="inv-thumb-placeholder">
                                                                    <ImageIcon size={20} color={SM.mutedText} />
                                                                </div>
                                                            )}
                                                            {(item.mediaList?.length > 1 || item.MediaList?.length > 1) && (
                                                                <div className="inv-media-count">
                                                                    +{(item.mediaList?.length || item.MediaList?.length) - 1}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="inv-item-name">{item.itemName}</p>
                                                            <p className="inv-item-desc">
                                                                <Info size={11} />
                                                                {item.itemDescription || 'No description'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Price */}
                                                <td>
                                                    <div className="inv-price">
                                                        <IndianRupee size={14} color={SM.gold} />
                                                        {item.price?.toLocaleString('en-IN')}
                                                    </div>
                                                </td>

                                                {/* Status */}
                                                <td>
                                                    <span className={`inv-status ${item.isAvailable ? 'inv-status-live' : 'inv-status-oos'}`}>
                                                        <span
                                                            className="inv-status-dot"
                                                            style={{ background: item.isAvailable ? '#22c55e' : '#94a3b8' }}
                                                        />
                                                        {item.isAvailable ? 'Live' : 'Out of Stock'}
                                                    </span>
                                                </td>

                                                {/* Actions */}
                                                <td>
                                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                        <div className="dropdown">
                                                            <button
                                                                className="inv-action-btn"
                                                                type="button"
                                                                data-bs-toggle="dropdown"
                                                                aria-expanded="false"
                                                            >
                                                                <MoreVertical size={16} />
                                                            </button>
                                                            <ul className="dropdown-menu inv-dropdown-menu">
                                                                <li>
                                                                    <button className="inv-dropdown-item" type="button">
                                                                        <Eye size={15} /> View Details
                                                                    </button>
                                                                </li>
                                                                <li>
                                                                    <hr style={{ margin: '4px 8px', borderColor: SM.border }} />
                                                                </li>
                                                                <li>
                                                                    <button
                                                                        className="inv-dropdown-item danger"
                                                                        type="button"
                                                                        onClick={() => handleDeleteItem(item.itemID)}
                                                                    >
                                                                        <Trash2 size={15} /> Delete Product
                                                                    </button>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="4">
                                            <div className="inv-empty">
                                                <div className="inv-empty-icon">
                                                    <Boxes size={32} color={SM.mutedText} />
                                                </div>
                                                <p className="inv-empty-title">
                                                    {searchTerm ? 'No products match your search' : 'No products added yet'}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default ManageInventory;