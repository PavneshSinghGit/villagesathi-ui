import axios from 'axios';

// Create an axios instance with base configuration
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://localhost:7092/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*'
    }
});

// Interceptor to attach the token for Protected Routes
axiosInstance.interceptors.request.use(
    (config) => {
        // --- UPDATED LOGIC: Check for all types of users ---
        const shopUser = JSON.parse(localStorage.getItem('shopUser'));
        const normalUser = JSON.parse(localStorage.getItem('user'));
        const customerUser = JSON.parse(localStorage.getItem('customerUser')); // Naya Customer Key
        
        // Teeno mein se jo bhi token mile use utha lo
        const token = shopUser?.token || normalUser?.token || customerUser?.token;
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;