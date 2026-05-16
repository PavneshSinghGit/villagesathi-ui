import React from "react";
import { Helmet } from "react-helmet-async";
import { ShieldCheck, Lock, Eye, FileText, UserCheck, Info, Globe } from "lucide-react";

const PrivacyPolicy = () => {
  const lastUpdated = "May 2026";

  return (
    <div className="privacy-wrapper" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Helmet>
        <title>Privacy Policy | VillageSathi Official Data Protection Portal</title>
        <meta name="description" content="Official privacy policy of VillageSathi. Learn how we safeguard your personal data while providing digital rural services and SathiMarket commerce." />
        <meta name="robots" content="index, follow" />
      </Helmet>

      {/* --- OFFICIAL GOVT STYLE SLIM HERO --- */}
      <header className="privacy-hero-govt py-5 text-center position-relative">
        <div className="container px-4">
          <div className="d-inline-flex align-items-center govt-badge px-3 py-1 mb-3">
            <Lock size={14} className="text-navy me-2" />
            <span className="small fw-bold">गोपनीयता नीति | Data Privacy & Security</span>
          </div>
          <h1 className="govt-title mb-2">
            Privacy <span className="text-saffron">Policy</span>
          </h1>
          <p className="govt-subtitle mx-auto mb-0" style={{ maxWidth: '700px' }}>
            At <strong>VillageSathi Platforms</strong>, we prioritize the security of your information. 
            This policy outlines our commitment to protecting the personal data of our rural citizens and partners.
          </p>
        </div>
      </header>

      {/* --- OFFICIAL STATUS BAR --- */}
      <section className="bg-navy py-2 text-white shadow-sm">
        <div className="container px-4 d-flex align-items-center gap-2">
          <Info size={16} className="text-saffron" />
          <span className="small fw-medium opacity-90">Compliance: Digital Personal Data Protection (DPDP) Guidelines • Updated: {lastUpdated}</span>
        </div>
      </section>

      {/* --- MAIN POLICY CONTENT --- */}
      <main className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-9">
            <article className="bg-white border shadow-sm p-4 p-md-5 rounded-1">
              
              <section className="mb-5">
                <h2 className="govt-section-heading h5 fw-bold mb-3 d-flex align-items-center">
                  <ShieldCheck className="text-saffron me-3" size={20} /> 1. Overview & Commitment
                </h2>
                <p className="text-muted lh-base">
                  Welcome to the official portal of <strong>VillageSathi</strong>. We are committed to maintaining the highest standards of data privacy. This policy explains our practices regarding the collection, use, and disclosure of information through our digital support tools and the <strong>SathiMarket</strong> ecosystem.
                </p>
              </section>

              <section className="mb-5">
                <h2 className="govt-section-heading h5 fw-bold mb-3 d-flex align-items-center">
                  <Eye className="text-navy me-3" size={20} /> 2. Information We Collect
                </h2>
                <p className="text-muted lh-base">To provide seamless rural digital services, we collect limited and necessary data:</p>
                <ul className="text-muted lh-base vstack gap-2 mt-3">
                  <li><strong>Identity Information:</strong> Name, contact number, and village address (primarily for SathiMarket logistics).</li>
                  <li><strong>Service Usage:</strong> Data on how you interact with our <strong>IoT Power Trackers</strong> and scheme information portals.</li>
                  <li><strong>Technical Indicators:</strong> IP addresses and device types to ensure secure access and improve our regional technical support.</li>
                </ul>
              </section>

              <section className="mb-5">
                <h2 className="govt-section-heading h5 fw-bold mb-3 d-flex align-items-center">
                  <UserCheck className="text-green me-3" size={20} /> 3. Utilization of Personal Data
                </h2>
                <div className="p-3 bg-govt-light border-start border-4 border-navy mb-3">
                  <p className="text-dark small fw-bold mb-0">Your information is used strictly for the following purposes:</p>
                </div>
                <ul className="text-muted lh-base vstack gap-2">
                  <li>Facilitating direct commerce between farmers and consumers on <strong>SathiMarket</strong>.</li>
                  <li>Sending real-time alerts for <strong>Sarkari Yojana</strong> and grid power status.</li>
                  <li>Enhancing local digital literacy through personalized content and newsletters.</li>
                  <li>Ensuring the security and integrity of our digital rural infrastructure.</li>
                </ul>
              </section>

              <section className="mb-5 border-top pt-4">
                <h2 className="h5 fw-bold text-navy mb-3 d-flex align-items-center">
                  <FileText className="text-navy me-3" size={20} /> 4. Data Security & Safeguards
                </h2>
                <p className="text-muted lh-base">
                  We implement robust encryption and server-side security measures to prevent unauthorized data access. <strong>VillageSathi Platforms Pvt. Ltd.</strong> follows strict internal protocols to ensure that rural citizen data is never shared with third-party advertisers without explicit consent.
                </p>
              </section>

              {/* CONTACT & GRIEVANCE BOX */}
              <div className="mt-5 p-4 bg-navy text-white text-center rounded-1">
                <Globe size={24} className="text-saffron mb-2" />
                <h3 className="h6 fw-bold mb-2">Privacy Grievance Office</h3>
                <p className="small opacity-80 mb-0">
                  For data-related queries or to request data deletion, contact: <br className="d-md-none" /> 
                  <strong className="text-saffron">contact@villagesathi.in</strong>
                </p>
              </div>

            </article>
          </div>
        </div>
      </main>

      <style>{`
        /* Official Govt Color Palette */
        .text-saffron { color: #ff9933; }
        .text-green { color: #128807; }
        .text-navy { color: #000080; }
        .bg-navy { background-color: #000080; }
        .bg-govt-light { background-color: #f1f5f9; }

        /* Hero Styling */
        .privacy-hero-govt {
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

export default PrivacyPolicy;