import React, { useEffect, useState } from 'react';
import { jobService } from '@/services/jobService';
import ActiveJobsList from '@/components/jobs/ActiveJobsList';
import { Loader2 } from 'lucide-react';

// Map backend status to display labels
const STATUS_MAP = {
    'accepted': 'Accepted',
    'worker_traveling': 'Traveling',
    'in_progress': 'In Progress',
    'waiting_payment': 'Waiting Payment',
    'completed': 'Finished',
};

const WorkerCurrentJobsPage = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await jobService.getActiveJobs();
                const mapped = (res.data || []).map(job => ({
                    id: job.job_id,
                    title: job.title,
                    status: STATUS_MAP[job.status] || job.status,
                    employerName: job.employer_name || 'Employer',
                    description: '',
                    location: job.location?.address || '',
                    budget: job.scheduled_time ? new Date(job.scheduled_time).toLocaleDateString() : '',
                }));
                setJobs(mapped);
            } catch (error) {
                console.error("Failed to load jobs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-20">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Your Current Jobs</h1>
                <p className="text-gray-500 font-medium mt-1">Manage all your active and upcoming jobs here.</p>
            </div>

            <ActiveJobsList jobs={jobs} basePath="/worker/job-details" />
        </div>
    );
};

export default WorkerCurrentJobsPage;
