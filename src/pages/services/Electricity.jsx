import React, { useCallback, useEffect, useReducer } from "react";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import {
  Zap, MapPin, RefreshCw, AlertTriangle, ShieldCheck,
  Phone, BarChart3, CheckCircle2, Info, Clock, Scale,
  Wifi, WifiOff, Wrench
} from "lucide-react";

// ─── API ─────────────────────────────────────────────────────────────────────
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });
const get = (url, params) => api.get(url, { params }).then((r) => r.data);

// ─── Helpers ─────────────────────────────────────────────────────────────────
const toLabel = (key) =>
  key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());

const STATUS_MAP = {
  1: {
    bg: "var(--success-bg)",
    border: "var(--success)",
    text: "Active — Supply On",
    label: "ACTIVE / चालू",
    Icon: CheckCircle2,
    color: "var(--success)",
  },
  2: {
    bg: "var(--warn-bg)",
    border: "var(--warn)",
    text: "Maintenance in Progress",
    label: "MAINTENANCE / सुधार जारी",
    Icon: Wrench,
    color: "var(--warn)",
  },
  3: {
    bg: "var(--danger-bg)",
    border: "var(--danger)",
    text: "Offline — Supply Cut",
    label: "OFFLINE / बिजली बंद",
    Icon: WifiOff,
    color: "var(--danger)",
  },
};
const DEFAULT_STATUS = {
  bg: "#f1f5f9",
  border: "var(--navy)",
  text: "Unknown Status",
  label: "UNKNOWN",
  Icon: Info,
  color: "var(--navy)",
};

