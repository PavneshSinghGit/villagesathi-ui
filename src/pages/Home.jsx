import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Zap, ShieldCheck, ArrowRight, Store, CheckCircle,
  ChevronRight, Info, Globe, Phone, Star, Users,
  MapPin, Landmark, Sprout, Play, ArrowUpRight
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL;

/* ── Animated counter hook ── */
function useCounter(target, duration = 1800, trigger) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const isNumeric = !isNaN(parseInt(target));
    if (!isNumeric) { setCount(target); return; }
    const end = parseInt(target.replace(/\D/g, ""));
    const step = Math.ceil(end / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(target); clearInterval(timer); }
      else setCount(start + (target.replace(/[0-9]/g, "") || ""));
    }, 16);
    return () => clearInterval(timer);
  }, [trigger]);
  return count;
}

/* ── Intersection observer hook ── */
function useInView(ref) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return inView;
}

/* ── StatCard ── */
function StatCard({ value, label, icon, delay }) {
  const ref = useRef();
  const inView = useInView(ref);
  const count = useCounter(value, 1600, inView);
  return (
    <div ref={ref} className="stat-card" style={{ animationDelay: delay }}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-value">{inView ? count : "0"}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

/* ── TestimonialCard ── */
const TESTIMONIALS = [
  { name: "Ramesh Verma", village: "Madhiya, Kheri", role: "Farmer", quote: "I can now check my PM-Kisan status from home. The portal is incredibly easy to use!", rating: 5, initial: "R" },
  { name: "Sunita Devi", village: "Bagghoon, UP", role: "SathiMarket Seller", quote: "My handmade goods now sell directly to city buyers. VillageSathi changed my life!", rating: 5, initial: "S" },
  { name: "Rakesh Patel", village: "Gola, Kheri", role: "Village Head", quote: "The power tracker tells us exactly when electricity will arrive. Panchayat work is so much easier now.", rating: 5, initial: "R" },
];

/* ── HowItWorks steps ── */
const HOW_STEPS = [
  { num: "01", title: "Register", desc: "Create your free account with just your mobile number — takes under 2 minutes.", icon: <Phone size={22} />, color: "#ff9933" },
  { num: "02", title: "Explore Services", desc: "Power tracker, Government Schemes, or SathiMarket — all in one place.", icon: <Globe size={22} />, color: "#000080" },
  { num: "03", title: "Get Help", desc: "Get direct assistance from a local Sathi agent — simple, no technical jargon.", icon: <Users size={22} />, color: "#128807" },
  { num: "04", title: "Grow", desc: "Sell your produce or handicrafts directly to buyers — zero middlemen.", icon: <Sprout size={22} />, color: "#ff9933" },
];

/* ── Service data ── */
const SERVICES = [
  { title: "Power Tracker", subtitle: "IoT Power Tracker", desc: "Real-time village grid status. Know when power is coming before it does.", icon: <Zap size={26} />, path: "/services/electricity", accent: "#ff9933", bg: "#fff8f0", tag: "LIVE" },
  { title: "SathiMarket", subtitle: "Rural Marketplace", desc: "Direct trade for farmers & artisans. No middlemen. Full profit.", icon: <Store size={26} />, path: "/sathi-market", accent: "#128807", bg: "#f0f9f0", tag: "POPULAR" },
  { title: "Govt. Schemes", subtitle: "Government Portal", desc: "PM-Kisan, Awas Yojana, Ration Card — all in one verified portal.", icon: <Landmark size={26} />, path: "/services/GovernmentSchemes", accent: "#000080", bg: "#f0f0fb", tag: "VERIFIED" },
  { title: "Smart Farming", subtitle: "AgriTech Tools", desc: "AI crop tips, soil reports & live Mandi rates at your fingertips.", icon: <Sprout size={26} />, path: "/services/FarmerHelp", accent: "#128807", bg: "#f0f9f0", tag: "NEW" },
];

function Home() {
  const [latestBlogs, setLatestBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const navigate = useNavigate();
  const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_URL;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/Blogs`);
        if (res.data?.data) setLatestBlogs(res.data.data.slice(0, 3));
      } catch (err) { console.error(err); }
      finally { setTimeout(() => setIsLoading(false), 500); }
    };
    fetchBlogs();
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(p => (p + 1) % TESTIMONIALS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const getImageUrl = (url) => {
    if (!url) return "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600";
    if (url.startsWith("http")) return url;
    const cleanBase = IMAGE_BASE_URL?.endsWith("/") ? IMAGE_BASE_URL.slice(0, -1) : IMAGE_BASE_URL;
    return `${cleanBase}/${url.startsWith("/") ? url.slice(1) : url}`;
  };

  return (
    <main className="vs-home" style={{ backgroundColor: "#f8fafc", overflowX: "hidden" }}>
      <Helmet>
        <title>VillageSathi | Digital Rural Empowerment & Government Schemes Portal</title>
        <meta name="description" content="Verified government schemes (Sarkari Yojana), IoT-based power tracking, and direct marketplace for rural India." />
      </Helmet>

      {/* ══════════════════════════════════════════
          SECTION 1 — HERO
      ══════════════════════════════════════════ */}
      <header className="vs-hero">
        {/* Decorative tricolor bar at top */}
        <div className="tricolor-bar">
          <span style={{ background: "#ff9933" }}></span>
          <span style={{ background: "#fff", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0" }}></span>
          <span style={{ background: "#128807" }}></span>
        </div>

        <div className="container px-4 py-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              {/* Pill badge */}
              <div className="hero-pill mb-4">
                <span className="pill-dot"></span>
                <span>DPIIT Recognized · Digital India Initiative</span>
              </div>

              <h1 className="hero-h1 mb-3">
                <span className="block-saffron">Empowering</span>
                <span className="block-navy">Rural India</span>
                <span className="block-green">Village Digital Hub</span>
              </h1>

              <p className="hero-sub mb-5">
                Verified Government Schemes, Real-time Power Monitoring, and a direct Agri-Marketplace — 
                <strong> all in one place.</strong> India's most trusted rural digital portal.
              </p>

              <div className="hero-cta-row">
                <Link to="/services/GovernmentSchemes" className="btn-primary-vs">
                  Government Schemes <ArrowRight size={16} />
                </Link>
                <Link to="/sathi-market" className="btn-secondary-vs">
                  <Store size={16} /> SathiMarket
                </Link>
              </div>

              {/* Trust badges */}
              <div className="trust-row mt-4">
                <div className="trust-item"><CheckCircle size={14} /> 500+ Panchayats</div>
                <div className="trust-item"><ShieldCheck size={14} /> Verified Data</div>
                <div className="trust-item"><Star size={14} /> 10k+ Users</div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="hero-visual-wrap">
                {/* Main visual card */}
                <div className="hero-card-main">
                  <div className="hc-header">
                    <div className="hc-dot red"></div>
                    <div className="hc-dot amber"></div>
                    <div className="hc-dot green"></div>
                    <span className="hc-title">VillageSathi Dashboard</span>
                  </div>
                  <div className="hc-body">
                    <div className="hc-stat-row">
                      <div className="hc-stat saffron">
                        <Zap size={18} />
                        <div>
                          <div className="hc-val">LIVE</div>
                          <div className="hc-lbl">Power Grid</div>
                        </div>
                      </div>
                      <div className="hc-stat green">
                        <CheckCircle size={18} />
                        <div>
                          <div className="hc-val">₹2000</div>
                          <div className="hc-lbl">PM-Kisan</div>
                        </div>
                      </div>
                      <div className="hc-stat navy">
                        <Store size={18} />
                        <div>
                          <div className="hc-val">48</div>
                          <div className="hc-lbl">Sellers Online</div>
                        </div>
                      </div>
                    </div>

                    {/* Bijli bar chart mockup */}
                    <div className="hc-chart-label">Kheri Grid — Power Supply (Today)</div>
                    <div className="hc-chart">
                      {[70, 90, 55, 100, 80, 95, 60, 88, 75, 100, 45, 90].map((h, i) => (
                        <div key={i} className="hc-bar" style={{ height: `${h}%`, background: h > 80 ? "#128807" : h > 60 ? "#ff9933" : "#e53e3e", opacity: 0.85 }}></div>
                      ))}
                    </div>
                    <div className="hc-chart-legend">
                      <span><span className="dot" style={{ background: "#128807" }}></span>High</span>
                      <span><span className="dot" style={{ background: "#ff9933" }}></span>Medium</span>
                      <span><span className="dot" style={{ background: "#e53e3e" }}></span>Low</span>
                    </div>
                  </div>
                </div>

                {/* Floating notification card */}
                <div className="hero-notif-card">
                  <div className="notif-icon"><CheckCircle size={16} /></div>
                  <div>
                    <div className="notif-title">PM-Kisan Installment</div>
                    <div className="notif-sub">17th installment released ✓</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════
          ANNOUNCEMENT TICKER
      ══════════════════════════════════════════ */}
      <div className="vs-ticker">
        <div className="ticker-badge">LIVE</div>
        <div className="ticker-track">
          <marquee>
            🌾 PM-Kisan 17th Installment updates are now live &nbsp;•&nbsp; ⚡ New IoT Power Grids active for Kheri district &nbsp;•&nbsp; 🛒 SathiMarket — 48 vendors online today &nbsp;•&nbsp; 📰 Weekly Village Patrika published every Monday
          </marquee>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          SECTION 2 — STATS
      ══════════════════════════════════════════ */}
      <section className="vs-stats-section">
        <div className="container px-4">
          <div className="stats-grid">
            <StatCard value="500+" label="Gram Panchayats" icon={<Globe size={20} />} delay="0ms" />
            <StatCard value="10k+" label="Registered Citizens" icon={<Users size={20} />} delay="100ms" />
            <StatCard value="24" label="IoT Power Grids" icon={<Zap size={20} />} delay="200ms" />
            <StatCard value="95%" label="Satisfaction Rate" icon={<Star size={20} />} delay="300ms" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 3 — SERVICES GRID
      ══════════════════════════════════════════ */}
      <section className="vs-section container px-4">
        <div className="vs-section-head">
          <div className="section-tag">PORTAL SERVICES</div>
          <h2 className="section-title">Our Core Services <span>One Click Away</span></h2>
          <p className="section-sub">All VillageSathi digital tools — accessible on your smartphone, anytime, anywhere.</p>
        </div>

        <div className="services-grid">
          {SERVICES.map((s, i) => (
            <div key={i} className="service-card" onClick={() => navigate(s.path)} style={{ "--accent": s.accent, "--bg": s.bg }}>
              <div className="sc-tag" style={{ background: s.accent }}>{s.tag}</div>
              <div className="sc-icon" style={{ background: s.bg, color: s.accent }}>{s.icon}</div>
              <h3 className="sc-title">{s.title}</h3>
              <div className="sc-en">{s.subtitle}</div>
              <p className="sc-desc">{s.desc}</p>
              <div className="sc-cta" style={{ color: s.accent }}>
                Access Service <ArrowUpRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 4 — HOW IT WORKS
      ══════════════════════════════════════════ */}
      <section className="vs-how-section">
        <div className="container px-4">
          <div className="vs-section-head">
            <div className="section-tag">SIMPLE PROCESS</div>
            <h2 className="section-title">How It Works — <span>Just 4 Steps</span></h2>
          </div>
          <div className="how-grid">
            {HOW_STEPS.map((step, i) => (
              <div key={i} className="how-card">
                <div className="how-num" style={{ color: step.color }}>{step.num}</div>
                <div className="how-icon" style={{ background: step.color + "18", color: step.color }}>{step.icon}</div>
                <h4 className="how-title">{step.title}</h4>
                <p className="how-desc">{step.desc}</p>
                {i < HOW_STEPS.length - 1 && <div className="how-connector"></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 5 — SCHEMES + PATRIKA
      ══════════════════════════════════════════ */}
      <section className="vs-section container px-4">
        <div className="row g-4 align-items-stretch">

          {/* Schemes Column */}
          <div className="col-lg-6">
            <div className="schemes-card">
              <div className="schemes-header">
                <div className="section-tag" style={{ marginBottom: "12px" }}>GOVERNMENT</div>
                <h3 className="schemes-title">Government Schemes</h3>
                <p className="schemes-sub">PM-Kisan, Awas Yojana, and more — verified information directly from government sources.</p>
              </div>
              <div className="schemes-list">
                {["PM-Kisan Status", "Awas Yojana", "Ration Card", "Panchayat Updates", "Scholarship Schemes", "Kisan Credit Card"].map((s, i) => (
                  <div key={i} className="scheme-item">
                    <CheckCircle size={15} className="scheme-check" />
                    <span>{s}</span>
                    <ChevronRight size={14} className="scheme-arrow" />
                  </div>
                ))}
              </div>
              <Link to="/services/GovernmentSchemes" className="schemes-btn">
                View All Schemes <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          {/* Blog/Patrika Column */}
          <div className="col-lg-6">
            <div className="patrika-card">
              <div className="patrika-header">
                <div className="section-tag" style={{ marginBottom: "12px", background: "#128807" }}>WEEKLY UPDATES</div>
                <div className="d-flex justify-content-between align-items-center">
                  <h3 className="patrika-title">Village Patrika</h3>
                  <Link to="/blog" className="patrika-link">All Articles <ChevronRight size={14} /></Link>
                </div>
              </div>
              <div className="blog-list">
                {isLoading
                  ? [1, 2, 3].map(n => <div key={n} className="blog-skeleton"></div>)
                  : latestBlogs.map((blog, i) => (
                    <Link key={i} to={`/BlogDetail/${blog.slug || blog.Slug}`} className="blog-item">
                      <div className="blog-img-wrap">
                        <img src={getImageUrl(blog.imageUrl)} alt={blog.title} className="blog-thumb" onError={e => { e.target.src = "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=100"; }} />
                      </div>
                      <div className="blog-info">
                        <div className="blog-cat">{blog.category || "News"}</div>
                        <div className="blog-title">{blog.title}</div>
                        <div className="blog-date">{new Date(blog.createdDate || Date.now()).toLocaleDateString("en-IN")}</div>
                      </div>
                      <ArrowUpRight size={14} className="blog-arrow" />
                    </Link>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 6 — TESTIMONIALS
      ══════════════════════════════════════════ */}
      <section className="vs-testimonial-section">
        <div className="container px-4">
          <div className="vs-section-head">
            <div className="section-tag" style={{ background: "#ff9933" }}>COMMUNITY VOICES</div>
            <h2 className="section-title">What Our Community Says — <span>Real Reviews</span></h2>
          </div>
          <div className="testimonial-wrap">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className={`testimonial-card ${i === activeTestimonial ? "active" : ""}`}>
                <div className="t-stars">{Array(t.rating).fill(0).map((_, j) => <Star key={j} size={14} fill="#ff9933" color="#ff9933" />)}</div>
                <p className="t-quote">"{t.quote}"</p>
                <div className="t-author">
                  <div className="t-avatar">{t.initial}</div>
                  <div>
                    <div className="t-name">{t.name}</div>
                    <div className="t-role">{t.role} · {t.village}</div>
                  </div>
                </div>
              </div>
            ))}
            <div className="t-dots">
              {TESTIMONIALS.map((_, i) => (
                <button key={i} className={`t-dot ${i === activeTestimonial ? "active" : ""}`} onClick={() => setActiveTestimonial(i)} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 7 — CTA BANNER
      ══════════════════════════════════════════ */}
      <section className="vs-cta-section container px-4">
        <div className="cta-banner">
          <div className="cta-content">
            <h2 className="cta-title">Start Your Village's Digital Journey Today</h2>
            <p className="cta-sub">Register for free, check your Government Scheme status, and sell on SathiMarket — all at no cost.</p>
            <div className="cta-btns">
              <Link to="/contact" className="cta-btn-primary">Register Now <ArrowRight size={16} /></Link>
              <Link to="/about" className="cta-btn-ghost">Know More</Link>
            </div>
          </div>
          <div className="cta-deco">
            <div className="cta-ring r1"></div>
            <div className="cta-ring r2"></div>
            <div className="cta-ring r3"></div>
            <MapPin size={48} className="cta-icon" />
          </div>
        </div>
      </section>

      {/* ══════════ STYLES ══════════ */}
      <style>{`
        /* ── Base ── */
        .vs-home { font-family: 'Segoe UI', system-ui, sans-serif; }
        .vs-section { padding: 64px 0; }

        /* ── Tricolor bar ── */
        .tricolor-bar { display: flex; height: 6px; }
        .tricolor-bar span { flex: 1; }

        /* ── Hero ── */
        .vs-hero {
          background: linear-gradient(135deg, #fffdf7 0%, #fff8f0 35%, #f0f4ff 70%, #f0f9f0 100%);
          padding-bottom: 16px;
        }
        .hero-pill {
          display: inline-flex; align-items: center; gap: 8px;
          background: #fff; border: 1px solid #e2e8f0;
          border-radius: 999px; padding: 6px 16px;
          font-size: 0.72rem; font-weight: 700; color: #475569;
          letter-spacing: 0.5px; text-transform: uppercase;
        }
        .pill-dot { width: 8px; height: 8px; border-radius: 50%; background: #128807; animation: pulse-dot 2s infinite; }
        @keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:0.3} }

        .hero-h1 { font-size: clamp(2rem, 5vw, 3rem); font-weight: 900; line-height: 1.15; }
        .block-saffron { display: block; color: #ff9933; }
        .block-navy    { display: block; color: #000080; }
        .block-green   { display: block; color: #128807; font-size: 0.55em; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin-top: 4px; }

        .hero-sub { color: #475569; font-size: 1.05rem; line-height: 1.7; max-width: 520px; }

        .hero-cta-row { display: flex; flex-wrap: wrap; gap: 12px; }
        .btn-primary-vs {
          display: inline-flex; align-items: center; gap: 8px;
          background: #000080; color: white; font-weight: 700;
          padding: 12px 24px; border-radius: 8px; text-decoration: none;
          font-size: 0.9rem; transition: all 0.2s;
        }
        .btn-primary-vs:hover { background: #000066; color: white; transform: translateY(-2px); }
        .btn-secondary-vs {
          display: inline-flex; align-items: center; gap: 8px;
          background: #ff9933; color: white; font-weight: 700;
          padding: 12px 24px; border-radius: 8px; text-decoration: none;
          font-size: 0.9rem; transition: all 0.2s;
        }
        .btn-secondary-vs:hover { background: #e68a00; color: white; transform: translateY(-2px); }

        .trust-row { display: flex; flex-wrap: wrap; gap: 16px; }
        .trust-item { display: flex; align-items: center; gap: 6px; font-size: 0.8rem; font-weight: 600; color: #64748b; }
        .trust-item svg { color: #128807; }

        /* ── Hero Visual Card ── */
        .hero-visual-wrap { position: relative; }
        .hero-card-main {
          background: #fff; border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0,0,128,0.12);
          border: 1px solid #e2e8f0; overflow: hidden;
        }
        .hc-header {
          background: #f8fafc; border-bottom: 1px solid #e2e8f0;
          padding: 12px 16px; display: flex; align-items: center; gap: 6px;
        }
        .hc-dot { width: 10px; height: 10px; border-radius: 50%; }
        .hc-dot.red { background: #ef4444; }
        .hc-dot.amber { background: #f59e0b; }
        .hc-dot.green { background: #22c55e; }
        .hc-title { margin-left: 8px; font-size: 0.78rem; font-weight: 700; color: #64748b; }
        .hc-body { padding: 20px; }
        .hc-stat-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 20px; }
        .hc-stat {
          display: flex; align-items: center; gap: 8px;
          padding: 10px; border-radius: 8px; font-size: 0.78rem;
        }
        .hc-stat.saffron { background: #fff8f0; color: #ff9933; }
        .hc-stat.green   { background: #f0f9f0; color: #128807; }
        .hc-stat.navy    { background: #f0f0fb; color: #000080; }
        .hc-val { font-weight: 800; font-size: 0.95rem; line-height: 1; }
        .hc-lbl { font-size: 0.65rem; color: #94a3b8; margin-top: 2px; }
        .hc-chart-label { font-size: 0.72rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 8px; }
        .hc-chart { display: flex; align-items: flex-end; gap: 4px; height: 80px; }
        .hc-bar { flex: 1; border-radius: 3px 3px 0 0; transition: height 0.4s ease; min-width: 10px; }
        .hc-chart-legend { display: flex; gap: 12px; margin-top: 8px; }
        .hc-chart-legend span { display: flex; align-items: center; gap: 4px; font-size: 0.7rem; color: #64748b; }
        .dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }

        /* Floating notification */
        .hero-notif-card {
          position: absolute; bottom: -16px; left: -16px;
          background: #fff; border-radius: 12px; padding: 12px 16px;
          display: flex; align-items: center; gap: 10px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
          border: 1px solid #e2e8f0;
          animation: float 3s ease-in-out infinite;
        }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        .notif-icon { width: 32px; height: 32px; border-radius: 8px; background: #f0f9f0; color: #128807; display: flex; align-items: center; justify-content: center; }
        .notif-title { font-size: 0.78rem; font-weight: 700; color: #1e293b; }
        .notif-sub { font-size: 0.7rem; color: #128807; font-weight: 600; }

        /* ── Ticker ── */
        .vs-ticker {
          background: #000080; color: white;
          display: flex; align-items: center; gap: 0;
          padding: 10px 0; overflow: hidden;
        }
        .ticker-badge {
          background: #ff9933; color: white;
          font-size: 0.65rem; font-weight: 900; letter-spacing: 2px;
          padding: 4px 16px; white-space: nowrap; flex-shrink: 0;
        }
        .ticker-track { flex: 1; padding-left: 16px; font-size: 0.82rem; opacity: 0.9; }

        /* ── Stats ── */
        .vs-stats-section { padding: 48px 0; background: #fff; border-bottom: 1px solid #f1f5f9; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
        .stat-card {
          text-align: center; padding: 24px 16px;
          border-radius: 12px; background: #f8fafc;
          border: 1px solid #e2e8f0;
          animation: fadeUp 0.6s ease both;
          transition: transform 0.2s;
        }
        .stat-card:hover { transform: translateY(-4px); }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .stat-icon { color: #ff9933; margin-bottom: 8px; }
        .stat-value { font-size: 2rem; font-weight: 900; color: #000080; line-height: 1; }
        .stat-label { font-size: 0.72rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-top: 6px; }

        /* ── Section heads ── */
        .vs-section-head { text-align: center; margin-bottom: 48px; }
        .section-tag {
          display: inline-block; background: #000080; color: #fff;
          font-size: 0.65rem; font-weight: 900; letter-spacing: 2px;
          text-transform: uppercase; padding: 4px 14px; border-radius: 4px;
          margin-bottom: 12px;
        }
        .section-title { font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 900; color: #000080; margin-bottom: 8px; }
        .section-title span { color: #ff9933; }
        .section-sub { color: #64748b; font-size: 0.95rem; max-width: 560px; margin: 0 auto; }

        /* ── Services Grid ── */
        .services-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
        .service-card {
          background: #fff; border: 1px solid #e2e8f0; border-radius: 12px;
          padding: 24px; cursor: pointer; position: relative; overflow: hidden;
          transition: all 0.25s ease;
        }
        .service-card:hover { border-color: var(--accent); transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.08); }
        .sc-tag {
          position: absolute; top: 0; right: 0;
          font-size: 0.6rem; font-weight: 900; letter-spacing: 1px;
          color: white; padding: 4px 10px; border-radius: 0 12px 0 8px;
        }
        .sc-icon { width: 48px; height: 48px; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; }
        .sc-title { font-size: 1.1rem; font-weight: 900; color: #000080; margin-bottom: 2px; }
        .sc-en { font-size: 0.72rem; font-weight: 700; color: var(--accent); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
        .sc-desc { font-size: 0.85rem; color: #64748b; line-height: 1.6; margin-bottom: 16px; }
        .sc-cta { display: flex; align-items: center; gap: 4px; font-size: 0.8rem; font-weight: 700; transition: gap 0.2s; }
        .service-card:hover .sc-cta { gap: 8px; }

        /* ── How it works ── */
        .vs-how-section { background: #f8fafc; padding: 64px 0; }
        .how-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; position: relative; }
        .how-card {
          background: #fff; border: 1px solid #e2e8f0; border-radius: 12px;
          padding: 24px; text-align: center; position: relative;
          transition: transform 0.2s;
        }
        .how-card:hover { transform: translateY(-4px); }
        .how-num { font-size: 2.5rem; font-weight: 900; opacity: 0.15; line-height: 1; margin-bottom: 12px; }
        .how-icon { width: 52px; height: 52px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 14px; }
        .how-title { font-size: 1rem; font-weight: 800; color: #000080; margin-bottom: 8px; }
        .how-desc { font-size: 0.83rem; color: #64748b; line-height: 1.6; }
        .how-connector {
          position: absolute; top: 50%; right: -13px; width: 26px; height: 2px;
          background: linear-gradient(90deg, #ff9933, #000080); z-index: 1;
        }

        /* ── Schemes card ── */
        .schemes-card {
          background: #fff; border: 1px solid #e2e8f0; border-radius: 16px;
          padding: 32px; height: 100%; border-top: 4px solid #000080;
        }
        .schemes-title { font-size: 1.4rem; font-weight: 900; color: #000080; margin-bottom: 8px; }
        .schemes-sub { font-size: 0.87rem; color: #64748b; line-height: 1.6; margin-bottom: 24px; }
        .schemes-list { display: flex; flex-direction: column; gap: 4px; margin-bottom: 24px; }
        .scheme-item {
          display: flex; align-items: center; gap: 10px; padding: 10px 12px;
          border-radius: 8px; font-size: 0.87rem; font-weight: 600; color: #1e293b;
          transition: background 0.15s; cursor: pointer;
        }
        .scheme-item:hover { background: #f0f0fb; }
        .scheme-check { color: #128807; flex-shrink: 0; }
        .scheme-arrow { color: #94a3b8; margin-left: auto; }
        .schemes-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: #000080; color: white; font-weight: 700;
          padding: 12px 24px; border-radius: 8px; text-decoration: none;
          font-size: 0.87rem; transition: all 0.2s;
        }
        .schemes-btn:hover { background: #000066; color: white; }

        /* ── Patrika card ── */
        .patrika-card {
          background: #fff; border: 1px solid #e2e8f0; border-radius: 16px;
          padding: 32px; height: 100%; border-top: 4px solid #128807;
        }
        .patrika-title { font-size: 1.4rem; font-weight: 900; color: #128807; }
        .patrika-link { font-size: 0.8rem; font-weight: 700; color: #128807; text-decoration: none; display: flex; align-items: center; gap: 2px; }
        .blog-list { display: flex; flex-direction: column; gap: 12px; margin-top: 20px; }
        .blog-skeleton { height: 72px; background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%); background-size: 200%; border-radius: 10px; animation: shimmer 1.5s infinite; }
        @keyframes shimmer { 0%{background-position:200%} 100%{background-position:-200%} }
        .blog-item {
          display: flex; align-items: center; gap: 12px; padding: 10px; border-radius: 10px;
          text-decoration: none; border: 1px solid #f1f5f9;
          transition: all 0.2s; background: #fafafa;
        }
        .blog-item:hover { border-color: #128807; background: #f0f9f0; }
        .blog-img-wrap { flex-shrink: 0; }
        .blog-thumb { width: 60px; height: 56px; border-radius: 8px; object-fit: cover; }
        .blog-info { flex: 1; min-width: 0; }
        .blog-cat { font-size: 0.65rem; font-weight: 800; color: #ff9933; text-transform: uppercase; letter-spacing: 1px; }
        .blog-title { font-size: 0.83rem; font-weight: 700; color: #1e293b; line-height: 1.4; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .blog-date { font-size: 0.7rem; color: #94a3b8; margin-top: 2px; }
        .blog-arrow { color: #128807; flex-shrink: 0; }

        /* ── Testimonials ── */
        .vs-testimonial-section { padding: 64px 0; background: linear-gradient(135deg, #000080 0%, #000055 100%); }
        .vs-testimonial-section .vs-section-head .section-title { color: #fff; }
        .vs-testimonial-section .section-title span { color: #ff9933; }
        .testimonial-wrap { max-width: 640px; margin: 0 auto; position: relative; }
        .testimonial-card {
          background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15);
          border-radius: 16px; padding: 32px; display: none;
          animation: fadeIn 0.4s ease;
        }
        .testimonial-card.active { display: block; }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        .t-stars { display: flex; gap: 4px; margin-bottom: 16px; }
        .t-quote { font-size: 1.05rem; color: #e2e8f0; line-height: 1.7; font-style: italic; margin-bottom: 20px; }
        .t-author { display: flex; align-items: center; gap: 12px; }
        .t-avatar { width: 44px; height: 44px; border-radius: 50%; background: #ff9933; color: white; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 1.1rem; }
        .t-name { font-weight: 800; color: #fff; font-size: 0.95rem; }
        .t-role { font-size: 0.75rem; color: #94a3b8; }
        .t-dots { display: flex; justify-content: center; gap: 8px; margin-top: 24px; }
        .t-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.3); border: none; cursor: pointer; transition: all 0.2s; padding: 0; }
        .t-dot.active { background: #ff9933; width: 24px; border-radius: 4px; }

        /* ── CTA Banner ── */
        .vs-cta-section { padding: 64px 0; }
        .cta-banner {
          background: linear-gradient(135deg, #ff9933 0%, #e68a00 100%);
          border-radius: 20px; padding: 48px; display: flex;
          align-items: center; justify-content: space-between; overflow: hidden;
          position: relative;
        }
        .cta-content { position: relative; z-index: 2; max-width: 500px; }
        .cta-title { font-size: clamp(1.3rem, 2.5vw, 1.7rem); font-weight: 900; color: #fff; margin-bottom: 12px; }
        .cta-sub { color: rgba(255,255,255,0.85); font-size: 0.95rem; line-height: 1.6; margin-bottom: 24px; }
        .cta-btns { display: flex; flex-wrap: wrap; gap: 12px; }
        .cta-btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          background: #000080; color: white; font-weight: 800;
          padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 0.9rem;
          transition: all 0.2s;
        }
        .cta-btn-primary:hover { background: #000055; color: white; transform: translateY(-2px); }
        .cta-btn-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.2); color: white; font-weight: 700;
          padding: 12px 24px; border-radius: 8px; text-decoration: none; font-size: 0.9rem;
          border: 1px solid rgba(255,255,255,0.4); transition: all 0.2s;
        }
        .cta-btn-ghost:hover { background: rgba(255,255,255,0.3); color: white; }
        .cta-deco { position: relative; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
        .cta-ring {
          position: absolute; border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.2);
          animation: expand 3s ease-in-out infinite;
        }
        .cta-ring.r1 { width: 100px; height: 100px; animation-delay: 0s; }
        .cta-ring.r2 { width: 150px; height: 150px; animation-delay: 0.5s; }
        .cta-ring.r3 { width: 200px; height: 200px; animation-delay: 1s; }
        @keyframes expand { 0%,100%{transform:scale(1);opacity:0.4} 50%{transform:scale(1.05);opacity:0.2} }
        .cta-icon { color: rgba(255,255,255,0.5); position: relative; z-index: 2; }

        /* ── Responsive ── */
        @media (max-width: 991px) {
          .hero-notif-card { left: 0; bottom: -8px; }
          .how-grid { grid-template-columns: repeat(2, 1fr); }
          .how-connector { display: none; }
        }
        @media (max-width: 767px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .services-grid { grid-template-columns: 1fr; }
          .how-grid { grid-template-columns: 1fr; }
          .cta-banner { flex-direction: column; text-align: center; padding: 32px 24px; }
          .cta-deco { display: none; }
          .hero-notif-card { display: none; }
        }
      `}</style>
    </main>
  );
}

export default Home;
