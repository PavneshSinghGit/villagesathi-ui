import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  Calendar, User, ArrowLeft, Printer, Share2,
  Bookmark, Zap, Tag, Clock, ChevronUp
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import DOMPurify from "dompurify";

/* ── Env ── */
const API_BASE_URL   = import.meta.env.VITE_API_URL;
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_URL;
const FALLBACK_IMG   = "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1200&q=80";

/* ── Helpers ── */
const getField = (obj, ...keys) => {
  if (!obj) return undefined;
  for (const k of keys) if (obj[k] !== undefined && obj[k] !== null) return obj[k];
  return undefined;
};

const buildImageUrl = (url) => {
  if (!url) return FALLBACK_IMG;
  if (url.startsWith("http")) return url;
  const base = IMAGE_BASE_URL?.endsWith("/") ? IMAGE_BASE_URL.slice(0, -1) : IMAGE_BASE_URL;
  const path = url.startsWith("/") ? url : `/${url}`;
  return `${base}${path}`;
};

const formatDate = (raw) => {
  try {
    return new Date(raw).toLocaleDateString("en-IN", {
      day: "2-digit", month: "long", year: "numeric",
    });
  } catch { return ""; }
};

const estimateReadTime = (html = "") => {
  const text = html.replace(/<[^>]+>/g, " ");
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
};

/* ── Reading progress bar ── */
function ReadingProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const handler = () => {
      const el    = document.documentElement;
      const total = el.scrollHeight - el.clientHeight;
      if (total <= 0) return;
      setPct(Math.min(100, (window.scrollY / total) * 100));
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="bd-progress-track" aria-hidden="true">
      <div className="bd-progress-fill" style={{ width: `${pct}%` }} />
    </div>
  );
}

/* ── Skeleton ── */
function Skeleton() {
  return (
    <main className="bd-page">
      <div className="bd-nav-bar">
        <div className="bd-container bd-nav-inner">
          <div className="bd-skel" style={{ width: 80, height: 18 }} />
          <div style={{ display: "flex", gap: ".6rem" }}>
            <div className="bd-skel" style={{ width: 32, height: 32, borderRadius: 8 }} />
            <div className="bd-skel" style={{ width: 32, height: 32, borderRadius: 8 }} />
          </div>
        </div>
      </div>
      <div className="bd-container bd-layout">
        <div className="bd-main-col">
          <div className="bd-skel" style={{ width: 90, height: 22, marginBottom: "1rem" }} />
          <div className="bd-skel" style={{ width: "90%", height: 36, marginBottom: ".5rem" }} />
          <div className="bd-skel" style={{ width: "70%", height: 36, marginBottom: "1.5rem" }} />
          <div className="bd-skel" style={{ width: "100%", height: 420, borderRadius: 10 }} />
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bd-skel" style={{ width: `${95 - i * 5}%`, height: 16, marginTop: "1rem" }} />
          ))}
        </div>
      </div>
      <style>{skeletonCSS}</style>
    </main>
  );
}

/* ── Share helper ── */
const handleShare = async (title, url) => {
  if (navigator.share) {
    try { await navigator.share({ title, url }); } catch { /* user cancelled */ }
  } else {
    await navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!");
  }
};

