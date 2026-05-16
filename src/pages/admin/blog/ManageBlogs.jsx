import React, { useEffect, useState, useCallback, useMemo } from "react";
import { blogApi } from "../../../api/blogApi";
import { 
  Edit, Trash2, Plus, Calendar, User, Eye, Search,  
  ChevronLeft, ChevronRight, X, FileText, CheckCircle, Clock, LayoutGrid, Loader2, Image as ImageIcon
} from "lucide-react";
import BlogForm from "./BlogForm";

const ManageBlogs = () => {
  const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_URL; 

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const stats = useMemo(() => {
    return {
      total: blogs.length,
      active: blogs.filter(b => b.isActive).length,
      draft: blogs.filter(b => !b.isActive).length
    };
  }, [blogs]);

  const handleShowModal = (blog = null) => {
    setSelectedBlog(blog);
    setShowModal(true);
  };

  const handleHideModal = () => {
    setShowModal(false);
    setSelectedBlog(null);
  };

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await blogApi.getAllBlogs();
      setBlogs(res.data.data || res.data || []);
    } catch (err) {
      console.error("Error fetching blogs:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) =>
      (blog.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (blog.category?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );
  }, [blogs, searchTerm]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBlogs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);

  const handleDelete = async (id) => {
    if (window.confirm("Bhai, pakka delete karna hai? This cannot be undone.")) {
      try {
        await blogApi.deleteBlog(id);
        fetchBlogs();
      } catch (err) {
        alert("Delete fail ho gaya!");
      }
    }
  };

  return (
    <div className="container-fluid py-4 px-md-5" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <style>{`
        .blog-hero {
          background: #0f172a;
          border-radius: 20px;
          padding: 25px 30px;
          border-bottom: 4px solid #ea580c;
          margin-bottom: 30px;
        }
        .stat-card-blog {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          transition: 0.3s;
        }
        .search-panel-blog {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 10px 15px;
          display: flex;
          align-items: center;
          transition: 0.3s;
        }
        .search-panel-blog:focus-within {
          border-color: #ea580c;
          box-shadow: 0 0 0 4px rgba(234, 88, 12, 0.05);
        }
        .search-panel-blog input {
          border: none;
          outline: none;
          width: 100%;
          padding-left: 10px;
          font-weight: 600;
          font-size: 0.9rem;
        }
        .table-premium-blog thead th {
          background: #f8fafc;
          font-size: 0.65rem;
          font-weight: 800;
          color: #64748b;
          letter-spacing: 1px;
          text-transform: uppercase;
          padding: 15px;
          border: none;
        }
        .blog-cover-mini {
          width: 70px;
          height: 45px;
          border-radius: 8px;
          object-fit: cover;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
        }
        .btn-add-blog {
          background: #ea580c;
          color: white;
          border: none;
          font-weight: 700;
          border-radius: 10px;
          padding: 10px 20px;
          transition: 0.3s;
        }
        .btn-add-blog:hover { background: #f59e0b; transform: translateY(-2px); }
        .text-xxs { font-size: 0.65rem; font-weight: 800; letter-spacing: 0.5px; }
      `}</style>

      {/* Header Section */}
      <div className="blog-hero shadow-lg">
        <div className="row align-items-center g-3">
          <div className="col-md-8">
            <div className="d-flex align-items-center gap-3">
              <div className="p-3 rounded-4" style={{background: 'rgba(234, 88, 12, 0.1)'}}>
                <LayoutGrid size={28} style={{color: '#ea580c'}} />
              </div>
              <div>
                <h3 className="text-white fw-bold mb-0">Blog Engine</h3>
                <p className="text-white-50 small mb-0 fw-bold">Manage system-wide articles and announcements</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 text-md-end">
            <button className="btn-add-blog shadow-sm d-inline-flex align-items-center gap-2" onClick={() => handleShowModal()}>
              <Plus size={18} /> CREATE POST
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="stat-card-blog p-3 shadow-sm d-flex align-items-center gap-3">
            <div className="p-2 rounded-3" style={{background: '#eff6ff', color: '#2563eb'}}><FileText size={20}/></div>
            <div><div className="text-xxs text-muted uppercase">Total Articles</div><h5 className="fw-bold mb-0 text-dark">{stats.total}</h5></div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-card-blog p-3 shadow-sm d-flex align-items-center gap-3">
            <div className="p-2 rounded-3" style={{background: '#f0fdf4', color: '#16a34a'}}><CheckCircle size={20}/></div>
            <div><div className="text-xxs text-muted uppercase">Published</div><h5 className="fw-bold mb-0 text-dark">{stats.active}</h5></div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-card-blog p-3 shadow-sm d-flex align-items-center gap-3">
            <div className="p-2 rounded-3" style={{background: '#fff7ed', color: '#ea580c'}}><Clock size={20}/></div>
            <div><div className="text-xxs text-muted uppercase">In Draft</div><h5 className="fw-bold mb-0 text-dark">{stats.draft}</h5></div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-panel-blog shadow-sm mb-4 border">
        <Search size={18} className="text-muted" />
        <input 
          type="text" 
          placeholder="Filter by title, author, or category..." 
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} 
        />
        {searchTerm && <X size={18} className="text-muted cursor-pointer" onClick={() => setSearchTerm("")} />}
      </div>

      {/* Data Table */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
        <div className="table-responsive">
          <table className="table table-premium-blog align-middle m-0">
            <thead>
              <tr>
                <th className="ps-4">COVER</th>
                <th>BLOG CONTENT</th>
                <th>CATEGORY</th>
                <th>METADATA</th>
                <th className="text-center">VISIBILITY</th>
                <th className="text-end pe-4">MANAGEMENT</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center py-5"><Loader2 className="animate-spin text-orange mx-auto" /></td></tr>
              ) : currentItems.length > 0 ? (
                currentItems.map((blog) => (
                  <tr key={blog.blogId || blog.id} className="border-bottom">
                    <td className="ps-4">
                      <img
                        src={`${IMAGE_BASE_URL}${blog.imageUrl}`}
                        alt=""
                        className="blog-cover-mini"
                        onError={(e) => {
                          e.target.src = "https://placehold.co/70x45/f1f5f9/64748b?text=No+Img";
                        }}
                      />
                    </td>
                    <td>
                      <div className="fw-bold text-dark text-truncate" style={{ maxWidth: '280px' }}>{blog.title}</div>
                      <div className="text-xxs text-muted d-flex align-items-center gap-1 mt-1">
                        <Eye size={10} style={{color: '#ea580c'}}/> {blog.views || 0} Total Impressions
                      </div>
                    </td>
                    <td><span className="badge bg-slate-100 text-dark border p-2" style={{fontSize: '0.65rem', background: '#f1f5f9'}}>{blog.category?.toUpperCase()}</span></td>
                    <td>
                      <div className="text-xxs text-dark fw-bold uppercase d-flex align-items-center gap-1"><User size={10}/> {blog.authorName || 'Staff Admin'}</div>
                      <div className="text-xxs text-muted d-flex align-items-center gap-1 mt-1"><Calendar size={10}/> {blog.createdDate ? new Date(blog.createdDate).toLocaleDateString('en-IN') : 'N/A'}</div>
                    </td>
                    <td className="text-center">
                      <span className={`badge px-3 py-1 rounded-pill ${blog.isActive ? 'bg-success-subtle text-success' : 'bg-slate-200 text-muted'}`} style={{fontSize: '0.65rem'}}>
                        {blog.isActive ? 'LIVE' : 'DRAFT'}
                      </span>
                    </td>
                    <td className="text-end pe-4">
                      <div className="d-flex justify-content-end gap-2">
                        <button className="btn btn-sm btn-light border" onClick={() => handleShowModal(blog)}><Edit size={16} className="text-primary"/></button>
                        <button className="btn btn-sm btn-light border" onClick={() => handleDelete(blog.blogId)}><Trash2 size={16} className="text-danger"/></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" className="text-center py-5 text-muted fw-bold">NO ARTICLES FOUND MATCHING YOUR CRITERIA</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-3 bg-light border-top d-flex justify-content-between align-items-center px-4">
            <small className="text-xxs text-muted uppercase">Displaying {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredBlogs.length)} of {filteredBlogs.length} posts</small>
            <div className="pagination pagination-sm mb-0 gap-1">
              <button className="btn btn-sm btn-white border shadow-sm" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}><ChevronLeft size={14}/></button>
              <span className="btn btn-sm btn-dark px-3 fw-bold" style={{background: '#0f172a'}}>{currentPage}</span>
              <button className="btn btn-sm btn-white border shadow-sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}><ChevronRight size={14}/></button>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <BlogForm blog={selectedBlog} onClose={handleHideModal} refresh={fetchBlogs} />
      )}
    </div>
  );
};

export default ManageBlogs;