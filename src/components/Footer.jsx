import React from "react";
import { Link } from "react-router-dom";
import {
  PhoneCall, Mail, MapPin, Award, Scale, ShieldCheck
} from "lucide-react";

/* ── Social SVG icons ── */
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      label: "Facebook",
      href: "https://www.facebook.com/share/1GWs833Zns/",
      icon: <FacebookIcon />,
      color: "#1877F2",
    },
    {
      label: "Instagram",
      href: "https://www.instagram.com/villagesathi.info",
      icon: <InstagramIcon />,
      color: "#E1306C",
    },
    {
      label: "WhatsApp",
      href: "https://wa.me/919305492516",
      icon: <WhatsAppIcon />,
      color: "#25D366",
    },
    {
      label: "Email",
      href: "mailto:villagesathi.info@gmail.com",
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/>
        </svg>
      ),
      color: "#ff9933",
    },
  ];

  const govLinks = [
    { label: "About Portal", link: "/about" },
    { label: "Help Desk", link: "/contact" },
    { label: "Privacy Policy", link: "/privacy-policy" },
    { label: "Terms of Use", link: "/terms" },
    { label: "Disclaimer", link: "/disclaimer" },
  ];

  const ecosystemLinks = [
    { label: "SathiMarket", link: "/sathi-market", tag: "market" },
    { label: "Sarkari Yojana", link: "/services/governmentschemes" },
    { label: "Grid Tracker", link: "/services/electricity" },
    { label: "Village Patrika", link: "/blog" },
    { label: "Support / FAQ", link: "/faq" },
  ];

  return (
    <footer className="vs-footer">
      {/* Tiranga top bar */}
      <div className="vs-tiranga-bar">
        <span className="bar-saffron" />
        <span className="bar-white" />
        <span className="bar-green" />
      </div>

      <div className="vs-container">
        {/* ── ROW 1: Brand ─────────────────────────────── */}
        <div className="vs-brand-row">
          <div className="vs-brand-left">
            <Link to="/" className="vs-logo-link">
              <span className="vs-logo-village">VILLAGE</span>
              <span className="vs-logo-sathi">SATHI</span>
              <span className="vs-logo-dot" />
            </Link>
            <p className="vs-tagline">
              <strong>VillageSathi Platforms</strong> — a DPIIT Recognized startup powering{" "}
              <strong>Digital India</strong> at the grassroots. Real-time utility data,{" "}
              <em>SathiMarket</em> commerce, and verified{" "}
              <strong>Sarkari Yojana</strong> info for every Gram Panchayat.
            </p>

            {/* Social Row */}
            <div className="vs-social-row">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="vs-social-btn"
                  aria-label={s.label}
                  style={{ "--accent": s.color }}
                >
                  {s.icon}
                  <span className="vs-social-label">{s.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Contact card */}
          <div className="vs-contact-card">
            <div className="vs-contact-inner">
              <div className="vs-contact-row">
                <MapPin size={15} className="vs-icon-saffron" />
                <span>Village Madhiya, Post Bagghoon,<br />Lakhimpur Kheri, UP – 261505</span>
              </div>
              <div className="vs-contact-row">
                <Mail size={15} className="vs-icon-saffron" />
                <a href="mailto:villagesathi.info@gmail.com" className="vs-contact-link">
                  villagesathi.info@gmail.com
                </a>
              </div>
              <a href="tel:+919305492516" className="vs-helpline">
                <div className="vs-helpline-icon">
                  <PhoneCall size={20} className="vs-icon-saffron" />
                </div>
                <div>
                  <span className="vs-micro">HELPLINE</span>
                  <strong>+91 93054 92516</strong>
                </div>
              </a>
            </div>

            {/* DPIIT badge */}
            <div className="vs-dpiit">
              <Award size={14} className="vs-icon-saffron" />
              <div>
                <span className="vs-micro vs-dpiit-title">DPIIT RECOGNIZED • STARTUP INDIA</span>
                <span className="vs-dpiit-sub">VillageSathi Platforms Pvt. Ltd. · UP-2024</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── DIVIDER ───────────────────────────────── */}
        <div className="vs-divider" />

        {/* ── ROW 2: Nav Columns ───────────────────── */}
        <div className="vs-nav-row">
          <div className="vs-nav-col">
            <h6 className="vs-nav-heading">Governance</h6>
            <ul className="vs-nav-list">
              {govLinks.map((item, i) => (
                <li key={i}>
                  <Link to={item.link} className="vs-nav-link">
                    <span className="vs-link-arrow">›</span> {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="vs-nav-col">
            <h6 className="vs-nav-heading">Ecosystem</h6>
            <ul className="vs-nav-list">
              {ecosystemLinks.map((item, i) => (
                <li key={i}>
                  <Link to={item.link} className={`vs-nav-link${item.tag === "market" ? " vs-market-link" : ""}`}>
                    <span className="vs-link-arrow">›</span> {item.label}
                    {item.tag === "market" && <span className="vs-market-badge">NEW</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Mission strip */}
          <div className="vs-mission-col">
            <div className="vs-mission-card">
              <div className="vs-mission-flag">
                <span className="mf-s" /><span className="mf-w" /><span className="mf-g" />
              </div>
              <p className="vs-mission-text">
                "Empowering every village with the tools of tomorrow — because <strong>Bharat</strong> thrives when its roots grow strong."
              </p>
              <div className="vs-mission-badges">
                <span className="vs-badge"><ShieldCheck size={11} /> Secure Portal</span>
                <span className="vs-badge vs-badge-gold"><Scale size={11} /> Legal Compliant</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── BOTTOM BAR ───────────────────────────── */}
        <div className="vs-bottom">
          <p className="vs-copy">
            © {currentYear} <strong>VillageSathi Platforms</strong>. All rights reserved.
            &nbsp;·&nbsp; Empowering Rural India through Digital Innovation.
          </p>
          <p className="vs-made">
            Made with 🇮🇳 in Uttar Pradesh
          </p>
        </div>
      </div>

      {/* ══ STYLES ══════════════════════════════════ */}
      <style>{`
        /* ── Fonts ── */
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Hind:wght@400;500;600&display=swap');

        /* ── Variables ── */
        .vs-footer {
          --saffron:  #FF9933;
          --navy:     #00004B;
          --deep:     #000033;
          --green:    #138808;
          --purple:   #6C2BD9;
          --purple-lt:#9B59F5;
          --white:    #FFFFFF;
          --muted:    rgba(255,255,255,0.55);
          --border:   rgba(255,255,255,0.08);

          background: var(--deep);
          font-family: 'Hind', sans-serif;
          color: var(--white);
          position: relative;
          overflow: hidden;
        }

        /* subtle diagonal grid texture */
        .vs-footer::before {
          content:'';
          position:absolute; inset:0;
          background-image: repeating-linear-gradient(
            45deg,
            rgba(255,255,255,0.015) 0px,
            rgba(255,255,255,0.015) 1px,
            transparent 1px,
            transparent 40px
          );
          pointer-events:none;
        }

        /* ── Tiranga strip ── */
        .vs-tiranga-bar { display:flex; height:5px; width:100%; }
        .bar-saffron { flex:1; background:var(--saffron); }
        .bar-white   { flex:1; background:#FFFFFF; }
        .bar-green   { flex:1; background:var(--green); }

        /* ── Layout ── */
        .vs-container {
          max-width:1200px; margin:0 auto;
          padding:48px 24px 24px;
          position:relative; z-index:1;
        }

        /* ── Brand Row ── */
        .vs-brand-row {
          display:flex; gap:40px; align-items:flex-start;
          flex-wrap:wrap;
        }
        .vs-brand-left { flex:1; min-width:260px; }

        /* Logo */
        .vs-logo-link {
          display:inline-flex; align-items:center; gap:2px;
          text-decoration:none; margin-bottom:14px;
        }
        .vs-logo-village {
          font-family:'Baloo 2', cursive;
          font-size:clamp(1.5rem,4vw,2rem);
          font-weight:800; color:var(--white);
          letter-spacing:-0.5px;
        }
        .vs-logo-sathi {
          font-family:'Baloo 2', cursive;
          font-size:clamp(1.5rem,4vw,2rem);
          font-weight:800; color:var(--saffron);
          letter-spacing:-0.5px;
        }
        .vs-logo-dot {
          width:8px; height:8px; border-radius:50%;
          background:var(--green); margin-left:6px; align-self:flex-end; margin-bottom:8px;
        }

        .vs-tagline {
          color:var(--muted); font-size:0.82rem; line-height:1.7;
          max-width:420px; margin-bottom:20px;
        }
        .vs-tagline strong { color:rgba(255,255,255,0.9); }
        .vs-tagline em { color:var(--purple-lt); font-style:normal; }

        /* Social */
        .vs-social-row { display:flex; flex-wrap:wrap; gap:8px; }
        .vs-social-btn {
          display:inline-flex; align-items:center; gap:6px;
          padding:7px 13px; border-radius:4px;
          border:1px solid rgba(255,255,255,0.12);
          background:rgba(255,255,255,0.04);
          color:rgba(255,255,255,0.75);
          text-decoration:none; font-size:0.75rem; font-weight:600;
          transition:all 0.25s ease; cursor:pointer;
        }
        .vs-social-btn:hover {
          background:var(--accent, var(--saffron));
          border-color:var(--accent, var(--saffron));
          color:#fff;
          transform:translateY(-2px);
          box-shadow:0 6px 20px rgba(0,0,0,0.3);
        }
        .vs-social-label { letter-spacing:0.3px; }

        /* Contact Card */
        .vs-contact-card {
          width:280px; flex-shrink:0;
          display:flex; flex-direction:column; gap:16px;
        }
        .vs-contact-inner {
          background:rgba(255,255,255,0.04);
          border:1px solid var(--border);
          border-radius:8px; padding:20px;
          display:flex; flex-direction:column; gap:12px;
        }
        .vs-contact-row {
          display:flex; align-items:flex-start; gap:10px;
          color:var(--muted); font-size:0.8rem; line-height:1.5;
        }
        .vs-icon-saffron { color:var(--saffron); flex-shrink:0; margin-top:2px; }
        .vs-contact-link {
          color:var(--muted); text-decoration:none;
          transition:color 0.2s;
        }
        .vs-contact-link:hover { color:var(--saffron); }

        .vs-helpline {
          display:flex; align-items:center; gap:12px;
          background:rgba(255,153,51,0.08);
          border:1px solid rgba(255,153,51,0.25);
          border-radius:6px; padding:12px 14px;
          text-decoration:none; color:var(--white);
          transition:all 0.25s;
        }
        .vs-helpline:hover { background:rgba(255,153,51,0.18); }
        .vs-helpline-icon {
          width:38px; height:38px; border-radius:50%;
          background:rgba(255,153,51,0.12);
          display:flex; align-items:center; justify-content:center;
          flex-shrink:0;
        }
        .vs-helpline strong { display:block; font-size:1rem; letter-spacing:0.5px; }
        .vs-micro {
          display:block; font-size:0.58rem; font-weight:700;
          letter-spacing:1.5px; color:var(--saffron); margin-bottom:2px;
          text-transform:uppercase;
        }

        /* DPIIT */
        .vs-dpiit {
          display:flex; align-items:center; gap:10px;
          background:rgba(255,153,51,0.05);
          border:1px dashed rgba(255,153,51,0.3);
          border-radius:6px; padding:12px 14px;
        }
        .vs-dpiit-title { color:var(--saffron); }
        .vs-dpiit-sub {
          display:block; font-size:0.62rem;
          color:var(--muted); margin-top:2px;
        }

        /* ── Divider ── */
        .vs-divider {
          margin:36px 0;
          height:1px;
          background:linear-gradient(to right, transparent, rgba(255,153,51,0.3) 30%, rgba(19,136,8,0.3) 70%, transparent);
        }

        /* ── Nav Row ── */
        .vs-nav-row {
          display:flex; gap:40px; flex-wrap:wrap; align-items:flex-start;
        }
        .vs-nav-col { min-width:140px; }
        .vs-nav-heading {
          font-size:0.68rem; font-weight:800;
          text-transform:uppercase; letter-spacing:2px;
          color:var(--saffron);
          border-left:3px solid var(--saffron);
          padding-left:10px; margin-bottom:18px;
        }
        .vs-nav-list { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:9px; }
        .vs-nav-link {
          color:var(--muted); text-decoration:none;
          font-size:0.83rem; display:inline-flex; align-items:center; gap:6px;
          transition:all 0.2s;
        }
        .vs-nav-link:hover { color:var(--saffron); transform:translateX(4px); }
        .vs-link-arrow { color:var(--saffron); font-size:1rem; line-height:1; }

        /* SathiMarket purple accent */
        .vs-market-link { color:var(--purple-lt) !important; }
        .vs-market-link:hover { color:#fff !important; }
        .vs-market-badge {
          font-size:0.55rem; font-weight:800; letter-spacing:1px;
          background:var(--purple); color:#fff;
          padding:2px 6px; border-radius:3px; margin-left:4px;
        }

        /* Mission card */
        .vs-mission-col { flex:1; min-width:220px; }
        .vs-mission-card {
          background:linear-gradient(135deg, rgba(108,43,217,0.1), rgba(0,0,51,0.5));
          border:1px solid rgba(108,43,217,0.25);
          border-radius:10px; padding:20px;
        }
        .vs-mission-flag {
          display:flex; height:3px; border-radius:2px; overflow:hidden;
          margin-bottom:14px; width:40px;
        }
        .mf-s { flex:1; background:var(--saffron); }
        .mf-w { flex:1; background:#fff; }
        .mf-g { flex:1; background:var(--green); }
        .vs-mission-text {
          font-size:0.82rem; line-height:1.7; color:var(--muted);
          font-style:italic; margin-bottom:16px;
        }
        .vs-mission-text strong { color:var(--saffron); font-style:normal; }
        .vs-mission-badges { display:flex; gap:8px; flex-wrap:wrap; }
        .vs-badge {
          display:inline-flex; align-items:center; gap:5px;
          font-size:0.62rem; font-weight:700; letter-spacing:1px;
          text-transform:uppercase;
          border:1px solid rgba(255,255,255,0.15);
          color:rgba(255,255,255,0.6);
          padding:4px 10px; border-radius:3px;
        }
        .vs-badge-gold { border-color:rgba(255,153,51,0.4); color:var(--saffron); }

        /* ── Bottom ── */
        .vs-bottom {
          margin-top:36px;
          padding-top:20px;
          border-top:1px solid var(--border);
          display:flex; justify-content:space-between; align-items:center;
          flex-wrap:wrap; gap:8px;
        }
        .vs-copy {
          font-size:0.78rem; color:var(--muted); margin:0;
        }
        .vs-copy strong { color:rgba(255,255,255,0.85); }
        .vs-made { font-size:0.78rem; color:var(--muted); margin:0; }

        /* ── Responsive ── */
        @media(max-width:900px) {
          .vs-brand-row { flex-direction:column; }
          .vs-contact-card { width:100%; }
        }
        @media(max-width:640px) {
          .vs-nav-row { gap:28px; }
          .vs-mission-col { width:100%; }
          .vs-bottom { flex-direction:column; text-align:center; gap:6px; }
          .vs-social-btn .vs-social-label { display:none; }
          .vs-social-btn { padding:8px 10px; }
          .vs-container { padding:36px 16px 20px; }
        }
      `}</style>
    </footer>
  );
};

export default Footer;