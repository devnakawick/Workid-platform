import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '@/services/api';
import { useLocationTracking } from '@/hooks/useLocationTracking';
import ActiveJobDetails from '@/components/jobs/ActiveJobDetails';
import JobProgressBar from '@/components/progress/JobProgressBar';
import JobActionButtons from '@/components/actions/JobActionButtons';
import StartJobLocationPopup from '@/components/popups/StartJobLocationPopup';
import StopLocationPopup from '@/components/popups/StopLocationPopup';
import JobLocationMap from '@/components/map/JobLocationMap';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WorkerJobDetailsPage = () => {
    const { id: jobId } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);

    const [showStartPopup, setShowStartPopup] = useState(false);
    const [showStopPopup, setShowStopPopup] = useState(false);

    const { isTracking, startTracking, stopTracking, currentLocation } = useLocationTracking(jobId);

    // Map backend status to display labels
    const STATUS_MAP = {
        'accepted': 'Accepted',
        'worker_traveling': 'Traveling',
        'in_progress': 'In Progress',
        'waiting_payment': 'Waiting Payment',
        'completed': 'Finished',
    };

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await api.get(`/api/worker/jobs/${jobId}`);
                const data = res.data;
                const mapped = {
                    id: data.job_id,
                    title: data.title,
                    description: data.description,
                    budget: data.budget,
                    status: STATUS_MAP[data.progress_status] || STATUS_MAP[data.status] || data.status,
                    employerName: data.employer?.name || 'Employer',
                    employerRating: data.employer?.rating || 0,
                    location: data.location?.address || '',
                    employerLocation: data.location ? { lat: data.location.lat, lng: data.location.lng } : null,
                    workerLocation: null,
                };
                setJob(mapped);

                if (mapped.status === 'In Progress' && !isTracking) {
                    startTracking();
                }
            } catch (error) {
                console.error("Failed to load job details:", error);
            } finally {
                setLoading(false);
            }
        };

        if (jobId) {
            fetchJob();
        }
    }, [jobId]);

    const handleStartTravel = async () => {
        try {
            const res = await api.post(`/api/worker/jobs/${jobId}/start-travel`);
            setJob({ ...job, status: 'Traveling' });
        } catch (err) {
            console.error('Start travel failed:', err);
        }
    };

    const handleStartJobClick = () => {
        setShowStartPopup(true);
    };

    const confirmStartJob = async () => {
        setShowStartPopup(false);
        try {
            const res = await api.post(`/api/worker/jobs/${jobId}/start-job`);
            setJob({ ...job, status: 'In Progress' });
            startTracking();
        } catch (err) {
            console.error('Start job failed:', err);
        }
    };

    const handleJobDone = async () => {
        try {
            const res = await api.post(`/api/worker/jobs/${jobId}/complete-job`);
            setJob({ ...job, status: 'Waiting Payment' });
            stopTracking();
            setShowStopPopup(true);
        } catch (err) {
            console.error('Complete job failed:', err);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (!job) {
        return <div className="text-center py-20 text-gray-500 font-bold">Job not found</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-blue-600 mb-2" onClick={() => navigate('/worker/current-jobs')}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to My Jobs
            </Button>

            <ActiveJobDetails job={job} />

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Job Progress</h3>
                <JobProgressBar currentStatus={job.status} />
                <JobActionButtons
                    status={job.status}
                    onStartTravel={handleStartTravel}
                    onStartJob={handleStartJobClick}
                    onJobDone={handleJobDone}
                />
            </div>

            {/* Map - Show when traveling or in progress */}
            {(job.status === 'Traveling' || job.status === 'In Progress') && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                        Live Location Sharing Active
                    </h3>
                    <JobLocationMap
                        employerLocation={job.employerLocation}
                        workerLocation={currentLocation || job.workerLocation}
                    />
                </div>
            )}

            <StartJobLocationPopup
                isOpen={showStartPopup}
                onConfirm={confirmStartJob}
                onCancel={() => setShowStartPopup(false)}
            />

            <StopLocationPopup
                isOpen={showStopPopup}
                onClose={() => setShowStopPopup(false)}
            />
        </div>
    );
};

export default WorkerJobDetailsPage;
