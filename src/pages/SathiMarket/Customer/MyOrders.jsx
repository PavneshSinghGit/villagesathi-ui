import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../../api/axiosInstance';
import { toast } from 'react-toastify';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
    Download, Package, CheckCircle2,
    Clock, XCircle, ArrowLeft, History,
    Search, ChevronDown, ChevronUp, Truck,
    RefreshCw, ChevronLeft, ChevronRight,
    ChevronsLeft, ChevronsRight
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

// ─────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────

const PAGE_SIZE = 5; // orders shown per page — change freely

// ─────────────────────────────────────────────
// Helpers — handle both camelCase & PascalCase API responses
// ─────────────────────────────────────────────

const getId     = (o) => o?.orderID     ?? o?.OrderID     ?? o?.orderId;
const getDate   = (o) => o?.orderDate   ?? o?.OrderDate   ?? o?.createdAt;
const getStatus = (o) => o?.orderStatus ?? o?.OrderStatus ?? 0;
const getAmount = (o) => o?.totalAmount ?? o?.TotalAmount ?? 0;
const getItems  = (o) => o?.orderItems  ?? o?.OrderItems  ?? o?.items ?? o?.Items ?? [];

const formatDate = (raw) => {
    if (!raw) return 'N/A';
    const d = new Date(raw);
    return isNaN(d) ? raw : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

// ─────────────────────────────────────────────
// Status config
// ─────────────────────────────────────────────

const STATUS_MAP = {
    0: { label: 'Pending',   icon: <Clock        size={13} />, color: '#ea580c', bg: '#fff7ed' },
    1: { label: 'Confirmed', icon: <CheckCircle2 size={13} />, color: '#2563eb', bg: '#eff6ff' },
    2: { label: 'Delivered', icon: <CheckCircle2 size={13} />, color: '#16a34a', bg: '#f0fdf4' },
    3: { label: 'Cancelled', icon: <XCircle      size={13} />, color: '#ef4444', bg: '#fef2f2' },
};
const getStatusInfo = (status) =>
    STATUS_MAP[Number(status)] ?? { label: 'In Transit', icon: <Truck size={13} />, color: '#721a61', bg: '#fdf0f9' };

// ─────────────────────────────────────────────
// Skeleton loader
// ─────────────────────────────────────────────

const OrderSkeleton = () => (
    <div className="vstack gap-3">
        {[1, 2, 3].map(n => (
            <div key={n} className="order-card p-3 d-flex align-items-center gap-3">
                <div className="skeleton rounded-circle" style={{ width: 46, height: 46, flexShrink: 0 }} />
                <div className="flex-grow-1 vstack gap-2">
                    <div className="skeleton" style={{ height: 13, width: '38%', borderRadius: 4 }} />
                    <div className="skeleton" style={{ height: 11, width: '22%', borderRadius: 4 }} />
                </div>
                <div className="skeleton d-none d-md-block" style={{ height: 26, width: 70, borderRadius: 4 }} />
                <div className="skeleton" style={{ height: 26, width: 100, borderRadius: 4 }} />
            </div>
        ))}
    </div>
);

// ─────────────────────────────────────────────
// Pagination component
// ─────────────────────────────────────────────

const Pagination = ({ currentPage, totalPages, totalRecords, pageSize, onPageChange }) => {
    if (totalPages <= 1) return null;

    const start = (currentPage - 1) * pageSize + 1;
    const end   = Math.min(currentPage * pageSize, totalRecords);

    // Build visible page numbers with ellipsis
    const getPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                pages.push(i);
            } else if (i === currentPage - 2 || i === currentPage + 2) {
                pages.push('...');
            }
        }
        // Remove duplicate ellipsis
        return pages.filter((p, idx) => !(p === '...' && pages[idx - 1] === '...'));
    };

    return (
        <div className="pagination-wrap d-flex flex-column flex-sm-row align-items-center justify-content-between gap-3 mt-4 pt-3">

            {/* "Showing X–Y of Z" */}
            <span className="text-muted" style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>
                Showing <strong>{start}–{end}</strong> of <strong>{totalRecords}</strong> orders
            </span>

            {/* Buttons */}
            <div className="d-flex align-items-center gap-1">
                <button className="page-btn icon-btn" onClick={() => onPageChange(1)}
                    disabled={currentPage === 1} aria-label="First page" title="First">
                    <ChevronsLeft size={15} />
                </button>
                <button className="page-btn icon-btn" onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1} aria-label="Previous page" title="Previous">
                    <ChevronLeft size={15} />
                </button>

                {getPageNumbers().map((page, idx) =>
                    page === '...'
                        ? <span key={`el-${idx}`} className="page-ellipsis">…</span>
                        : (
                            <button
                                key={page}
                                className={`page-btn num-btn ${currentPage === page ? 'active' : ''}`}
                                onClick={() => onPageChange(page)}
                                aria-label={`Page ${page}`}
                                aria-current={currentPage === page ? 'page' : undefined}
                            >
                                {page}
                            </button>
                        )
                )}

                <button className="page-btn icon-btn" onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages} aria-label="Next page" title="Next">
                    <ChevronRight size={15} />
                </button>
                <button className="page-btn icon-btn" onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages} aria-label="Last page" title="Last">
                    <ChevronsRight size={15} />
                </button>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────
