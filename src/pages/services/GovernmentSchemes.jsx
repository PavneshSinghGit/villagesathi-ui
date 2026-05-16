import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import {
  Search, FileText, CheckCircle, Building2, RefreshCw,
  HelpCircle, ArrowUpRight, ChevronDown, ChevronUp,
  Tractor, HeartPulse, GraduationCap, Scale, Filter, X
} from "lucide-react";

// ─── API ──────────────────────────────────────────────────────────────────────
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORY_CONFIG = {
  agriculture: { Icon: Tractor,       color: "#128807", bg: "#e6f3e6", label: "Agriculture" },
  health:      { Icon: HeartPulse,    color: "#c0392b", bg: "#fdf2f2", label: "Health"      },
  education:   { Icon: GraduationCap, color: "#000080", bg: "#eef2fb", label: "Education"   },
  default:     { Icon: Building2,     color: "#b45309", bg: "#fff4e6", label: "General"      },
};

const getCat = (category) =>
  CATEGORY_CONFIG[category?.toLowerCase()] ?? CATEGORY_CONFIG.default;

const REQUIRED_DOCS = [
  "Mobile-linked Aadhaar Card",
  "Bank Passbook (DBT enabled)",
  "Income Certificate",
  "Land Records / Khatoni",
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function GovernmentSchemes() {
  const [schemes, setSchemes]           = useState([]);
  const [searchTerm, setSearchTerm]     = useState("");
  const [activeCategory, setCategory]   = useState("All");
  const [loading, setLoading]           = useState(true);
  const [fetchError, setFetchError]     = useState(false);
  const [docsOpen, setDocsOpen]         = useState(false);
  const [filterOpen, setFilterOpen]     = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/GovtSchemes/GetAll");
        setSchemes(Array.isArray(res.data.data) ? res.data.data : []);
      } catch {
        setFetchError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const categories = useMemo(() => {
    const counts = schemes.reduce((acc, s) => {
      const c = s.category || "General";
      acc[c] = (acc[c] || 0) + 1;
      return acc;
    }, {});
    return [{ name: "All", count: schemes.length },
      ...Object.entries(counts).map(([name, count]) => ({ name, count }))];
  }, [schemes]);

  const filtered = useMemo(() =>
    schemes.filter((s) => {
      const q = searchTerm.toLowerCase();
      const matchSearch = !q ||
        s.schemeName?.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q);
      const matchCat = activeCategory === "All" || s.category === activeCategory;
      return matchSearch && matchCat;
    }),
  [schemes, searchTerm, activeCategory]);

  const clearSearch = useCallback(() => setSearchTerm(""), []);

  if (loading) return <LoadingScreen />;
  if (fetchError) return <ErrorScreen />;

  return (
    <main className="gs-root">
      <Helmet>
        <title>Sarkari Yojana Hub — Government Schemes | VillageSathi</title>
        <meta name="description" content="Official repository for PM-Kisan, PM Awas Yojana, and Uttar Pradesh government schemes. Check eligibility and apply online." />
        <meta name="keywords" content="sarkari yojana, PM Kisan, PM Awas Yojana, government schemes UP, village welfare schemes, ration card eKYC" />
        <meta property="og:title" content="Sarkari Yojana Hub | VillageSathi" />
        <meta property="og:description" content="Transparent access to Bharat's welfare initiatives for every village." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://villagesathi.in/schemes" />
      </Helmet>

      {/* Hero */}
      <header className="gs-hero" role="banner">
        <div className="gs-container gs-hero-inner">
          <div className="gs-hero-text">
            <span className="gs-badge">
              <Scale size={13} aria-hidden="true" />
              Public Welfare Initiatives
            </span>
            <h1 className="gs-hero-title">
              Government <span className="gs-saffron">Schemes</span> Hub
            </h1>
            <p className="gs-hero-sub">
              Transparent access to Bharat's welfare initiatives for every village.
            </p>
          </div>

          {/* Search + filter */}
          <div className="gs-search-row">
            <div className="gs-search-wrap">
              <Search size={16} className="gs-search-icon" aria-hidden="true" />
              <input
                type="search"
                className="gs-search"
                placeholder="Search yojana name…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search government schemes"
              />
              {searchTerm && (
                <button className="gs-search-clear" onClick={clearSearch} aria-label="Clear search">
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Mobile filter toggle */}
            <button
              className="gs-filter-toggle"
              onClick={() => setFilterOpen((v) => !v)}
              aria-expanded={filterOpen}
              aria-label="Toggle category filter"
            >
              <Filter size={15} aria-hidden="true" />
              {activeCategory !== "All" ? activeCategory : "Filter"}
              {filterOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>
          </div>
        </div>
      </header>

      {/* Ticker */}
      <div className="gs-ticker" role="marquee" aria-label="Live scheme updates">
        <span className="gs-ticker-live" aria-hidden="true">LIVE</span>
        <marquee className="gs-ticker-text">
          PM-Kisan 17th Installment status live &nbsp;•&nbsp; PM Awas Yojana (Gramin) 2026 list published &nbsp;•&nbsp; e-KYC mandatory for all ration cards
        </marquee>
      </div>

      {/* Mobile category pills */}
      {filterOpen && (
        <div className="gs-filter-pills gs-container" role="group" aria-label="Filter by category">
          {categories.map((c) => (
            <button
              key={c.name}
              className={`gs-pill ${activeCategory === c.name ? "gs-pill--active" : ""}`}
              onClick={() => { setCategory(c.name); setFilterOpen(false); }}
              aria-pressed={activeCategory === c.name}
            >
              {c.name} <span className="gs-pill-count">{c.count}</span>
            </button>
          ))}
        </div>
      )}

      {/* Body */}
      <div className="gs-container gs-body">
        <div className="gs-layout">

          {/* Sidebar */}
          <aside className="gs-sidebar" aria-label="Sidebar">

            {/* Desktop category list */}
            <nav className="gs-card gs-card--navy-top" aria-label="Filter by category">
              <h2 className="gs-section-label">Browse by Category</h2>
              <ul className="gs-cat-list" role="list">
                {categories.map((c) => (
                  <li key={c.name}>
                    <button
                      className={`gs-cat-btn ${activeCategory === c.name ? "gs-cat-btn--active" : ""}`}
                      onClick={() => setCategory(c.name)}
                      aria-pressed={activeCategory === c.name}
                    >
                      <span>{c.name}</span>
                      <span className="gs-cat-count">{c.count}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Required documents */}
            <div className="gs-card">
              <button
                className="gs-docs-toggle"
                onClick={() => setDocsOpen((v) => !v)}
                aria-expanded={docsOpen}
              >
                <span className="gs-section-label" style={{ margin: 0 }}>अनिवार्य दस्तावेज</span>
                {docsOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </button>
              {docsOpen && (
                <ul className="gs-docs-list" role="list" aria-label="Required documents">
                  {REQUIRED_DOCS.map((doc) => (
                    <li key={doc} className="gs-doc-item">
                      <CheckCircle size={13} className="gs-doc-check" aria-hidden="true" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* CSC locator */}
            <div className="gs-card gs-csc-card">
              <Building2 size={28} className="gs-csc-icon" aria-hidden="true" />
              <p className="gs-csc-label">Locate nearest CSC</p>
              <a
                href="https://locator.csccloud.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="gs-btn-navy gs-csc-btn"
                aria-label="Find nearest Common Service Center"
              >
                Find Center <ArrowUpRight size={13} aria-hidden="true" />
              </a>
            </div>
          </aside>

          {/* Scheme cards */}
          <section aria-label={`Government schemes — ${filtered.length} result${filtered.length !== 1 ? "s" : ""}`}>
            <p className="gs-result-count" aria-live="polite">
              Showing <strong>{filtered.length}</strong> scheme{filtered.length !== 1 ? "s" : ""}
              {activeCategory !== "All" && <> in <em>{activeCategory}</em></>}
              {searchTerm && <> matching "<em>{searchTerm}</em>"</>}
            </p>

            {filtered.length > 0 ? (
              <div className="gs-schemes">
                {filtered.map((scheme) => (
                  <SchemeCard key={scheme.id} scheme={scheme} />
                ))}
              </div>
            ) : (
              <EmptyState onClear={() => { setSearchTerm(""); setCategory("All"); }} />
            )}
          </section>
        </div>
      </div>

      <style>{CSS}</style>
    </main>
  );
}

// ─── Scheme Card ──────────────────────────────────────────────────────────────
function SchemeCard({ scheme }) {
  const cat = getCat(scheme.category);
  const { Icon } = cat;

  return (
    <article className="gs-scheme-card" aria-label={scheme.schemeName}>
      <div className="gs-scheme-main">
        <header className="gs-scheme-header">
          <span
            className="gs-cat-badge"
            style={{ background: cat.bg, color: cat.color }}
            aria-label={`Category: ${cat.label}`}
          >
            <Icon size={12} aria-hidden="true" />
            {(scheme.category || "General").toUpperCase()}
          </span>
          <span className="gs-scheme-id">ID: VS-{scheme.id}</span>
        </header>

        <h2 className="gs-scheme-name">{scheme.schemeName}</h2>
        <p className="gs-scheme-desc">{scheme.description}</p>

        <div className="gs-scheme-meta">
          <div className="gs-meta-block gs-meta-block--navy">
            <dt className="gs-meta-label">पात्रता (Eligibility)</dt>
            <dd className="gs-meta-val">{scheme.eligibility}</dd>
          </div>
          <div className="gs-meta-block gs-meta-block--saffron">
            <dt className="gs-meta-label">लाभ (Benefits)</dt>
            <dd className="gs-meta-val">{scheme.benefits}</dd>
          </div>
        </div>
      </div>

      <div className="gs-scheme-action">
        {scheme.link ? (
          <a
            href={scheme.link}
            target="_blank"
            rel="noopener noreferrer"
            className="gs-btn-apply"
            aria-label={`Apply for ${scheme.schemeName}`}
          >
            Apply Now <ArrowUpRight size={13} aria-hidden="true" />
          </a>
        ) : (
          <span className="gs-btn-apply gs-btn-apply--disabled" aria-disabled="true">
            Coming Soon
          </span>
        )}
      </div>
    </article>
  );
}

// ─── Utility screens ──────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div className="gs-fullscreen" role="status" aria-label="Loading schemes">
      <RefreshCw size={36} className="gs-spin gs-navy" aria-hidden="true" />
      <p className="gs-loading-text">सरकारी योजना डेटा लोड हो रहा है…</p>
      <p className="gs-loading-sub">Loading government scheme data</p>
    </div>
  );
}

function ErrorScreen() {
  return (
    <div className="gs-fullscreen" role="alert">
      <HelpCircle size={36} className="gs-muted" aria-hidden="true" />
      <p className="gs-loading-text">Could not load schemes.</p>
      <p className="gs-loading-sub">Please check your connection and refresh the page.</p>
    </div>
  );
}

function EmptyState({ onClear }) {
  return (
    <div className="gs-empty" role="status">
      <HelpCircle size={40} aria-hidden="true" />
      <p className="gs-empty-title">No schemes found</p>
      <p className="gs-empty-sub">Try a different search term or category.</p>
      <button className="gs-btn-navy" onClick={onClear}>Clear filters</button>
    </div>
  );
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
  :root {
    --navy:    #000080;
    --navy-dk: #00005a;
    --saffron: #ff9933;
    --saff-dk: #e07000;
    --success: #128807;
    --text:    #1e293b;
    --muted:   #64748b;
    --border:  rgba(0,0,128,0.13);
    --bg:      #f8fafc;
    --card:    #ffffff;
    --radius:  4px;
    --gap:     1.25rem;
  }

  /* Root */
  .gs-root { background: var(--bg); min-height: 100vh; color: var(--text); font-family: 'Noto Sans', system-ui, sans-serif; }
  .gs-container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
  @media (min-width: 768px) { .gs-container { padding: 0 2rem; } }

  /* Hero */
  .gs-hero {
    background: linear-gradient(160deg, #fff8f0 0%, #fff 60%);
    border-top: 4px solid var(--saffron);
    padding: 1.75rem 0 1.5rem;
  }
  .gs-hero-inner { display: flex; flex-direction: column; gap: 1.25rem; }
  @media (min-width: 768px) {
    .gs-hero-inner { flex-direction: row; align-items: center; justify-content: space-between; }
  }
  .gs-hero-title {
    font-size: clamp(1.4rem, 3.5vw, 2rem); font-weight: 800;
    color: var(--navy); margin: 0.35rem 0 0;
  }
  .gs-hero-sub { color: var(--muted); margin: 0.2rem 0 0; font-size: 0.88rem; }
  .gs-saffron { color: var(--saffron); }
  .gs-badge {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 0.63rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em;
    background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 3px;
    padding: 3px 8px; color: var(--navy);
  }

  /* Search */
  .gs-search-row { display: flex; gap: 0.5rem; align-items: center; flex-wrap: nowrap; }
  @media (min-width: 768px) { .gs-search-row { min-width: 380px; } }
  .gs-search-wrap { position: relative; flex: 1; }
  .gs-search-icon { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: var(--muted); pointer-events: none; }
  .gs-search {
    width: 100%; height: 40px; padding: 0 36px 0 36px;
    border: 1px solid var(--border); border-radius: var(--radius);
    font-size: 0.85rem; background: #fff; color: var(--text);
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .gs-search:focus { outline: none; border-color: var(--navy); box-shadow: 0 0 0 2px rgba(0,0,128,0.15); }
  .gs-search-clear {
    position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer; color: var(--muted); padding: 2px;
    display: flex; align-items: center;
  }
  .gs-filter-toggle {
    display: inline-flex; align-items: center; gap: 5px; white-space: nowrap;
    height: 40px; padding: 0 12px; background: var(--navy); color: #fff;
    border: none; border-radius: var(--radius); font-size: 0.8rem; font-weight: 700;
    cursor: pointer; transition: background 0.15s;
  }
  .gs-filter-toggle:hover { background: var(--navy-dk); }
  @media (min-width: 992px) { .gs-filter-toggle { display: none; } }

  /* Mobile category pills */
  .gs-filter-pills {
    display: flex; flex-wrap: wrap; gap: 0.5rem;
    padding: 0.75rem 1rem; background: #fff; border-bottom: 1px solid var(--border);
  }
  @media (min-width: 992px) { .gs-filter-pills { display: none; } }
  .gs-pill {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 5px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600;
    background: #f1f5f9; color: var(--muted); border: 1px solid var(--border); cursor: pointer;
    transition: background 0.15s, color 0.15s;
  }
  .gs-pill:hover { background: #e2e8f0; }
  .gs-pill--active { background: var(--navy); color: #fff; border-color: var(--navy); }
  .gs-pill-count { font-size: 0.65rem; opacity: 0.75; }

  /* Ticker */
  .gs-ticker {
    background: var(--navy); padding: 6px 1rem;
    display: flex; align-items: center; gap: 8px;
  }
  .gs-ticker-live {
    font-size: 0.55rem; font-weight: 800; letter-spacing: 0.08em;
    background: #dc2626; color: #fff; padding: 2px 5px; border-radius: 2px;
    flex-shrink: 0;
  }
  .gs-ticker-text { font-size: 0.78rem; color: rgba(255,255,255,0.85); flex: 1; }

  /* Body layout */
  .gs-body { padding: 1.5rem 0 3rem; }
  .gs-layout { display: grid; gap: var(--gap); }
  @media (min-width: 992px) { .gs-layout { grid-template-columns: 260px 1fr; align-items: start; } }

  /* Sidebar */
  .gs-sidebar { display: flex; flex-direction: column; gap: 0.75rem; }
  @media (min-width: 992px) { .gs-sidebar { position: sticky; top: 1rem; } }

  /* Cards */
  .gs-card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 1rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }
  .gs-card--navy-top { border-top: 4px solid var(--navy); }
  .gs-section-label {
    display: block; font-size: 0.68rem; font-weight: 800; text-transform: uppercase;
    letter-spacing: 0.06em; color: var(--navy); margin-bottom: 0.75rem;
    padding-bottom: 0.5rem; border-bottom: 1px solid var(--border);
  }

  /* Category list */
  .gs-cat-list { list-style: none; margin: 0; padding: 0; display: none; flex-direction: column; gap: 2px; }
  @media (min-width: 992px) { .gs-cat-list { display: flex; } }
  .gs-cat-btn {
    display: flex; justify-content: space-between; align-items: center;
    width: 100%; background: none; border: none; text-align: left;
    font-size: 0.83rem; padding: 7px 8px; border-radius: 3px; cursor: pointer;
    color: var(--muted); transition: background 0.12s, color 0.12s;
  }
  .gs-cat-btn:hover { background: #f1f5f9; color: var(--navy); }
  .gs-cat-btn--active { background: #eef2fb; color: var(--navy); font-weight: 700; }
  .gs-cat-count {
    font-size: 0.68rem; font-weight: 700; background: #e2e8f0;
    color: var(--muted); padding: 1px 7px; border-radius: 10px;
  }
  .gs-cat-btn--active .gs-cat-count { background: var(--navy); color: #fff; }

  /* Docs toggle */
  .gs-docs-toggle {
    display: flex; justify-content: space-between; align-items: center;
    width: 100%; background: none; border: none; cursor: pointer; padding: 0;
    color: var(--navy);
  }
  .gs-docs-list { list-style: none; margin: 0.75rem 0 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
  .gs-doc-item { display: flex; align-items: flex-start; gap: 7px; font-size: 0.8rem; color: var(--text); }
  .gs-doc-check { color: var(--success); flex-shrink: 0; margin-top: 2px; }

  /* CSC card */
  .gs-csc-card { text-align: center; }
  .gs-csc-icon { color: var(--navy); opacity: 0.2; margin-bottom: 0.5rem; }
  .gs-csc-label { font-weight: 700; font-size: 0.83rem; color: var(--navy); margin: 0 0 0.5rem; }
  .gs-csc-btn { width: 100%; justify-content: center; margin-top: 0.25rem; }

  /* Buttons */
  .gs-btn-navy {
    display: inline-flex; align-items: center; gap: 5px;
    background: var(--navy); color: #fff; border: none; border-radius: var(--radius);
    font-size: 0.8rem; font-weight: 700; padding: 8px 14px; cursor: pointer;
    transition: background 0.15s; text-decoration: none;
  }
  .gs-btn-navy:hover { background: var(--navy-dk); color: #fff; }

  /* Result count */
  .gs-result-count {
    font-size: 0.8rem; color: var(--muted); margin: 0 0 0.75rem;
  }
  .gs-result-count strong, .gs-result-count em { color: var(--navy); font-style: normal; }

  /* Scheme list */
  .gs-schemes { display: flex; flex-direction: column; gap: 0.75rem; }

  /* Scheme card */
  .gs-scheme-card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 1.1rem 1.25rem;
    display: flex; flex-direction: column; gap: 1rem; white-space: normal;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    transition: border-color 0.18s, box-shadow 0.18s, transform 0.15s;
  }
  .gs-scheme-card:hover {
    border-color: var(--saffron);
    box-shadow: 0 4px 12px rgba(255,153,51,0.12);
    transform: translateY(-1px);
  }
  @media (min-width: 640px) {
    .gs-scheme-card { flex-direction: row; align-items: flex-start; }
  }

  .gs-scheme-main { flex: 1; min-width: 0; }
  .gs-scheme-header { display: flex; align-items: center; gap: 8px; margin-bottom: 0.4rem; flex-wrap: wrap; }
  .gs-cat-badge {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 0.58rem; font-weight: 800; letter-spacing: 0.05em;
    padding: 3px 7px; border-radius: 3px;
  }
  .gs-scheme-id { font-size: 0.65rem; color: var(--muted); font-weight: 600; }
  .gs-scheme-name { font-size: 0.95rem; font-weight: 700; color: var(--navy); margin: 0 0 0.4rem; line-height: 1.35; }
  .gs-scheme-desc {
    font-size: 0.8rem; color: var(--muted); margin: 0 0 0.75rem;
    line-height: 1.55; display: -webkit-box; -webkit-line-clamp: 3;
    -webkit-box-orient: vertical; overflow: hidden;
  }

  /* Meta grid */
  .gs-scheme-meta { display: grid; gap: 0.5rem; }
  @media (min-width: 480px) { .gs-scheme-meta { grid-template-columns: 1fr 1fr; } }
  .gs-meta-block {
    padding: 8px 10px; border-left: 3px solid; border-radius: 2px;
    background: #f8fafc;
  }
  .gs-meta-block--navy { border-color: var(--navy); }
  .gs-meta-block--saffron { border-color: var(--saffron); }
  .gs-meta-label { display: block; font-size: 0.6rem; font-weight: 800; text-transform: uppercase; color: var(--muted); margin-bottom: 2px; }
  .gs-meta-val { font-size: 0.78rem; font-weight: 600; color: var(--text); margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  /* Apply action */
  .gs-scheme-action {
    display: flex; align-items: flex-start;
    flex-shrink: 0;
  }
  @media (min-width: 640px) { .gs-scheme-action { padding-left: 1rem; border-left: 1px solid var(--border); } }
  .gs-btn-apply {
    display: inline-flex; align-items: center; gap: 5px; white-space: nowrap;
    background: var(--saffron); color: #fff; text-decoration: none;
    border: none; border-radius: var(--radius); font-size: 0.75rem; font-weight: 800;
    padding: 9px 14px; cursor: pointer; letter-spacing: 0.02em;
    transition: background 0.15s;
  }
  .gs-btn-apply:hover { background: var(--saff-dk); color: #fff; }
  .gs-btn-apply--disabled { background: #e2e8f0; color: var(--muted); cursor: not-allowed; }

  /* Empty / loading / error screens */
  .gs-fullscreen {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    min-height: 100vh; gap: 0.5rem; padding: 2rem;
  }
  .gs-empty {
    display: flex; flex-direction: column; align-items: center;
    padding: 3rem 1rem; text-align: center; color: #94a3b8;
    background: var(--card); border: 1px solid var(--border); border-radius: var(--radius);
  }
  .gs-empty-title { font-weight: 700; font-size: 0.9rem; color: var(--navy); margin: 0.75rem 0 0.25rem; }
  .gs-empty-sub { font-size: 0.8rem; margin: 0 0 1rem; }
  .gs-loading-text { font-weight: 700; font-size: 0.95rem; color: var(--navy); margin: 0.5rem 0 0; }
  .gs-loading-sub { font-size: 0.8rem; color: var(--muted); margin: 0; }
  .gs-navy { color: var(--navy); }
  .gs-muted { color: var(--muted); }

  /* Spin */
  .gs-spin { animation: gsSpin 1s linear infinite; }
  @keyframes gsSpin { to { transform: rotate(360deg); } }
`;