import React, { useEffect, useState, useCallback, useMemo } from "react";
import { blogApi } from "../../../api/blogApi";
import { 
  Edit, Trash2, Plus, Calendar, User, Eye, Search,  
  ChevronLeft, ChevronRight, X, FileText, CheckCircle, Clock 
} from "lucide-react"; // Added missing icons
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

  // --- Stats Calculation ---
  const stats = useMemo(() => {
    return {
      total: blogs.length,
      active: blogs.filter(b => b.isActive).length,
      draft: blogs.filter(b => !b.isActive).length
    };
  }, [blogs]);

  // --- Show/Hide Functions ---
  const handleShowModal = (blog = null) => {
    setSelectedBlog(blog);
    setShowModal(true);
  };

  const handleHideModal = () => {
    setShowModal(false);
    setSelectedBlog(null);
  };

  // --- Fetch Data ---
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

  // --- Filter Logic ---
  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) =>
      (blog.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (blog.category?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );
  }, [blogs, searchTerm]);

  // --- Pagination Logic ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBlogs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);

  const handleDelete = async (id) => {
    if (window.confirm("Bhai, pakka delete karna hai?")) {
      try {
        await blogApi.deleteBlog(id);
        fetchBlogs();
      } catch (err) {
        alert("Delete fail ho gaya!");
      }
    }
  };

  // --- Table Row Skeleton ---
  const TableSkeleton = () => (
    <>
      {[1, 2, 3, 4, 5].map((idx) => (
        <tr key={idx} className="placeholder-glow">
          <td className="ps-4">
            <div className="placeholder rounded-3" style={{ width: '80px', height: '55px', display: 'block' }}></div>
          </td>
          <td>
            <div className="placeholder col-8 mb-1"></div>
            <div className="placeholder col-4 small"></div>
          </td>
          <td><div className="placeholder col-6"></div></td>
          <td><div className="placeholder col-7"></div></td>
          <td className="text-center"><div className="placeholder col-4"></div></td>
          <td className="text-end pe-4"><div className="placeholder col-6"></div></td>
        </tr>
      ))}
    </>
  );

  return (
    <div className="container-fluid py-4 px-4 bg-light min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-dark mb-0">Blog Management</h3>
        <button className="btn btn-dark px-4 py-2 rounded-3 d-flex align-items-center gap-2" onClick={() => handleShowModal()}>
          <Plus size={20} /> Add Post
        </button>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-3 rounded-4 bg-white border-start border-primary border-4">
            <div className="d-flex align-items-center gap-3">
              <div className="p-2 bg-primary-subtle rounded text-primary"><FileText size={20}/></div>
              <div><h5 className="fw-bold mb-0">{stats.total}</h5><small className="text-muted">Total Posts</small></div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-3 rounded-4 bg-white border-start border-success border-4">
            <div className="d-flex align-items-center gap-3">
              <div className="p-2 bg-success-subtle rounded text-success"><CheckCircle size={20}/></div>
              <div><h5 className="fw-bold mb-0">{stats.active}</h5><small className="text-muted">Live</small></div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-3 rounded-4 bg-white border-start border-warning border-4">
            <div className="d-flex align-items-center gap-3">
              <div className="p-2 bg-warning-subtle rounded text-warning"><Clock size={20}/></div>
              <div><h5 className="fw-bold mb-0">{stats.draft}</h5><small className="text-muted">Drafts</small></div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="position-relative">
          <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={22} />
          <input 
            type="text" 
            className="form-control form-control-lg ps-5 border-0 shadow-sm py-3" 
            placeholder="Search by title or category..." 
            style={{ borderRadius: '12px' }}
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} 
          />
          {searchTerm && (
            <button className="position-absolute top-50 end-0 translate-middle-y me-3 btn btn-link p-0 text-muted" onClick={() => setSearchTerm("")}>
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr className="text-muted small text-uppercase">
                <th className="ps-4" style={{ width: '100px' }}>Cover</th>
                <th>Blog Info</th>
                <th>Category</th>
                <th>Author & Date</th>
                <th className="text-center">Status</th>
                <th className="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody className="border-top-0">
              {loading ? (
                <TableSkeleton />
              ) : currentItems.length > 0 ? (
                currentItems.map((blog) => (
                  <tr key={blog.blogId || blog.id}>
                    <td className="ps-4">
                      <div className="rounded-3 shadow-sm border bg-light overflow-hidden d-flex align-items-center justify-content-center" style={{ width: '80px', height: '55px' }}>
                        <img
                          src={`${IMAGE_BASE_URL}${blog.imageUrl}`}
                          alt=""
                          loading="lazy"
                          className="w-100 h-100 object-fit-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = `<div class="text-muted"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg></div>`;
                          }}
                        />
                      </div>
                    </td>
                    <td>
                      <div className="fw-bold text-dark text-truncate" style={{ maxWidth: '250px' }}>{blog.title}</div>
                      <div className="small text-muted d-flex align-items-center gap-1"><Eye size={12}/> {blog.views || 0}</div>
                    </td>
                    <td><span className="badge rounded-pill bg-info-subtle text-info border border-info-subtle">{blog.category}</span></td>
                    <td>
                      <div className="small text-dark fw-medium text-truncate" style={{maxWidth: '120px'}}><User size={12}/> {blog.authorName || 'Admin'}</div>
                      <div className="small text-muted mt-1"><Calendar size={12}/> {blog.createdDate ? new Date(blog.createdDate).toLocaleDateString('en-GB') : 'N/A'}</div>
                    </td>
                    <td className="text-center">
                      <span className={`badge border px-2 py-1 small ${blog.isActive ? 'bg-success-subtle text-success border-success' : 'bg-secondary-subtle text-secondary border-secondary'}`}>
                        {blog.isActive ? 'Live' : 'Draft'}
                      </span>
                    </td>
                    <td className="text-end pe-4">
                      <div className="d-flex justify-content-end gap-2">
                        <button className="btn btn-outline-primary btn-sm rounded-circle p-2 border-0 bg-light" onClick={() => handleShowModal(blog)}><Edit size={18} /></button>
                        <button className="btn btn-outline-danger btn-sm rounded-circle p-2 border-0 bg-light" onClick={() => handleDelete(blog.blogId)}><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" className="text-center py-5 text-muted">Bhai, koi blog nahi mila!</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="card-footer bg-white border-0 py-3 border-top">
            <div className="d-flex justify-content-between align-items-center">
              <small className="text-muted fw-medium">Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredBlogs.length)} of {filteredBlogs.length}</small>
              <nav>
                <ul className="pagination pagination-sm mb-0 gap-1">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link border-0 rounded-2 shadow-sm" onClick={() => setCurrentPage(currentPage - 1)}><ChevronLeft size={16}/></button>
                  </li>
                  {[...Array(totalPages)].map((_, i) => (
                    <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                      <button className="page-link border-0 rounded-2 shadow-sm mx-1 px-3" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link border-0 rounded-2 shadow-sm" onClick={() => setCurrentPage(currentPage + 1)}><ChevronRight size={16}/></button>
                  </li>
                </ul>
              </nav>
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