// ─── State Management ─────────────────────────────────────────────────────────
const INIT = {
  states: [], districts: [], centers: [], villages: [],
  stateId: "", districtId: "", centerId: "", villageId: "",
  result: null, loading: false, error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "SET":       return { ...state, ...action.payload };
    case "LOADING":   return { ...state, loading: true, error: "", result: null };
    case "SUCCESS":   return { ...state, loading: false, result: action.payload };
    case "ERROR":     return { ...state, loading: false, error: action.payload };
    case "PICK_STATE":
      return { ...state, stateId: action.id, districtId: "", centerId: "", villageId: "", districts: [], centers: [], villages: [] };
    case "PICK_DISTRICT":
      return { ...state, districtId: action.id, centerId: "", villageId: "", centers: [], villages: [] };
    case "PICK_CENTER":
      return { ...state, centerId: action.id, villageId: "", villages: [] };
    default: return state;
  }
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Electricity() {
  const [s, dispatch] = useReducer(reducer, INIT);

  // Bootstrap
  useEffect(() => {
    get("/Electricity/location/states/1").then((states) =>
      dispatch({ type: "SET", payload: { states } })
    ).catch(console.error);
  }, []);

  useEffect(() => {
    if (!s.stateId) return;
    dispatch({ type: "PICK_STATE", id: s.stateId });
    get(`/Electricity/location/districts/${s.stateId}`).then((districts) =>
      dispatch({ type: "SET", payload: { districts } })
    );
  }, [s.stateId]);

  useEffect(() => {
    if (!s.districtId) return;
    get(`/Electricity/supply-centers/${s.districtId}`).then((centers) =>
      dispatch({ type: "SET", payload: { centers } })
    );
  }, [s.districtId]);

  useEffect(() => {
    if (!s.centerId) return;
    get(`/Electricity/villages/${s.centerId}`).then((villages) =>
      dispatch({ type: "SET", payload: { villages } })
    );
  }, [s.centerId]);

  const handleCheck = useCallback(async () => {
    if (!s.centerId || !s.villageId) {
      dispatch({ type: "ERROR", payload: "Please select a Supply Center and Village." });
      return;
    }
    dispatch({ type: "LOADING" });
    try {
      const res = await get("/Electricity/status", { centerId: s.centerId, villageId: s.villageId });
      if (res.success) dispatch({ type: "SUCCESS", payload: res.data });
      else dispatch({ type: "ERROR", payload: res.message || "No records found for this location." });
    } catch {
      dispatch({ type: "ERROR", payload: "Could not reach the server. Please try again." });
    }
  }, [s.centerId, s.villageId]);

  return (
    <main className="e-root">
      <Helmet>
        <title>Smart Power Tracker — Village Electricity Status | VillageSathi</title>
        <meta name="description" content="Check real-time electricity supply status for your village. IoT-enabled grid monitoring for Gram Panchayats across Uttar Pradesh." />
        <meta name="keywords" content="village electricity status, bijli status, power supply UP, gram panchayat electricity, rural electricity tracker" />
        <meta property="og:title" content="Smart Power Tracker | VillageSathi" />
        <meta property="og:description" content="Track real-time electricity supply status for your village via official grid monitoring." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://villagesathi.in/electricity" />
      </Helmet>

      {/* Hero */}
      <header className="e-hero" role="banner">
        <div className="e-container e-hero-inner">
          <div className="e-hero-text">
            <span className="e-badge" aria-label="Official portal">
              <Scale size={13} aria-hidden="true" />
              विद्युत आपूर्ति पोर्टल&nbsp;·&nbsp;Power Supply Monitor
            </span>
            <h1 className="e-hero-title">
              Smart <span className="e-saffron">Power</span> Tracker
            </h1>
            <p className="e-hero-sub">
              IoT-enabled grid monitoring for real-time village electricity status.
            </p>
          </div>
          <div className="e-hero-status" aria-live="polite">
            <Clock size={15} aria-hidden="true" />
            <span>Grid Sync: Live</span>
          </div>
        </div>
      </header>

      {/* Ticker */}
      <div className="e-ticker" role="marquee" aria-label="Grid alerts">
        <Zap size={13} className="e-saffron-icon" aria-hidden="true" />
        <marquee className="e-ticker-text">
          Grid Alert: Scheduled maintenance in Kheri Block 10 PM–4 AM &nbsp;•&nbsp;
          PM-Kisan Smart Grid Sync active for irrigation pumps &nbsp;•&nbsp;
          Report power theft: Helpline 1912
        </marquee>
      </div>

      {/* Body */}
      <div className="e-container e-body">
        <div className="e-layout">

          {/* Sidebar */}
          <aside className="e-sidebar" aria-label="Quick links">
            <nav className="e-card e-card--navy-top" aria-label="Status tools">
              <h2 className="e-section-label">Status Tools</h2>
              <ul className="e-nav-list" role="list">
                <li>
                  <button className="e-nav-btn e-nav-btn--active" aria-current="page">
                    <Wifi size={15} aria-hidden="true" /> Track Village Grid
                  </button>
                </li>
                <li>
                  <button className="e-nav-btn">
                    <BarChart3 size={15} aria-hidden="true" /> Load Analytics
                  </button>
                </li>
              </ul>
            </nav>

            <div className="e-helpline" role="complementary" aria-label="Helpline">
              <Phone size={28} aria-hidden="true" />
              <p className="e-helpline-label">Toll-Free Helpline</p>
              <a href="tel:1912" className="e-helpline-number" aria-label="Call electricity helpline 1912">1912</a>
              <p className="e-helpline-sub">For Electrical Complaints</p>
            </div>
          </aside>

          {/* Main */}
          <section className="e-main" aria-label="Electricity status checker">

            {/* Filter panel */}
            <div className="e-card e-card--navy-top">
              <h2 className="e-card-heading">
                <MapPin size={16} className="e-icon-red" aria-hidden="true" />
                Select Your Location
              </h2>

              <div className="e-grid-4">
                <FieldSelect
                  id="state-select"
                  label="राज्य (State)"
                  value={s.stateId}
                  options={s.states}
                  onChange={(id) => dispatch({ type: "PICK_STATE", id })}
                />
                <FieldSelect
                  id="district-select"
                  label="जनपद (District)"
                  value={s.districtId}
                  options={s.districts}
                  disabled={!s.stateId}
                  onChange={(id) => dispatch({ type: "PICK_DISTRICT", id })}
                />
                <FieldSelect
                  id="center-select"
                  label="उप-केंद्र (Center)"
                  value={s.centerId}
                  options={s.centers}
                  disabled={!s.districtId}
                  onChange={(id) => dispatch({ type: "PICK_CENTER", id })}
                />
                <FieldSelect
                  id="village-select"
                  label="ग्राम (Village)"
                  value={s.villageId}
                  options={s.villages}
                  disabled={!s.centerId}
                  highlight
                  onChange={(id) => dispatch({ type: "SET", payload: { villageId: id } })}
                />
              </div>

              <div className="e-action-row">
                {s.error && (
                  <p className="e-error" role="alert" aria-live="assertive">
                    <AlertTriangle size={14} aria-hidden="true" /> {s.error}
                  </p>
                )}
                <button
                  className="e-btn-primary"
                  onClick={handleCheck}
                  disabled={s.loading || !s.villageId}
                  aria-label="Check electricity status"
                >
                  {s.loading
                    ? <><RefreshCw size={16} className="e-spin" aria-hidden="true" /> Checking…</>
                    : <><Zap size={16} aria-hidden="true" /> Fetch Status</>
                  }
                </button>
              </div>
            </div>

            {/* Result panel */}
            <div className="e-card e-result-panel" aria-live="polite" aria-atomic="true">
              {s.result ? (
                <StatusResult data={s.result} />
              ) : (
                <EmptyState />
              )}
            </div>

          </section>
        </div>
      </div>

      <style>{CSS}</style>
    </main>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function FieldSelect({ id, label, value, options = [], disabled, highlight, onChange }) {
  return (
    <div className="e-field">
      <label htmlFor={id} className="e-field-label">{label}</label>
      <select
        id={id}
        className={`e-select ${highlight ? "e-select--highlight" : ""}`}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
      >
        <option value="">Choose…</option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>{o.name}</option>
        ))}
      </select>
    </div>
  );
}

