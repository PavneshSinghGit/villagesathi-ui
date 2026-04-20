import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

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
    const generatedSlug = val.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    setFormData({ ...formData, title: val, slug: generatedSlug });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    // 1. Backend Binding Fix (Use EXACT keys as per C# Model)
    data.append("BlogId", blog ? (blog.blogId || blog.BlogId) : 0);
    data.append("Title", formData.title);
    data.append("ShortDescription", formData.shortDescription);
    data.append("Content", formData.content);
    data.append("Category", formData.category);
    data.append("MetaDescription", formData.metaDescription);
    data.append("Slug", formData.slug);
    data.append("AuthorName", formData.authorName);
    
    // Boolean ko string "true"/"false" bhejna safe hota hai multipart mein
    data.append("IsActive", formData.isActive); 

    // 2. Image Handling
    const currentImg = blog?.imageUrl || blog?.ImageUrl || "";
    data.append("ImageUrl", currentImg);

    if (imageFile) {
      data.append("ImageFile", imageFile); // Key name should match C# parameter exactly
    }

    // 3. Technical Stats
    data.append("Views", blog?.views || blog?.Views || 0);
    data.append("Likes", blog?.likes || blog?.Likes || 0);
    
    if (!blog) {
      data.append("CreatedDate", new Date().toISOString());
    }

    try {
      const id = blog?.blogId || blog?.BlogId;
      const url = blog ? `${API_BASE_URL}/Blogs/${id}` : `${API_BASE_URL}/Blogs`;
      const method = blog ? "put" : "post";

      // Axios call
      const res = await axios({
        method: method,
        url: url,
        data: data,
        headers: { "Content-Type": "multipart/form-data" }
      });

      // Agar yahan tak pahunche matlab success hai
      console.log("Success Response:", res.data);
      
      // Safety Check for callbacks
      if (typeof refresh === "function") refresh();
      if (typeof onClose === "function") onClose();

    } catch (err) {
      // Real debugging info
      console.error("Axios Error Object:", err);
      
      // Agar backend se successful response (200-299) nahi aaya toh hi alert dikhao
      if (err.response) {
        console.error("Server Data Error:", err.response.data);
        alert(`Server Error: ${JSON.stringify(err.response.data)}`);
      } else {
        alert("Network Error or UI Crash! Check Console.");
      }
    }
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1050 }}>
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
                <div className="col-md-8">
                  <div className="mb-3">
                    <label className="form-label fw-bold">Blog Title</label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      value={formData.title}
                      onChange={handleTitleChange}
                      placeholder="Enter title..."
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">Content</label>
                    <div style={{ height: '350px', marginBottom: '50px' }}>
                      <ReactQuill
                        theme="snow"
                        value={formData.content}
                        onChange={(val) => setFormData({ ...formData, content: val })}
                        modules={modules}
                        style={{ height: '300px' }}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">Short Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={formData.shortDescription}
                      onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    />
                  </div>
                </div>

                <div className="col-md-4 bg-light p-3 rounded">
                  <div className="mb-3">
                    <label className="form-label fw-bold text-primary">URL Slug</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">Category</label>
                    <select 
                      className="form-select"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="General">General</option>
                      <option value="Agriculture">Agriculture</option>
                      <option value="News">News</option>
                      <option value="Development">Development</option>
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
                    {blog && !imageFile && <small className="text-muted">Current: {blog.imageUrl || blog.ImageUrl}</small>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">SEO Meta Description</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      value={formData.metaDescription}
                      onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                    />
                  </div>

                  <div className="form-check form-switch mt-4">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    />
                    <label className="form-check-label fw-bold">Publish (Is Active)</label>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer border-top shadow-sm">
              <button type="button" className="btn btn-link text-muted px-4" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-dark px-5 fw-bold shadow">
                {blog ? "Update Changes" : "Save & Publish"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BlogForm;