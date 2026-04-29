import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Calendar, User, ArrowRight, Tag, Search, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import "bootstrap/dist/css/bootstrap.min.css";

// Same as Admin, plus "All" for filtering
const CATEGORIES = ["All", "Agriculture", "Government Schemes", "Rural Development", "News", "General"];

function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL;
        const res = await axios.get(`${API_BASE_URL}/Blogs`);
        const allData = res.data.data || [];
        // Only display active posts to the public
        setPosts(allData.filter(p => p.isActive === true || p.IsActive === true));
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Unable to load articles at this moment.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const title = (post.title || post.Title || "").toLowerCase();
      const desc = (post.shortDescription || post.ShortDescription || "").toLowerCase();
      const category = post.category || post.Category || "General";

      const matchesSearch = title.includes(searchQuery.toLowerCase()) || desc.includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [posts, searchQuery, selectedCategory]);

  const getImageUrl = (url) => {
    if (!url) return "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=500";
    if (url.startsWith("http")) return url;
    return `${import.meta.env.VITE_IMAGE_URL}/${url.replace(/^\//, '')}`;
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
      <div className="spinner-grow text-success" role="status"></div>
      <span className="ms-3 fw-bold">Fetching Journal...</span>
    </div>
  );

  return (
    <div className="pb-5 bg-light min-vh-100">
      <Helmet>
        <title>VillageSathi | Rural Insights & News</title>
      </Helmet>

      {/* Hero Section */}
      <section className="py-5 text-white text-center mb-5"
        style={{
          background: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200") center/cover',
          borderRadius: '0 0 40px 40px'
        }}>
        <div className="container py-4">
          <h1 className="display-4 fw-bold text-white">VillageSathi Journal 📰</h1>
          <p className="lead mx-auto" style={{ maxWidth: '600px' }}>
            Latest updates on agriculture, rural development, and government schemes.
          </p>
        </div>
      </section>

      <div className="container">
        <div className="row g-4">
          {/* Main Content */}
          <div className="col-lg-8 order-2 order-lg-1">
            <div className="mb-4 d-flex justify-content-between align-items-center">
              <h3 className="fw-bold mb-0 border-start border-success border-5 ps-3">{selectedCategory} Articles</h3>
              <span className="text-muted fw-bold">{filteredPosts.length} Found</span>
            </div>

            <div className="row g-4">
              {filteredPosts.length > 0 ? filteredPosts.map((post) => (
                <div className="col-12" key={post.blogId || post.BlogId}>
                  <div className="card border-0 shadow-sm overflow-hidden rounded-4 h-100 transition-hover">
                    <div className="row g-0">
                      <div className="col-md-4">
                        <img
                          src={getImageUrl(post.imageUrl || post.ImageUrl)}
                          alt="Cover"
                          className="w-100 h-100"
                          style={{ objectFit: 'cover', minHeight: '220px' }}
                        />
                      </div>
                      <div className="col-md-8 p-4 d-flex flex-column">
                        <div className="mb-2 d-flex gap-2">
                          <span className="badge bg-success-subtle text-success rounded-pill px-3 py-2">
                            <Tag size={12} className="me-1" /> {post.category || post.Category || "General"}
                          </span>
                        </div>
                        <h4 className="fw-bold">{post.title || post.Title}</h4>
                        <p className="text-muted small line-clamp-2">{post.shortDescription || post.ShortDescription}</p>

                        <div className="mt-auto d-flex justify-content-between align-items-center">
                          <div className="small text-dark fw-bold">
                            <User size={14} className="text-success me-1" /> {post.authorName || post.AuthorName}
                          </div>
                          <Link to={`/BlogDetail/${post.slug || post.Slug}`} className="btn btn-success btn-sm rounded-pill px-4">
                            Read Article <ArrowRight size={14} className="ms-1" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-5">
                  <Search size={48} className="text-muted opacity-25 mb-3" />
                  <h4>No matches found</h4>
                  <p className="text-muted">Try clearing filters or changing your search term.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4 order-1 order-lg-2">
            <div className="card border-0 shadow-sm p-4 rounded-4 mb-4">
              <h6 className="fw-bold mb-3">Search Article</h6>

              {/* Border aur Padding yahan control ho rahi hai */}
              <div
                className="input-group align-items-center px-3"
                style={{
                  borderRadius: '50px',
                  border: '2px solid #dee2e6', // Proper border color aur thickness
                  backgroundColor: '#f8f9fa'    // Light background
                }}
              >
                <Search size={20} className="text-muted" />

                <input
                  type="text"
                  className="form-control border-1 bg-transparent py-3"
                  placeholder="Type to search..."
                  value={searchQuery}
                  style={{
                    fontSize: '1.1rem',
                    boxShadow: 'none', // Blue glow hatane ke liye
                    paddingLeft: '10px',
                    width: '320px'  
                  }}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="card border-0 shadow-sm p-4 rounded-4 sticky-top" style={{ top: '20px' }}>
              <h6 className="fw-bold mb-3">Filter by Category</h6>
              <div className="list-group list-group-flush">
                {CATEGORIES.map((cat, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedCategory(cat)}
                    className={`list-group-item list-group-item-action border-0 d-flex justify-content-between align-items-center rounded-3 mb-1 ${selectedCategory === cat ? 'bg-success text-white active' : 'text-muted'}`}
                  >
                    <span>{cat}</span>
                    <span className={`badge rounded-pill ${selectedCategory === cat ? 'bg-white text-success' : 'bg-light text-dark'}`}>
                      {cat === "All" ? posts.length : posts.filter(p => (p.category || p.Category) === cat).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .transition-hover { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .transition-hover:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
}

export default Blog;