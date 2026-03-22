import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,   
    headers: { 'Content-Type': 'application/json' },
    timeout: 15000,
});

// Request interceptor
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');

    // Normalize URL for public paths check
    const requestUrl = config.url?.startsWith('/') ? config.url : `/${config.url}`;

    const publicPaths = [
        '/auth/verify-otp',
        '/auth/resend-otp',
        '/auth/refresh',
        '/api/auth/verify-otp',
        '/api/auth/resend-otp',
        '/api/auth/refresh'
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
    (error) => {
        const { response, config } = error;
        console.log('API error:', response?.status, config?.url);

        if (response?.status === 401) {
            // Check if this is a request that we SHOULD NOT clear tokens for
            // e.g. if we just got a 401 on /me during signup, maybe don't wipe everything immediately
            const isAuthFlow = config.url?.includes('/auth/me') || 
                               config.url?.includes('verify-otp') ||
                               config.url?.includes('signup');

            if (!isAuthFlow) {
                console.log('401 error - clearing tokens and redirecting');
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');

                if (!window.location.pathname.includes('/login') &&
                    !window.location.pathname.includes('/otp') &&
                    !window.location.pathname.includes('/register')) {
                    window.location.href = '/login';
                }
            } else {
                console.log('401 error during auth flow - not clearing tokens immediately');
            }
        }
        return Promise.reject(error);
    }
);

export default api;