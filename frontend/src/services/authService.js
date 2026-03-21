import api from './api';

export const sendOTP = (phone, role = 'worker', password = null) =>
  api.post('api/auth/send-otp', { phone_number: phone });

export const verifyOTP = (phone, otp) =>
  api.post('api/auth/verify-otp', {
    phone_number: phone,
    otp,
  });

export const getMe = () =>
  api.get('api/auth/me');

export const refreshToken = (refreshToken) =>
  api.post('api/auth/refresh', { refresh_token: refreshToken });

export const workerSignup = (data) =>
  api.post('api/auth/worker/signup', data);

export const employerSignup = (data) =>
  api.post('api/auth/employer/signup', data);

export const loginWithPassword = (phone, password) =>
  api.post('api/auth/login', { phone_number: phone, password });

export const logout = () =>
  api.post('api/auth/logout').finally(() => {
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
  loginWithPassword,
  logout,
};

export default authService;