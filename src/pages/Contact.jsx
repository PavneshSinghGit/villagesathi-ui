import React, { useState, useMemo, useRef } from "react";
import axios from "axios";
import {
  Mail, Phone, MapPin, Send, ExternalLink, MessageSquare, Info, CheckCircle, AlertCircle, Loader2
} from "lucide-react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Helmet } from "react-helmet-async";
import Swal from "sweetalert2";

const SUBJECT_OPTIONS = [
  { value: "General Inquiry", label: "General Inquiry" },
  { value: "Scheme Help", label: "Govt Scheme Help" },
  { value: "Electricity Issue", label: "Electricity Issue" },
  { value: "SathiMarket Help", label: "SathiMarket Vendor Help" },
];

const SOCIAL_LINKS = [
  { Icon: FaFacebook, href: "#", label: "Facebook" },
  { Icon: FaTwitter, href: "#", label: "Twitter" },
  { Icon: FaInstagram, href: "#", label: "Instagram" },
  { Icon: FaLinkedin, href: "#", label: "LinkedIn" },
];

const INITIAL_FORM = { name: "", email: "", subject: "General Inquiry", message: "" };

/* ─── Small reusable pieces ─── */

function InfoCard({ icon, title, detail, link, accentColor }) {
  const content = (
    <div className="vs-info-card" style={{ "--accent": accentColor }}>
      <span className="vs-info-icon">{React.cloneElement(icon, { size: 20 })}</span>
      <div>
        <p className="vs-info-title">{title}</p>
        <p className="vs-info-detail">{detail}</p>
      </div>
    </div>
  );
  return link ? (
    <a href={link} style={{ textDecoration: "none" }}>{content}</a>
  ) : content;
}

function FormField({ label, error, children }) {
  return (
    <div className="vs-field">
      <label className="vs-label">{label}</label>
      {children}
      {error && <span className="vs-error"><AlertCircle size={12} /> {error}</span>}
    </div>
  );
}

/* ─── Validation ─── */
function validate(form) {
  const errs = {};
  if (!form.name.trim()) errs.name = "Name is required";
  if (!form.email.trim()) errs.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email";
  if (!form.message.trim()) errs.message = "Message cannot be empty";
  else if (form.message.trim().length < 10) errs.message = "Message too short (min 10 chars)";
  return errs;
}

