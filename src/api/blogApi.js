import axiosInstance from './axiosInstance';

export const blogApi = {
    // Saare blogs lane ke liye
    getAllBlogs: () => axiosInstance.get('/Blogs'),

    // Single blog slug se lane ke liye
    getBlogBySlug: (slug) => axiosInstance.get(`/Blogs/${slug}`),

    // Naya blog banane ke liye (FormData ke saath)
    createBlog: (formData) => axiosInstance.post('/Blogs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),

    // Update karne ke liye
    updateBlog: (id, formData) => axiosInstance.put(`/Blogs/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),

    // Delete karne ke liye
    deleteBlog: (id) => axiosInstance.delete(`/Blogs/${id}`)
};