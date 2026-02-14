import React, { useState, useEffect } from 'react';
import { Briefcase } from 'lucide-react';
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
import { mockJobs, mockApplications } from '@/lib/mockData';

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
    const [applications, setApplications] = useState(mockApplications);

    const detailedJob = jobId ? mockJobs.find(j => j.id === jobId) : null;

    useEffect(() => {
        if (jobId && !detailedJob) {
            // If ID present but job not found, clear param to show list
            setSearchParams({});
        }
    }, [jobId, detailedJob, setSearchParams]);

    const handleApply = (job) => {
        setSelectedJob(job);
        setShowApplicationForm(true);
    };

    const handleSubmitApplication = (data) => {
        const newApplication = {
            id: String(applications.length + 1),
            job_id: selectedJob.id,
            job_title: selectedJob.title,
            company: selectedJob.company,
            applied_date: new Date().toISOString(),
            status: 'pending',
            cover_message: data.cover_message,
            proposed_rate: data.proposed_rate
        };

        setApplications([...applications, newApplication]);
        setShowApplicationForm(false);
        setSelectedJob(null);
        toast.success(t('applications.withdraw_success')); // Or generic success
    };

    const handleResetFilters = () => {
        setFilters({ location: '', category: 'all', salaryRange: '0' });
        setSearchQuery('');
    };

    const handleBackToList = () => {
        setSearchParams({});
    };

    const filteredJobs = mockJobs.filter(job => {
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
                        isLoading={false}
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
                <div className="mb-6">
                    <JobSearch value={searchQuery} onChange={setSearchQuery} />
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
                    isLoading={false}
                />
            </div>
        </div>
    );
}