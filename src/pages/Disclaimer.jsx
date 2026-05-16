import React from "react";
import { Helmet } from "react-helmet-async";
import { AlertTriangle, Info, ShieldAlert, CheckCircle, ExternalLink, Scale } from "lucide-react";

const Disclaimer = () => {
  const lastUpdated = "May 2026";

  return (
    <div className="disclaimer-wrapper" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Helmet>
        <title>Legal Disclaimer | VillageSathi Platforms Pvt. Ltd.</title>
        <meta name="description" content="Official legal disclaimer for VillageSathi. We are an independent private digital platform and not affiliated with any government department." />
        <meta name="robots" content="index, follow" />
      </Helmet>

      {/* --- OFFICIAL GOVT STYLE SLIM HERO --- */}
      <header className="disclaimer-hero-govt py-5 text-center position-relative">
        <div className="container px-4">
          <div className="d-inline-flex align-items-center govt-badge px-3 py-1 mb-3">
            <Scale size={14} className="text-navy me-2" />
            <span className="small fw-bold">अस्वीकरण | Legal Disclaimer</span>
          </div>
          <h1 className="govt-title mb-2">
            Legal <span className="text-saffron">Disclaimer</span>
          </h1>
          <p className="govt-subtitle mx-auto mb-0" style={{ maxWidth: '700px' }}>
            This page clarifies the independent nature of <strong>VillageSathi Platforms</strong> 
            and our commitment to providing information transparency to rural citizens.
          </p>
        </div>
      </header>

      {/* --- OFFICIAL STATUS BAR --- */}
      <section className="bg-navy py-2 text-white shadow-sm">
        <div className="container px-4 d-flex align-items-center gap-2">
          <AlertTriangle size={16} className="text-saffron" />
          <span className="small fw-medium opacity-90">Please read carefully before using any portal services. Effective Date: {lastUpdated}</span>
        </div>
      </section>

      {/* --- MAIN LEGAL CONTENT --- */}
      <main className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-9">
            <article className="bg-white border shadow-sm p-4 p-md-5 rounded-1">
              
              <section className="mb-5">
                <h2 className="govt-section-heading h5 fw-bold mb-3 d-flex align-items-center">
                  <ShieldAlert className="text-saffron me-3" size={20} /> 1. No Government Affiliation
                </h2>
                <div className="p-3 bg-govt-light border-start border-4 border-navy mb-3">
                   <p className="text-dark small fw-bold mb-0">Independent Private Entity Declaration:</p>
                </div>
                <p className="text-muted lh-base">
                  <strong>VillageSathi</strong> (villagesathi.in) is owned and operated by <strong>VillageSathi Platforms Pvt. Ltd.</strong>, a registered private startup. We are <strong>NOT</strong> affiliated, associated, authorized, endorsed by, or in any way officially connected with any government department, agency, or ministry. We do not claim to be a government body.
                </p>
              </section>

              <section className="mb-5">
                <h2 className="govt-section-heading h5 fw-bold mb-3 d-flex align-items-center">
                  <Info className="text-navy me-3" size={20} /> 2. Information for Awareness Only
                </h2>
                <p className="text-muted lh-base">
                  All information regarding <strong>Government Schemes (Sarkari Yojana)</strong> and <strong>Electricity Grid Status</strong> provided on this platform is for general informational and awareness purposes only. While we source data from official portals (e.g., pmkisan.gov.in) to assist rural citizens, we do not guarantee the absolute completeness, reliability, or accuracy of this data.
                </p>
              </section>

              <section className="mb-5">
                <h2 className="govt-section-heading h5 fw-bold mb-3 d-flex align-items-center">
                  <ExternalLink className="text-navy me-3" size={20} /> 3. External & Official Links
                </h2>
                <p className="text-muted lh-base">
                  Our portal contains links to official government websites for the convenience of our users. VillageSathi has no control over the content, updates, or availability of those external sites. Navigating to these links is at the user's own discretion and risk.
                </p>
              </section>

              <section className="mb-5">
                <h2 className="govt-section-heading h5 fw-bold mb-3 d-flex align-items-center">
                  <CheckCircle className="text-green me-3" size={20} /> 4. Professional Consultation
                </h2>
                <p className="text-muted lh-base">
                  The agricultural, technical, and financial information provided here should not be considered professional or legal advice. Users are strongly advised to consult with authorized government officials or relevant subject experts before taking action based on the information provided on this platform.
                </p>
              </section>

              {/* CONSENT & CONTACT BOX */}
              <div className="mt-5 p-4 bg-navy text-white text-center rounded-1">
                <h3 className="h6 fw-bold mb-2">User Consent</h3>
                <p className="small opacity-80 mb-3">
                  By using this website, you hereby acknowledge our disclaimer and agree to its terms.
                </p>
                <p className="small mb-0">
                  Legal Inquiries: <strong className="text-saffron">villagesathi.info@gmail.com</strong>
                </p>
              </div>

            </article>
          </div>
        </div>
      </main>

      <style>{`
        /* Official Color Palette */
        .text-saffron { color: #ff9933; }
        .text-green { color: #128807; }
        .text-navy { color: #000080; }
        .bg-navy { background-color: #000080; }
        .bg-govt-light { background-color: #f1f5f9; }

        /* Hero Styling */
        .disclaimer-hero-govt {
          background-color: #ffffff;
          background-image: linear-gradient(180deg, #fef2e0 0%, #ffffff 100%);
          border-top: 3px solid #ff9933;
        }
        .govt-badge { background-color: #f1f5f9; border: 1px solid #cbd5e1; color: #475569; border-radius: 4px; }
        .govt-title { font-weight: 800; font-size: 2.2rem; color: #000080; }
        .govt-subtitle { color: #475569; font-size: 0.95rem; line-height: 1.6; }

        /* Content Styling */
        .govt-section-heading {
          border-bottom: 1px solid #eee;
          padding-bottom: 10px;
          color: #000080;
        }
        .lh-base { line-height: 1.7; }

        @media (max-width: 768px) {
          .govt-title { font-size: 1.7rem !important; }
          .p-md-5 { padding: 1.5rem !important; }
        }
      `}</style>
    </div>
  );
};

export default Disclaimer;