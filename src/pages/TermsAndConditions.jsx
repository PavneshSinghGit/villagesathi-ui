import React from "react";
import { Helmet } from "react-helmet-async";
import { FileText, Gavel, Scale, AlertCircle, CheckCircle, Store, Info } from "lucide-react";

const TermsAndConditions = () => {
  const lastUpdated = "May 2026";

  return (
    <div className="terms-wrapper" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Helmet>
        <title>Terms & Conditions | VillageSathi Official Digital Portal</title>
        <meta name="description" content="Official terms and conditions for VillageSathi and SathiMarket. Read our legal guidelines for rural digital commerce and information access." />
        <meta name="robots" content="index, follow" />
      </Helmet>

      {/* --- OFFICIAL GOVT STYLE SLIM HERO --- */}
      <header className="terms-hero-govt py-5 text-center position-relative">
        <div className="container px-4">
          <div className="d-inline-flex align-items-center govt-badge px-3 py-1 mb-3">
            <Scale size={14} className="text-navy me-2" />
            <span className="small fw-bold">कानूनी दस्तावेज | Legal Document</span>
          </div>
          <h1 className="govt-title mb-2">
            Terms & <span className="text-saffron">Conditions</span>
          </h1>
          <p className="govt-subtitle mx-auto mb-0" style={{ maxWidth: '600px' }}>
            Please read these terms carefully before using our digital services. 
            By accessing this portal, you agree to comply with <strong>VillageSathi Platforms</strong> policies.
          </p>
        </div>
      </header>

      {/* --- OFFICIAL STATUS BAR --- */}
      <section className="bg-navy py-2 text-white shadow-sm">
        <div className="container px-4 d-flex align-items-center gap-2">
          <Info size={16} className="text-saffron" />
          <span className="small fw-medium opacity-90">Current Version: v2.4 • Effective from: {lastUpdated}</span>
        </div>
      </section>

      {/* --- MAIN LEGAL CONTENT --- */}
      <main className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-9">
            <article className="bg-white border shadow-sm p-4 p-md-5 rounded-1">
              
              <section className="mb-5">
                <h2 className="govt-section-heading h5 fw-bold mb-3 d-flex align-items-center">
                  <Gavel className="text-saffron me-3" size={20} /> 1. Acceptance of Terms & Usage
                </h2>
                <p className="text-muted lh-base">
                  By accessing <strong>villagesathi.in</strong> or its sub-domains, you agree to be legally bound by these Terms and Conditions. These terms constitute a legal agreement between you (The User) and <strong>VillageSathi Platforms Pvt. Ltd.</strong> regarding your use of our digital services and <strong>SathiMarket</strong> commerce tools.
                </p>
              </section>

              <section className="mb-5">
                <h2 className="govt-section-heading h5 fw-bold mb-3 d-flex align-items-center">
                  <Store className="text-navy me-3" size={20} /> 2. SathiMarket Guidelines
                </h2>
                <div className="p-3 bg-govt-light border-start border-4 border-navy mb-3">
                  <p className="text-dark small fw-bold mb-0">For Users & Sellers participating in Rural Commerce:</p>
                </div>
                <ul className="text-muted lh-base vstack gap-2">
                  <li><strong>Product Authenticity:</strong> Sellers are strictly required to list genuine village produce with accurate pricing and descriptions.</li>
                  <li><strong>Marketplace Role:</strong> VillageSathi acts as a digital bridge connecting rural sellers with buyers. While we provide mediation, we are not a direct party to individual trade disputes.</li>
                  <li><strong>Safety Standards:</strong> Any unauthorized, prohibited, or illegal substances are strictly banned from the marketplace.</li>
                </ul>
              </section>

              <section className="mb-5">
                <h2 className="govt-section-heading h5 fw-bold mb-3 d-flex align-items-center">
                  <CheckCircle className="text-green me-3" size={20} /> 3. Data & Information Accuracy
                </h2>
                <p className="text-muted lh-base">
                  VillageSathi strives to provide real-time data regarding <strong>Sarkari Yojana</strong> and <strong>IoT Power Tracking</strong>. However, this information is aggregated from official sensors and public records. Users are advised to cross-verify sensitive details with the respective <strong>Government Departments</strong> for final verification.
                </p>
              </section>

              <section className="mb-5">
                <h2 className="govt-section-heading h5 fw-bold mb-3 d-flex align-items-center">
                  <AlertCircle className="text-danger me-3" size={20} /> 4. Limitation of Liability
                </h2>
                <p className="text-muted lh-base">
                  <strong>VillageSathi Platforms</strong> shall not be held liable for any direct or indirect loss resulting from technical downtime, information delay, or marketplace interactions. Our services are provided on an "As-Is" and "As-Available" basis to support rural digital transformation.
                </p>
              </section>

              <section className="mb-5 border-top pt-4">
                <h2 className="h5 fw-bold text-navy mb-3 d-flex align-items-center">
                  <FileText className="text-navy me-3" size={20} /> 5. Intellectual Property Rights
                </h2>
                <p className="text-muted lh-base">
                  The software, code, branding, and proprietary algorithms used in VillageSathi are the exclusive property of the company. No part of this portal may be reproduced, copied, or exploited for commercial purposes without prior written consent.
                </p>
              </section>

              {/* LEGAL CONTACT BOX */}
              <div className="mt-5 p-4 bg-navy text-white text-center rounded-1">
                <h3 className="h6 fw-bold mb-2">Legal Helpdesk & Inquiries</h3>
                <p className="small opacity-80 mb-0">
                  For formal legal correspondence or dispute resolution, please contact: <br className="d-md-none" /> 
                  <strong className="text-saffron">villagesathi.info@gmail.com</strong>
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
        .terms-hero-govt {
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

export default TermsAndConditions;