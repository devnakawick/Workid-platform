import React, { useState, useEffect, useCallback } from 'react';
import { Briefcase, Sparkles, Loader2 } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import JobCard from '../components/jobs/JobCard';
import JobFilters, { SALARY_RANGES } from '../components/jobs/JobFilters';
import JobSearch from '../components/jobs/JobSearch';
import ApplicationForm from '../components/jobs/ApplicationForm';
import JobDetails from '../components/jobs/JobDetails';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { jobService } from '../services/jobService';
import { aiService } from '../services/aiService';

export default function Jobs() {
    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    const jobId = searchParams.get('id');

    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        location: '',
        category: 'all',
        salaryRange: '0'
    });
    const [selectedJob, setSelectedJob] = useState(null);
    const [showApplicationForm, setShowApplicationForm] = useState(false);
    const [appliedJobIds, setAppliedJobIds] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [detailedJob, setDetailedJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applyLoading, setApplyLoading] = useState(false);
    const [smartSearchLoading, setSmartSearchLoading] = useState(false);

    // Map backend job to frontend shape
    const mapJob = (job) => ({
        id: String(job.id),
        title: job.title,
        description: job.description || '',
        company: job.employer?.full_name || 'Employer',
        location: `${job.city || ''}, ${job.district || ''}`,
        job_type: job.payment_type || 'fixed',
        salary: Number(job.budget) || 0,
        duration: job.estimated_duration_hours ? `${job.estimated_duration_hours}h` : '-',
        category: job.category,
        urgency: job.urgency,
        status: job.status,
        posted_date: job.created_at,
        applications_count: job.applications_count || 0,
    });

    // Fetch jobs from API
    const fetchJobs = useCallback(async () => {
        setLoading(true);
        try {
            const res = await jobService.getJobs();
            const data = res.data?.jobs || res.data || [];
            setJobs(Array.isArray(data) ? data.map(mapJob) : []);
        } catch (err) {
            console.error('Failed to fetch jobs:', err);
            toast.error('Failed to load jobs');
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch applications to know which jobs were applied to
    const fetchMyApplications = useCallback(async () => {
        try {
            const res = await jobService.getMyApplications();
            const apps = res.data || [];
            setAppliedJobIds(apps.map(a => String(a.job_id)));
        } catch {
            // Worker may not be logged in or no profile yet
        }
    }, []);

    useEffect(() => {
        fetchJobs();
        fetchMyApplications();
    }, [fetchJobs, fetchMyApplications]);

    // Fetch job detail when jobId changes
    useEffect(() => {
        if (jobId) {
            jobService.getJobById(jobId)
                .then(res => setDetailedJob(mapJob(res.data)))
                .catch(() => {
                    setSearchParams({});
                    setDetailedJob(null);
                });
        } else {
            setDetailedJob(null);
        }
    }, [jobId, setSearchParams]);

    const handleApply = (job) => {
        setSelectedJob(job);
        setShowApplicationForm(true);
    };

    const handleSubmitApplication = async (data) => {
        if (!selectedJob) return;
        setApplyLoading(true);
        try {
            await jobService.applyToJob(selectedJob.id, {
                message: data.cover_message || null,
                proposed_rate: data.proposed_rate ? Number(data.proposed_rate) : null,
            });
            setAppliedJobIds(prev => [...prev, selectedJob.id]);
            setShowApplicationForm(false);
            setSelectedJob(null);
            toast.success(t('applications.apply_success', 'Application submitted!'));
        } catch (err) {
            console.error('Apply error:', err);
            const msg = err.response?.data?.detail || 'Failed to apply';
            toast.error(typeof msg === 'string' ? msg : JSON.stringify(msg));
        } finally {
            setApplyLoading(false);
        }
    };

    const handleSmartSearch = async () => {
        if (!searchQuery.trim()) {
            toast.error("Please enter a search query first.");
            return;
        }
        setSmartSearchLoading(true);
        try {
            const res = await aiService.executeSearch({ q: searchQuery });
            const data = res.data?.jobs || res.data || [];
            if (data.length > 0) {
                setJobs(Array.isArray(data) ? data.map(mapJob) : []);
                toast.success('AI smartly filtered jobs for you!');
            } else {
                toast.error('No smart matches found. Try different terms.');
            }
        } catch (err) {
            console.error('Smart search failed', err);
            toast.error('Smart search failed.');
        } finally {
            setSmartSearchLoading(false);
        }
    };

    const handleResetFilters = () => {
        setFilters({ location: '', category: 'all', salaryRange: '0' });
        setSearchQuery('');
        fetchJobs(); // Re-fetch all jobs to reset AI search
    };

    const handleBackToList = () => {
        setSearchParams({});
    };

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = !searchQuery ||
            job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.location?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesLocation = !filters.location ||
            job.location?.toLowerCase().includes(filters.location.toLowerCase());

        const matchesCategory = filters.category === 'all' || job.category?.toLowerCase() === filters.category?.toLowerCase();

        const salaryRange = SALARY_RANGES[parseInt(filters.salaryRange)];
        const matchesSalary = !salaryRange || (
            (job.salary >= salaryRange.min) &&
            (job.salary <= salaryRange.max)
        );

        return matchesSearch && matchesLocation && matchesCategory && matchesSalary;
    });

    if (detailedJob) {
        return (
            <div className="bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <JobDetails
                        job={detailedJob}
                        onBack={handleBackToList}
                        onApply={handleApply}
                        isApplied={appliedJobIds.includes(detailedJob.id)}
                    />

                    {/* Application Form Modal reused */}
                    <ApplicationForm
                        job={selectedJob || detailedJob}
                        isOpen={showApplicationForm}
                        onClose={() => {
                            setShowApplicationForm(false);
                            // Keep selectedJob null if triggered from details view directly? 
                            // Actually handleApply sets selectedJob so we are good.
                            if (!selectedJob) setSelectedJob(null);
                        }}
                        onSubmit={handleSubmitApplication}
                        isLoading={applyLoading}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('jobs.title')}</h1>
                    <p className="text-gray-600">{t('jobs.subtitle')}</p>
                </div>

                {/* Search */}
                <div className="mb-6 flex gap-3">
                    <div className="flex-1">
                        <JobSearch value={searchQuery} onChange={setSearchQuery} />
                    </div>
                    <Button 
                        onClick={handleSmartSearch} 
                        disabled={smartSearchLoading} 
                        className="bg-indigo-600 hover:bg-indigo-700 h-12 px-6 flex items-center gap-2 text-base font-bold text-white shadow-sm border border-transparent"
                    >
                        {smartSearchLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 text-indigo-200" />}
                        <span className="hidden sm:inline">Smart AI Search</span>
                    </Button>
                </div>

                {/* Filters */}
                <JobFilters
                    filters={filters}
                    onFilterChange={setFilters}
                    onReset={handleResetFilters}
                />

                {/* Results Count */}
                <div className="flex items-center justify-between mb-6 bg-white rounded-lg px-4 py-3 border border-gray-200">
                    <p className="text-sm font-medium text-gray-700">
                        <span className="text-indigo-600 font-semibold">
                            {t('jobs.jobsFound', { count: filteredJobs.length })}
                        </span>
                    </p>
                </div>

                {/* Jobs Grid */}
                {filteredJobs.length === 0 ? (
                    <div className="text-center py-20">
                        <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('jobs.noJobs')}</h3>
                        <p className="text-gray-600 mb-4">{t('jobs.adjustFilters')}</p>
                        <Button onClick={handleResetFilters} variant="outline">
                            {t('jobs.clearFilters')}
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {filteredJobs.map((job) => (
                                <JobCard
                                    key={job.id}
                                    job={job}
                                    onApply={handleApply}
                                    isApplied={appliedJobIds.includes(job.id)}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                )}

                {/* Application Form Modal */}
                <ApplicationForm
                    job={selectedJob}
                    isOpen={showApplicationForm}
                    onClose={() => {
                        setShowApplicationForm(false);
                        setSelectedJob(null);
                    }}
                    onSubmit={handleSubmitApplication}
                    isLoading={applyLoading}
                />
            </div>
        </div>
    );
}