// PDF Invoice generator
// ─────────────────────────────────────────────

const generateInvoice = (order, userData) => {
    const doc     = new jsPDF();
    const orderId = getId(order);
    const amount  = getAmount(order);
    const items   = getItems(order);
    const date    = formatDate(getDate(order));

    doc.setFillColor(114, 26, 97);
    doc.rect(0, 0, 210, 42, 'F');
    doc.setFontSize(20); doc.setFont('helvetica', 'bold'); doc.setTextColor(255, 255, 255);
    doc.text('SATHI MARKET', 14, 18);
    doc.setFontSize(9); doc.setFont('helvetica', 'normal');
    doc.text('Official Order Invoice  |  VillageSathi Platforms', 14, 27);
    doc.text(`Invoice: #VS-${orderId}`, 14, 34);
    doc.setDrawColor(255, 194, 0); doc.setLineWidth(1.2); doc.line(0, 42, 210, 42);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.text('BILL TO', 14, 55);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
    doc.text(`Name   : ${userData.name ?? userData.Name ?? 'Customer'}`, 14, 63);
    doc.text(`Phone  : +91 ${userData.mobileNo ?? userData.MobileNo ?? 'N/A'}`, 14, 70);
    doc.text(`Date   : ${date}`, 14, 77);
    doc.text(`Status : ${getStatusInfo(getStatus(order)).label}`, 14, 84);

    const tableBody = items.length > 0
        ? items.map((item, i) => [
            i + 1,
            item.itemName ?? item.ItemName ?? `Item ${i + 1}`,
            item.quantity ?? item.Quantity ?? 1,
            `₹${item.unitPrice ?? item.UnitPrice ?? item.price ?? 0}`,
            `₹${item.totalPrice ?? item.TotalPrice ?? (item.unitPrice ?? 0) * (item.quantity ?? 1)}`
          ])
        : [[1, 'Marketplace Purchase', '—', '—', `₹${amount}`]];

    autoTable(doc, {
        startY: 92,
        head: [['#', 'Item', 'Qty', 'Unit Price', 'Total']],
        body: tableBody,
        theme: 'striped',
        headStyles: { fillColor: [114, 26, 97], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 9 },
        bodyStyles: { fontSize: 9 },
        columnStyles: { 0: { cellWidth: 10 }, 2: { halign: 'center' }, 3: { halign: 'right' }, 4: { halign: 'right' } },
        styles: { cellPadding: 4 }
    });

    const fy = doc.lastAutoTable.finalY + 6;
    doc.setDrawColor(220, 220, 220); doc.setLineWidth(0.4); doc.line(120, fy, 196, fy);
    doc.setFontSize(9); doc.setTextColor(100, 100, 100);
    doc.text('Delivery Charges', 120, fy + 8); doc.text('FREE', 196, fy + 8, { align: 'right' });
    doc.text('Taxes (GST)', 120, fy + 15); doc.text('Included', 196, fy + 15, { align: 'right' });
    doc.setDrawColor(114, 26, 97); doc.line(120, fy + 18, 196, fy + 18);
    doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(114, 26, 97);
    doc.text('GRAND TOTAL', 120, fy + 26); doc.text(`₹${amount}`, 196, fy + 26, { align: 'right' });

    doc.setFontSize(8); doc.setFont('helvetica', 'normal'); doc.setTextColor(160, 160, 160);
    doc.text('Thank you for shopping on SathiMarket — Empowering Rural Bharat', 105, 285, { align: 'center' });
    doc.text('villagesathi.in  |  support: villagesathi.info@gmail.com', 105, 290, { align: 'center' });
    doc.save(`VS_Invoice_${orderId}.pdf`);
};

