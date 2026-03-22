import api from './api';

const BASE_JOBS = '/api/jobs';
const BASE_WORKER = '/api/worker';

export const jobService = {
    // === Public / Browse Jobs ===
    getJobs: (params = {}) => 
        api.get(`${BASE_JOBS}`, { params }),

    getJobById: (jobId) => 
        api.get(`${BASE_JOBS}/${jobId}`),

    // === Worker Applications ===
    applyToJob: (jobId, applicationData = {}) => 
        api.post(`${BASE_JOBS}/${jobId}/apply`, applicationData),

    withdrawApplication: (applicationId) => 
        api.delete(`/api/jobs/applications/${applicationId}/withdraw`),

    getMyApplications: (status = null) => 
        api.get(`${BASE_JOBS}/applications/mine`, {
            params: status ? { status } : {}
        }),

    // === Worker Active Jobs & Progress ===
    getActiveJobs: () => 
        api.get(`${BASE_WORKER}/jobs/active`),

    getJobProgress: (jobId) => 
        api.get(`${BASE_JOBS}/${jobId}/progress`),   // Note: This endpoint doesn't exist yet in the files you sent

    getJobLocations: (jobId) => 
        api.get(`${BASE_JOBS}/${jobId}/location`),

    updateJobLocation: (jobId, lat, lng) => 
        api.post(`${BASE_JOBS}/${jobId}/location/update`, { lat, lng }),
};

export default jobService;