/* ─── Main Component ─── */
export default function Contact() {
  const API_URL = `${import.meta.env.VITE_API_URL}/Contact/AddMessage`;
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});
  const formRef = useRef(null);

  const structuredData = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "GovernmentOrganization",
      name: "VillageSathi Platforms",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Village Madhiya, Post Bagghoon",
        addressLocality: "Lakhimpur Kheri",
        addressRegion: "UP",
        postalCode: "261505",
        addressCountry: "IN",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+91-9305492516",
        contactType: "customer service",
      },
    }),
    []
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const newErrors = validate({ ...form, [name]: value });
      setErrors((prev) => ({ ...prev, [name]: newErrors[name] }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const newErrors = validate(form);
    setErrors((prev) => ({ ...prev, [name]: newErrors[name] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allTouched = Object.fromEntries(Object.keys(INITIAL_FORM).map((k) => [k, true]));
    setTouched(allTouched);
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length) {
      formRef.current?.querySelector(".vs-field:has(.vs-error)")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setLoading(true);
    try {
      await axios.post(API_URL, {
        ...form,
        IPAddress: "0.0.0.0",
        UserAgent: navigator.userAgent,
      });
      Swal.fire({
        title: "Message Sent!",
        text: "The VillageSathi support team will contact you within 24–48 hours.",
        icon: "success",
        confirmButtonColor: "#000080",
      });
      setForm(INITIAL_FORM);
      setTouched({});
      setErrors({});
    } catch {
      Swal.fire({ title: "Error", text: "Please try again later.", icon: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="vs-page">
      <Helmet>
        <title>Contact Us | VillageSathi Official Support Portal</title>
        <meta
          name="description"
          content="Official contact portal for VillageSathi. Get expert help with PM-Kisan, Electricity bills, and SathiMarket registrations in Kheri, UP."
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Tiro+Devanagari+Hindi&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      {/* ── HERO ── */}
      <header className="vs-hero">
        <div className="vs-hero-stripe" aria-hidden="true" />
        <div className="vs-container">
          <span className="vs-badge">
            <span className="vs-badge-dot" aria-hidden="true" />
            Helpdesk
          </span>
          <h1 className="vs-hero-title">
            Contact <span className="vs-highlight">VillageSathi</span>
          </h1>
          <p className="vs-hero-sub">
            Official helpdesk for Gram Panchayats, farmers, and artisans. Submit queries on{" "}
            <strong>Sarkari Yojana</strong>, <strong>Electricity Services</strong>, or{" "}
            <strong>SathiMarket</strong>.
          </p>
        </div>
      </header>

      {/* ── ANNOUNCEMENT ── */}
      <div className="vs-announcement" role="note">
        <div className="vs-container vs-announcement-inner">
          <Info size={15} className="vs-ann-icon" aria-hidden="true" />
          <span>Helpdesk Response Time: Within <strong>24–48 working hours</strong>.</span>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="vs-container vs-body">
        <div className="vs-grid">
          {/* ── LEFT SIDEBAR ── */}
          <aside className="vs-sidebar">
            <InfoCard
              icon={<Phone />}
              title="Helpline"
              detail="+91 9305492516"
              link="tel:+919305492516"
              accentColor="#ff9933"
            />
            <InfoCard
              icon={<Mail />}
              title="Official Email"
              detail="villagesathi.info@gmail.com"
              link="mailto:villagesathi.info@gmail.com"
              accentColor="#000080"
            />
            <InfoCard
              icon={<MapPin />}
              title="Registered Office"
              detail="Village Madhiya, Post Bagghoon, Kheri, UP – 261505"
              accentColor="#128807"
            />

            {/* Hours card */}
            <div className="vs-hours-card">
              <p className="vs-hours-title">Working Hours</p>
              <ul className="vs-hours-list">
                <li><span>Mon – Sat</span><strong>9:00 AM – 6:00 PM</strong></li>
                <li><span>Sunday</span><strong>Closed</strong></li>
              </ul>
            </div>

            {/* Social */}
            <div className="vs-social-card">
              <p className="vs-social-title">Follow Us</p>
              <div className="vs-social-row">
                {SOCIAL_LINKS.map(({ Icon, href, label }) => (
                  <a key={label} href={href} aria-label={label} className="vs-social-btn">
                    <Icon size={17} />
                  </a>
                ))}
              </div>
            </div>
          </aside>

          {/* ── FORM ── */}
          <section className="vs-form-card" aria-label="Contact Form">
            <h2 className="vs-form-heading">
              <MessageSquare size={20} className="vs-form-heading-icon" aria-hidden="true" />
              Contact Form
            </h2>

            <form ref={formRef} onSubmit={handleSubmit} noValidate className="vs-form">
              <div className="vs-form-row">
                <FormField label="Full Name" error={errors.name}>
                  <input
                    type="text"
                    name="name"
                    className={`vs-input ${errors.name ? "vs-input--error" : ""}`}
                    value={form.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Your name"
                    autoComplete="name"
                  />
                </FormField>
                <FormField label="Email Address" error={errors.email}>
                  <input
                    type="email"
                    name="email"
                    className={`vs-input ${errors.email ? "vs-input--error" : ""}`}
                    value={form.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Email address"
                    autoComplete="email"
                  />
                </FormField>
              </div>

              <FormField label="Subject of Inquiry">
                <select
                  name="subject"
                  className="vs-input vs-select"
                  value={form.subject}
                  onChange={handleChange}
                >
                  {SUBJECT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="Your Message" error={errors.message}>
                <textarea
                  name="message"
                  className={`vs-input vs-textarea ${errors.message ? "vs-input--error" : ""}`}
                  value={form.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows={5}
                  placeholder="Write your message here…"
                />
                <span className="vs-char-count">{form.message.length} chars</span>
              </FormField>

              <button type="submit" disabled={loading} className="vs-submit">
                {loading ? (
                  <><Loader2 size={18} className="vs-spin" /> Processing…</>
                ) : (
                  <><Send size={18} /> Submit Inquiry</>
                )}
              </button>
            </form>
          </section>
        </div>

        {/* ── MAP ── */}
        <div className="vs-map-section">
          <div className="vs-map-info">
            <h3 className="vs-map-heading">
              <span className="vs-map-heading-bar" aria-hidden="true" />
              Office Location
            </h3>
            <p className="vs-map-desc">
              Visit our headquarters in Madhiya for SathiMarket registrations and local
              administrative support.
            </p>
            <address className="vs-map-address">
              <MapPin size={18} className="vs-map-pin" aria-hidden="true" />
              <span>Village Madhiya, Post Bagghoon,<br />Kheri, Uttar Pradesh – 261505</span>
            </address>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Villagesathi&query_place_id=ChIJFUIJOAATnzkRLnhsPrY6pg0"
              target="_blank"
              rel="noreferrer"
              className="vs-map-btn"
            >
              Get Directions to VillageSathi
            </a>
          </div>
          <div className="vs-map-embed">
            <iframe
              title="VillageSathi Office Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3513.568469339246!2d80.3503251!3d27.9060931!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399f130022416b77%3A0x7be2880026e6329c!2sVILLAGESATHI%20PLATFORMS%20PRIVATE%20LIMITED!5e0!3m2!1sen!2sin!4v1715712000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, display: "block" }}
              allowFullScreen=""
              loading="lazy"
            />
          </div>
        </div>
      </div>

      {/* ─────────── STYLES ─────────── */}
      <style>{`
        /* ── Tokens ── */
        .vs-page {
          --navy:    #000080;
          --navy-dk: #00004d;
          --saffron: #ff9933;
          --saffron-dk: #e68a00;
          --green:   #128807;
          --muted:   #64748b;
          --border:  #e2e8f0;
          --surface: #ffffff;
          --bg:      #f5f7fa;
          --radius:  6px;
          --shadow:  0 1px 4px rgba(0,0,0,.08), 0 4px 16px rgba(0,0,0,.06);
          background: var(--bg);
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #1e293b;
          -webkit-font-smoothing: antialiased;
        }
        .vs-container { max-width: 1140px; margin-inline: auto; padding-inline: 1.25rem; }

        /* ── Hero ── */
        .vs-hero {
          background: #fff;
          border-top: 4px solid var(--saffron);
          padding: 3rem 0 2.5rem;
          position: relative;
          overflow: hidden;
          text-align: center;
        }
        .vs-hero-stripe {
          position: absolute; inset: 0;
          background: linear-gradient(160deg, #fff9f0 0%, #fff 60%);
          pointer-events: none;
        }
        .vs-hero .vs-container { position: relative; }
        .vs-badge {
          display: inline-flex; align-items: center; gap: .5rem;
          background: #f1f5f9; border: 1px solid #cbd5e1;
          border-radius: 20px; padding: .3rem .85rem;
          font-size: .72rem; font-weight: 700; color: #475569;
          letter-spacing: .04em; text-transform: uppercase; margin-bottom: 1rem;
        }
        .vs-badge-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--green); flex-shrink: 0;
          box-shadow: 0 0 0 2px rgba(18,136,7,.2);
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%,100% { box-shadow: 0 0 0 2px rgba(18,136,7,.2); }
          50%      { box-shadow: 0 0 0 5px rgba(18,136,7,.08); }
        }
        .vs-hero-title {
          font-size: clamp(1.8rem, 4vw, 2.6rem);
          font-weight: 800; color: var(--navy); margin: 0 0 .75rem; line-height: 1.2;
        }
        .vs-highlight { color: var(--saffron); }
        .vs-hero-sub {
          color: var(--muted); font-size: .97rem; line-height: 1.7;
          max-width: 680px; margin-inline: auto;
        }

        /* ── Announcement bar ── */
        .vs-announcement {
          background: var(--navy); color: #fff;
          padding: .6rem 0; font-size: .82rem;
        }
        .vs-announcement-inner {
          display: flex; align-items: center; gap: .55rem;
        }
        .vs-ann-icon { color: var(--saffron); flex-shrink: 0; }

        /* ── Body layout ── */
        .vs-body { padding-block: 2.5rem 3rem; }
        .vs-grid {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 1.5rem;
          align-items: start;
        }
        @media (max-width: 900px) {
          .vs-grid { grid-template-columns: 1fr; }
        }

        /* ── Sidebar ── */
        .vs-sidebar { display: flex; flex-direction: column; gap: .85rem; }

        /* InfoCard */
        .vs-info-card {
          background: var(--surface);
          border-left: 4px solid var(--accent, var(--navy));
          border-radius: var(--radius);
          box-shadow: var(--shadow);
          padding: .9rem 1rem;
          display: flex; align-items: flex-start; gap: .9rem;
          transition: transform .15s, box-shadow .15s;
        }
        a:hover .vs-info-card { transform: translateY(-2px); box-shadow: 0 4px 18px rgba(0,0,0,.1); }
        .vs-info-icon {
          flex-shrink: 0;
          display: grid; place-items: center;
          width: 38px; height: 38px;
          background: #f8fafc; border-radius: 6px;
          color: var(--navy);
        }
        .vs-info-title {
          font-size: .65rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: .05em; color: var(--muted); margin: 0 0 .25rem;
        }
        .vs-info-detail {
          font-size: .85rem; font-weight: 600; color: var(--navy); margin: 0;
          word-break: break-word;
        }

        /* Hours card */
        .vs-hours-card {
          background: var(--surface); border-radius: var(--radius);
          box-shadow: var(--shadow); padding: 1rem;
        }
        .vs-hours-title {
          font-size: .65rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: .05em; color: var(--muted); margin: 0 0 .65rem;
        }
        .vs-hours-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: .4rem; }
        .vs-hours-list li {
          display: flex; justify-content: space-between; align-items: center;
          font-size: .82rem; color: var(--navy);
        }
        .vs-hours-list span { color: var(--muted); }

        /* Social card */
        .vs-social-card {
          background: var(--surface); border-radius: var(--radius);
          box-shadow: var(--shadow); padding: 1rem; text-align: center;
        }
        .vs-social-title {
          font-size: .65rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: .05em; color: var(--muted); margin: 0 0 .75rem;
        }
        .vs-social-row { display: flex; justify-content: center; gap: .6rem; }
        .vs-social-btn {
          display: grid; place-items: center;
          width: 36px; height: 36px;
          background: #f1f5f9; border-radius: 8px;
          color: var(--navy); transition: background .15s, color .15s, transform .15s;
        }
        .vs-social-btn:hover {
          background: var(--navy); color: var(--saffron); transform: translateY(-2px);
        }

        /* ── Form Card ── */
        .vs-form-card {
          background: var(--surface); border-radius: var(--radius);
          box-shadow: var(--shadow); padding: 2rem;
        }
        .vs-form-heading {
          display: flex; align-items: center; gap: .6rem;
          font-size: 1rem; font-weight: 700; color: var(--navy);
          border-bottom: 2px solid var(--border); padding-bottom: .9rem; margin-bottom: 1.5rem;
        }
        .vs-form-heading-icon { color: var(--saffron); }

        .vs-form { display: flex; flex-direction: column; gap: 1.1rem; }
        .vs-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.1rem; }
        @media (max-width: 560px) { .vs-form-row { grid-template-columns: 1fr; } }

        .vs-field { display: flex; flex-direction: column; gap: .35rem; position: relative; }
        .vs-label {
          font-size: .68rem; font-weight: 800; text-transform: uppercase;
          letter-spacing: .06em; color: var(--navy);
        }
        .vs-input {
          width: 100%; padding: .65rem .85rem;
          border: 1.5px solid var(--border); border-radius: var(--radius);
          font-size: .9rem; font-family: inherit; color: #1e293b;
          background: #fafbfc;
          transition: border-color .15s, box-shadow .15s;
          outline: none;
          box-sizing: border-box;
        }
        .vs-input:focus {
          border-color: var(--navy);
          box-shadow: 0 0 0 3px rgba(0,0,128,.1);
          background: #fff;
        }
        .vs-input--error { border-color: #dc2626; }
        .vs-input--error:focus { box-shadow: 0 0 0 3px rgba(220,38,38,.12); }
        .vs-select { appearance: none; cursor: pointer;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
          background-repeat: no-repeat; background-position: right .8rem center; padding-right: 2.5rem;
        }
        .vs-textarea { resize: vertical; min-height: 120px; }
        .vs-char-count {
          font-size: .7rem; color: var(--muted); text-align: right; margin-top: .2rem;
        }
        .vs-error {
          display: flex; align-items: center; gap: .3rem;
          font-size: .72rem; color: #dc2626; font-weight: 500;
        }

        .vs-submit {
          display: flex; align-items: center; justify-content: center; gap: .55rem;
          width: 100%; padding: .8rem 1rem;
          background: var(--navy); color: #fff;
          border: none; border-radius: var(--radius);
          font-size: .9rem; font-weight: 700; letter-spacing: .03em;
          cursor: pointer; transition: background .2s, transform .15s, box-shadow .15s;
          font-family: inherit;
        }
        .vs-submit:hover:not(:disabled) {
          background: var(--navy-dk); transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(0,0,128,.3);
        }
        .vs-submit:disabled { opacity: .65; cursor: not-allowed; }
        .vs-spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Map ── */
        .vs-map-section {
          margin-top: 2rem;
          display: grid; grid-template-columns: 340px 1fr;
          border-radius: var(--radius); overflow: hidden;
          box-shadow: var(--shadow);
        }
        @media (max-width: 768px) {
          .vs-map-section { grid-template-columns: 1fr; }
          .vs-map-embed { height: 280px; }
        }
        .vs-map-info {
          background: var(--navy); color: #fff;
          padding: 2rem 1.75rem;
          display: flex; flex-direction: column; justify-content: center; gap: 1rem;
        }
        .vs-map-heading {
          font-size: 1.2rem; font-weight: 700; margin: 0;
          display: flex; align-items: center; gap: .7rem;
        }
        .vs-map-heading-bar {
          display: inline-block; width: 4px; height: 1.2em;
          background: var(--saffron); border-radius: 2px; flex-shrink: 0;
        }
        .vs-map-desc { font-size: .85rem; opacity: .8; margin: 0; line-height: 1.6; }
        .vs-map-address {
          display: flex; align-items: flex-start; gap: .6rem;
          font-size: .85rem; font-style: normal; line-height: 1.6;
        }
        .vs-map-pin { color: var(--saffron); flex-shrink: 0; margin-top: .1rem; }
        .vs-map-btn {
          display: inline-flex; align-items: center; gap: .4rem;
          padding: .6rem 1.2rem;
          background: var(--saffron); color: #fff;
          border-radius: var(--radius); font-size: .85rem; font-weight: 700;
          text-decoration: none; transition: background .2s, transform .15s;
          align-self: flex-start;
        }
        .vs-map-btn:hover { background: var(--saffron-dk); transform: translateY(-1px); }
        .vs-map-embed { height: 380px; }
        .vs-map-embed iframe { display: block; }
      `}</style>
    </main>
  );
}