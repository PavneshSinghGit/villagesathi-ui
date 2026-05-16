import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  CloudSun, Droplets, Wind, Thermometer, Sun, CloudRain, MapPin, 
  Sunrise, Sunset, Search, Sprout, Globe, Info, Zap, Clock, Navigation, Scale
} from "lucide-react";

function Weather() {
  const [city, setCity] = useState("Lucknow");

  const currentWeatherData = {
    temp: "32°C",
    condition: "Partly Cloudy",
    humidity: "65%",
    windSpeed: "12 km/h",
    feelsLike: "35°C",
    sunrise: "5:30 AM",
    sunset: "6:45 PM"
  };

  const forecast = [
    { day: "कल (Tomorrow)", temp: "31°C", icon: <CloudRain size={18} className="text-info" /> },
    { day: "बुधवार (Wed)", temp: "33°C", icon: <Sun size={18} className="text-warning" /> },
    { day: "गुरुवार (Thu)", temp: "30°C", icon: <CloudSun size={18} className="text-navy" /> },
    { day: "शुक्रवार (Fri)", temp: "29°C", icon: <CloudRain size={18} className="text-info" /> },
  ];

  return (
    <main className="animate-fade-in pb-5" style={{ backgroundColor: '#f8fafc', minHeight: '100vh', overflow: 'hidden' }}>
      <Helmet>
        <title>Official Weather Hub | Agri-Climate Alerts | VillageSathi Portal</title>
        <meta name="description" content="Official hyper-local weather alerts for Uttar Pradesh. Real-time temperature, humidity, and agriculture-specific climate advisory." />
      </Helmet>

      {/* --- OFFICIAL GOVT HERO SECTION --- */}
      <header className="hero-govt-slim py-4 py-md-5 position-relative" style={{ borderTop: '3px solid #000080' }}>
        <div className="container-fluid px-md-5">
          <div className="row align-items-center g-4">
            <div className="col-lg-7 text-center text-lg-start">
               <div className="d-inline-flex align-items-center govt-badge px-3 py-1 mb-3">
                 <Scale size={14} className="text-navy me-2" />
                 <span className="small fw-bold text-uppercase">मौसम विज्ञान केंद्र | Climate Monitoring Cell</span>
               </div>
               <h1 className="govt-title mb-2">
                 Agri-Climate <span className="text-navy">Dashboard</span>
               </h1>
               <p className="govt-subtitle mb-0">IMD Sync Data • Hyper-local Rural Weather Monitoring for Gram Panchayats.</p>
            </div>
            <div className="col-lg-5 text-lg-end">
               <div className="d-inline-flex align-items-center bg-white border border-navy-soft p-2 px-3 shadow-sm">
                  <Clock size={16} className="text-navy me-2 animate-pulse" />
                  <span className="text-navy fw-bold small" style={{ fontSize: '0.7rem' }}>UPDATED: 05 MAY 2026, 11:15 AM</span>
               </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- ANNOUNCEMENT BAR --- */}
      <section className="bg-navy py-2 shadow-sm text-white">
        <div className="container-fluid px-4 px-md-5 d-flex align-items-center gap-2">
          <Zap size={14} className="text-saffron" />
          <marquee className="small fw-medium opacity-90">
            Weather Alert: High humidity predicted for next 48 hours in Central UP • Farmers advised to complete sowing before expected rainfall on Friday • Heatwave warning active for afternoon hours.
          </marquee>
        </div>
      </section>

      <div className="container-fluid px-md-5 mt-4">
        <div className="row g-4">
          
          {/* --- LEFT SIDEBAR: SEARCH & ADVISORY --- */}
          <aside className="col-lg-3">
            <div className="vstack gap-3 sticky-sidebar">
              {/* Search Card */}
              <div className="bg-white border shadow-sm p-4 rounded-1 border-top-navy">
                <h6 className="fw-bold mb-3 small text-navy text-uppercase">Change Location</h6>
                <div className="input-group bg-light border p-1 rounded-0">
                  <span className="input-group-text bg-transparent border-0"><Search size={16} className="text-navy" /></span>
                  <input 
                    type="text" className="form-control border-0 bg-transparent shadow-none small fw-bold" 
                    placeholder="गांव/शहर का नाम" 
                    value={city} onChange={(e) => setCity(e.target.value)}
                  />
                </div>
              </div>

              {/* Advisory Card */}
              <div className="p-4 text-white rounded-1 border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #000080, #00004d)' }}>
                 <div className="position-relative z-1">
                    <Sprout size={30} className="mb-3 text-saffron" />
                    <h6 className="fw-bold small mb-2">Kisan Salah (कृषि सलाह)</h6>
                    <p className="mb-0 opacity-90 x-small-text lh-base">
                      Next 48 hours show 65% humidity. Ideal for fertilizer application in Kharif crops. Avoid unseasonal irrigation to prevent root damage.
                    </p>
                 </div>
                 <Globe size={100} className="position-absolute opacity-10" style={{ bottom: '-20px', right: '-20px' }} />
              </div>
            </div>
          </aside>

          {/* --- MAIN WEATHER INTERFACE --- */}
          <div className="col-lg-9">
            <div className="row g-3">
              
              {/* Main Temp Row */}
              <div className="col-lg-8">
                <div className="bg-white border border-left-navy shadow-sm p-4 h-100 rounded-1">
                  <div className="d-flex justify-content-between align-items-start">
                     <div>
                        <p className="x-small text-muted mb-1 fw-bold d-flex align-items-center gap-1">
                          <MapPin size={12} className="text-danger"/> {city.toUpperCase()}, BHARAT
                        </p>
                        <h2 className="display-4 fw-bold text-navy mb-0">{currentWeatherData.temp}</h2>
                        <p className="h6 text-muted fw-bold">{currentWeatherData.condition} / थोड़ा बादल</p>
                     </div>
                     <Sun size={80} className="text-warning pulse-soft d-none d-sm-block" />
                  </div>
                  
                  <div className="row g-2 mt-4 text-center">
                    <div className="col-4"><MiniStat icon={<Droplets size={16} />} label="HUMIDITY" val={currentWeatherData.humidity} color="text-info" /></div>
                    <div className="col-4"><MiniStat icon={<Wind size={16} />} label="WIND" val={currentWeatherData.windSpeed} color="text-secondary" /></div>
                    <div className="col-4"><MiniStat icon={<Thermometer size={16} />} label="FEELS LIKE" val={currentWeatherData.feelsLike} color="text-danger" /></div>
                  </div>
                </div>
              </div>

              {/* Sunrise/Sunset Card */}
              <div className="col-lg-4">
                <div className="bg-white border border-top-saffron shadow-sm p-4 h-100 rounded-1 d-flex flex-column justify-content-center">
                  <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
                     <Sunrise size={28} className="text-saffron" />
                     <div>
                        <p className="x-small text-muted mb-0 fw-bold">SUNRISE (सूर्योदय)</p>
                        <h6 className="fw-bold mb-0 text-navy">{currentWeatherData.sunrise}</h6>
                     </div>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                     <Sunset size={28} className="text-danger" />
                     <div>
                        <p className="x-small text-muted mb-0 fw-bold">SUNSET (सूर्यास्त)</p>
                        <h6 className="fw-bold mb-0 text-navy">{currentWeatherData.sunset}</h6>
                     </div>
                  </div>
                </div>
              </div>

              {/* Forecast Row */}
              <div className="col-12">
                <div className="bg-white border shadow-sm p-4 rounded-1">
                  <h6 className="fw-bold mb-4 small text-navy text-uppercase border-bottom pb-2 d-flex align-items-center gap-2">
                    <Navigation size={16} className="text-navy"/> Seasonal Forecast (मौसम का पूर्वानुमान)
                  </h6>
                  <div className="row g-2">
                    {forecast.map((f, i) => (
                      <div className="col-6 col-md-3" key={i}>
                        <div className="p-3 bg-light border text-center transition-hover">
                          <p className="x-small text-muted mb-2 fw-bold">{f.day}</p>
                          <div className="my-2">{f.icon}</div>
                          <h6 className="fw-bold text-navy mb-0">{f.temp}</h6>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Technical/SEO Content */}
              <div className="col-12 mt-2">
                <article className="bg-navy text-white p-4 rounded-1 shadow-sm border-left-saffron">
                  <h3 className="h6 fw-bold mb-3 d-flex align-items-center gap-2">
                    <Info size={18} className="text-saffron"/> Scientific Weather Compliance
                  </h3>
                  <div className="row g-4">
                    <div className="col-md-6">
                      <p className="x-small-text opacity-80 mb-0 lh-base">
                        Our Climate Hub utilizes official <strong>IMD Satellite Data</strong> and regional IoT sensors to provide accurate alerts for <strong>Uttar Pradesh</strong>. Monitoring wind patterns is crucial for rural energy management and irrigation planning.
                      </p>
                    </div>
                    <div className="col-md-6">
                      <p className="x-small-text opacity-80 mb-0 lh-base">
                        By integrating digital literacy with climate science, VillageSathi aims to minimize crop loss by 20% for every registered Gram Panchayat through timely unseasonal rain warnings.
                      </p>
                    </div>
                  </div>
                </article>
              </div>

            </div>
          </div>
        </div>
      </div>

      <style>{`
        .text-saffron { color: #ff9933; }
        .text-navy { color: #000080; }
        .bg-navy { background-color: #000080; }
        .bg-govt-light { background-color: #f1f5f9; }
        .border-navy-soft { border: 1px solid rgba(0,0,128,0.1) !important; }
        .border-top-navy { border-top: 5px solid #000080 !important; }
        .border-left-navy { border-left: 5px solid #000080 !important; }
        .border-top-saffron { border-top: 5px solid #ff9933 !important; }
        .border-left-saffron { border-left: 5px solid #ff9933 !important; }

        .hero-govt-slim {
          background-color: #ffffff;
          background-image: linear-gradient(180deg, #e0f2fe 0%, #ffffff 100%);
        }
        .govt-badge { background-color: #f1f5f9; border: 1px solid #cbd5e1; color: #475569; border-radius: 4px; }
        .govt-title { font-weight: 800; font-size: 2.2rem; color: #000080; }
        .govt-subtitle { color: #475569; font-size: 1rem; }

        .x-small { font-size: 0.65rem; }
        .x-small-text { font-size: 0.85rem; }
        .pulse-soft { animation: pulse 3s infinite; }
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
        
        .transition-hover:hover { border-color: #000080; background: white !important; transform: scale(1.02); transition: 0.2s; }

        @media (max-width: 768px) {
          .govt-title { font-size: 1.6rem !important; }
          .sticky-sidebar { position: relative; top: 0; }
          .container-fluid { padding-left: 15px; padding-right: 15px; }
        }
      `}</style>
    </main>
  );
}

const MiniStat = ({ icon, label, val, color }) => (
  <div className="p-2 bg-light rounded-1 border">
    <div className={`mb-1 ${color}`}>{icon}</div>
    <p className="x-small text-muted mb-1 fw-bold" style={{ fontSize: '0.55rem' }}>{label}</p>
    <h6 className="fw-bold text-navy mb-0 small">{val}</h6>
  </div>
);

export default Weather;