import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJobDetails, startTravel, startJob, completeJob } from '@/services/jobProgressApi';
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
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);

    const [showStartPopup, setShowStartPopup] = useState(false);
    const [showStopPopup, setShowStopPopup] = useState(false);

    const { isTracking, startTracking, stopTracking, currentLocation } = useLocationTracking(jobId);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const data = await getJobDetails(jobId);
                setJob(data);

                // If job is already in progress, start tracking automatically (in a real app, this would check backend state)
                if (data.status === 'In Progress' && !isTracking) {
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
        const res = await startTravel(jobId);
        setJob({ ...job, status: res.status });
    };

    const handleStartJobClick = () => {
        setShowStartPopup(true);
    };

    const confirmStartJob = async () => {
        setShowStartPopup(false);
        const res = await startJob(jobId);
        setJob({ ...job, status: res.status });
        startTracking();
    };

    const handleJobDone = async () => {
        const res = await completeJob(jobId);
        setJob({ ...job, status: res.status });
        stopTracking();
        setShowStopPopup(true);
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