/* ── Print helper ── */
const handlePrint = (post, contentHtml) => {
  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(`<!DOCTYPE html><html lang="en"><head>
    <meta charset="UTF-8">
    <title>${post.title} | VillageSathi</title>
    <style>
      @page { size: A4; margin: 20mm 15mm; }
      * { box-sizing: border-box; max-width: 100%; }
      body { font-family: Georgia, serif; color: #1a1a1a; line-height: 1.7; }
      .hdr { border-bottom: 3px double #000080; padding-bottom: 10px; margin-bottom: 18px; display: flex; justify-content: space-between; align-items: center; }
      .hdr-brand { font-size: 10px; font-weight: 700; color: #ff9933; text-transform: uppercase; letter-spacing: .08em; }
      .hdr-date  { font-size: 10px; color: #64748b; }
      h1 { font-size: 22px; color: #000080; margin: 0 0 10px; line-height: 1.25; word-wrap: break-word; }
      .meta { font-size: 11px; color: #64748b; margin-bottom: 18px; display: flex; gap: 20px; border-bottom: 1px solid #eee; padding-bottom: 8px; }
      img { max-width: 100%; height: auto; display: block; margin: 16px 0; border-radius: 4px; }
      p  { margin: 0 0 1rem; text-align: justify; font-size: 13px; }
      h2 { font-size: 16px; color: #000080; border-left: 4px solid #ff9933; padding-left: 10px; margin: 1.5rem 0 .75rem; }
      h3 { font-size: 14px; color: #000080; margin: 1.2rem 0 .6rem; }
      table { width: 100%; border-collapse: collapse; margin: 14px 0; table-layout: fixed; }
      td, th { border: 1px solid #ddd; padding: 8px; font-size: 11px; word-wrap: break-word; }
      th { background: #f1f5f9; font-weight: 700; }
      .ftr { margin-top: 30px; font-size: 9px; color: #999; text-align: center; border-top: 1px solid #eee; padding-top: 8px; }
      @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
    </style>
  </head><body>
    <div class="hdr">
      <span class="hdr-brand">VillageSathi Patrika — Official Rural Media</span>
      <span class="hdr-date">${formatDate(post.createdDate || Date.now())}</span>
    </div>
    <h1>${post.title}</h1>
    <div class="meta">
      <span>By: ${post.authorName || "Team VillageSathi"}</span>
      <span>Category: ${post.category || "General"}</span>
    </div>
    ${contentHtml}
    <div class="ftr">Generated from VillageSathi Platforms — Digital Rural Empowerment Portal · villagesathi.in</div>
  </body></html>`);
  win.document.close();
  const imgs = win.document.images;
  if (!imgs.length) { win.print(); return; }
  let done = 0;
  const tryPrint = () => { done++; if (done === imgs.length) win.print(); };
  Array.from(imgs).forEach(img => { img.onload = img.onerror = tryPrint; if (img.complete) tryPrint(); });
};

