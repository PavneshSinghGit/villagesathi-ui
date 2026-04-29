import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

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

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'clean']
    ],
  };

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title || blog.Title || "",
        content: blog.content || blog.Content || "",
        shortDescription: blog.shortDescription || blog.ShortDescription || "",
        category: blog.category || blog.Category || "General",
        metaDescription: blog.metaDescription || blog.MetaDescription || "",
        slug: blog.slug || blog.Slug || "",
        authorName: blog.authorName || blog.AuthorName || "Admin",
        isActive: blog.isActive !== undefined ? blog.isActive : (blog.IsActive !== undefined ? blog.IsActive : true)
      });
    }
  }, [blog]);

  const handleTitleChange = (e) => {
    const val = e.target.value;
    const generatedSlug = val.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    setFormData({ ...formData, title: val, slug: generatedSlug });
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
      const url = blog
        ? `${API_BASE_URL}/Blogs/UpdateBlog/${currentId}`
        : `${API_BASE_URL}/Blogs`;

      await axios({
        method: "POST",
        url: url,
        data: data,
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert(blog ? "Blog updated successfully!" : "Blog published successfully!");
      if (refresh) refresh();
      if (onClose) onClose();
    } catch (err) {
      console.error("Submission Error:", err);
      alert("Failed to save the blog.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', zIndex: 1050 }}>
      <div className="modal-dialog modal-xl border-0 shadow-lg">
        <div className="modal-content border-0">
          <form onSubmit={handleSubmit}>
            <div className="modal-header bg-dark text-white py-3">
              <h5 className="modal-title fw-bold">
                {blog ? "📝 Edit Blog Post" : "🆕 Create New Blog Post"}
              </h5>
              <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
            </div>

            <div className="modal-body p-4" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
              <div className="row">
                {/* Left Column: Editor & Main Fields */}
                <div className="col-md-8">
                  <div className="mb-4">
                    <label className="form-label fw-bold">Blog Title</label>
                    <input
                      type="text"
                      className="form-control form-control-lg border-2"
                      value={formData.title}
                      onChange={handleTitleChange}
                      placeholder="Enter title..."
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-bold">Content</label>
                    <div style={{ marginBottom: '60px' }}>
                      <ReactQuill
                        theme="snow"
                        value={formData.content}
                        onChange={(val) => setFormData({ ...formData, content: val })}
                        modules={modules}
                        style={{ height: '350px' }}
                      />
                    </div>
                  </div>

                  <div className="mb-3 mt-5">
                    <label className="form-label fw-bold">Short Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={formData.shortDescription}
                      onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                      placeholder="Briefly describe the blog for the listing page..."
                    />
                  </div>
                </div>

                {/* Right Column: Settings & SEO */}
                <div className="col-md-4 bg-light p-4 rounded border-start">
                  <div className="mb-3">
                    <label className="form-label fw-bold text-primary">URL Slug</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">Category</label>
                    <select
                      className="form-select"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">Author Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.authorName}
                      onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">Featured Image</label>
                    <input
                      type="file"
                      className="form-control"
                      onChange={(e) => setImageFile(e.target.files[0])}
                      accept="image/*"
                    />
                    {(blog && (blog.imageUrl || blog.ImageUrl)) && (
                      <div className="mt-2">
                        <small className="text-muted d-block text-truncate">Current: {blog.imageUrl || blog.ImageUrl}</small>
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">SEO Meta Description</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      value={formData.metaDescription}
                      onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                      placeholder="SEO description for search engines..."
                    />
                  </div>

                  <div className="form-check form-switch mt-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="isActiveSwitch"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    />
                    <label className="form-check-label fw-bold" htmlFor="isActiveSwitch">Publish Article</label>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer border-top bg-light">
              <button type="button" className="btn btn-secondary px-4" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary px-5 fw-bold" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : (blog ? "Update Blog" : "Publish Now")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BlogForm;