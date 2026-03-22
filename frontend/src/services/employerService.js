import api from './api';

const BASE_EMPLOYER = '/api/employer';
const BASE_JOBS = '/api/jobs';
const BASE_AI = '/api/ai';

export const employerService = {
    // Profile
    getEmployerProfile: () => 
        api.get(`${BASE_EMPLOYER}/profile`),

    createEmployerProfile: (data) =>
        api.post(`${BASE_EMPLOYER}/profile`, data),

    updateEmployerProfile: (data) => 
        api.put(`${BASE_EMPLOYER}/profile`, data),

    rateWorker: (jobId, rating, review = null) => 
        api.post(`${BASE_EMPLOYER}/jobs/${jobId}/rate-worker`, { rating, review }),

    // Stats
    getEmployerStats: () => 
        api.get(`${BASE_EMPLOYER}/stats`),

    // Job Management
    postJob: (data) => 
        api.post(`${BASE_EMPLOYER}/jobs`, data),

    getMyJobs: (status = null) => 
        api.get(`${BASE_EMPLOYER}/jobs`, {
            params: status ? { status } : {}
        }),

    getJobDetail: (jobId) => 
        api.get(`${BASE_EMPLOYER}/jobs/${jobId}`),

    updateJob: (jobId, data) => 
        api.put(`${BASE_EMPLOYER}/jobs/${jobId}`, data),

    updateJobStatus: (jobId, status) => 
        api.patch(`${BASE_EMPLOYER}/jobs/${jobId}/status`, { status }),

    deleteJob: (jobId) => 
        api.delete(`${BASE_EMPLOYER}/jobs/${jobId}`),

    // Applications
    getJobApplications: (jobId) => 
        api.get(`${BASE_EMPLOYER}/jobs/${jobId}/applications`),

    acceptApplication: (applicationId) => 
        api.post(`${BASE_EMPLOYER}/applications/${applicationId}/accept`),

    rejectApplication: (applicationId) => 
        api.post(`${BASE_EMPLOYER}/applications/${applicationId}/reject`),

    // Worker Search & Discovery
    searchWorkers: (params = {}) => 
        api.get(`${BASE_EMPLOYER}/workers`, { params }),

    getWorkerProfile: (workerId) => 
        api.get(`${BASE_EMPLOYER}/workers/${workerId}`),

    // AI Features
    getRecommendedWorkers: (jobId) => 
        api.get(`${BASE_AI}/workers/recommended/${jobId}`),

    getWorkerReputation: (workerId) => 
        api.get(`${BASE_AI}/reputation/worker/${workerId}`),
};

export default employerService;