/* ── Main ── */
export default function BlogDetail() {
  const { slug }    = useParams();
  const contentRef  = useRef(null);
  const [post, setPost]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(false);
  const [imgError, setImgError] = useState(false);
  const [saved, setSaved]       = useState(false);
  const [showTop, setShowTop]   = useState(false);

  /* scroll-to-top visibility */
  useEffect(() => {
    const t = () => setShowTop(window.scrollY > 500);
    window.addEventListener("scroll", t, { passive: true });
    return () => window.removeEventListener("scroll", t);
  }, []);

  /* fetch */
  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    const fetchPost = async () => {
      setLoading(true); setError(false);
      try {
        const res  = await axios.get(`${API_BASE_URL}/Blogs/${slug}`, { signal: controller.signal });
        if (cancelled) return;
        const data = res.data?.data ?? res.data;
        setPost(data);
      } catch (err) {
        if (!cancelled && !axios.isCancel(err)) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchPost();
    window.scrollTo({ top: 0, behavior: "instant" });
    return () => { cancelled = true; controller.abort(); };
  }, [slug]);

  const sanitizedContent = useMemo(() =>
    post?.content ? DOMPurify.sanitize(post.content, { ADD_TAGS: ["iframe"], ADD_ATTR: ["allow", "allowfullscreen", "frameborder"] }) : ""
  , [post]);

  const readTime = useMemo(() => estimateReadTime(post?.content), [post]);

  const onPrint = useCallback(() => {
    if (!post || !contentRef.current) return;
    handlePrint(post, contentRef.current.innerHTML);
  }, [post]);

  if (loading) return <Skeleton />;

  if (error || !post) return (
    <main className="bd-page bd-error-page">
      <div className="bd-error-box">
        <span className="bd-error-code">404</span>
        <h1 className="bd-error-title">लेख नहीं मिला</h1>
        <p className="bd-error-sub">Article Not Found</p>
        <Link to="/blog" className="bd-back-btn">
          <ArrowLeft size={16} /> Back to Patrika
        </Link>
      </div>
      <style>{pageCSS}</style>
    </main>
  );

  const imgSrc = imgError ? FALLBACK_IMG : buildImageUrl(getField(post, "imageUrl", "ImageUrl"));

  return (
    <main className="bd-page">
      <Helmet>
        <title>{post.title} | VillageSathi Official Patrika</title>
        <meta name="description" content={getField(post, "shortDescription", "ShortDescription") || ""} />
        <meta property="og:title"       content={post.title} />
        <meta property="og:description" content={getField(post, "shortDescription", "ShortDescription") || ""} />
        <meta property="og:image"       content={imgSrc} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Helmet>

      <ReadingProgress />

      {/* ── Sticky nav ── */}
      <nav className="bd-nav-bar" aria-label="Article navigation">
        <div className="bd-container bd-nav-inner">
          <Link to="/blog" className="bd-back-link">
            <ArrowLeft size={15} aria-hidden="true" /> वापस / Back
          </Link>
          <div className="bd-nav-actions">
            <button
              className="bd-icon-btn"
              onClick={() => handleShare(post.title, window.location.href)}
              aria-label="Share article"
              title="Share"
            >
              <Share2 size={17} />
            </button>
            <button
              className={`bd-icon-btn ${saved ? "bd-icon-btn--active" : ""}`}
              onClick={() => setSaved(s => !s)}
              aria-label={saved ? "Unsave article" : "Save article"}
              aria-pressed={saved}
              title={saved ? "Saved" : "Save"}
            >
              <Bookmark size={17} fill={saved ? "currentColor" : "none"} />
            </button>
            <button
              className="bd-icon-btn"
              onClick={onPrint}
              aria-label="Print / Save as PDF"
              title="Print / Save PDF"
            >
              <Printer size={17} />
            </button>
          </div>
        </div>
      </nav>

      <div className="bd-container bd-layout">
        {/* ── Main column ── */}
        <article className="bd-main-col">

          {/* ── Category + badges ── */}
          <div className="bd-badges">
            <span className="bd-category-badge">
              <Tag size={11} aria-hidden="true" />
              {(getField(post, "category", "Category") || "General").toUpperCase()}
            </span>
            <span className="bd-official-badge">OFFICIAL GAZETTE</span>
          </div>

          {/* ── Title ── */}
          <h1 className="bd-title">{post.title}</h1>

          {/* ── Meta strip ── */}
          <div className="bd-meta-strip">
            <div className="bd-author">
              <span className="bd-author-avatar" aria-hidden="true">
                <User size={15} />
              </span>
              <span className="bd-author-name">
                {getField(post, "authorName", "AuthorName") || "Team VillageSathi"}
              </span>
            </div>
            <div className="bd-meta-right">
              <span className="bd-meta-item">
                <Calendar size={13} aria-hidden="true" />
                {formatDate(getField(post, "createdDate", "CreatedDate") || Date.now())}
              </span>
              <span className="bd-meta-sep" aria-hidden="true" />
              <span className="bd-meta-item">
                <Clock size={13} aria-hidden="true" />
                {readTime} min read
              </span>
            </div>
          </div>

          {/* ── Hero image ── */}
          <figure className="bd-hero-figure">
            <img
              src={imgSrc}
              alt={post.title}
              className="bd-hero-img"
              loading="eager"
              decoding="async"
              onError={() => setImgError(true)}
            />
          </figure>

          {/* ── Content ── */}
          <div className="bd-content-wrap" ref={contentRef}>
            <div
              className="bd-content-body"
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />
          </div>

          {/* ── Footer CTA ── */}
          <aside className="bd-cta" aria-label="Tip">
            <span className="bd-cta-icon" aria-hidden="true"><Zap size={22} /></span>
            <div>
              <p className="bd-cta-heading">Rural Empowerment Tip</p>
              <p className="bd-cta-body">
                VillageSathi provides direct access to resources for 500+ Gram Panchayats.
                Stay updated via our weekly Patrika.
              </p>
            </div>
          </aside>

          {/* ── Back link ── */}
          <div className="bd-back-row">
            <Link to="/blog" className="bd-back-full">
              <ArrowLeft size={15} aria-hidden="true" /> All Articles
            </Link>
          </div>
        </article>

        {/* ── Sidebar ── */}
        <aside className="bd-sidebar" aria-label="Article info">
          <div className="bd-sidebar-card">
            <p className="bd-sidebar-label">Category</p>
            <p className="bd-sidebar-val bd-sidebar-cat">
              {getField(post, "category", "Category") || "General"}
            </p>
          </div>
          <div className="bd-sidebar-card">
            <p className="bd-sidebar-label">Published</p>
            <p className="bd-sidebar-val">
              {formatDate(getField(post, "createdDate", "CreatedDate") || Date.now())}
            </p>
          </div>
          <div className="bd-sidebar-card">
            <p className="bd-sidebar-label">Author</p>
            <p className="bd-sidebar-val">
              {getField(post, "authorName", "AuthorName") || "Team VillageSathi"}
            </p>
          </div>
          <div className="bd-sidebar-card">
            <p className="bd-sidebar-label">Read Time</p>
            <p className="bd-sidebar-val">{readTime} min</p>
          </div>
          <button className="bd-sidebar-print" onClick={onPrint}>
            <Printer size={15} aria-hidden="true" /> Save as PDF
          </button>
          <button
            className={`bd-sidebar-save ${saved ? "bd-sidebar-save--active" : ""}`}
            onClick={() => setSaved(s => !s)}
            aria-pressed={saved}
          >
            <Bookmark size={15} fill={saved ? "currentColor" : "none"} aria-hidden="true" />
            {saved ? "Saved" : "Save Article"}
          </button>
        </aside>
      </div>

      {/* ── Scroll to top ── */}
      {showTop && (
        <button
          className="bd-scroll-top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll to top"
        >
          <ChevronUp size={20} />
        </button>
      )}

      <style>{pageCSS}</style>
    </main>
  );
}

