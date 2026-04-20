import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://localhost:7092/api', // Aapka .NET Core backend URL
    headers: {
        'Content-Type': 'application/json',
    }
});

// Agar JWT token use kar rahe hain, toh interceptor add kar sakte hain
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