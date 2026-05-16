import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import axios from "axios";
import {
  Calendar, User, Search, Newspaper, FileText,
  ArrowUpRight, ChevronDown, Info, ChevronLeft, ChevronRight, X, SlidersHorizontal
} from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

/* ── Constants ── */
const PAGE_SIZE = 8;
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&q=70";

/* ── Helpers ── */
const getField = (obj, ...keys) => {
  for (const k of keys) if (obj[k] !== undefined && obj[k] !== null) return obj[k];
  return undefined;
};

const formatDate = (raw) => {
  try {
    return new Date(raw).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric"
    });
  } catch { return ""; }
};

/* ── Sub-components ── */

function SkeletonCard() {
  return (
    <div className="bp-card bp-card--skeleton" aria-hidden="true">
      <div className="bp-card-img bp-skel" />
      <div className="bp-card-body">
        <div className="bp-skel bp-skel--meta" />
        <div className="bp-skel bp-skel--title" />
        <div className="bp-skel bp-skel--line" />
        <div className="bp-skel bp-skel--line bp-skel--short" />
        <div className="bp-skel bp-skel--btn" />
      </div>
    </div>
  );
}

function PostCard({ post, imageBaseUrl }) {
  const [imgError, setImgError] = useState(false);

  const rawUrl = getField(post, "imageUrl", "ImageUrl");
  const imgSrc = useMemo(() => {
    if (imgError || !rawUrl) return FALLBACK_IMAGE;
    if (rawUrl.startsWith("http")) return rawUrl;
    const base = imageBaseUrl.endsWith("/") ? imageBaseUrl.slice(0, -1) : imageBaseUrl;
    return `${base}${rawUrl.startsWith("/") ? rawUrl : `/${rawUrl}`}`;
  }, [rawUrl, imageBaseUrl, imgError]);

  const title       = getField(post, "title", "Title") || "Untitled";
  const description = getField(post, "shortDescription", "ShortDescription") || "";
  const category    = getField(post, "category", "Category") || "General";
  const author      = getField(post, "authorName", "AuthorName") || "Editor";
  const slug        = getField(post, "slug", "Slug") || "";
  const date        = getField(post, "createdDate", "CreatedDate");
  const id          = getField(post, "blogId", "BlogId");

  return (
    <article className="bp-card" style={{ "--delay": "0ms" }}>
      <div className="bp-card-img-wrap">
        <img
          src={imgSrc}
          alt={title}
          className="bp-card-img"
          loading="lazy"
          decoding="async"
          onError={() => setImgError(true)}
          width={280}
          height={200}
        />
        <span className="bp-category-badge">{category.toUpperCase()}</span>
      </div>
      <div className="bp-card-body">
        <div className="bp-meta">
          <span className="bp-meta-item">
            <Calendar size={12} aria-hidden="true" />
            {date ? formatDate(date) : "—"}
          </span>
          <span className="bp-meta-sep" aria-hidden="true" />
          <span className="bp-meta-item">
            <User size={12} aria-hidden="true" />
            {author}
          </span>
        </div>
        <h2 className="bp-card-title">{title}</h2>
        <p className="bp-card-desc">{description}</p>
        <Link
          to={`/BlogDetail/${slug}`}
          className="bp-read-link"
          aria-label={`Read full article: ${title}`}
        >
          पूरा लेख पढ़ें <ArrowUpRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

function Pagination({ current, total, onChange }) {
  if (total <= 1) return null;

  const pages = useMemo(() => {
    const delta = 1;
    const range = [];
    const rangeWithDots = [];
    let l;
    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
        range.push(i);
      }
    }
    for (const i of range) {
      if (l) {
        if (i - l === 2) rangeWithDots.push(l + 1);
        else if (i - l > 2) rangeWithDots.push("…");
      }
      rangeWithDots.push(i);
      l = i;
    }
    return rangeWithDots;
  }, [current, total]);

  return (
    <nav className="bp-pagination" aria-label="Article pages">
      <button
        className="bp-page-btn bp-page-arrow"
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`dots-${i}`} className="bp-page-dots" aria-hidden="true">…</span>
        ) : (
          <button
            key={p}
            className={`bp-page-btn ${p === current ? "bp-page-btn--active" : ""}`}
            onClick={() => onChange(p)}
            aria-label={`Page ${p}`}
            aria-current={p === current ? "page" : undefined}
          >
            {p}
          </button>
        )
      )}

      <button
        className="bp-page-btn bp-page-arrow"
        onClick={() => onChange(current + 1)}
        disabled={current === total}
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}

