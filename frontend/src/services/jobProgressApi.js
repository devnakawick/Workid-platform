export const mockJobs = [
    {
        id: 'job-1',
        title: 'Fix Kitchen Sink',
        employerName: 'John Doe',
        description: 'Fix leaking kitchen sink and replace faucet. Materials provided by the employer on-site.',
        location: 'Colombo, Sri Lanka',
        employerLocation: { lat: 6.9271, lng: 79.8612 },
        workerLocation: { lat: 6.8654, lng: 79.8973 },
        budget: 'Rs. 4000.00',
        status: 'Accepted' // 'Accepted', 'Traveling', 'In Progress', 'Waiting Payment', 'Finished'
    },
    {
        id: 'job-2',
        title: 'Bathroom Plumbing Install',
        employerName: 'Jane Smith',
        description: 'Complete bathroom plumbing installation for new construction.',
        location: 'Dehiwala, Sri Lanka',
        employerLocation: { lat: 6.8511, lng: 79.8682 },
        workerLocation: { lat: 6.8654, lng: 79.8973 },
        budget: 'Rs. 65,000.00',
        status: 'In Progress'
    }
];

export const getActiveJobs = async () => {
    return new Promise((resolve) => {
        setTimeout(() => resolve([...mockJobs]), 500);
    });
};

export const getJobDetails = async (jobId) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const job = mockJobs.find(j => j.id === jobId);
            if (job) resolve({ ...job });
            else reject(new Error('Job not found'));
        }, 500);
    });
};

export const startTravel = async (jobId) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`Job ${jobId} status updated to Traveling`);
            resolve({ success: true, status: 'Traveling' });
        }, 500);
    });
};

export const startJob = async (jobId) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`Job ${jobId} status updated to In Progress`);
            resolve({ success: true, status: 'In Progress' });
        }, 500);
    });
};

export const completeJob = async (jobId) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`Job ${jobId} status updated to Waiting Payment`);
            resolve({ success: true, status: 'Waiting Payment' });
        }, 500);
    });
};

export const getJobLocations = async (jobId) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const job = mockJobs.find(j => j.id === jobId);
            if (job) {
                resolve({
                    employerLocation: job.employerLocation,
                    workerLocation: job.workerLocation
                });
            } else {
                resolve(null);
            }
        }, 500);
    });
};

export const updateEmployerLocationSettings = async (jobId, settings) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`Updated location settings for job ${jobId}:`, settings);
            resolve({ success: true, settings });
        }, 500);
    });
};