function StatusResult({ data }) {
  const statusCode = Number(
    Object.entries(data).find(([k]) => k.toLowerCase() === "status")?.[1]
  );
  const theme = STATUS_MAP[statusCode] ?? DEFAULT_STATUS;
  const { Icon } = theme;

  const entries = Object.entries(data).filter(
    ([k, v]) => k.toLowerCase() !== "status" && v != null && v !== ""
  );

  return (
    <div className="e-result">
      <div
        className="e-status-banner"
        style={{ background: theme.bg, borderColor: theme.border }}
        role="status"
        aria-label={`Electricity status: ${theme.text}`}
      >
        <span className="e-status-icon" style={{ color: theme.color }}>
          <Icon size={22} aria-hidden="true" />
        </span>
        <div>
          <p className="e-status-label" style={{ color: theme.border }}>{theme.label}</p>
          <p className="e-status-village">
            {data.villageName?.toUpperCase() ?? "VILLAGE"} — Grid Node Update
          </p>
        </div>
      </div>

      {entries.length > 0 && (
        <dl className="e-data-grid">
          {entries.map(([key, value]) => (
            <div key={key} className="e-data-item">
              <dt className="e-data-key">{toLabel(key)}</dt>
              <dd className="e-data-val">{value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="e-empty" aria-label="Awaiting location selection">
      <BarChart3 size={48} aria-hidden="true" />
      <p className="e-empty-title">Waiting for Input</p>
      <p className="e-empty-sub">
        Select your state, district, supply center, and village, then tap Fetch Status.
      </p>
    </div>
  );
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
  :root {
    --navy: #000080;
    --navy-dark: #00005a;
    --saffron: #ff9933;
    --success: #128807;
    --success-bg: #e6f3e6;
    --warn: #b45309;
    --warn-bg: #fef3c7;
    --danger: #c0392b;
    --danger-bg: #fdf2f2;
    --text: #1e293b;
    --text-muted: #64748b;
    --border: rgba(0,0,128,0.15);
    --bg: #f8fafc;
    --card-bg: #ffffff;
    --radius: 4px;
    --gap: 1.5rem;
  }

  /* Layout */
  .e-root { background: var(--bg); min-height: 100vh; font-family: system-ui, sans-serif; color: var(--text); }
  .e-container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
  @media (min-width: 768px) { .e-container { padding: 0 2rem; } }

  /* Hero */
  .e-hero {
    background: linear-gradient(180deg, #fef2e0 0%, #fff 100%);
    border-top: 3px solid var(--saffron);
    padding: 1.5rem 0;
  }
  .e-hero-inner {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }
  .e-hero-title { font-size: clamp(1.5rem, 4vw, 2.2rem); font-weight: 800; color: var(--navy); margin: 0.25rem 0; }
  .e-hero-sub { color: var(--text-muted); margin: 0; font-size: 0.9rem; }
  .e-saffron { color: var(--saffron); }
  .e-badge {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;
    background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 4px; padding: 3px 8px;
    color: var(--navy); margin-bottom: 0.5rem;
  }
  .e-hero-status {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 0.7rem; font-weight: 700; text-transform: uppercase;
    background: #fff; border: 1px solid var(--border); padding: 6px 12px;
    border-radius: 4px; color: var(--navy); white-space: nowrap;
  }

  /* Ticker */
  .e-ticker { background: var(--navy); padding: 6px 1rem; display: flex; align-items: center; gap: 8px; }
  .e-ticker-text { font-size: 0.78rem; color: rgba(255,255,255,0.85); flex: 1; }
  .e-saffron-icon { color: var(--saffron); flex-shrink: 0; }

  /* Layout */
  .e-body { padding: 1.5rem 0 3rem; }
  .e-layout { display: grid; gap: var(--gap); }
  @media (min-width: 992px) {
    .e-layout { grid-template-columns: 280px 1fr; align-items: start; }
  }

  /* Sidebar */
  .e-sidebar { display: flex; flex-direction: column; gap: 1rem; }
  @media (min-width: 992px) { .e-sidebar { position: sticky; top: 1rem; } }

  /* Cards */
  .e-card {
    background: var(--card-bg); border: 1px solid var(--border);
    border-radius: var(--radius); box-shadow: 0 1px 3px rgba(0,0,0,0.06); padding: 1.25rem;
  }
  .e-card--navy-top { border-top: 4px solid var(--navy); }
  .e-card-heading {
    display: flex; align-items: center; gap: 8px;
    font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;
    color: var(--navy); margin: 0 0 1rem; padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--border);
  }
  .e-icon-red { color: #dc2626; }
  .e-section-label {
    font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;
    color: var(--navy); margin: 0 0 0.75rem; padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--border);
  }

  /* Nav list */
  .e-nav-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 2px; }
  .e-nav-btn {
    display: flex; align-items: center; gap: 8px;
    width: 100%; background: none; border: none; text-align: left; cursor: pointer;
    font-size: 0.85rem; padding: 8px 4px; border-radius: 4px; color: var(--text-muted);
    transition: background 0.15s, color 0.15s;
  }
  .e-nav-btn:hover { background: #f1f5f9; color: var(--navy); }
  .e-nav-btn--active { color: var(--navy); font-weight: 700; }
  .e-nav-btn--active svg { color: var(--saffron); }

  /* Helpline card */
  .e-helpline {
    background: var(--navy); color: #fff;
    border-radius: var(--radius); padding: 1.25rem;
    text-align: center; border-left: 4px solid var(--saffron);
  }
  .e-helpline svg { color: var(--saffron); margin-bottom: 0.5rem; }
  .e-helpline-label { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin: 0.25rem 0; }
  .e-helpline-number {
    display: block; font-size: 2rem; font-weight: 800;
    color: #fff; text-decoration: none; line-height: 1;
  }
  .e-helpline-number:hover { color: var(--saffron); }
  .e-helpline-sub { font-size: 0.6rem; text-transform: uppercase; color: rgba(255,255,255,0.5); margin: 0.25rem 0 0; }

  /* Form grid */
  .e-grid-4 { display: grid; gap: 0.75rem; grid-template-columns: 1fr; }
  @media (min-width: 480px) { .e-grid-4 { grid-template-columns: 1fr 1fr; } }
  @media (min-width: 900px) { .e-grid-4 { grid-template-columns: repeat(4, 1fr); } }

  /* Field */
  .e-field { display: flex; flex-direction: column; gap: 4px; }
  .e-field-label { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; color: var(--navy); }
  .e-select {
    height: 40px; font-size: 0.85rem; padding: 0 10px;
    border: 1px solid var(--border); border-radius: 2px;
    background: #fff; color: var(--text); cursor: pointer;
    transition: border-color 0.15s, box-shadow 0.15s;
    appearance: auto;
  }
  .e-select:focus { outline: none; box-shadow: 0 0 0 2px rgba(0,0,128,0.2); border-color: var(--navy); }
  .e-select:disabled { background: #f8fafc; color: var(--text-muted); cursor: not-allowed; }
  .e-select--highlight { border-color: var(--saffron); border-width: 1.5px; }

  /* Action row */
  .e-action-row { display: flex; flex-wrap: wrap; align-items: center; gap: 0.75rem; margin-top: 1rem; }
  .e-error { display: flex; align-items: center; gap: 6px; color: #dc2626; font-size: 0.78rem; font-weight: 600; margin: 0; flex: 1 1 100%; }
  .e-btn-primary {
    display: inline-flex; align-items: center; gap: 6px;
    background: var(--navy); color: #fff; border: none; border-radius: 2px;
    font-size: 0.85rem; font-weight: 700; padding: 0 1.25rem; height: 40px;
    cursor: pointer; transition: background 0.15s, transform 0.1s;
    white-space: nowrap;
  }
  .e-btn-primary:hover:not(:disabled) { background: var(--navy-dark); }
  .e-btn-primary:active:not(:disabled) { transform: scale(0.98); }
  .e-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
  .e-btn-primary svg:first-child { color: var(--saffron); }
  .e-spin { animation: spin 1s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Result panel */
  .e-result-panel { min-height: 320px; }
  .e-result { animation: fadeIn 0.3s ease; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }

  /* Status banner */
  .e-status-banner {
    display: flex; align-items: flex-start; gap: 1rem;
    padding: 1rem 1.25rem; border-left: 4px solid; border-radius: 2px; margin-bottom: 1rem;
  }
  .e-status-icon { flex-shrink: 0; margin-top: 2px; }
  .e-status-label { font-size: 1.1rem; font-weight: 800; margin: 0 0 2px; }
  .e-status-village { font-size: 0.75rem; font-weight: 600; color: var(--text-muted); margin: 0; }

  /* Data grid */
  .e-data-grid { display: grid; gap: 6px; grid-template-columns: 1fr; margin: 0; }
  @media (min-width: 600px) { .e-data-grid { grid-template-columns: 1fr 1fr; } }
  .e-data-item {
    display: flex; justify-content: space-between; align-items: center;
    padding: 10px 12px; background: #f8fafc; border: 1px solid var(--border); border-radius: 2px;
  }
  .e-data-key { font-size: 0.68rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin: 0; }
  .e-data-val { font-size: 0.85rem; font-weight: 700; color: var(--navy); margin: 0; }

  /* Empty state */
  .e-empty {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 3rem 1rem; color: #94a3b8; text-align: center;
  }
  .e-empty-title { font-weight: 700; font-size: 0.9rem; text-transform: uppercase; margin: 0.75rem 0 0.25rem; color: #94a3b8; }
  .e-empty-sub { font-size: 0.8rem; max-width: 320px; margin: 0; color: #cbd5e1; line-height: 1.5; }

  /* Main area stacking */
  .e-main { display: flex; flex-direction: column; gap: 1rem; }
`;