/* ── Skeleton CSS (shared) ── */
const skeletonCSS = `
  @keyframes shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position: 600px 0; }
  }
  .bd-skel {
    background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
    background-size: 1200px 100%;
    animation: shimmer 1.4s ease-in-out infinite;
    border-radius: 5px; display: block;
  }
`;

/* ── Page CSS ── */
const pageCSS = `
  /* ── Tokens ── */
  .bd-page {
    --navy:      #000080;
    --navy-dk:   #00004d;
    --saffron:   #ff9933;
    --saffron-lt:#fff8ee;
    --green:     #128807;
    --green-lt:  #f0faf0;
    --muted:     #64748b;
    --border:    #e2e8f0;
    --surface:   #ffffff;
    --bg:        #f5f7fa;
    --radius:    8px;
    --shadow:    0 1px 4px rgba(0,0,0,.07), 0 6px 20px rgba(0,0,0,.05);
    background: var(--bg);
    font-family: 'DM Sans', sans-serif;
    color: #1e293b;
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  }
  .bd-container { max-width: 1140px; margin-inline: auto; padding-inline: 1.25rem; }

  /* ── Progress bar ── */
  .bd-progress-track {
    position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
    height: 3px; background: rgba(0,0,128,.12);
  }
  .bd-progress-fill {
    height: 100%; background: var(--saffron);
    transition: width .1s linear;
  }

  /* ── Nav ── */
  .bd-nav-bar {
    position: sticky; top: 0; z-index: 100;
    background: rgba(255,255,255,.92);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--border);
    border-top: 3px solid var(--saffron);
  }
  .bd-nav-inner {
    display: flex; align-items: center; justify-content: space-between;
    padding-block: .6rem;
  }
  .bd-back-link {
    display: inline-flex; align-items: center; gap: .4rem;
    font-size: .8rem; font-weight: 700; color: var(--navy);
    text-decoration: none; text-transform: uppercase; letter-spacing: .05em;
    padding: .3rem .6rem; border-radius: 5px;
    transition: background .15s;
  }
  .bd-back-link:hover { background: #f1f5f9; }
  .bd-nav-actions { display: flex; align-items: center; gap: .4rem; }
  .bd-icon-btn {
    display: grid; place-items: center;
    width: 36px; height: 36px;
    background: none; border: 1.5px solid var(--border);
    border-radius: 8px; color: var(--muted); cursor: pointer;
    transition: border-color .15s, color .15s, background .15s;
  }
  .bd-icon-btn:hover { border-color: var(--navy); color: var(--navy); background: #f8fafc; }
  .bd-icon-btn--active { border-color: var(--navy); color: var(--navy); background: #eef0ff; }

  /* ── Layout ── */
  .bd-layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    padding-block: 2rem 3rem;
  }
  @media (min-width: 1024px) {
    .bd-layout { grid-template-columns: 1fr 220px; align-items: start; }
  }

  /* ── Main column ── */
  .bd-main-col { min-width: 0; }

  /* Badges */
  .bd-badges { display: flex; flex-wrap: wrap; gap: .5rem; margin-bottom: 1rem; }
  .bd-category-badge {
    display: inline-flex; align-items: center; gap: .3rem;
    background: var(--saffron); color: #fff;
    font-size: .62rem; font-weight: 800; letter-spacing: .07em;
    padding: .28rem .65rem; border-radius: 4px;
  }
  .bd-official-badge {
    display: inline-flex; align-items: center;
    background: #f1f5f9; border: 1px solid var(--border);
    font-size: .62rem; font-weight: 700; letter-spacing: .06em;
    color: var(--muted); padding: .28rem .65rem; border-radius: 4px;
  }

  /* Title */
  .bd-title {
    font-family: 'Lora', Georgia, serif;
    font-size: clamp(1.5rem, 4vw, 2.4rem);
    font-weight: 700; color: var(--navy);
    line-height: 1.25; margin: 0 0 1.25rem;
    word-wrap: break-word;
  }

  /* Meta strip */
  .bd-meta-strip {
    display: flex; flex-wrap: wrap; align-items: center;
    justify-content: space-between; gap: .75rem;
    padding: .75rem 1rem;
    background: var(--surface); border: 1.5px solid var(--border);
    border-radius: var(--radius); margin-bottom: 1.5rem;
  }
  .bd-author { display: flex; align-items: center; gap: .6rem; }
  .bd-author-avatar {
    display: grid; place-items: center;
    width: 32px; height: 32px; border-radius: 50%;
    background: var(--navy); color: #fff; flex-shrink: 0;
  }
  .bd-author-name { font-size: .85rem; font-weight: 700; color: var(--navy); }
  .bd-meta-right { display: flex; align-items: center; gap: .6rem; flex-wrap: wrap; }
  .bd-meta-item {
    display: inline-flex; align-items: center; gap: .3rem;
    font-size: .75rem; font-weight: 600; color: var(--muted);
    text-transform: uppercase; letter-spacing: .04em;
  }
  .bd-meta-sep {
    width: 3px; height: 3px; border-radius: 50%;
    background: var(--border); flex-shrink: 0;
  }

  /* Hero image */
  .bd-hero-figure {
    margin: 0 0 2rem; border-radius: var(--radius);
    overflow: hidden; box-shadow: var(--shadow);
    aspect-ratio: 16 / 7;
    background: #e2e8f0;
  }
  .bd-hero-img {
    width: 100%; height: 100%; object-fit: cover; display: block;
  }

  /* ── Rich content body ── */
  .bd-content-wrap {
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: var(--radius);
    padding: 1.75rem 1.5rem;
    box-shadow: var(--shadow);
    margin-bottom: 1.75rem;
  }
  @media (min-width: 640px) { .bd-content-wrap { padding: 2.25rem 2.5rem; } }

  .bd-content-body {
    font-family: 'Lora', Georgia, serif;
    font-size: 1.05rem; line-height: 1.85;
    color: #2d3748; overflow-wrap: break-word; word-wrap: break-word;
  }
  .bd-content-body p  { margin: 0 0 1.4rem; text-align: justify; }
  .bd-content-body h2 {
    font-family: 'DM Sans', sans-serif;
    font-size: 1.35rem; font-weight: 800; color: var(--navy);
    border-left: 5px solid var(--saffron); padding-left: 1rem;
    margin: 2.25rem 0 1rem; line-height: 1.3;
  }
  .bd-content-body h3 {
    font-family: 'DM Sans', sans-serif;
    font-size: 1.1rem; font-weight: 700; color: var(--navy);
    margin: 1.75rem 0 .75rem;
  }
  .bd-content-body h4 {
    font-family: 'DM Sans', sans-serif;
    font-size: .95rem; font-weight: 700; color: var(--muted);
    text-transform: uppercase; letter-spacing: .05em;
    margin: 1.5rem 0 .6rem;
  }
  .bd-content-body ul,
  .bd-content-body ol { padding-left: 1.5rem; margin: 0 0 1.4rem; }
  .bd-content-body li  { margin-bottom: .45rem; }
  .bd-content-body blockquote {
    border-left: 4px solid var(--saffron);
    background: var(--saffron-lt);
    margin: 1.75rem 0; padding: 1rem 1.25rem;
    border-radius: 0 var(--radius) var(--radius) 0;
    font-style: italic; color: #475569;
  }
  .bd-content-body a {
    color: var(--navy); text-decoration: underline;
    text-underline-offset: 3px;
    transition: color .15s;
  }
  .bd-content-body a:hover { color: var(--saffron); }
  .bd-content-body img {
    max-width: 100% !important; height: auto !important;
    border-radius: var(--radius); margin: 1.5rem 0;
    border: 1px solid var(--border); display: block;
  }
  .bd-content-body table {
    display: block; width: 100% !important;
    overflow-x: auto; -webkit-overflow-scrolling: touch;
    border-collapse: collapse; margin: 1.5rem 0;
    font-size: .9rem; font-family: 'DM Sans', sans-serif;
  }
  .bd-content-body th {
    background: var(--navy); color: #fff;
    font-weight: 700; text-align: left;
    padding: .65rem .9rem; border: 1px solid rgba(255,255,255,.15);
  }
  .bd-content-body td {
    padding: .6rem .9rem; border: 1px solid var(--border);
  }
  .bd-content-body tr:nth-child(even) td { background: #f8fafc; }
  .bd-content-body code {
    background: #f1f5f9; color: var(--navy-dk);
    padding: .1em .4em; border-radius: 4px;
    font-size: .88em; font-family: 'Courier New', monospace;
  }
  .bd-content-body pre {
    background: #0f172a; color: #e2e8f0;
    padding: 1.25rem; border-radius: var(--radius);
    overflow-x: auto; font-size: .88rem;
    margin: 1.5rem 0;
  }
  .bd-content-body pre code {
    background: none; color: inherit; padding: 0;
  }

  /* CTA */
  .bd-cta {
    display: flex; gap: 1rem; align-items: flex-start;
    padding: 1.25rem 1.5rem;
    background: var(--green-lt);
    border-left: 5px solid var(--green);
    border-radius: var(--radius);
    margin-bottom: 2rem;
  }
  .bd-cta-icon {
    display: grid; place-items: center;
    width: 44px; height: 44px; flex-shrink: 0;
    background: #128807; color: #fff; border-radius: 10px;
  }
  .bd-cta-heading { font-weight: 700; color: #128807; margin: 0 0 .3rem; font-size: .9rem; }
  .bd-cta-body { font-size: .85rem; color: #334155; margin: 0; line-height: 1.6; }

  /* Back row */
  .bd-back-row { margin-top: 1rem; }
  .bd-back-full {
    display: inline-flex; align-items: center; gap: .4rem;
    font-size: .8rem; font-weight: 700; color: var(--navy);
    text-decoration: none; text-transform: uppercase; letter-spacing: .05em;
    padding: .45rem .9rem; border: 1.5px solid var(--navy);
    border-radius: var(--radius);
    transition: background .15s, color .15s;
  }
  .bd-back-full:hover { background: var(--navy); color: #fff; }

  /* ── Sidebar ── */
  .bd-sidebar {
    display: none;
    flex-direction: column; gap: .75rem;
    position: sticky; top: 72px;
  }
  @media (min-width: 1024px) { .bd-sidebar { display: flex; } }

  .bd-sidebar-card {
    background: var(--surface); border: 1.5px solid var(--border);
    border-radius: var(--radius); padding: .85rem 1rem;
  }
  .bd-sidebar-label {
    font-size: .62rem; font-weight: 800; text-transform: uppercase;
    letter-spacing: .06em; color: var(--muted); margin: 0 0 .25rem;
  }
  .bd-sidebar-val { font-size: .85rem; font-weight: 600; color: var(--navy); margin: 0; }
  .bd-sidebar-cat {
    background: var(--saffron-lt); color: var(--saffron);
    display: inline-block; padding: .2rem .65rem;
    border-radius: 4px; font-size: .78rem; font-weight: 700;
  }

  .bd-sidebar-print,
  .bd-sidebar-save {
    width: 100%; display: flex; align-items: center; justify-content: center; gap: .5rem;
    padding: .65rem; border-radius: var(--radius);
    font-size: .82rem; font-weight: 700; font-family: inherit; cursor: pointer;
    transition: background .15s, color .15s, border-color .15s;
  }
  .bd-sidebar-print {
    background: var(--navy); color: #fff; border: none;
  }
  .bd-sidebar-print:hover { background: var(--navy-dk); }
  .bd-sidebar-save {
    background: none; border: 1.5px solid var(--border); color: var(--muted);
  }
  .bd-sidebar-save:hover { border-color: var(--navy); color: var(--navy); }
  .bd-sidebar-save--active { border-color: var(--navy); color: var(--navy); background: #eef0ff; }

  /* ── Scroll to top ── */
  .bd-scroll-top {
    position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 200;
    display: grid; place-items: center;
    width: 44px; height: 44px;
    background: var(--navy); color: #fff;
    border: none; border-radius: 50%; cursor: pointer;
    box-shadow: 0 4px 14px rgba(0,0,128,.35);
    animation: fadeInUp .25s ease;
    transition: background .15s, transform .15s;
  }
  .bd-scroll-top:hover { background: var(--navy-dk); transform: translateY(-2px); }
  @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

  /* ── Error page ── */
  .bd-error-page {
    display: grid; place-items: center; min-height: 80vh;
  }
  .bd-error-box {
    text-align: center; padding: 2rem;
  }
  .bd-error-code {
    display: block; font-family: 'Lora', serif;
    font-size: 5rem; font-weight: 700;
    color: var(--saffron); line-height: 1;
    margin-bottom: .5rem;
  }
  .bd-error-title {
    font-family: 'Lora', serif; font-size: 1.6rem;
    color: var(--navy); margin: 0 0 .25rem;
  }
  .bd-error-sub { color: var(--muted); margin: 0 0 1.5rem; }
  .bd-back-btn {
    display: inline-flex; align-items: center; gap: .45rem;
    padding: .65rem 1.5rem;
    background: var(--navy); color: #fff;
    border-radius: var(--radius); text-decoration: none;
    font-size: .85rem; font-weight: 700;
    transition: background .15s;
  }
  .bd-back-btn:hover { background: var(--navy-dk); }

  /* ── Responsive tweaks ── */
  @media (max-width: 639px) {
    .bd-content-wrap { padding: 1.25rem 1rem; }
    .bd-content-body { font-size: .97rem; }
    .bd-hero-figure { aspect-ratio: 4 / 3; }
    .bd-meta-strip { flex-direction: column; align-items: flex-start; gap: .6rem; }
  }

  ${skeletonCSS}
`;