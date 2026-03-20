import api from './api';

export const sendOTP = (phone) =>
  api.post('/auth/send-otp', { phone_number: phone });

export const verifyOTP = (phone, otp) =>
  api.post('/auth/verify-otp', {
    phone_number: phone,
    otp,
  });

export const getMe = () =>
  api.get('/auth/me');

export const refreshToken = (refreshToken) =>
  api.post('/auth/refresh', { refresh_token: refreshToken });

export const workerSignup = (data) =>
  api.post('/auth/worker/signup', data);

export const employerSignup = (data) =>
  api.post('/auth/employer/signup', data);

export const logout = () =>
  api.post('/auth/logout').finally(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }).catch((err) => {
    console.warn('Backend logout failed:', err);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  });

const authService = {
  sendOTP,
  verifyOTP,
  getMe,
  refreshToken,
  workerSignup,
  employerSignup,
  logout,
};

export default authService;