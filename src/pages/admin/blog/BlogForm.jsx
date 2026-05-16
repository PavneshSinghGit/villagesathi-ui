import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { 
    Save, FileText, Link as LinkIcon, Tag, User, Image as ImageIcon, 
    Globe, CheckCircle, Loader2, Edit, Plus 
} from 'lucide-react';

const CATEGORIES = ["Agriculture", "Government Schemes", "Rural Development", "News", "General"];

const BlogForm = ({ blog, onClose, refresh }) => {
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    content: "",
    category: "General",
    metaDescription: "",
    slug: "",
    authorName: "Admin",
    isActive: true
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. useEffect ko simplify kiya taaki data stable rahe
  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title || blog.Title || "",
        shortDescription: blog.shortDescription || blog.ShortDescription || "",
        content: blog.content || blog.Content || "",
        category: blog.category || blog.Category || "General",
        metaDescription: blog.metaDescription || blog.MetaDescription || "",
        slug: blog.slug || blog.Slug || "",
        authorName: blog.authorName || blog.AuthorName || "Admin",
        isActive: blog.isActive ?? blog.IsActive ?? true
      });
    }
  }, [blog]);

  // 2. Optimized Title Change (Prevents wiping other fields)
  const handleTitleChange = (e) => {
    const val = e.target.value;
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '');
    
    // Yahan prev state ka use karna zaroori hai taaki baki data delete na ho
    setFormData(prev => ({ 
      ...prev, 
      title: val, 
      slug: generatedSlug 
    }));
  };

  // 3. Generic Input Handler for all other fields
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.content || formData.content === "<p><br></p>") {
      alert("Please enter content for the blog.");
      return;
    }

    setIsSubmitting(true);
    const data = new FormData();
    const currentId = blog ? (blog.blogId || blog.BlogId) : 0;

    data.append("BlogId", currentId);
    data.append("Title", formData.title);
    data.append("ShortDescription", formData.shortDescription || "");
    data.append("Content", formData.content);
    data.append("Category", formData.category);
    data.append("MetaDescription", formData.metaDescription || "");
    data.append("Slug", formData.slug);
    data.append("AuthorName", formData.authorName);
    data.append("IsActive", formData.isActive);

    const existingImg = blog?.imageUrl || blog?.ImageUrl || "";
    if (imageFile) {
      data.append("ImageFile", imageFile);
      data.append("ImageUrl", imageFile.name);
    } else {
      data.append("ImageUrl", existingImg);
    }

    data.append("Views", blog?.views || blog?.Views || 0);
    data.append("Likes", blog?.likes || blog?.Likes || 0);
    data.append("CreatedDate", blog ? (blog.createdDate || blog.CreatedDate) : new Date().toISOString());

    try {
      const url = blog ? `${API_BASE_URL}/Blogs/UpdateBlog/${currentId}` : `${API_BASE_URL}/Blogs`;
      await axios.post(url, data, { headers: { "Content-Type": "multipart/form-data" } });

      alert(blog ? "Updated!" : "Published!");
      if (refresh) refresh();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to save.", err);
      console.error("Error details:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(15, 23, 42, 0.85)', zIndex: 1060 }}>
      <div className="modal-dialog modal-xl modal-dialog-centered border-0">
        <div className="modal-content border-0 overflow-hidden" style={{ borderRadius: '24px' }}>
          <form onSubmit={handleSubmit}>
            <div className="modal-header border-0 px-4 py-3 bg-dark text-white">
              <h5 className="modal-title fw-bold">{blog ? "Edit Article" : "New Article"}</h5>
              <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
            </div>

            <div className="modal-body p-0" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
              <div className="row g-0">
                {/* Left Side */}
                <div className="col-lg-8 p-4 bg-white border-end">
                  <div className="mb-4">
                    <label className="fw-bold small text-muted mb-2">TITLE</label>
                    <input
                      name="title"
                      type="text"
                      className="form-control form-control-lg"
                      value={formData.title}
                      onChange={handleTitleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="fw-bold small text-muted mb-2">CONTENT</label>
                    <div style={{ height: '350px', marginBottom: '50px' }}>
                      <ReactQuill
                        theme="snow"
                        value={formData.content}
                        onChange={(val) => setFormData(prev => ({ ...prev, content: val }))}
                        style={{ height: '300px' }}
                      />
                    </div>
                  </div>

                  <div className="mt-5">
                    <label className="fw-bold small text-muted mb-2">EXCERPT</label>
                    <textarea
                      name="shortDescription"
                      className="form-control"
                      rows="2"
                      value={formData.shortDescription}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Right Side Settings */}
                <div className="col-lg-4 p-4 bg-light">
                  <div className="mb-3">
                    <label className="fw-bold small text-muted mb-1">SLUG</label>
                    <input name="slug" className="form-control" value={formData.slug} onChange={handleChange} />
                  </div>

                  <div className="mb-3">
                    <label className="fw-bold small text-muted mb-1">CATEGORY</label>
                    <select name="category" className="form-select" value={formData.category} onChange={handleChange}>
                      {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="fw-bold small text-muted mb-1">AUTHOR</label>
                    <input name="authorName" className="form-control" value={formData.authorName} onChange={handleChange} />
                  </div>

                  <div className="mb-3">
                    <label className="fw-bold small text-muted mb-1">FEATURED IMAGE</label>
                    <input type="file" className="form-control" onChange={(e) => setImageFile(e.target.files[0])} />
                  </div>

                  <div className="mb-3">
                    <label className="fw-bold small text-muted mb-1">SEO DESCRIPTION</label>
                    <textarea name="metaDescription" className="form-control" rows="3" value={formData.metaDescription} onChange={handleChange} />
                  </div>

                  <div className="form-check form-switch p-3 border rounded bg-white mt-4">
                    <label className="form-check-label fw-bold">Live Status</label>
                    <input 
                      name="isActive"
                      className="form-check-input float-end" 
                      type="checkbox" 
                      checked={formData.isActive} 
                      onChange={handleChange} 
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer bg-light">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Discard</button>
              <button type="submit" className="btn btn-primary px-4" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BlogForm;