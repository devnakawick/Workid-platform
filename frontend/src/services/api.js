import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,   
    headers: { 'Content-Type': 'application/json' },
    timeout: 15000,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Request interceptor
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');

    const requestUrl = config.url?.startsWith('/') ? config.url : `/${config.url}`;

    const publicPaths = [
        '/auth/verify-otp',
        '/auth/resend-otp',
        '/auth/refresh',
        '/auth/send-otp',
        '/api/auth/verify-otp',
        '/api/auth/resend-otp',
        '/api/auth/refresh',
        '/api/auth/send-otp'
    ];

    const isPublic = publicPaths.some(path => requestUrl.startsWith(path));

    if (token && !isPublic) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor
api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const { response, config } = error;
        const originalRequest = config;

        if (response?.status === 401 && !originalRequest._retry) {
            // Skip redirect logic for auth-flow endpoints
            const isAuthEndpoint = originalRequest.url?.includes('/auth/');

            if (isAuthEndpoint) {
                return Promise.reject(error);
            }

            // Attempt token refresh
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
                if (isRefreshing) {
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    }).then(token => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    }).catch(err => Promise.reject(err));
                }

                originalRequest._retry = true;
                isRefreshing = true;

                try {
                    const res = await axios.post(
                        `${import.meta.env.VITE_API_URL}/api/auth/refresh`,
                        { refresh_token: refreshToken },
                        { headers: { 'Content-Type': 'application/json' } }
                    );
                    const newToken = res.data.access_token;
                    localStorage.setItem('access_token', newToken);
                    if (res.data.refresh_token) {
                        localStorage.setItem('refresh_token', res.data.refresh_token);
                    }
                    processQueue(null, newToken);
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    processQueue(refreshError, null);
                    // Refresh failed  clear tokens and redirect
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    localStorage.removeItem('user');

                    const path = window.location.pathname;
                    if (!path.includes('/login') && !path.includes('/otp') &&
                        !path.includes('/register') && !path.includes('/signup') &&
                        path !== '/') {
                        window.location.href = '/login';
                    }
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            } else {
                
                localStorage.removeItem('access_token');
                localStorage.removeItem('user');

                const path = window.location.pathname;
                if (!path.includes('/login') && !path.includes('/otp') &&
                    !path.includes('/register') && !path.includes('/signup') &&
                    path !== '/') {
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;