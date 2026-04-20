import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Zap, BookOpen, Sprout, ShieldCheck, Activity,
  Users, ArrowRight, Smartphone, HeartPulse, PhoneCall, Map,
  GraduationCap
} from "lucide-react";
import BlogSkeleton from "../components/BlogSkeleton"; 
import "../styles/userStyles.css";

// Accessing environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL;
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_URL;

function Home() {
  const [latestBlogs, setLatestBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        // Using environment variable for the endpoint
        const res = await axios.get(`${API_BASE_URL}/Blogs`);
        if (res.data && res.data.data) {
          setLatestBlogs(res.data.data.slice(0, 3));
        }
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
      } finally {
        // Optional timeout to show off the skeleton effect
        setTimeout(() => setIsLoading(false), 800);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="home-wrapper animate-fade-in">
      <title>VillageSathi | Digital Empowerment for Rural India</title>

      {/* --- 1. HERO SECTION --- */}
      <header className="hero-section text-center position-relative">
        <div className="container py-5">
          <div className="gov-badge mb-4">
            <span className="badge-text text-uppercase tracking-wider">A Digital Initiative for Rural Empowerment</span>
          </div>
          <h1 className="display-4 fw-bold hero-title">
            VillageSathi: Bridging <span className="text-accent">Rural Bharat</span> <br />
            with the Digital Global Era
          </h1>
          <p className="lead hero-subtitle mx-auto mt-4 text-secondary" style={{ maxWidth: '800px' }}>
            VillageSathi is an official digital ecosystem facilitating seamless access to
            <strong> Government Schemes, Agricultural Innovation, and Digital Education</strong>.
          </p>
          <div className="mt-5 d-flex justify-content-center gap-3 flex-wrap">
            <Link to="/services" className="text-decoration-none">
              <button className="btn btn-gov-primary btn-lg px-5 py-3 shadow">
                Explore Services <ArrowRight className="ms-2" size={20} />
              </button>
            </Link>
            <button className="btn btn-gov-outline btn-lg px-5 py-3">
              Become a Volunteer
            </button>
          </div>
        </div>
      </header>

      {/* --- 2. ABOUT THE MISSION --- */}
      <section className="container py-5 my-5">
        <div className="row align-items-center g-5">
          <div className="col-lg-6 order-2 order-lg-1">
            <div className="ps-lg-4">
              <h6 className="text-success fw-bold text-uppercase ls-2 mb-2">Empowering Rural India</h6>
              <h2 className="display-5 fw-bold mb-4">
                Our Mission: <br />
                <span className="text-success">Digital Transformation of Villages</span>
              </h2>
              <p className="text-muted fs-5 leading-relaxed">
                VillageSathi bridges the gap between rural citizens and critical digital infrastructure.
                By solving the challenge of information asymmetry, we create a transparent
                environment where every villager has the power of data.
              </p>

              <div className="mission-list mt-5">
                <MissionPoint 
                  icon={<ShieldCheck size={28} />}
                  title="Verified Government Data"
                  desc="Access real-time updates on Housing, Pension, and Social Welfare schemes."
                />
                <MissionPoint 
                  icon={<Activity size={28} />}
                  title="Last-Mile Connectivity"
                  desc="Delivering accurate weather forecasts and live Mandi rates directly to you."
                />
              </div>
            </div>
          </div>

          <div className="col-lg-6 order-1 order-lg-2">
            <div className="mission-visual-wrapper position-relative">
              <div className="image-overlay-glow">
                <img
                  src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800"
                  alt="Village Progress"
                  className="img-fluid rounded-5 shadow-lg border-bottom border-5 border-success"
                />
              </div>
              <div className="floating-stat shadow-lg bg-white p-4 rounded-4 position-absolute d-flex align-items-center gap-3 border"
                style={{ bottom: '-20px', right: '10%', maxWidth: '250px' }}>
                <div className="stat-icon bg-success rounded-circle p-2 text-white">
                  <Activity size={24} />
                </div>
                <div>
                  <span className="d-block h3 fw-bold text-dark mb-0">100%</span>
                  <span className="small text-muted fw-bold text-uppercase" style={{ fontSize: '0.65rem' }}>
                    Digital Literacy Goal
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 3. LATEST UPDATES (SKELETON LOGIC) --- */}
      <section className="bg-light py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-5">
            <div>
              <h2 className="fw-bold mb-0">VillageSathi Patrika 📰</h2>
              <p className="text-muted mb-0">Latest news and agricultural guides</p>
            </div>
            <Link to="/blog" className="btn btn-outline-success rounded-pill">View All News</Link>
          </div>

          <div className="row g-4">
            {isLoading ? (
              [1, 2, 3].map((n) => <BlogSkeleton key={n} />)
            ) : (
              latestBlogs.map(blog => (
                <div className="col-md-4" key={blog.blogId}>
                  <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden blog-card">
                    <img 
                      src={`${IMAGE_BASE_URL}${blog.imageUrl}`} 
                      className="card-img-top" 
                      style={{ height: '200px', objectFit: 'fill' }} 
                      alt={blog.title} 
                    />
                    <div className="card-body">
                      <span className="badge bg-success bg-opacity-10 text-success mb-2">{blog.category}</span>
                      <h5 className="fw-bold line-clamp-2">{blog.title}</h5>
                      <p className="small text-muted">{blog.shortDescription?.substring(0, 100)}...</p>
                      <Link to={`/BlogDetail/${blog.slug}`} className="text-success fw-bold text-decoration-none small">
                        Read More →
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* --- 4. SERVICES GRID --- */}
      <section className="container py-5 mt-4">
        <div className="text-center mb-5">
          <h2 className="section-title fw-bold">Our Core Digital Services</h2>
          <p className="text-muted">Every essential facility for village development, now in your pocket.</p>
        </div>
        <div className="row g-4 text-center">
          <ServiceBox icon={<Zap />} title="Smart Utilities" text="Pay Electricity, Water, and Gas bills securely." color="blue" />
          <ServiceBox icon={<BookOpen />} title="Govt. Schemes" text="Check eligibility for PM Kisan and Awas Yojna." color="green" />
          <ServiceBox icon={<Sprout />} title="Agri Advisory" text="Connect with experts for soil testing and techniques." color="orange" />
          <ServiceBox icon={<GraduationCap />} title="Digital Literacy" text="Free computer and skill development courses." color="red" />
          <ServiceBox icon={<HeartPulse />} title="Health Services" text="Ayushman Bharat and online consultations." color="teal" />
          <ServiceBox icon={<Smartphone />} title="Job Junction" text="Local employment and self-employment info." color="navy" />
        </div>
      </section>

     {/* --- 5. STATISTICS (Modernized with Glass Effect) --- */}
<section className="stats-section py-5 position-relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
  {/* Decorative background circle */}
  <div className="position-absolute rounded-circle bg-success opacity-10" style={{ width: '300px', height: '300px', top: '-100px', left: '-100px' }}></div>
  
  <div className="container position-relative">
    <div className="row g-4 text-center">
      <StatItem icon={<Map size={24} />} num="500+" label="Connected Villages" />
      <StatItem icon={<Users size={24} />} num="1M+" label="Satisfied Citizens" />
      <StatItem icon={<Zap size={24} />} num="50+" label="Active Services" />
      <StatItem icon={<PhoneCall size={24} />} num="24/7" label="Technical Support" />
    </div>
  </div>
</section>

{/* --- 6. CALL TO ACTION (Improved Input & Layout) --- */}
<section className="container my-5 pt-4">
  <div className="cta-gradient-card p-4 p-md-5 rounded-5 shadow-lg border-0 text-white position-relative overflow-hidden">
    <div className="row align-items-center position-relative" style={{ zIndex: 2 }}>
      <div className="col-lg-7 text-center text-lg-start mb-4 mb-lg-0">
        <h2 className="display-6 fw-bold mb-3">Connect Your Village to the Future</h2>
        <p className="fs-5 opacity-90 mb-0">Join <span className="text-warning fw-bold">10,000+</span> Sarpanchs and volunteers receiving real-time scheme alerts.</p>
      </div>
      <div className="col-lg-5">
        <div className="bg-white p-2 rounded-pill shadow-sm d-flex align-items-center">
          <input 
            type="tel" 
            className="form-control border-0 bg-transparent px-4 py-2 flex-grow-1" 
            placeholder="Enter Mobile Number" 
            style={{ boxShadow: 'none' }}
          />
          <button className="btn btn-warning rounded-pill px-4 py-2 fw-bold text-uppercase d-flex align-items-center gap-2 transition-hover">
            Join <ArrowRight size={18} />
          </button>
        </div>
        <p className="small mt-3 text-center text-lg-start opacity-75">
          <ShieldCheck size={14} className="me-1" /> Your data is encrypted and secure.
        </p>
      </div>
    </div>
    {/* Background Pattern */}
    <div className="cta-pattern"></div>
  </div>
</section>

    </div>
  );
}

// --- Helper Sub-components ---

const MissionPoint = ({ icon, title, desc }) => (
  <div className="d-flex gap-4 mb-4">
    <div className="icon-box bg-success-subtle p-3 rounded-4 text-success">
      {icon}
    </div>
    <div>
      <h5 className="fw-bold mb-1">{title}</h5>
      <p className="text-muted small">{desc}</p>
    </div>
  </div>
);

const ServiceBox = ({ icon, title, text, color }) => (
  <div className="col-md-4">
    <div className="service-card h-100 p-4 border-0 shadow-sm transition-hover">
      <div className={`icon-circle mb-3 bg-${color} bg-opacity-10 text-${color} mx-auto d-flex align-items-center justify-content-center rounded-circle`} style={{ width: '60px', height: '60px' }}>
        {icon}
      </div>
      <h5 className="fw-bold">{title}</h5>
      <p className="text-muted small mb-0">{text}</p>
    </div>
  </div>
);

const StatItem = ({ icon, num, label }) => (
  <div className="col-md-3 col-6">
    <div className="p-3">
      <div className="text-warning mb-2 d-flex justify-content-center opacity-75">{icon}</div>
      <h2 className="display-5 fw-bold mb-1 text-white tabular-nums">{num}</h2>
      <p className="text-uppercase small fw-semibold text-white" style={{ color: '#ffff !important' }}>{label}</p>
    </div>
  </div>
);

export default Home;