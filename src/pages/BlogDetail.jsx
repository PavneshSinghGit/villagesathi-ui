import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Calendar, User, ArrowLeft, Share2, Eye } from "lucide-react";
import { Helmet } from "react-helmet-async";
import DOMPurify from "dompurify";

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL; // Ye https://localhost:7092/api hai
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_URL; // Ye https://localhost:7092 hai

function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchPost = async () => {
      setLoading(true);
      try {
        // FIX: Yaha se '/api' hata diya hai kyunki VITE_API_URL me wo pehle se hai
        const res = await axios.get(`${API_BASE_URL}/Blogs/${slug}`);
        if (isMounted) {
          setPost(res.data.data);
          setError(false);
        }
      } catch (err) {
        console.error("Blog fetch error details:", err.response || err);
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPost();
    return () => { isMounted = false; };
  }, [slug]);

  const sanitizedContent = useMemo(() => {
    return post?.content ? DOMPurify.sanitize(post.content) : "";
  }, [post?.content]);

  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/1200x450?text=No+Image";
    if (path.startsWith('http')) return path;

    // Agar path '/Blogs/...' se start hota hai
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${IMAGE_BASE_URL}${normalizedPath}`;
  };

  if (loading) return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100">
      <div className="spinner-border text-success" role="status"></div>
      <p className="mt-3 fw-bold text-muted">Loading Article...</p>
    </div>
  );

  if (error || !post) return (
    <div className="container text-center py-5">
      <div className="card border-0 shadow-sm p-5 mt-5">
        <h3 className="text-danger">Article Not Found</h3>
        <p className="text-muted">Ham maafi chahte hain, ye article nahi mil saka.</p>
        <Link to="/blog" className="btn btn-success mt-3 px-4 rounded-pill">
          <ArrowLeft size={18} className="me-2" /> Back To Blog
        </Link>
      </div>
    </div>
  );

  return (
    <article className="blog-detail-page pb-5 bg-white">
      <Helmet>
        <title>{post.title} | VillageSathi</title>
        <meta name="description" content={post.shortDescription} />
      </Helmet>

      {/* --- IMAGE SECTION (FIXED) --- */}
      <header className="position-relative mb-5" style={{ height: '450px', overflow: 'hidden' }}>
        <img
          src={getImageUrl(post.imageUrl)}
          alt={post.title}
          className="w-100 h-100"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />
        <div
          className="position-absolute bottom-0 start-0 w-100 p-4 text-white"
          style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.85))', paddingTop: '120px' }}
        >
          <div className="container">
            <Link to="/blog" className="btn btn-sm btn-outline-light mb-3 rounded-pill px-3">
              <ArrowLeft size={16} className="me-1" /> Back to News
            </Link>
            <h1 className="display-4 fw-bold mb-0 text-white">{post.title}</h1>
          </div>
        </div>
      </header>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">

            {/* Meta Info */}
            <div className="d-flex flex-wrap align-items-center justify-content-between border-bottom pb-3 mb-4 text-muted gap-3">
              <div className="d-flex flex-wrap gap-4">
                <span className="d-flex align-items-center gap-2">
                  <User size={18} className="text-success" /> {post.authorName || "Admin"}
                </span>
                <span className="d-flex align-items-center gap-2">
                  <Calendar size={18} className="text-success" />
                  {new Date(post.createdDate).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                <span className="d-flex align-items-center gap-2">
                  <Eye size={18} className="text-success" /> {post.views} Views
                </span>
              </div>
              <button className="btn btn-outline-success btn-sm rounded-pill px-3" onClick={() => window.print()}>
                <Share2 size={16} className="me-2" /> Share
              </button>
            </div>

            {/* Short Description */}
            <blockquote
              className="lead fw-medium text-secondary mb-5 ps-4"
              style={{ borderLeft: '5px solid #198754', fontStyle: 'italic' }}
            >
              {post.shortDescription}
            </blockquote>

            {/* Main Content */}
            <div
              className="blog-main-content lh-lg fs-5"
              style={{
                textAlign: 'justify',
                color: '#2c3e50',
                whiteSpace: 'pre-wrap', 
                wordBreak: 'break-word',
                overflowWrap: 'anywhere' 
              }}
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />

            {/* Footer */}
            <footer className="mt-5 p-4 bg-light rounded-4 border-start border-success border-4 shadow-sm">
              <h5 className="fw-bold text-dark">Aapke kya vichaar hain?</h5>
              <p className="text-muted mb-0">Hame feedback dein ya WhatsApp group join karein.</p>
              <div className="d-flex gap-2 mt-3">
                <Link to="/contact" className="btn btn-success rounded-pill px-4">Contact Us</Link>
              </div>
            </footer>

          </div>
        </div>
      </div>
    </article>
  );
}

export default BlogDetail;