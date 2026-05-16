import React, { useState, useEffect, useRef } from "react";
import {
  ShieldCheck, Target, Users, Award, Landmark, CheckCircle, Globe, Mail,
  MapPin, Zap, Handshake, ChevronRight, Quote, ArrowRight, Star,
  Cpu, TrendingUp, Heart, Phone
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import founder from "../assets/Images/PavneshPhoto.jpg";

/* ── Intersection observer hook ── */
function useInView(ref, threshold = 0.15) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return inView;
}

/* ── Animated counter ── */
function useCounter(target, duration = 1600, trigger) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    const isNumeric = !isNaN(parseInt(target));
    if (!isNumeric) { setCount(target); return; }
    const end = parseInt(target.replace(/\D/g, ""));
    const suffix = target.replace(/[0-9]/g, "");
    let start = 0;
    const step = Math.ceil(end / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(target); clearInterval(timer); }
      else setCount(start + suffix);
    }, 16);
    return () => clearInterval(timer);
  }, [trigger]);
  return count;
}

/* ── Stat card with counter ── */
function StatBadge({ value, label, icon, delay }) {
  const ref = useRef();
  const inView = useInView(ref);
  const count = useCounter(value, 1600, inView);
  return (
    <div ref={ref} className="about-stat" style={{ animationDelay: delay }}>
      <div className="about-stat-icon">{icon}</div>
      <div className="about-stat-val">{inView ? count : "0"}</div>
      <div className="about-stat-lbl">{label}</div>
    </div>
  );
}

/* ── Timeline milestone ── */
const MILESTONES = [
  { year: "2021", title: "Founded", desc: "VillageSathi Platforms incorporated in Lakhimpur Kheri, UP.", color: "#ff9933" },
  { year: "2022", title: "DPIIT Recognition", desc: "Recognized as a startup under the Government of India's DPIIT program.", color: "#000080" },
  { year: "2023", title: "500+ Panchayats", desc: "Reached 500 Gram Panchayats across Uttar Pradesh with IoT grid coverage.", color: "#128807" },
  { year: "2024", title: "SathiMarket Launch", desc: "Launched direct-to-consumer rural marketplace with 0% middleman commission.", color: "#ff9933" },
  { year: "2027", title: "Goal: 5,000 Villages", desc: "Target to serve 5 million rural citizens across North India.", color: "#000080", future: true },
];

/* ── Core values ── */
const VALUES = [
  { icon: <ShieldCheck size={24} />, title: "Verified Data", desc: "Every scheme, grid status and market price is sourced directly from official APIs — no guesswork.", color: "#000080", bg: "#f0f0fb" },
  { icon: <Heart size={24} />, title: "Rural First", desc: "Every product decision starts with one question: does this work on a ₹6,000 smartphone with 2G?", color: "#ff9933", bg: "#fff8f0" },
  { icon: <Handshake size={24} />, title: "Zero Middlemen", desc: "Farmers and artisans connect directly to buyers. We take nothing from the transaction.", color: "#128807", bg: "#f0f9f0" },
  { icon: <Cpu size={24} />, title: "IoT-Powered", desc: "Real-time village power grid data from physical sensors — not manual updates.", color: "#000080", bg: "#f0f0fb" },
];

