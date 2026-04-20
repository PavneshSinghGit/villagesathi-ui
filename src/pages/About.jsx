import React from "react";
import { ShieldCheck, Target, Heart, Eye, Users, Award, TrendingUp, Landmark, CheckCircle } from "lucide-react";
import { Helmet } from "react-helmet-async"; // Corrected to use helmet-async
import "../styles/userStyles.css";

function About() {
  const stats = [
    { id: 1, label: "Communities Served", value: "500+", icon: <Landmark /> },
    { id: 2, label: "Empowered Citizens", value: "10k+", icon: <Users /> },
    { id: 3, label: "Issues Resolved", value: "25k+", icon: <Award /> },
    { id: 4, label: "Digital Literacy Rate", value: "95%", icon: <TrendingUp /> },
  ];

  return (
    <div className="about-wrapper">
      <Helmet>
        <title>Our Story | VillageSathi — Bridging the Rural-Digital Divide</title>
      </Helmet>

      {/* --- 1. HERO SECTION --- */}
      <section className="about-hero text-center py-5 position-relative overflow-hidden">
        <div className="container py-5">
          <div className="badge bg-white text-success px-3 py-2 rounded-pill mb-3 fw-bold shadow-sm">
            ESTABLISHED 2025
          </div>
          <h1 className="display-3 fw-bold text-white mb-3">
            Empowering Bharat, <br /> One Village at a Time
          </h1>
          <p className="lead text-white-50 mx-auto" style={{ maxWidth: '850px' }}>
            Empowered Villages, Digital Identity — VillageSathi is more than just a portal; 
            it is a movement dedicated to integrating rural India into the global digital ecosystem.
          </p>
        </div>
        <div className="hero-wave">
          <svg viewBox="0 0 1440 320">
            <path fill="#ffffff" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,165.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* --- 2. IMPACT STATS --- */}
      <div className="container mt-n5 position-relative z-index-2">
        <div className="row g-4 text-center">
          {stats.map((stat) => (
            <div className="col-6 col-md-3" key={stat.id}>
              <div className="stat-card p-4 rounded-4 shadow-sm bg-white border-0 transition-hover">
                <div className="stat-icon mb-2 text-success">{stat.icon}</div>
                <h2 className="fw-bold mb-0 text-dark">{stat.value}</h2>
                <p className="text-muted small mb-0 fw-semibold uppercase">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container my-5 pt-5">
        {/* --- 3. CORE IDENTITY --- */}
        <div className="row align-items-center mb-5 pb-5">
          <div className="col-lg-6 animate-left">
            <h6 className="text-success fw-bold text-uppercase tracking-wider">Our Identity</h6>
            <h2 className="fw-bold mb-4 display-6">Tech-Driven Solutions for <span className="text-success">Rural Progress</span></h2>
            <p className="fs-5 text-muted mb-4">
              VillageSathi is a digital revolution designed to dissolve the barriers 
              between rural citizens and modern technology. We turn information into empowerment.
            </p>
            <div className="mt-4">
              <div className="d-flex mb-3 align-items-center">
                <CheckCircle className="text-success me-3" size={20} />
                <p className="mb-0 fs-6"><strong>Direct Empowerment:</strong> Access government welfare without intermediaries.</p>
              </div>
              <div className="d-flex align-items-center">
                <CheckCircle className="text-success me-3" size={20} />
                <p className="mb-0 fs-6"><strong>Real-time Insights:</strong> Instant updates on electricity, weather, and market rates.</p>
              </div>
            </div>
          </div>
          <div className="col-lg-6 text-center mt-5 mt-lg-0">
            <div className="position-relative">
              <img 
                src="https://img.freepik.com/free-vector/digital-transformation-abstract-concept-vector-illustration_335657-2139.jpg" 
                alt="Digital Village Innovation" 
                className="img-fluid rounded-5 shadow-lg floating-img"
                style={{ maxWidth: '85%' }}
              />
            </div>
          </div>
        </div>

        {/* --- 4. VISION & MISSION --- */}
        <div className="row g-4 mt-4">
          <div className="col-md-6">
            <div className="card h-100 p-5 shadow-sm border-0 bg-success text-white rounded-4 overflow-hidden position-relative">
              <Target className="mission-bg-icon opacity-10" size={150} style={{position: 'absolute', right: '-20px', bottom: '-20px'}} />
              <div className="position-relative z-index-1">
                <Target className="mb-3" size={40} />
                <h3 className="fw-bold">Our Mission</h3>
                <p className="opacity-90 leading-relaxed">
                  To provide transparent, rapid, and efficient digital services to every doorstep. 
                  We aim to eradicate corruption and bureaucratic delays by putting power directly into 
                  the hands of the citizens through modern technology.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card h-100 p-5 shadow-sm border-0 bg-dark text-white rounded-4 overflow-hidden position-relative">
              <Eye className="mission-bg-icon opacity-10" size={150} style={{position: 'absolute', right: '-20px', bottom: '-20px'}} />
              <div className="position-relative z-index-1">
                <Eye className="mb-3" size={40} />
                <h3 className="fw-bold">Our Vision</h3>
                <p className="opacity-90 leading-relaxed">
                  We envision a Bharat where every rural household is digitally literate, 
                  economically independent, and no longer forced to migrate to cities for 
                  basic essential services.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* --- 5. CORE VALUES --- */}
        <div className="bg-light p-5 rounded-5 mt-5 border border-white text-center">
          <h2 className="fw-bold mb-2">Values That Define Us</h2>
          <p className="text-muted mb-5">The principles that guide our digital revolution.</p>
          <div className="row g-4">
            <ValueCard 
              icon={<ShieldCheck size={48} />} 
              title="Trust & Security" 
              desc="Your data and transactions are protected by industry-leading security standards."
              color="success"
            />
            <ValueCard 
              icon={<Heart size={48} />} 
              title="Citizen-Centric" 
              desc="Every feature we build is designed with the ease and comfort of villagers in mind."
              color="danger"
            />
            <ValueCard 
              icon={<Users size={48} />} 
              title="Inclusive Growth" 
              desc="Fostering unity by bridging the digital gap and connecting communities together."
              color="primary"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-component for cleaner code
const ValueCard = ({ icon, title, desc, color }) => (
  <div className="col-md-4">
    <div className="value-box p-4 bg-white rounded-4 h-100 shadow-sm border-bottom border-4" style={{borderColor: `var(--bs-${color})`}}>
      <div className={`text-${color} mb-3`}>{icon}</div>
      <h5 className="fw-bold">{title}</h5>
      <p className="small text-muted mb-0">{desc}</p>
    </div>
  </div>
);

export default About;