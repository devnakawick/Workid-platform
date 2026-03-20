import api from './api';

export const authService = {
    sendOTP: (phone) => 
        api.post('/auth/send-otp', { phone_number: phone }),

    verifyOTP: (phone, otp) => 
        api.post('/auth/verify-otp', { 
            phone_number: phone, 
            otp 
        }),

    workerSignup: (data) => 
        api.post('/auth/worker/signup', data),

    employerSignup: (data) => 
        api.post('/auth/employer/signup', data),

    getMe: () => 
        api.get('/auth/me'),

    refreshToken: () => 
        api.post('/auth/refresh', { refresh_token: "..."}),          

    logout: () => { 
        localStorage.removeItem('access_token');
        return Promise.resolve({ message: 'Logged out' });
    },
};

export default authService;