function About() {
  return (
    <div className="about-vs" style={{ backgroundColor: "#f8fafc", minHeight: "100vh", overflowX: "hidden" }}>
      <Helmet>
        <title>About VillageSathi | Rural Digital Empowerment Mission</title>
        <meta name="description" content="VillageSathi Platforms is a DPIIT-recognized startup digitizing 500+ Gram Panchayats across Uttar Pradesh with IoT power tracking, government schemes, and SathiMarket." />
      </Helmet>

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <header className="about-hero">
        {/* Tricolor accent bar */}
        <div className="tricolor-bar">
          <span style={{ background: "#ff9933" }} />
          <span style={{ background: "#fff", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0" }} />
          <span style={{ background: "#128807" }} />
        </div>

        <div className="container px-4 py-5">
          <div className="hero-inner text-center">
            <div className="hero-pill mb-4">
              <span className="pill-dot" />
              DPIIT Recognized · Digital India Initiative
            </div>
            <h1 className="about-h1 mb-3">
              Bridging <span className="hs">Villages</span> &amp;{" "}
              <span className="hn">Opportunities</span>
            </h1>
            <p className="about-hero-sub mx-auto mb-5">
              VillageSathi is building a digital highway that connects every Gram Panchayat in India to
              verified government services, real-time power data, and a direct marketplace — with no
              middlemen and no jargon.
            </p>
            <div className="d-flex flex-wrap gap-3 justify-content-center">
              <a href="/services" className="btn-primary-vs">
                Explore Services <ArrowRight size={16} />
              </a>
              <a href="/contact" className="btn-ghost-vs">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════
          STATS BAR
      ══════════════════════════════════════════ */}
      <section className="about-stats-bar">
        <div className="container px-4">
          <div className="stats-row">
            <StatBadge value="500+" label="Gram Panchayats" icon={<Landmark size={20} />} delay="0ms" />
            <StatBadge value="10k+" label="Registered Citizens" icon={<Users size={20} />} delay="80ms" />
            <StatBadge value="95%" label="Satisfaction Rate" icon={<Star size={20} />} delay="160ms" />
            <StatBadge value="Active" label="UP Startup Ecosystem" icon={<Award size={20} />} delay="240ms" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FOUNDER SECTION
      ══════════════════════════════════════════ */}
      <section className="container px-4 py-5 founder-section">
        <div className="row align-items-center g-5">

          {/* Photo */}
          <div className="col-lg-5 order-2 order-lg-1">
            <div className="founder-photo-wrap">
              <div className="founder-photo-frame">
                <img
                  src={founder}
                  alt="Pavnesh Singh, Founder of VillageSathi"
                  className="founder-img"
                />
              </div>
              {/* Name badge */}
              <div className="founder-badge">
                <div className="fb-avatar">PS</div>
                <div>
                  <div className="fb-name">Pavnesh Singh</div>
                  <div className="fb-role">Founder &amp; Lead Developer</div>
                </div>
              </div>
              {/* Accent dots */}
              <div className="founder-dots">
                {Array(9).fill(0).map((_, i) => <span key={i} className="fdot" />)}
              </div>
            </div>
          </div>

          {/* Story */}
          <div className="col-lg-7 order-1 order-lg-2">
            <div className="founder-story">
              <div className="section-tag mb-3">OUR STORY</div>
              <Quote size={36} className="quote-icon mb-3" />
              <h2 className="founder-quote mb-4">
                "Eliminating the distance between{" "}
                <span className="fq-green">villages and opportunities</span>."
              </h2>
              <p className="founder-body mb-4">
                Born and raised in <strong>Lakhimpur Kheri</strong>, Pavnesh Singh witnessed firsthand
                how rural citizens struggled to access basic government services, understand their
                electricity bills, or sell their produce without losing margins to middlemen.
              </p>
              <p className="founder-body mb-5">
                VillageSathi was built to change that — one village at a time. Our platform gives every
                Gram Panchayat citizen the same digital access that metro residents take for granted:
                verified scheme information, real-time power grid data, and a fair marketplace.
              </p>

              {/* Credential badges */}
              <div className="row g-3">
                <div className="col-sm-6">
                  <div className="cred-badge green">
                    <CheckCircle size={18} />
                    <span>DPIIT Recognized Startup</span>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="cred-badge saffron">
                    <CheckCircle size={18} />
                    <span>UP Startup Ecosystem Member</span>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="cred-badge navy">
                    <ShieldCheck size={18} />
                    <span>500+ Panchayats Covered</span>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="cred-badge navy">
                    <TrendingUp size={18} />
                    <span>Goal: 5,000 Villages by 2027</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CORE VALUES
      ══════════════════════════════════════════ */}
      <section className="values-section">
        <div className="container px-4">
          <div className="vs-section-head text-center mb-5">
            <div className="section-tag mb-3">WHAT WE STAND FOR</div>
            <h2 className="section-title">Our Core <span>Values</span></h2>
            <p className="section-sub mx-auto">
              The principles that guide every feature we build and every village we serve.
            </p>
          </div>
          <div className="values-grid">
            {VALUES.map((v, i) => (
              <div key={i} className="value-card" style={{ "--accent": v.color, "--bg": v.bg }}>
                <div className="vc-icon" style={{ background: v.bg, color: v.color }}>{v.icon}</div>
                <h4 className="vc-title" style={{ color: v.color }}>{v.title}</h4>
                <p className="vc-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          MISSION + GOAL SPLIT
      ══════════════════════════════════════════ */}
      <section className="container px-4 py-5">
        <div className="row g-4">

          {/* Mission card */}
          <div className="col-lg-6">
            <div className="mission-card">
              <div className="section-tag mb-3">OUR MISSION</div>
              <h3 className="mission-title">Transparency at Every Level</h3>
              <p className="mission-body">
                We eliminate the middleman from rural administration. Every data point on
                VillageSathi — from PM-Kisan updates to Smart Power Grids — is verified through
                direct API integrations and IoT sensors deployed in the field.
              </p>
              <div className="mission-features">
                <div className="mf-item">
                  <Zap size={20} className="mf-icon saffron" />
                  <div>
                    <div className="mf-title">Verified Data Infrastructure</div>
                    <div className="mf-sub">Real-time tracking for 500+ Uttar Pradesh villages</div>
                  </div>
                </div>
                <div className="mf-item">
                  <Handshake size={20} className="mf-icon green" />
                  <div>
                    <div className="mf-title">Empowering Local Artisans</div>
                    <div className="mf-sub">Direct marketplace bridge for self-reliant artisans</div>
                  </div>
                </div>
                <div className="mf-item">
                  <Globe size={20} className="mf-icon navy" />
                  <div>
                    <div className="mf-title">Digital Literacy First</div>
                    <div className="mf-sub">Simple Hindi/English interface for low-tech users</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Goal card */}
          <div className="col-lg-6">
            <div className="goal-card">
              <Target size={40} className="goal-target-icon mb-4" />
              <div className="section-tag saffron-tag mb-3">ROADMAP 2027</div>
              <h3 className="goal-title">
                Goal: <span>5,000 Gram Panchayats</span>
              </h3>
              <p className="goal-body">
                By 2027, VillageSathi aims to be the primary digital touchpoint for 5 million rural
                citizens across North India — supporting the nation's self-reliance mission at the
                grassroots level.
              </p>

              {/* Progress bar */}
              <div className="goal-progress-wrap">
                <div className="gp-label">
                  <span>Current: 500 Panchayats</span>
                  <span>Target: 5,000</span>
                </div>
                <div className="gp-bar">
                  <div className="gp-fill" style={{ width: "10%" }}></div>
                </div>
                <div className="gp-pct">10% of Goal Reached</div>
              </div>

              <a href="/services" className="goal-cta">
                View All Services <ChevronRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TIMELINE
      ══════════════════════════════════════════ */}
      <section className="timeline-section">
        <div className="container px-4">
          <div className="vs-section-head text-center mb-5">
            <div className="section-tag mb-3">OUR JOURNEY</div>
            <h2 className="section-title">From One Village <span>to Thousands</span></h2>
          </div>
          <div className="timeline">
            {MILESTONES.map((m, i) => (
              <div key={i} className={`tl-item ${m.future ? "future" : ""}`}>
                <div className="tl-dot" style={{ background: m.color, borderColor: m.color }} />
                <div className="tl-card">
                  <div className="tl-year" style={{ color: m.color }}>{m.year}</div>
                  <div className="tl-title">{m.title}</div>
                  <div className="tl-desc">{m.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          HQ / CONTACT SECTION
      ══════════════════════════════════════════ */}
      <section className="container px-4 py-5">
        <div className="hq-card">
          <div className="row align-items-center g-4">
            <div className="col-lg-2 text-center">
              <div className="hq-globe-wrap">
                <Globe size={48} className="hq-globe" />
              </div>
            </div>
            <div className="col-lg-6">
              <h3 className="hq-title">Globally Minded, Locally Rooted</h3>
              <p className="hq-sub">
                VillageSathi Platforms Pvt. Ltd. is headquartered in rural Uttar Pradesh — built by
                villagers, for the development of rural India.
              </p>
            </div>
            <div className="col-lg-4">
              <div className="hq-contacts">
                <a href="mailto:villagesathi.info@gmail.com" className="hq-contact-item">
                  <Mail size={16} />
                  <span>villagesathi.info@gmail.com</span>
                </a>
                <a href="tel:+919305492516" className="hq-contact-item">
                  <Phone size={16} />
                  <span>+91 9305 492 516</span>
                </a>
                <div className="hq-contact-item">
                  <MapPin size={16} />
                  <span>Village Madhiya, Post Bagghoon, Kheri, UP – 261505</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ STYLES ══════════ */}
      <style>{`
        /* ── Palette ── */
        :root {
          --saffron: #ff9933;
          --navy: #000080;
          --green: #128807;
          --light-bg: #f8fafc;
          --card-bg: #ffffff;
          --muted: #64748b;
          --border: #e2e8f0;
        }
        .about-vs { font-family: 'Segoe UI', system-ui, sans-serif; }

        /* ── Tricolor ── */
        .tricolor-bar { display: flex; height: 6px; }
        .tricolor-bar span { flex: 1; }

        /* ── Hero ── */
        .about-hero {
          background: linear-gradient(135deg, #fffdf7 0%, #fff8f0 35%, #f0f4ff 70%, #f0f9f0 100%);
          padding-bottom: 16px;
        }
        .hero-pill {
          display: inline-flex; align-items: center; gap: 8px;
          background: #fff; border: 1px solid #e2e8f0; border-radius: 999px;
          padding: 6px 18px; font-size: 0.72rem; font-weight: 700;
          color: #475569; letter-spacing: 0.5px; text-transform: uppercase;
        }
        .pill-dot { width: 8px; height: 8px; border-radius: 50%; background: #128807; animation: pulse-dot 2s infinite; flex-shrink: 0; }
        @keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:0.3} }

        .about-h1 { font-size: clamp(2rem, 5vw, 3.2rem); font-weight: 900; color: #000080; line-height: 1.1; }
        .hs { color: #ff9933; }
        .hn { color: #128807; }
        .about-hero-sub { color: #475569; font-size: 1.05rem; line-height: 1.7; max-width: 680px; }

        .btn-primary-vs {
          display: inline-flex; align-items: center; gap: 8px;
          background: #000080; color: white; font-weight: 700;
          padding: 12px 28px; border-radius: 8px; text-decoration: none;
          font-size: 0.9rem; transition: all 0.2s;
        }
        .btn-primary-vs:hover { background: #000060; color: white; transform: translateY(-2px); }
        .btn-ghost-vs {
          display: inline-flex; align-items: center; gap: 8px;
          background: transparent; color: #000080; font-weight: 700;
          padding: 12px 28px; border-radius: 8px; text-decoration: none;
          font-size: 0.9rem; border: 2px solid #000080; transition: all 0.2s;
        }
        .btn-ghost-vs:hover { background: #000080; color: white; }

        /* ── Stats bar ── */
        .about-stats-bar { background: #000080; padding: 32px 0; }
        .stats-row { display: grid; grid-template-columns: repeat(4,1fr); gap: 24px; }
        .about-stat {
          text-align: center; padding: 16px 12px;
          border-right: 1px solid rgba(255,255,255,0.1);
          animation: fadeUp 0.5s ease both;
        }
        .about-stat:last-child { border-right: none; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .about-stat-icon { color: #ff9933; margin-bottom: 8px; }
        .about-stat-val { font-size: 1.8rem; font-weight: 900; color: #fff; line-height: 1; }
        .about-stat-lbl { font-size: 0.65rem; font-weight: 700; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; }

        /* ── Section heads ── */
        .section-tag {
          display: inline-block; background: #000080; color: #fff;
          font-size: 0.65rem; font-weight: 900; letter-spacing: 2px;
          text-transform: uppercase; padding: 4px 14px; border-radius: 4px;
        }
        .saffron-tag { background: #ff9933; }
        .section-title { font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 900; color: #000080; }
        .section-title span { color: #ff9933; }
        .section-sub { color: #64748b; font-size: 0.95rem; max-width: 560px; }

        /* ── Founder section ── */
        .founder-section { padding: 64px 0; }
        .founder-photo-wrap { position: relative; padding: 16px; }
        .founder-photo-frame {
          border-left: 8px solid #ff9933; border-radius: 4px;
          overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,128,0.12);
        }
        .founder-img { width: 100%; height: 460px; object-fit: cover; display: block; }
        .founder-badge {
          position: absolute; bottom: 0; right: 0;
          background: #000080; color: white; border-radius: 10px;
          padding: 14px 18px; display: flex; align-items: center; gap: 12px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.2); margin: 8px;
        }
        .fb-avatar {
          width: 40px; height: 40px; border-radius: 50%; background: #ff9933;
          color: white; display: flex; align-items: center; justify-content: center;
          font-weight: 900; font-size: 0.9rem; flex-shrink: 0;
        }
        .fb-name { font-weight: 800; font-size: 0.92rem; }
        .fb-role { font-size: 0.7rem; color: #ff9933; font-weight: 700; }
        .founder-dots {
          position: absolute; top: 0; left: -12px;
          display: grid; grid-template-columns: repeat(3,1fr); gap: 6px; padding: 4px;
        }
        .fdot { width: 6px; height: 6px; border-radius: 50%; background: #ff9933; opacity: 0.4; }

        .quote-icon { color: #ff9933; opacity: 0.3; }
        .founder-quote { font-size: clamp(1.2rem, 2.5vw, 1.6rem); font-weight: 800; color: #000080; line-height: 1.4; }
        .fq-green { color: #128807; }
        .founder-body { color: #475569; font-size: 0.97rem; line-height: 1.75; }

        .cred-badge {
          display: flex; align-items: center; gap: 10px; padding: 12px 16px;
          border-radius: 8px; font-size: 0.85rem; font-weight: 700;
          border: 1px solid transparent;
        }
        .cred-badge.green  { background: #f0f9f0; color: #128807; border-color: #c6e8c5; }
        .cred-badge.saffron { background: #fff8f0; color: #e68a00; border-color: #ffd9a0; }
        .cred-badge.navy   { background: #f0f0fb; color: #000080; border-color: #c5c5ef; }

        /* ── Values ── */
        .values-section { background: #f1f5f9; padding: 64px 0; }
        .values-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        .value-card {
          background: #fff; border: 1px solid var(--border); border-radius: 12px;
          padding: 28px 22px; transition: all 0.25s; border-top: 3px solid var(--accent);
        }
        .value-card:hover { transform: translateY(-5px); box-shadow: 0 12px 32px rgba(0,0,0,0.08); }
        .vc-icon {
          width: 52px; height: 52px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center; margin-bottom: 16px;
        }
        .vc-title { font-size: 1rem; font-weight: 800; margin-bottom: 8px; }
        .vc-desc { font-size: 0.84rem; color: #64748b; line-height: 1.65; }

        /* ── Mission / Goal ── */
        .mission-card {
          background: #fff; border: 1px solid #e2e8f0; border-radius: 16px;
          padding: 36px; height: 100%; border-top: 4px solid #000080;
        }
        .mission-title { font-size: 1.4rem; font-weight: 900; color: #000080; margin-bottom: 14px; }
        .mission-body { color: #64748b; font-size: 0.92rem; line-height: 1.7; margin-bottom: 24px; }
        .mission-features { display: flex; flex-direction: column; gap: 16px; }
        .mf-item { display: flex; align-items: flex-start; gap: 14px; padding: 14px; background: #f8fafc; border-radius: 8px; }
        .mf-icon { flex-shrink: 0; margin-top: 2px; }
        .mf-icon.saffron { color: #ff9933; }
        .mf-icon.green   { color: #128807; }
        .mf-icon.navy    { color: #000080; }
        .mf-title { font-size: 0.88rem; font-weight: 800; color: #1e293b; }
        .mf-sub   { font-size: 0.78rem; color: #94a3b8; margin-top: 2px; }

        .goal-card {
          background: linear-gradient(135deg, #000080 0%, #000055 100%);
          border-radius: 16px; padding: 36px; height: 100%; color: white;
          position: relative; overflow: hidden;
        }
        .goal-target-icon { color: #ff9933; }
        .goal-title { font-size: 1.4rem; font-weight: 900; color: #fff; margin-bottom: 14px; }
        .goal-title span { color: #ff9933; }
        .goal-body { color: rgba(255,255,255,0.75); font-size: 0.92rem; line-height: 1.7; margin-bottom: 28px; }

        .goal-progress-wrap { margin-bottom: 28px; }
        .gp-label { display: flex; justify-content: space-between; font-size: 0.75rem; color: rgba(255,255,255,0.6); margin-bottom: 8px; }
        .gp-bar { height: 8px; background: rgba(255,255,255,0.15); border-radius: 4px; overflow: hidden; }
        .gp-fill { height: 100%; background: #ff9933; border-radius: 4px; transition: width 1s ease; }
        .gp-pct { font-size: 0.72rem; color: #ff9933; font-weight: 700; margin-top: 6px; }

        .goal-cta {
          display: inline-flex; align-items: center; gap: 6px;
          background: #ff9933; color: white; font-weight: 700;
          padding: 11px 22px; border-radius: 8px; text-decoration: none;
          font-size: 0.88rem; transition: all 0.2s;
        }
        .goal-cta:hover { background: #e68a00; color: white; }

        /* ── Timeline ── */
        .timeline-section { background: #fff; padding: 64px 0; }
        .timeline {
          display: grid; grid-template-columns: repeat(5,1fr); gap: 0;
          position: relative;
        }
        .timeline::before {
          content: ''; position: absolute; top: 20px; left: 10%; right: 10%;
          height: 2px; background: linear-gradient(90deg, #ff9933, #000080, #128807, #ff9933, #000080);
        }
        .tl-item { text-align: center; padding: 0 12px; position: relative; }
        .tl-dot {
          width: 20px; height: 20px; border-radius: 50%; border: 3px solid;
          margin: 10px auto 20px; position: relative; z-index: 1;
          background: white;
        }
        .tl-item.future .tl-dot { opacity: 0.5; }
        .tl-item.future .tl-card { opacity: 0.65; }
        .tl-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px 12px; transition: all 0.2s; }
        .tl-card:hover { border-color: #ff9933; transform: translateY(-3px); }
        .tl-year { font-size: 1.1rem; font-weight: 900; margin-bottom: 4px; }
        .tl-title { font-size: 0.85rem; font-weight: 800; color: #000080; margin-bottom: 6px; }
        .tl-desc { font-size: 0.75rem; color: #64748b; line-height: 1.5; }

        /* ── HQ Card ── */
        .hq-card {
          background: #fff; border: 1px solid #e2e8f0; border-radius: 16px;
          padding: 40px; border-left: 6px solid #ff9933;
          box-shadow: 0 4px 24px rgba(0,0,128,0.06);
        }
        .hq-globe-wrap { background: #fff8f0; border-radius: 50%; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; margin: 0 auto; }
        .hq-globe { color: #ff9933; }
        .hq-title { font-size: 1.3rem; font-weight: 900; color: #000080; margin-bottom: 8px; }
        .hq-sub { color: #64748b; font-size: 0.9rem; line-height: 1.65; }
        .hq-contacts { display: flex; flex-direction: column; gap: 12px; }
        .hq-contact-item {
          display: flex; align-items: flex-start; gap: 10px; font-size: 0.85rem;
          font-weight: 600; color: #1e293b; text-decoration: none; padding: 10px 12px;
          background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;
          transition: all 0.15s;
        }
        .hq-contact-item svg { color: #000080; flex-shrink: 0; margin-top: 1px; }
        .hq-contact-item:hover { border-color: #000080; background: #f0f0fb; color: #000080; }

        /* ── Responsive ── */
        @media (max-width: 1024px) {
          .values-grid { grid-template-columns: repeat(2,1fr); }
          .timeline { grid-template-columns: 1fr; }
          .timeline::before { display: none; }
          .tl-item { display: flex; gap: 16px; text-align: left; }
          .tl-dot { flex-shrink: 0; margin: 4px 0 0; }
          .tl-card { flex: 1; }
        }
        @media (max-width: 768px) {
          .stats-row { grid-template-columns: repeat(2,1fr); }
          .about-stat { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.1); }
          .founder-img { height: 320px; }
          .founder-dots { display: none; }
          .values-grid { grid-template-columns: 1fr; }
          .hq-card { padding: 24px; }
        }
      `}</style>
    </div>
  );
}

export default About;