/* ── Main Component ── */
export default function Blog() {
  const API_BASE_URL  = import.meta.env.VITE_API_URL;
  const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_URL;

  const [posts, setPosts]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deferredSearch, setDeferredSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOpen, setFilterOpen]   = useState(false);

  const searchRef  = useRef(null);
  const filterRef  = useRef(null);
  const resultsRef = useRef(null);

  /* ── Debounce search ── */
  useEffect(() => {
    const t = setTimeout(() => {
      setDeferredSearch(searchQuery);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  /* ── Reset page on category change ── */
  useEffect(() => { setCurrentPage(1); }, [selectedCategory]);

  /* ── Close filter dropdown on outside click ── */
  useEffect(() => {
    const handler = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ── Fetch ── */
  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    const fetchBlogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${API_BASE_URL}/Blogs`, {
          signal: controller.signal,
        });
        if (cancelled) return;
        const allData = res.data?.data ?? [];
        setPosts(
          allData.filter((p) => getField(p, "isActive", "IsActive") === true)
        );
      } catch (err) {
        if (!cancelled && !axios.isCancel(err)) {
          setError("Could not load articles. Please try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchBlogs();
    return () => { cancelled = true; controller.abort(); };
  }, [API_BASE_URL]);

  /* ── Derived data ── */
  const categoriesWithCount = useMemo(() => {
    const counts = posts.reduce((acc, post) => {
      const cat = getField(post, "category", "Category") || "General";
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [posts]);

  const filteredPosts = useMemo(() => {
    const q = deferredSearch.toLowerCase();
    return posts.filter((post) => {
      const title = (getField(post, "title", "Title") || "").toLowerCase();
      const desc  = (getField(post, "shortDescription", "ShortDescription") || "").toLowerCase();
      const cat   = getField(post, "category", "Category") || "General";
      return (
        (title.includes(q) || desc.includes(q)) &&
        (selectedCategory === "All" || cat === selectedCategory)
      );
    });
  }, [posts, deferredSearch, selectedCategory]);

  const totalPages  = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE));
  const pagedPosts  = useMemo(
    () => filteredPosts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filteredPosts, currentPage]
  );

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const clearSearch = () => { setSearchQuery(""); searchRef.current?.focus(); };

  /* ── Render ── */
  return (
    <main className="bp-page">
      <Helmet>
        <title>VillageSathi Patrika | Official Rural Updates & Agri News</title>
        <meta
          name="description"
          content="Official digital news portal of VillageSathi. Get verified updates on agriculture, rural development, and government initiatives."
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      {/* ── HERO ── */}
      <header className="bp-hero">
        <div className="bp-hero-bg" aria-hidden="true" />
        <div className="bp-container bp-hero-inner">
          <div className="bp-hero-text">
            <span className="bp-badge">
              <Newspaper size={13} aria-hidden="true" />
              विलेज पत्रिका &nbsp;·&nbsp; Rural Media Center
            </span>
            <h1 className="bp-hero-title">
              VillageSathi <span className="bp-accent">Patrika</span>
            </h1>
            <p className="bp-hero-sub">
              Verified information, rural updates &amp; agricultural knowledge.
            </p>
          </div>

          {/* ── Search + Filter ── */}
          <div className="bp-controls">
            <div className="bp-search-wrap">
              <Search size={16} className="bp-search-icon" aria-hidden="true" />
              <input
                ref={searchRef}
                type="search"
                className="bp-search"
                placeholder="लेख खोजें / Search articles…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search articles"
              />
              {searchQuery && (
                <button className="bp-search-clear" onClick={clearSearch} aria-label="Clear search">
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Category dropdown */}
            <div className="bp-filter-wrap" ref={filterRef}>
              <button
                className="bp-filter-btn"
                onClick={() => setFilterOpen((o) => !o)}
                aria-expanded={filterOpen}
                aria-haspopup="listbox"
              >
                <SlidersHorizontal size={15} aria-hidden="true" />
                <span>{selectedCategory === "All" ? "All Categories" : selectedCategory}</span>
                <ChevronDown size={14} className={`bp-chevron ${filterOpen ? "bp-chevron--open" : ""}`} />
              </button>
              {filterOpen && (
                <ul className="bp-dropdown" role="listbox" aria-label="Categories">
                  <li>
                    <button
                      role="option"
                      aria-selected={selectedCategory === "All"}
                      className={`bp-dropdown-item ${selectedCategory === "All" ? "bp-dropdown-item--active" : ""}`}
                      onClick={() => { setSelectedCategory("All"); setFilterOpen(false); }}
                    >
                      All Categories
                      <span className="bp-dropdown-count">{posts.length}</span>
                    </button>
                  </li>
                  {categoriesWithCount.map(({ name, count }) => (
                    <li key={name}>
                      <button
                        role="option"
                        aria-selected={selectedCategory === name}
                        className={`bp-dropdown-item ${selectedCategory === name ? "bp-dropdown-item--active" : ""}`}
                        onClick={() => { setSelectedCategory(name); setFilterOpen(false); }}
                      >
                        {name}
                        <span className="bp-dropdown-count">{count}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── TICKER ── */}
      <div className="bp-ticker" role="marquee" aria-label="Latest updates">
        <span className="bp-ticker-label">
          <Info size={13} aria-hidden="true" /> LIVE
        </span>
        <div className="bp-ticker-track">
          <span className="bp-ticker-text">
            New articles published on Organic Farming • PM-Kisan status guide updated for 2026 •
            Follow Village Patrika for weekly regional news • New articles published on Organic Farming •
            PM-Kisan status guide updated for 2026 • Follow Village Patrika for weekly regional news
          </span>
        </div>
      </div>

      {/* ── RESULTS ── */}
      <div className="bp-container bp-content" ref={resultsRef}>

        {/* Result summary */}
        {!loading && !error && (
          <div className="bp-result-bar">
            <p className="bp-result-count">
              {filteredPosts.length === 0
                ? "No articles found"
                : `Showing ${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(currentPage * PAGE_SIZE, filteredPosts.length)} of ${filteredPosts.length} article${filteredPosts.length !== 1 ? "s" : ""}`}
              {selectedCategory !== "All" && (
                <> in <strong>{selectedCategory}</strong></>
              )}
              {deferredSearch && (
                <> for <strong>"{deferredSearch}"</strong></>
              )}
            </p>
            {(deferredSearch || selectedCategory !== "All") && (
              <button className="bp-clear-filters" onClick={() => { clearSearch(); setSelectedCategory("All"); }}>
                <X size={13} /> Clear filters
              </button>
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bp-empty" role="alert">
            <FileText size={40} aria-hidden="true" />
            <p>{error}</p>
            <button className="bp-retry" onClick={() => window.location.reload()}>Retry</button>
          </div>
        )}

        {/* Skeleton / Posts grid */}
        <div className="bp-grid">
          {loading
            ? Array.from({ length: PAGE_SIZE }, (_, i) => <SkeletonCard key={i} />)
            : pagedPosts.map((post) => (
                <PostCard
                  key={getField(post, "blogId", "BlogId")}
                  post={post}
                  imageBaseUrl={IMAGE_BASE_URL}
                />
              ))
          }
        </div>

        {/* Empty state */}
        {!loading && !error && filteredPosts.length === 0 && (
          <div className="bp-empty">
            <FileText size={40} aria-hidden="true" />
            <p>No articles match your criteria.</p>
            <button className="bp-retry" onClick={() => { clearSearch(); setSelectedCategory("All"); }}>
              Show all articles
            </button>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && filteredPosts.length > 0 && (
          <Pagination current={currentPage} total={totalPages} onChange={handlePageChange} />
        )}
      </div>

      {/* ─────────── STYLES ─────────── */}
      <style>{`
        /* ── Tokens ── */
        .bp-page {
          --navy:    #000080;
          --navy-dk: #00004d;
          --saffron: #ff9933;
          --saffron-lt: #fff5e6;
          --green:   #128807;
          --muted:   #64748b;
          --border:  #e2e8f0;
          --surface: #ffffff;
          --bg:      #f5f7fa;
          --radius:  8px;
          --shadow:  0 1px 3px rgba(0,0,0,.07), 0 4px 16px rgba(0,0,0,.05);
          background: var(--bg);
          font-family: 'DM Sans', sans-serif;
          color: #1e293b;
          min-height: 100vh;
          -webkit-font-smoothing: antialiased;
        }
        .bp-container { max-width: 1200px; margin-inline: auto; padding-inline: 1.25rem; }

        /* ── Hero ── */
        .bp-hero {
          position: relative;
          border-top: 4px solid var(--saffron);
          background: #fff;
          padding: 2.5rem 0 2rem;
          overflow: hidden;
        }
        .bp-hero-bg {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, #fffaf3 0%, #fff 55%, #f0f4ff 100%);
          pointer-events: none;
        }
        .bp-hero-inner {
          position: relative;
          display: flex; flex-direction: column; gap: 1.5rem;
        }
        @media (min-width: 768px) {
          .bp-hero-inner { flex-direction: row; align-items: center; justify-content: space-between; }
        }

        .bp-badge {
          display: inline-flex; align-items: center; gap: .45rem;
          background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 20px;
          padding: .28rem .8rem; font-size: .68rem; font-weight: 700;
          color: #475569; letter-spacing: .05em; text-transform: uppercase;
          margin-bottom: .75rem;
        }
        .bp-hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.8rem, 4vw, 2.6rem);
          font-weight: 800; color: var(--navy); margin: 0 0 .5rem; line-height: 1.15;
        }
        .bp-accent { color: var(--saffron); }
        .bp-hero-sub { color: var(--muted); font-size: .92rem; margin: 0; line-height: 1.6; }

        /* ── Controls ── */
        .bp-controls {
          display: flex; flex-direction: column; gap: .6rem;
          flex-shrink: 0; width: 100%;
        }
        @media (min-width: 768px) { .bp-controls { width: 420px; } }
        @media (min-width: 480px) { .bp-controls { flex-direction: row; } }

        .bp-search-wrap {
          position: relative; flex: 1;
        }
        .bp-search-icon {
          position: absolute; left: .75rem; top: 50%; transform: translateY(-50%);
          color: var(--muted); pointer-events: none;
        }
        .bp-search {
          width: 100%; padding: .6rem .75rem .6rem 2.35rem;
          border: 1.5px solid var(--border); border-radius: var(--radius);
          font-size: .875rem; font-family: inherit; color: #1e293b;
          background: var(--surface); outline: none; box-sizing: border-box;
          transition: border-color .15s, box-shadow .15s;
        }
        .bp-search:focus { border-color: var(--navy); box-shadow: 0 0 0 3px rgba(0,0,128,.1); }
        .bp-search::-webkit-search-cancel-button { display: none; }
        .bp-search-clear {
          position: absolute; right: .6rem; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; color: var(--muted);
          display: grid; place-items: center; padding: .25rem; border-radius: 4px;
          transition: color .15s;
        }
        .bp-search-clear:hover { color: var(--navy); }

        /* ── Filter dropdown ── */
        .bp-filter-wrap { position: relative; flex-shrink: 0; }
        .bp-filter-btn {
          display: inline-flex; align-items: center; gap: .5rem;
          padding: .6rem .9rem; background: var(--navy); color: #fff;
          border: none; border-radius: var(--radius);
          font-size: .82rem; font-weight: 600; font-family: inherit;
          cursor: pointer; white-space: nowrap;
          transition: background .15s;
        }
        .bp-filter-btn:hover { background: var(--navy-dk); }
        .bp-chevron { transition: transform .2s; }
        .bp-chevron--open { transform: rotate(180deg); }
        .bp-dropdown {
          position: absolute; right: 0; top: calc(100% + .4rem); z-index: 200;
          background: var(--surface); border: 1.5px solid var(--border);
          border-radius: var(--radius); box-shadow: 0 8px 30px rgba(0,0,0,.12);
          list-style: none; margin: 0; padding: .35rem;
          min-width: 200px; max-height: 320px; overflow-y: auto;
        }
        .bp-dropdown-item {
          display: flex; align-items: center; justify-content: space-between;
          width: 100%; padding: .5rem .75rem;
          background: none; border: none; border-radius: 5px;
          font-size: .85rem; font-family: inherit; color: #334155;
          cursor: pointer; text-align: left;
          transition: background .12s;
        }
        .bp-dropdown-item:hover { background: #f8fafc; }
        .bp-dropdown-item--active { background: var(--saffron-lt); color: var(--navy); font-weight: 700; }
        .bp-dropdown-count {
          font-size: .7rem; font-weight: 700;
          background: #e2e8f0; color: var(--muted);
          padding: .1rem .45rem; border-radius: 20px;
        }

        /* ── Ticker ── */
        .bp-ticker {
          background: var(--navy); color: #fff;
          display: flex; align-items: center;
          padding: .5rem 1.25rem; gap: .75rem;
          overflow: hidden;
        }
        .bp-ticker-label {
          display: flex; align-items: center; gap: .35rem;
          font-size: .68rem; font-weight: 800; letter-spacing: .08em;
          color: var(--saffron); white-space: nowrap; flex-shrink: 0;
        }
        .bp-ticker-track { flex: 1; overflow: hidden; }
        .bp-ticker-text {
          display: inline-block;
          font-size: .78rem; font-weight: 500; white-space: nowrap;
          animation: ticker 28s linear infinite;
        }
        @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }

        /* ── Content area ── */
        .bp-content { padding-block: 1.75rem 3rem; }

        /* ── Result bar ── */
        .bp-result-bar {
          display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap;
          gap: .5rem; margin-bottom: 1.25rem;
        }
        .bp-result-count { font-size: .82rem; color: var(--muted); margin: 0; }
        .bp-clear-filters {
          display: inline-flex; align-items: center; gap: .3rem;
          background: none; border: 1px solid var(--border); border-radius: 20px;
          padding: .25rem .65rem; font-size: .75rem; font-weight: 600; color: var(--muted);
          cursor: pointer; transition: border-color .15s, color .15s;
        }
        .bp-clear-filters:hover { border-color: var(--navy); color: var(--navy); }

        /* ── Grid ── */
        .bp-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        @media (min-width: 640px) { .bp-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .bp-grid { grid-template-columns: repeat(2, 1fr); gap: 1.25rem; } }

        /* ── Card ── */
        .bp-card {
          background: var(--surface); border-radius: var(--radius);
          box-shadow: var(--shadow); border: 1.5px solid var(--border);
          display: flex; flex-direction: column;
          transition: transform .18s, box-shadow .18s, border-color .18s;
          overflow: hidden;
        }
        .bp-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 28px rgba(0,0,128,.1);
          border-color: var(--saffron);
        }
        @media (min-width: 640px) {
          .bp-card { flex-direction: row; }
          .bp-card-img-wrap { width: 220px; flex-shrink: 0; }
        }

        .bp-card-img-wrap {
          position: relative; overflow: hidden;
          height: 200px; flex-shrink: 0;
        }
        @media (min-width: 640px) { .bp-card-img-wrap { height: auto; } }

        .bp-card-img {
          width: 100%; height: 100%; object-fit: cover;
          display: block;
          transition: transform .3s;
        }
        .bp-card:hover .bp-card-img { transform: scale(1.04); }

        .bp-category-badge {
          position: absolute; top: .6rem; left: .6rem;
          background: var(--saffron); color: #fff;
          font-size: .6rem; font-weight: 800; letter-spacing: .07em;
          padding: .22rem .55rem; border-radius: 4px;
        }

        .bp-card-body {
          padding: 1.1rem 1.25rem 1.25rem;
          display: flex; flex-direction: column; flex: 1;
        }

        .bp-meta {
          display: flex; align-items: center; flex-wrap: wrap; gap: .4rem;
          margin-bottom: .65rem;
        }
        .bp-meta-item {
          display: inline-flex; align-items: center; gap: .3rem;
          font-size: .68rem; font-weight: 600; color: var(--muted);
          text-transform: uppercase; letter-spacing: .04em;
        }
        .bp-meta-sep {
          width: 3px; height: 3px; border-radius: 50%;
          background: var(--border); flex-shrink: 0;
        }

        .bp-card-title {
          font-family: 'Playfair Display', serif;
          font-size: 1rem; font-weight: 700; color: var(--navy);
          margin: 0 0 .6rem; line-height: 1.4;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        @media (min-width: 768px) { .bp-card-title { font-size: 1.05rem; } }

        .bp-card-desc {
          font-size: .85rem; color: var(--muted); line-height: 1.65; margin: 0 0 auto;
          display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
          padding-bottom: 1rem;
        }

        .bp-read-link {
          display: inline-flex; align-items: center; gap: .35rem;
          font-size: .78rem; font-weight: 700; color: var(--navy);
          text-decoration: none; text-transform: uppercase; letter-spacing: .05em;
          padding: .4rem .8rem; border: 1.5px solid var(--navy);
          border-radius: var(--radius); align-self: flex-start;
          transition: background .15s, color .15s;
        }
        .bp-read-link:hover { background: var(--navy); color: #fff; }

        /* ── Skeleton ── */
        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        .bp-skel {
          background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
          background-size: 800px 100%;
          animation: shimmer 1.4s ease-in-out infinite;
          border-radius: 5px;
        }
        .bp-card--skeleton { pointer-events: none; }
        .bp-card--skeleton .bp-card-img { background: #e2e8f0; }
        .bp-skel--meta  { height: 10px; width: 55%; margin-bottom: .8rem; }
        .bp-skel--title { height: 18px; width: 90%; margin-bottom: .5rem; }
        .bp-skel--line  { height: 13px; width: 100%; margin-bottom: .4rem; }
        .bp-skel--short { width: 70%; }
        .bp-skel--btn   { height: 30px; width: 130px; margin-top: .8rem; }

        /* ── Empty / Error ── */
        .bp-empty {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; gap: .75rem;
          padding: 4rem 2rem; text-align: center;
          background: var(--surface); border-radius: var(--radius);
          border: 1.5px dashed var(--border); color: var(--muted);
        }
        .bp-empty svg { opacity: .25; }
        .bp-empty p { font-size: .9rem; margin: 0; }
        .bp-retry {
          padding: .5rem 1.25rem;
          background: var(--navy); color: #fff;
          border: none; border-radius: var(--radius);
          font-size: .85rem; font-weight: 700; font-family: inherit;
          cursor: pointer; transition: background .15s;
        }
        .bp-retry:hover { background: var(--navy-dk); }

        /* ── Pagination ── */
        .bp-pagination {
          display: flex; align-items: center; justify-content: center;
          gap: .4rem; margin-top: 2rem; flex-wrap: wrap;
        }
        .bp-page-btn {
          display: grid; place-items: center;
          min-width: 38px; height: 38px; padding: 0 .5rem;
          background: var(--surface); border: 1.5px solid var(--border);
          border-radius: var(--radius); font-size: .85rem; font-weight: 600;
          color: #334155; font-family: inherit; cursor: pointer;
          transition: background .15s, border-color .15s, color .15s, transform .12s;
        }
        .bp-page-btn:hover:not(:disabled) {
          border-color: var(--navy); color: var(--navy);
          transform: translateY(-1px);
        }
        .bp-page-btn:disabled { opacity: .35; cursor: not-allowed; }
        .bp-page-btn--active {
          background: var(--navy); border-color: var(--navy); color: #fff;
        }
        .bp-page-btn--active:hover { background: var(--navy-dk); border-color: var(--navy-dk); color: #fff; }
        .bp-page-arrow { color: var(--muted); }
        .bp-page-dots {
          display: grid; place-items: center;
          min-width: 38px; height: 38px;
          font-size: .9rem; color: var(--muted);
        }
      `}</style>
    </main>
  );
}