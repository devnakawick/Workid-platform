import api from './api';

const BASE_WORKER = '/api/worker';
const BASE_JOBS = '/api/jobs';

export const workerService = {
    // Profile
    getWorkerProfile: () =>
        api.get(`${BASE_WORKER}/profile`),

    updateWorkerProfile: (data) =>
        api.put(`${BASE_WORKER}/profile`, data),

    // Stats
    getWorkerStats: () =>
        api.get(`${BASE_WORKER}/stats`),

    // Applications
    getMyApplications: (status = null) =>
        api.get(`${BASE_JOBS}/applications/mine`, {
            params: status ? { status } : {}
        }),
    
    // Documents
    getDocuments: () => 
        api.get(`${BASE_WORKER}/documents`),

    uploadDocuments: (file, DocumentType) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('document_type', DocumentType); 

        return api.post(`${BASE_WORKER}/document/upload`, formData);
    },

    deleteDocument: (documentId) => 
        api.delete(`${BASE_WORKER}/documents/${documentId}`),

    // Active Jobs
    getActiveJobs: () => 
        api.get(`${BASE_WORKER}/jobs/active`),
};

export default workerService;