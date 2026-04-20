import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, User, ArrowRight, Tag, Search, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function Blog() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("https://localhost:7092/api/Blogs");
        // API response keys check karein (blogId, title etc small case mein hain)
        setPosts(res.data.data);
        setFilteredPosts(res.data.data);
      } catch (err) {
        console.error("Error fetching blogs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Search Logic
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = posts.filter(post =>
      post.title.toLowerCase().includes(query) ||
      post.shortDescription.toLowerCase().includes(query)
    );
    setFilteredPosts(filtered);
  };

  // Category Filter Logic
  const filterByCategory = (category) => {
    if (category === "All") {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(post => post.category === category);
      setFilteredPosts(filtered);
    }
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
      <div className="spinner-border text-success" role="status"></div>
      <span className="ms-2">Patrika load ho rahi hai...</span>
    </div>
  );

  return (
    <div className="blogs-page pb-5 bg-light">
      <Helmet>
        <title>VillageSathi Patrika | Gaon ki Taza Khabar</title>
      </Helmet>

      {/* --- HERO SECTION --- */}
      <section className="blog-hero py-5 text-white text-center mb-5" style={{ background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200") center/cover' }}>
        <div className="container py-4">
          <h1 className="display-4 fw-bold">VillageSathi Patrika 📰</h1>
          <p className="lead opacity-75 mx-auto" style={{ maxWidth: '700px' }}>
            Kheti-baari, sarkari yojana aur gaon ke vikas ki har khabar ab ek hi jagah.
          </p>
        </div>
      </section>

      <div className="container">
        <div className="row g-4">

          {/* --- MAIN BLOG LIST --- */}
          <div className="col-lg-8">
            <h3 className="fw-bold mb-4 d-flex align-items-center">
              <span className="bg-success p-1 rounded me-2" style={{ width: '10px', height: '30px', display: 'inline-block' }}></span>
              Taza Jankari
            </h3>

            <div className="row g-4">
              {filteredPosts.length > 0 ? filteredPosts.map((post) => (
                <div className="col-12" key={post.blogId}>
                  <div className="card blog-card border-0 shadow-sm overflow-hidden rounded-4 h-100 transition-hover">
                    <div className="row g-0">
                      <div className="col-md-4">
                        <img
                          src={post.imageUrl.startsWith("http") ? post.imageUrl : `https://localhost:7092${post.imageUrl}`}
                          className="img-fluid h-100 object-fit-cover"
                          alt={post.title}
                          style={{ minHeight: '200px' }}
                        />
                      </div>
                      <div className="col-md-8">
                        <div className="card-body p-4">
                          <div className="d-flex justify-content-between mb-2">
                            <span className="badge bg-success-subtle text-success rounded-pill px-3">
                              <Tag size={12} className="me-1" /> {post.category || "General"}
                            </span>
                            <small className="text-muted d-flex align-items-center">
                              <Calendar size={14} className="me-1" />
                              {new Date(post.createdDate).toLocaleDateString('hi-IN')}
                            </small>
                          </div>
                          <h4 className="fw-bold mb-2">{post.title}</h4>
                          <p className="text-muted small mb-4 line-clamp-2">{post.shortDescription}</p>

                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                              {/* Icon Container */}
                              <div
                                className="bg-success bg-opacity-10 d-flex align-items-center justify-content-center rounded-circle me-2"
                                style={{ width: '32px', height: '32px' }}
                              >
                                {/* FontAwesome Icon */}
                                <i className="fa fa-user text-success" style={{ fontSize: '14px' }}></i>
                              </div>

                              {/* Author Name */}
                              <span className="small fw-bold text-dark">
                                {post.authorName || "Admin"}
                              </span>
                            </div>
                            <Link to={`/BlogDetail/${post.slug}`} className="btn btn-link text-success p-0 fw-bold text-decoration-none">
                              Read More <ArrowRight size={16} className="ms-1" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-12 text-center py-5 bg-white rounded-4 shadow-sm">
                  <h5>Sorry no data found!</h5>
                  <button className="btn btn-success mt-2" onClick={() => filterByCategory("All")}>See All Articles</button>
                </div>
              )}
            </div>
          </div>

          {/* --- SIDEBAR --- */}
          <div className="col-lg-4">
            {/* Search Widget */}
            <div className="card border-0 shadow-sm p-4 rounded-4 mb-4">
              <h6 className="fw-bold mb-3">Search Article</h6>
              <div className="input-group bg-light rounded-pill px-3 py-1 align-items-center">
                <Search size={18} className="text-muted" />
                <div class="row">
                  <input type="text" className="form-control border-0 bg-transparent shadow-none"
                    placeholder="Search here..." value={searchQuery} onChange={handleSearch}
                  />
                </div>
              </div>
            </div>

            {/* Categories Widget */}
            <div className="card border-0 shadow-sm p-4 rounded-4 mb-4">
              <h6 className="fw-bold mb-3">Categories</h6>
              <ul className="list-unstyled mb-0">
                {["All", "Krishi", "Sarkari Yojana", "General"].map((cat, i) => (
                  <li key={i} className="mb-2">
                    <button
                      onClick={() => filterByCategory(cat)}
                      className="btn btn-link p-0 text-decoration-none text-muted d-flex justify-content-between w-100 hover-link"
                    >
                      <span>{cat}</span>
                      <span className="badge bg-light text-dark rounded-pill">
                        {cat === "All" ? posts.length : posts.filter(p => p.category === cat).length}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter Widget */}
            <div className="card border-0 shadow-sm p-4 rounded-4 bg-success text-white">
              <MessageCircle className="mb-3" size={32} />
              <h5 className="fw-bold">WhatsApp Par Judein</h5>
              <p className="small opacity-75">Sarkari yojana aur kheti ke naye updates turant pane ke liye hamara group join karein.</p>
              <a
                href="https://wa.me/yournumber"
                target="_blank"
                rel="noreferrer"
                className="btn btn-light w-100 fw-bold rounded-pill mt-2"
              >
                Group Join Karein
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Blog;