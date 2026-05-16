import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { 
  HelpCircle, ChevronDown, ChevronUp, Store, 
  ShieldCheck, Zap, MessageSquare, Info, Search 
} from "lucide-react";

const FAQ_DATA = [
  {
    category: "General Information",
    icon: <Info size={20} />,
    questions: [
      {
        q: "VillageSathi kya hai? (What is VillageSathi?)",
        a: "VillageSathi ek rural digital ecosystem hai jo gaon ke logo ko sarkari yojanaon (Sarkari Yojana), bijli ki sthiti (Power Status), aur bazaar (SathiMarket) se jodta hai."
      },
      {
        q: "Kya ye ek sarkari website hai? (Is this a Govt. site?)",
        a: "Nahi, VillageSathi ek private startup hai (DPIIT Recognized). Hum sirf sarkari data ko asaan bhasha mein rural citizens tak pahunchane ka kaam karte hain."
      }
    ]
  },
  {
    category: "SathiMarket Commerce",
    icon: <Store size={20} />,
    questions: [
      {
        q: "SathiMarket par samaan kaise bechein?",
        a: "Aap apne mobile number se register karke 'Seller' ban sakte hain aur apne gaon ke utpad (products) jaise handicrafts ya anaj seedhe grahako ko bech sakte hain."
      },
      {
        q: "Kya SathiMarket delivery handle karta hai?",
        a: "Haan, humare logistics partners rural areas se pickup aur delivery mein poori madad karte hain."
      }
    ]
  },
  {
    category: "Portal Services",
    icon: <Zap size={20} />,
    questions: [
      {
        q: "Bijli ki report kaise check karein?",
        a: "Hamare 'Power Tracker' section mein jaakar aap apne block ya gram panchayat ki live bijli (Electricity) ki sthiti dekh sakte hain."
      },
      {
        q: "PM-Kisan status kaise check karein?",
        a: "Aap 'Government Schemes' section mein jaakar apna registration number daalkar turant beneficiary status dekh sakte hain."
      }
    ]
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // SEO Schema for AdSense & Google Search
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQ_DATA.flatMap(cat => 
      cat.questions.map(item => ({
        "@type": "Question",
        "name": item.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.a
        }
      }))
    )
  };

  return (
    <div className="faq-wrapper" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Helmet>
        <title>FAQ | VillageSathi Support & Help Center Portal</title>
        <meta name="description" content="Official help center for VillageSathi. Frequently asked questions about Sarkari Yojana, SathiMarket, and Rural Digital Services." />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      {/* --- OFFICIAL GOVT STYLE SLIM HERO --- */}
      <header className="faq-hero-govt py-5 text-center position-relative">
        <div className="container px-4">
          <div className="d-inline-flex align-items-center govt-badge px-3 py-1 mb-3">
            <HelpCircle size={14} className="text-navy me-2" />
            <span className="small fw-bold">सहायता केंद्र | Help & Support Desk</span>
          </div>
          <h1 className="govt-title mb-2">
            Frequently Asked <span className="text-saffron">Questions</span>
          </h1>
          <p className="govt-subtitle mx-auto mb-0" style={{ maxWidth: '700px' }}>
            SathiMarket, Government Schemes, aur Digital Services se jude har sawal ka 
            <strong> official jawab</strong> yahan milega.
          </p>
        </div>
      </header>

      {/* --- OFFICIAL STATUS BAR --- */}
      <section className="bg-navy py-2 shadow-sm text-white">
        <div className="container px-4 d-flex align-items-center gap-2">
          <Search size={16} className="text-saffron" />
          <span className="small fw-medium opacity-90">Quick Search: Find answers to common queries instantly.</span>
        </div>
      </section>

      {/* --- FAQ CONTENT --- */}
      <main className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-8">
            
            {FAQ_DATA.map((cat, catIdx) => (
              <div key={catIdx} className="mb-5">
                <div className="d-flex align-items-center mb-4 border-bottom pb-2 border-navy-soft">
                  <div className="p-2 rounded-2 bg-govt-light text-navy me-3">
                    {cat.icon}
                  </div>
                  <h2 className="h5 fw-bold mb-0 text-navy text-uppercase tracking-wider">{cat.category}</h2>
                </div>

                <div className="vstack gap-3">
                  {cat.questions.map((item, qIdx) => {
                    const uniqueId = `${catIdx}-${qIdx}`;
                    const isOpen = openIndex === uniqueId;
                    return (
                      <div 
                        key={qIdx} 
                        className={`faq-card border shadow-sm transition-all ${isOpen ? 'border-saffron' : 'bg-white'}`}
                      >
                        <div 
                          className="faq-header p-4 d-flex justify-content-between align-items-center cursor-pointer"
                          onClick={() => toggleFAQ(uniqueId)}
                          style={{ cursor: 'pointer' }}
                        >
                          <h3 className="h6 fw-bold mb-0 text-dark pe-3">{item.q}</h3>
                          <div className={`icon-circle-small ${isOpen ? 'bg-saffron text-white' : 'bg-light'}`}>
                            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </div>
                        </div>
                        {isOpen && (
                          <div className="faq-body p-4 pt-0 border-top bg-light-soft">
                            <p className="text-muted mb-0 small-text lh-base pt-3">{item.a}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* CONTACT CALLOUT */}
            <div className="text-center mt-5 p-5 bg-navy text-white rounded-1 shadow-sm">
              <MessageSquare size={30} className="text-saffron mb-3" />
              <h4 className="h5 fw-bold mb-2">Sawal abhi bhi baki hai?</h4>
              <p className="small opacity-80 mb-4">Agar aapko apna jawab nahi mila, toh hamari support team se sampark karein.</p>
              <button 
                onClick={() => window.location.href='/contact'} 
                className="btn btn-govt-secondary rounded-0 px-5 py-2 fw-bold"
              >
                Contact Support Desk
              </button>
            </div>

          </div>
        </div>
      </main>

      <style>{`
        /* Official Palette */
        .text-saffron { color: #ff9933; }
        .text-navy { color: #000080; }
        .bg-navy { background-color: #000080; }
        .bg-saffron { background-color: #ff9933; }
        .bg-govt-light { background-color: #f1f5f9; }
        .bg-light-soft { background-color: #fafbfc; }
        .border-navy-soft { border-color: rgba(0,0,128,0.1) !important; }
        .border-saffron { border-color: #ff9933 !important; }

        /* Hero Styling */
        .faq-hero-govt {
          background-color: #ffffff;
          background-image: linear-gradient(180deg, #fef2e0 0%, #ffffff 100%);
          border-top: 3px solid #ff9933;
        }
        .govt-badge { background-color: #f1f5f9; border: 1px solid #cbd5e1; color: #475569; border-radius: 4px; }
        .govt-title { font-weight: 800; font-size: 2.2rem; color: #000080; }
        .govt-subtitle { color: #475569; font-size: 1rem; line-height: 1.6; }

        /* FAQ Card Styling */
        .faq-card {
          border-radius: 4px;
          transition: all 0.2s ease;
        }
        .icon-circle-small {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .small-text { font-size: 0.95rem; }
        .lh-base { line-height: 1.7; }

        .btn-govt-secondary {
          background-color: #ff9933;
          color: white;
          border: none;
        }
        .btn-govt-secondary:hover { background-color: #e68a00; color: white; }

        @media (max-width: 768px) {
          .govt-title { font-size: 1.7rem !important; }
          .p-5 { padding: 2rem !important; }
        }
      `}</style>
    </div>
  );
};

export default FAQ;