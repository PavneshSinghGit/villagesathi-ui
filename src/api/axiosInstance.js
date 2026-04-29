import axios from 'axios';

const axiosInstance = axios.create({
    // Hardcoded URL hata kar environment variable use kiya
    baseURL: import.meta.env.VITE_API_URL, 
    headers: {
        'Content-Type': 'application/json',
    }
});

// JWT token interceptor (Same rahega)
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axiosInstance;