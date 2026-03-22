import api from './api';

const BASE_AI = '/api/ai';

export const aiService = {
    // === Jobs ===
    getRecommendedJobs: (limit = 10) => 
        api.get(`${BASE_AI}/jobs/recommended`, { params: { top_n: limit } }),

    getTrendingJobs: (limit = 10) => 
        api.get(`${BASE_AI}/jobs/trending`, { params: { top_n: limit } }),

    getRecommendedWorkers: (jobId) => 
        api.get(`${BASE_AI}/workers/recommended/${jobId}`),

    getTopRatedWorkers: () => 
        api.get(`${BASE_AI}/workers/top-rated`),

    getMatchScore: (jobId) => 
        api.get(`${BASE_AI}/match-score/${jobId}`),

    // === Wage & Rates ===
    predictWage: (data) => 
        api.post(`${BASE_AI}/predict-wage`, data),

    checkWageFairness: (data) => 
        api.post(`${BASE_AI}/check-wage-fairness`, data),

    getMarketRates: (category) => 
        api.get(`${BASE_AI}/market-rates/${category}`),

    checkWageAnomaly: (data) => 
        api.post(`${BASE_AI}/anomaly/wage`, data),

    // === Reputation ===
    getWorkerReputation: (workerId) => 
        api.get(`${BASE_AI}/reputation/worker/${workerId}`),

    getEmployerReputation: (employerId) => 
        api.get(`${BASE_AI}/reputation/employer/${employerId}`),

    getMyReputation: () => 
        api.get(`${BASE_AI}/reputation/me`),

    // === Records ===
    recordApplication: (data) => 
        api.post(`${BASE_AI}/record/application`, data),

    recordHire: (data) => 
        api.post(`${BASE_AI}/record/hire`, data),

    // === Search & NLP ===
    parseSearch: (query) => 
        api.post(`${BASE_AI}/search/parse`, { query }),

    executeSearch: (params) => 
        api.get(`${BASE_AI}/search/execute`, { params }),

    parseMultilingualSearch: (data) => 
        api.post(`${BASE_AI}/search/parse-multilingual`, data),

    executeMultilingualSearch: (params) => 
        api.get(`${BASE_AI}/search/execute-multilingual`, { params }),

    extractSkills: (data) => 
        api.post(`${BASE_AI}/skills/extract`, data),

    // === Categorization ===
    validateCategory: (data) => 
        api.post(`${BASE_AI}/category/validate`, data),

    suggestCategory: () => 
        api.get(`${BASE_AI}/category/suggest`),

    // === Trust & Safety ===
    checkSpam: (data) => 
        api.post(`${BASE_AI}/spam/check`, data),

    checkEmployerFraud: (employerId) => 
        api.get(`${BASE_AI}/fraud/check-employer/${employerId}`),

    checkWorkerFraud: (workerId) => 
        api.get(`${BASE_AI}/fraud/check-worker/${workerId}`),

    moderateContent: (data) => 
        api.post(`${BASE_AI}/moderate`, data),
};

export default aiService;
