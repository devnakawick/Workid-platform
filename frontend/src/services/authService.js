import api from './api';

export const authService = {
    sendOTP: (phone) => 
        api.post('/send-otp', { phone_number: phone }),

    verifyOTP: (phone, otp) => 
        api.post('/verify-otp', { 
            phone_number: phone, 
            otp 
        }),

    workerSignup: (data) => 
        api.post('/worker/signup', data),

    employerSignup: (data) => 
        api.post('/employer/signup', data),

    getMe: () => 
        api.get('/me'),

    // refreshToken: () => api.post('/refresh'),          // NOT IMPLEMENTED 

    logout: () => { 
        localStorage.removeItem('access_token');
        return Promise.resolve({ message: 'Logged out' });
    },
};

export default authService;