// ─────────────────────────────────────────────
// Order row (expandable)
// ─────────────────────────────────────────────

const OrderRow = ({ order, onDownload }) => {
    const [expanded, setExpanded] = useState(false);
    const status  = getStatusInfo(getStatus(order));
    const items   = getItems(order);
    const orderId = getId(order);

    return (
        <div className={`order-card shadow-sm ${expanded ? 'expanded' : ''}`}>
            <div className="p-3 d-flex flex-wrap align-items-center gap-3 justify-content-between">
                <div className="d-flex align-items-center gap-3" style={{ minWidth: 0 }}>
                    <div className="order-icon-wrap flex-shrink-0"><Package size={22} /></div>
                    <div style={{ minWidth: 0 }}>
                        <div className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>
                            Order <span style={{ color: '#721a61' }}>#VS-{orderId}</span>
                        </div>
                        <div className="text-muted" style={{ fontSize: '11px' }}>{formatDate(getDate(order))}</div>
                    </div>
                </div>

                <div className="text-center">
                    <div className="text-muted" style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700 }}>Amount</div>
                    <div className="fw-bold" style={{ fontSize: '1.05rem', color: '#721a61' }}>₹{getAmount(order)}</div>
                </div>

                <span className="status-pill" style={{ backgroundColor: status.bg, color: status.color }}>
                    {status.icon} {status.label}
                </span>

                <div className="d-flex align-items-center gap-2 ms-md-auto flex-wrap">
                    <button className="btn-invoice-outline d-flex align-items-center gap-1" onClick={() => onDownload(order)}>
                        <Download size={13} /> Invoice
                    </button>
                    {items.length > 0 && (
                        <button className="btn-expand d-flex align-items-center gap-1"
                            onClick={() => setExpanded(p => !p)} aria-expanded={expanded}>
                            {expanded ? <><ChevronUp size={14} /> Hide</> : <><ChevronDown size={14} /> Items</>}
                        </button>
                    )}
                </div>
            </div>

            {expanded && items.length > 0 && (
                <div className="order-items-panel border-top px-3 py-3">
                    <div className="small fw-bold text-muted text-uppercase mb-2" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>
                        Order Items ({items.length})
                    </div>
                    <div className="vstack gap-2">
                        {items.map((item, i) => {
                            const name  = item.itemName ?? item.ItemName ?? `Item ${i + 1}`;
                            const qty   = item.quantity ?? item.Quantity ?? 1;
                            const price = item.unitPrice ?? item.UnitPrice ?? item.price ?? 0;
                            const total = item.totalPrice ?? item.TotalPrice ?? price * qty;
                            return (
                                <div key={i} className="d-flex justify-content-between align-items-center py-1 border-bottom">
                                    <div>
                                        <span className="fw-bold small text-dark">{name}</span>
                                        <span className="text-muted ms-2" style={{ fontSize: '11px' }}>× {qty}</span>
                                    </div>
                                    <span className="fw-bold small" style={{ color: '#721a61' }}>₹{total}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

// ─────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────

const MyOrders = () => {
    // ── State ──────────────────────────────────────────────────────────────
    const [allOrders, setAllOrders]       = useState([]);  // used when server sends all rows
    const [pageOrders, setPageOrders]     = useState([]);  // used when server paginates
    const [searchTerm, setSearchTerm]     = useState('');
    const [loading, setLoading]           = useState(true);
    const [retrying, setRetrying]         = useState(false);
    const [currentPage, setCurrentPage]   = useState(1);
    const [totalPages, setTotalPages]     = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [serverPaging, setServerPaging] = useState(true); // auto-detected on first fetch
    const navigate = useNavigate();

    // ── Fetch ──────────────────────────────────────────────────────────────
    //
    // Strategy:
    //   1. Always send ?page=N&pageSize=5 to the API.
    //   2. If the response includes TotalCount / TotalPages  → server supports pagination.
    //      We store only the current page slice and let the server do the heavy lifting.
    //   3. If the response has no pagination metadata → it returned everything.
    //      We store all rows and slice client-side. No extra network calls on page change.
    //
    const fetchOrders = useCallback(async (page = 1, isRetry = false) => {
        try {
            isRetry ? setRetrying(true) : setLoading(true);

            const userData = JSON.parse(localStorage.getItem('customerUser') || '{}');
            const userId   = userData?.userId ?? userData?.UserId;

            if (!userId) {
                toast.error('Session expired. Please login again.');
                navigate('/customer-login');
                return;
            }

            const response = await axiosInstance.get(`/Orders/GetByUser/${userId}`, {
                params: { page, pageSize: PAGE_SIZE }
            });

            const raw         = response.data?.Data       ?? response.data?.data       ?? response.data       ?? [];
            const serverTotal = response.data?.TotalCount ?? response.data?.totalCount ??
                                response.data?.TotalPages ?? response.data?.totalPages ?? null;
            const dataArray   = Array.isArray(raw) ? raw : [];

            if (serverTotal !== null) {
                // Server returned pagination metadata — trust it
                // serverTotal might be record count (e.g. 47) or page count (e.g. 10)
                const isRecordCount = serverTotal > PAGE_SIZE;
                const pages   = isRecordCount ? Math.ceil(serverTotal / PAGE_SIZE) : serverTotal;
                const records = isRecordCount ? serverTotal : serverTotal * PAGE_SIZE;

                setServerPaging(true);
                setPageOrders(dataArray);
                setTotalPages(Math.max(1, pages));
                setTotalRecords(records);
            } else {
                // Server sent everything — paginate on the client
                setServerPaging(false);
                setAllOrders(dataArray);
                setTotalRecords(dataArray.length);
                setTotalPages(Math.max(1, Math.ceil(dataArray.length / PAGE_SIZE)));
            }

            setCurrentPage(page);
        } catch (err) {
            console.error('Failed to fetch orders:', err);
            toast.error('Could not load your order history. Please try again.');
        } finally {
            setLoading(false);
            setRetrying(false);
        }
    }, [navigate]);

    useEffect(() => { fetchOrders(1); }, [fetchOrders]);

    // Reset to page 1 whenever search changes
    useEffect(() => { setCurrentPage(1); }, [searchTerm]);

    // ── Filtered list (client-side path only) ─────────────────────────────
    const filteredAll = useMemo(() => {
        const term = searchTerm.toLowerCase().trim();
        return allOrders
            .filter(o => !term || String(getId(o) ?? '').includes(term))
            .sort((a, b) => (getId(b) ?? 0) - (getId(a) ?? 0));
    }, [allOrders, searchTerm]);

    // Keep totalPages in sync when search changes the filtered count
    useEffect(() => {
        if (!serverPaging) {
            setTotalRecords(filteredAll.length);
            setTotalPages(Math.max(1, Math.ceil(filteredAll.length / PAGE_SIZE)));
        }
    }, [filteredAll, serverPaging]);

    // ── Current page slice ────────────────────────────────────────────────
    const displayOrders = useMemo(() => {
        if (serverPaging) {
            // Server already gave the right slice; still apply search filter if typed
            const term = searchTerm.toLowerCase().trim();
            return pageOrders.filter(o => !term || String(getId(o) ?? '').includes(term));
        }
        const start = (currentPage - 1) * PAGE_SIZE;
        return filteredAll.slice(start, start + PAGE_SIZE);
    }, [serverPaging, pageOrders, filteredAll, currentPage, searchTerm]);

    // ── Page change ───────────────────────────────────────────────────────
    const goToPage = (page) => {
        if (page < 1 || page > totalPages || page === currentPage) return;
        if (serverPaging) {
            fetchOrders(page);  // new network call — fetches only that page
        } else {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // ── Invoice ───────────────────────────────────────────────────────────
    const handleDownload = (order) => {
        try {
            const userData = JSON.parse(localStorage.getItem('customerUser') || '{}');
            generateInvoice(order, userData);
            toast.success('Invoice downloaded!');
        } catch (err) {
            console.error('PDF error:', err);
            toast.error('Failed to generate invoice.');
        }
    };

    // ─────────────────────────────────────────────────────────────────────
    // Render
    // ─────────────────────────────────────────────────────────────────────

    return (
        <main className="min-vh-100 pb-5" style={{ backgroundColor: '#f8f0f6' }}>
            <Helmet>
                <title>My Orders | SathiMarket</title>
                <meta name="description" content="View and manage your recent SathiMarket orders." />
            </Helmet>

            <style>{`
                :root {
                    --maroon: #721a61;
                    --maroon-dark: #561249;
                    --gold: #ffc200;
                    --border: #e8d5e4;
                }

                /* ── Skeleton ── */
                .skeleton {
                    background: linear-gradient(90deg, #f0e8ee 25%, #e8d8e4 50%, #f0e8ee 75%);
                    background-size: 200% 100%;
                    animation: shimmer 1.4s infinite;
                }
                @keyframes shimmer {
                    0%   { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }

                /* ── Header ── */
                .orders-header {
                    background: var(--maroon);
                    color: white;
                    padding: 12px 0;
                    border-bottom: 3px solid var(--gold);
                    box-shadow: 0 2px 8px rgba(114,26,97,0.3);
                }

                /* ── Search ── */
                .search-pill {
                    background: white; border-radius: 6px;
                    padding: 7px 12px; display: flex; align-items: center;
                    border: 1px solid rgba(255,255,255,0.25);
                }
                .search-pill input {
                    border: none; outline: none; width: 100%;
                    margin-left: 8px; font-size: 13px; background: transparent;
                }

                /* ── Order card ── */
                .order-card {
                    background: white; border-radius: 8px;
                    border: 1px solid var(--border);
                    transition: border-color 0.2s, box-shadow 0.2s; overflow: hidden;
                }
                .order-card:hover, .order-card.expanded { border-color: var(--maroon); }
                .order-card.expanded { box-shadow: 0 4px 16px rgba(114,26,97,0.1); }

                .order-icon-wrap {
                    width: 46px; height: 46px; border-radius: 50%;
                    background: #fdf0f9; color: var(--maroon);
                    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
                }

                /* ── Status pill ── */
                .status-pill {
                    padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700;
                    display: inline-flex; align-items: center; gap: 4px;
                    text-transform: uppercase; white-space: nowrap;
                }

                /* ── Action buttons ── */
                .btn-invoice-outline {
                    border: 1.5px solid var(--maroon); color: var(--maroon);
                    background: transparent; font-weight: 700; font-size: 12px;
                    border-radius: 4px; padding: 5px 12px;
                    transition: background 0.15s, color 0.15s; cursor: pointer;
                }
                .btn-invoice-outline:hover { background: var(--maroon); color: white; }
                .btn-expand {
                    border: 1px solid var(--border); color: #555; background: #fafafa;
                    font-size: 12px; font-weight: 600; border-radius: 4px; padding: 5px 10px;
                    cursor: pointer; transition: background 0.15s;
                }
                .btn-expand:hover { background: #f0e0ec; color: var(--maroon); border-color: var(--maroon); }

                .order-items-panel { background: #fdf8fc; }

                /* ── Empty state ── */
                .empty-state {
                    background: white; border-radius: 10px;
                    border: 1px solid var(--border); padding: 60px 20px; text-align: center;
                }

                /* ── Pagination ── */
                .pagination-wrap {
                    border-top: 1px solid var(--border) !important;
                }
                .page-btn {
                    border: 1.5px solid var(--border); background: white; color: #444;
                    border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600;
                    transition: all 0.15s; line-height: 1;
                }
                .page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
                .page-btn:not(:disabled):hover {
                    border-color: var(--maroon); color: var(--maroon); background: #fdf5fb;
                }
                .page-btn.active {
                    background: var(--maroon); color: white;
                    border-color: var(--maroon); box-shadow: 0 2px 6px rgba(114,26,97,0.3);
                }
                .num-btn  { min-width: 34px; height: 34px; padding: 0 6px; }
                .icon-btn { width: 32px; height: 32px; padding: 0; display: flex; align-items: center; justify-content: center; }
                .page-ellipsis { width: 26px; text-align: center; color: #aaa; font-size: 14px; user-select: none; }

                @media (max-width: 576px) {
                    .num-btn  { min-width: 30px; height: 30px; font-size: 12px; }
                    .icon-btn { width: 28px; height: 28px; }
                }
            `}</style>

            {/* ── Sticky header ── */}
            <header className="orders-header sticky-top">
                <div className="container">
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
                        <div className="d-flex align-items-center">
                            <button onClick={() => navigate(-1)} className="btn text-white p-0 me-3 border-0" aria-label="Go back">
                                <ArrowLeft size={22} />
                            </button>
                            <h1 className="h6 mb-0 fw-bold">
                                My Orders
                                {!loading && totalRecords > 0 && (
                                    <span className="ms-2 badge rounded-pill"
                                        style={{ background: 'rgba(255,255,255,0.2)', fontSize: '0.65rem' }}>
                                        {totalRecords}
                                    </span>
                                )}
                            </h1>
                        </div>

                        <div className="d-none d-md-block" style={{ width: 270 }}>
                            <div className="search-pill">
                                <Search size={15} style={{ color: 'rgba(0,0,0,0.35)', flexShrink: 0 }} />
                                <input placeholder="Search by Order ID..."
                                    value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mt-4">

                {/* Mobile search */}
                <div className="d-md-none mb-3">
                    <div className="search-pill shadow-sm" style={{ background: 'white', borderColor: '#e8d5e4' }}>
                        <Search size={15} className="text-muted flex-shrink-0" />
                        <input placeholder="Search by Order ID..."
                            value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    </div>
                </div>

                {/* ── Content ── */}
                {loading ? (
                    <OrderSkeleton />
                ) : displayOrders.length > 0 ? (
                    <>
                        <div className="vstack gap-3">
                            {displayOrders.map(order => (
                                <OrderRow
                                    key={getId(order) ?? Math.random()}
                                    order={order}
                                    onDownload={handleDownload}
                                />
                            ))}
                        </div>

                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalRecords={totalRecords}
                            pageSize={PAGE_SIZE}
                            onPageChange={goToPage}
                        />
                    </>
                ) : (
                    <div className="empty-state">
                        <History size={56} style={{ color: '#721a61', opacity: 0.18 }} className="mb-3" />
                        {searchTerm ? (
                            <>
                                <h5 className="fw-bold">No results for "{searchTerm}"</h5>
                                <p className="text-muted small mb-3">Try a different Order ID.</p>
                                <button className="btn btn-sm"
                                    style={{ color: '#721a61', border: '1px solid #721a61', borderRadius: 4 }}
                                    onClick={() => setSearchTerm('')}>
                                    Clear Search
                                </button>
                            </>
                        ) : (
                            <>
                                <h5 className="fw-bold">No orders yet</h5>
                                <p className="text-muted small mb-4">Buy fresh produce and goods from local Sathi shops.</p>
                                <div className="d-flex gap-2 justify-content-center flex-wrap">
                                    <Link to="/sathi-market" className="btn text-white px-4 fw-bold"
                                        style={{ backgroundColor: '#721a61', borderRadius: 6 }}>
                                        Start Shopping
                                    </Link>
                                    <button className="btn fw-bold px-3"
                                        style={{ border: '1px solid #721a61', color: '#721a61', borderRadius: 6 }}
                                        onClick={() => fetchOrders(1, true)} disabled={retrying}>
                                        {retrying
                                            ? <><span className="spinner-border spinner-border-sm me-1" />Retrying...</>
                                            : <><RefreshCw size={14} className="me-1" />Retry</>}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
};

export default MyOrders;