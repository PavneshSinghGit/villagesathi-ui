import React, { useState, useMemo } from "react";
import { 
  Calculator, Leaf, Info, Map, Beaker, ChevronRight, 
  ShieldCheck, BookOpen, Droplets, Sprout, Scale, Zap, AlertCircle
} from "lucide-react"; 
import { Helmet } from "react-helmet-async";

const CROP_DATA = {
  wheat: { name: 'Wheat (गेहूं)', n: 50, p: 25 },
  rice: { name: 'Rice (धान)', n: 40, p: 20 },
  maize: { name: 'Maize (मक्का)', n: 60, p: 30 },
};

function AgriCalc() {
  const [area, setArea] = useState('');
  const [crop, setCrop] = useState('wheat');
  const [results, setResults] = useState(null);

  const structuredData = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "VillageSathi Agri-Calculator",
    "description": "Scientific fertilizer calculator for Indian farmers based on land area and crop type.",
    "applicationCategory": "AgricultureTool",
    "operatingSystem": "Web"
  }), []);

  const calculateFertilizer = (e) => {
    e.preventDefault();
    const { n, p } = CROP_DATA[crop];
    const landArea = parseFloat(area) || 0;
    if (landArea <= 0) return;

    const dapRequired = (p / 46) * 100 * landArea;
    const nFromDap = dapRequired * 0.18;
    const remainingN = (n * landArea) - nFromDap;
    const ureaRequired = (remainingN / 46) * 100;

    setResults({
      urea: ureaRequired.toFixed(1),
      dap: dapRequired.toFixed(1),
    });
  };

  return (
    <main className="animate-fade-in pb-5" style={{ backgroundColor: '#f8fafc', minHeight: '100vh', overflowX: 'hidden' }}>
      <Helmet>
        <title>Agri-Input Calculator | Official Farmer Tools | VillageSathi</title>
        <meta name="description" content="Calculate the exact quantity of Urea and DAP required for your crops scientifically. Official agricultural utility by VillageSathi." />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      {/* --- OFFICIAL GOVT HERO SECTION --- */}
      <header className="hero-govt-slim py-4 py-md-5 position-relative" style={{ borderTop: '3px solid #128807' }}>
        <div className="container px-4 px-md-5">
          <div className="row align-items-center g-4">
            <div className="col-lg-7 text-center text-lg-start">
               <div className="d-inline-flex align-items-center govt-badge px-3 py-1 mb-3">
                 <Scale size={14} className="text-navy me-2" />
                 <span className="small fw-bold text-uppercase">कृषि गणना यंत्र | Agriculture Input Calculator</span>
               </div>
               <h1 className="govt-title mb-2">
                 Agri-Input <span className="text-green">Calculator</span>
               </h1>
               <p className="govt-subtitle mb-0">Standard recommended doses calculation for urea and DAP based on crop requirements.</p>
            </div>
            <div className="col-lg-5 d-none d-lg-flex justify-content-end gap-2">
               <div className="d-inline-flex align-items-center bg-white border border-navy-soft p-2 px-3 shadow-sm rounded-1">
                  <Sprout size={16} className="text-green me-2" />
                  <span className="text-navy fw-bold small" style={{ fontSize: '0.7rem' }}>ECO-FRIENDLY PRECISION</span>
               </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- OFFICIAL STATUS BAR --- */}
      <section className="bg-navy py-2 shadow-sm text-white">
        <div className="container-fluid px-4 px-md-5 d-flex align-items-center gap-2">
          <Zap size={14} className="text-saffron" />
          <marquee className="small fw-medium opacity-90">
            Guideline: Apply DAP during sowing for better root development • Urea should be applied in split doses as per crop stage • Values are indicative for standard soil health.
          </marquee>
        </div>
      </section>

      <div className="container mt-4 px-3 px-md-5">
        <div className="row g-4">
          
          {/* LEFT SIDE: CALCULATOR FORM */}
          <div className="col-lg-8">
            <div className="bg-white border shadow-sm p-4 p-md-5 rounded-1 h-100">
              <div className="d-flex align-items-center gap-3 mb-4 border-bottom pb-3">
                <div className="icon-wrap-govt bg-govt-light"><Calculator size={24} className="text-navy" /></div>
                <div>
                  <h3 className="h5 fw-bold text-navy mb-0">Fertilizer Estimation (उर्वरक गणना)</h3>
                  <p className="text-muted x-small-text mb-0">Calculate accurate fertilizer needs for your land area.</p>
                </div>
              </div>

              <form onSubmit={calculateFertilizer} className="row g-4">
                <div className="col-md-6">
                  <label className="govt-label">Select Crop (फसल का चयन करें)</label>
                  <select className="form-select rounded-0 border-navy-soft shadow-none" value={crop} onChange={(e) => setCrop(e.target.value)} style={{ height: '45px' }}>
                    {Object.keys(CROP_DATA).map(k => (
                      <option key={k} value={k}>{CROP_DATA[k].name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="govt-label">Area in Acres (एकड़ में क्षेत्र)</label>
                  <input 
                    type="number" className="form-control rounded-0 border-navy-soft shadow-none"
                    value={area} onChange={(e) => setArea(e.target.value)} 
                    placeholder="उदा. 2.5" required style={{ height: '45px' }}
                  />
                </div>

                <div className="col-12">
                  <button type="submit" className="btn btn-navy w-100 rounded-0 py-2 fw-bold text-uppercase d-flex align-items-center justify-content-center gap-2">
                    गणना करें (Calculate Requirement) <ChevronRight size={18} />
                  </button>
                </div>
              </form>

              {/* RESULTS AREA */}
              <div className="mt-5 pt-4 border-top">
                {results ? (
                  <div className="animate-fade-in">
                    <div className="row g-3">
                      <ResultCard title="UREA (यूरिया)" value={results.urea} icon={<Beaker className="text-saffron" />} border="border-left-saffron" />
                      <ResultCard title="DAP (डीएपी)" value={results.dap} icon={<Beaker className="text-navy" />} border="border-left-navy" />
                    </div>
                    <div className="mt-4 p-3 bg-light border-start border-4 border-warning rounded-1">
                      <div className="d-flex gap-2">
                        <AlertCircle size={18} className="text-warning mt-1 flex-shrink-0" />
                        <p className="x-small-text text-muted mb-0 lh-base">
                          * ये आंकड़े सांकेतिक हैं। सटीक प्रबंधन के लिए मिट्टी परीक्षण (Soil Testing) की सलाह दी जाती है। 
                          अपनी नजदीकी कृषि सहकारी समिति या विलेजसाथी विशेषज्ञों से परामर्श लें।
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-5 bg-light-soft border-dashed rounded-1">
                    <Calculator size={40} className="text-navy opacity-10 mb-2" />
                    <p className="small text-muted fw-bold">परिणाम देखने के लिए ऊपर भूमि का विवरण दर्ज करें।</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR: QUICK GUIDE */}
          <aside className="col-lg-4">
            <div className="info-glass-card bg-navy text-white p-4 rounded-1 h-100 shadow-sm border-left-saffron">
              <h2 className="h6 fw-bold mb-4 border-bottom border-white border-opacity-10 pb-2 text-uppercase tracking-wider">Farmer's Quick Guide</h2>
              <div className="vstack gap-4">
                <AgriInfoItem icon={<Leaf />} title="Crop Selection" detail="Select crop as per current season." />
                <AgriInfoItem icon={<Map />} title="Land Area" detail="Enter land size in standard Acres." />
                <AgriInfoItem icon={<Droplets />} title="Soil Health" detail="Calculations assume standard soil fertility." />
                <AgriInfoItem icon={<BookOpen />} title="Fertilizer Usage" detail="DAP use is recommended during sowing." />
              </div>
              
              <div className="mt-5 p-3 bg-opacity-5 border border-white border-opacity-10 text-center">
                 <p className="x-small fw-bold text-saffron text-uppercase mb-2">Technical Support</p>
                 <h5 className="mb-0 fw-bold">+91 9305492516</h5>
                 <p className="x-small opacity-50 mb-0">Monday - Saturday (10AM - 6PM)</p>
              </div>
            </div>
          </aside>
        </div>

        {/* SEO CONTENT SECTION */}
        <div className="mt-5">
           <article className="bg-white p-4 border shadow-sm rounded-1">
              <h3 className="h6 fw-bold text-navy mb-3 d-flex align-items-center">
                <Info size={18} className="text-green me-2"/> 
                Why Scientific Fertilizer Calculation is Essential?
              </h3>
              <div className="row g-4">
                <div className="col-md-6">
                  <p className="x-small-text text-muted mb-0 lh-base">
                    Excessive use of urea leads to soil toxicity and environmental degradation. Our <strong>Agri-Calculator</strong> helps farmers maintain the Nitrogen-Phosphorus balance, ensuring optimal crop growth while reducing the overall production cost per acre.
                  </p>
                </div>
                <div className="col-md-6">
                  <p className="x-small-text text-muted mb-0 lh-base">
                    Aligned with the <strong>Digital India</strong> mission, VillageSathi provides data-driven tools to every Gram Panchayat. This tool empowers small-scale farmers to transition from traditional practices to precision agriculture.
                  </p>
                </div>
              </div>
           </article>
        </div>
      </div>

      <style>{`
        .text-saffron { color: #ff9933; }
        .text-green { color: #128807; }
        .text-navy { color: #000080; }
        .bg-navy { background-color: #000080; }
        .bg-govt-light { background-color: #f1f5f9; }
        .bg-light-soft { background-color: #fafbfc; }
        .border-navy-soft { border: 1px solid rgba(0,0,128,0.15) !important; }
        .border-left-saffron { border-left: 5px solid #ff9933 !important; }
        .border-left-navy { border-left: 5px solid #000080 !important; }
        
        .govt-title { font-weight: 800; font-size: 2.2rem; color: #000080; }
        .hero-govt-slim { background: #ffffff; background-image: linear-gradient(180deg, #e6f3e6 0%, #ffffff 100%); }
        .govt-badge { background-color: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 4px; color: #475569; }

        .govt-label { font-size: 0.7rem; font-weight: 800; color: #000080; text-transform: uppercase; margin-bottom: 5px; }
        .btn-navy { background: #000080; color: white; border: none; }
        .btn-navy:hover { background: #00004d; color: white; }

        .x-small { font-size: 0.65rem; }
        .x-small-text { font-size: 0.85rem; }
        .icon-wrap-govt { width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; border-radius: 8px; }

        @media (max-width: 768px) {
          .govt-title { font-size: 1.6rem !important; }
          .container { padding-left: 15px; padding-right: 15px; }
        }
      `}</style>
    </main>
  );
}

const AgriInfoItem = ({ icon, title, detail }) => (
  <div className="d-flex gap-3 align-items-start">
    <div className="p-2 rounded-1 bg-white bg-opacity-10 text-saffron">
      {React.cloneElement(icon, { size: 18 })}
    </div>
    <div>
      <h4 className="x-small fw-bold text-white-50 mb-1 text-uppercase">{title}</h4>
      <span className="text-white fw-medium small">{detail}</span>
    </div>
  </div>
);

const ResultCard = ({ title, value, icon, border }) => (
  <div className="col-md-6">
    <div className={`p-4 bg-white border shadow-sm rounded-1 ${border}`}>
      <div className="d-flex justify-content-between align-items-start mb-2">
        <span className="x-small fw-bold text-navy text-uppercase tracking-wider">{title}</span>
        {icon}
      </div>
      <div className="d-flex align-items-baseline gap-2">
        <h2 className="fw-bold mb-0 text-navy" style={{ fontSize: '2rem' }}>{value}</h2>
        <span className="fw-bold text-muted small">KILOGRAM (किग्रा)</span>
      </div>
    </div>
  </div>
);

export default AgriCalc;