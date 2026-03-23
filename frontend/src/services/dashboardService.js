import api from './api';

const BASE_DASHBOARD = '/api/dashboard';

export const dashboardService = {
    getWorkerDashboardStats: () =>
        api.get(`${BASE_DASHBOARD}/worker/stats`),

    getEmployerDashboardStats: () =>
        api.get(`${BASE_DASHBOARD}/employer/stats`),
};

export default dashboardService;
