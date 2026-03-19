import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,   
    headers: { 'Content-Type': 'application/json' },
    timeout: 15000,
});

// Request interceptor
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');

    const publicPaths = [
        '/auth/login',
        '/auth/register',
        '/auth/verify-otp',
        '/auth/resend-otp',
        '/auth/refresh'          
    ];

    const isPublic = publicPaths.some(path => config.url?.startsWith(path));

    if (token && !isPublic) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor
api.interceptors.response.use(
    (res) => res,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('access_token');

            if (!window.location.pathname.includes('/login') &&
                !window.location.pathname.includes('/otp') &&
                !window.location.pathname.includes('/register')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;