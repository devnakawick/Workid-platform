import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronLeft, UserSearch, Star, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast, Toaster } from 'react-hot-toast';

// Application Components
import ApplicationFilters from '../../components/employer/ApplicationFilters';
import ApplicationInbox from '../../components/employer/ApplicantsList';
import ApplicationDetail from '../../components/employer/ApplicantsDetail';

// Real API
import { employerService } from '../../services/employerService';

const ReviewApplications = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  // State
  const [applications, setApplications] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showDetail, setShowDetail] = useState(false); // Mobile view toggle
  const [walletBalance, setWalletBalance] = useState(0);
  const [rateModal, setRateModal] = useState(null); // { jobId, workerName }
  const [rateValue, setRateValue] = useState(0);
  const [hoverRate, setHoverRate] = useState(0);
  const [rateReview, setRateReview] = useState('');
  const [rateLoading, setRateLoading] = useState(false);

  // Filter State
  const [filters, setFilters] = useState({
    searchQuery: '',
    status: 'all',
    jobId: searchParams.get('jobId') || 'all',
  });

  const [myJobs, setMyJobs] = useState([]);

  // Sync URL params to filters
  useEffect(() => {
    const urlJobId = searchParams.get('jobId');
    if (urlJobId) setFilters((prev) => ({ ...prev, jobId: urlJobId }));
  }, [searchParams]);

  // Fetch employer's jobs, then fetch applications for each
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Get employer's jobs
        const jobsRes = await employerService.getMyJobs();
        const jobs = jobsRes.data || [];
        setMyJobs(jobs.map(j => ({ id: String(j.id), title: j.title, budget: Number(j.budget) || 0, status: j.status, location: j.city || '' })));

        // 2. For each job, fetch applications
        const allApps = [];
        for (const job of jobs) {
          try {
            const appsRes = await employerService.getJobApplications(job.id);
            const apps = appsRes.data || [];
            apps.forEach(app => {
              const name = app.worker_name || 'Worker';
              const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
              allApps.push({
                id: app.id,
                jobId: String(app.job_id),
                name: name,
                initials: initials,
                verified: false,
                status: app.status,
                job: job.title,
                skills: [],
                rating: app.worker_rating || 0,
                jobs: 0,
                rate: String(Number(job.budget) || 0),
                appliedDate: app.applied_at ? new Date(app.applied_at).toLocaleDateString() : '',
                appliedAgo: app.applied_at ? getTimeAgo(app.applied_at) : '',
                bio: app.cover_letter || 'No message provided.',
                location: '',
                age: '-',
                phone: '',
                completionRate: 0,
                responseTime: '-',
                memberSince: '-',
                isInvited: false,
                reviews: [],
              });
            });
          } catch (e) {
            // Skip jobs with no applications endpoint access
          }
        }
        setApplications(allApps);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        toast.error('Failed to load applications');
      }
    };

    fetchData();
  }, []);

  // Helper: relative time
  function getTimeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }

  // Filter Logic
  const filteredApps = applications.filter((app) => {
    const matchSearch = app.name.toLowerCase().includes(filters.searchQuery.toLowerCase());
    const matchStatus = filters.status === 'all' || app.status === filters.status;
    const matchJob = filters.jobId === 'all' || app.jobId === filters.jobId;
    return matchSearch && matchStatus && matchJob;
  });

  const currentApp = applications.find((a) => a.id === selected?.id) || selected;

  // Stats Calculation
  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === 'pending').length,
    accepted: applications.filter((a) => a.status === 'accepted').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
  };

  const fmt = (n) => (Number(n) || 0).toLocaleString('en-LK', { minimumFractionDigits: 2 });

  // HANDLERS

  const handleFilterChange = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const handleClearAll = () =>
    setFilters({ searchQuery: '', status: 'all', jobId: 'all' });

  const handleSelect = (app) => {
    setSelected(app);
    setShowDetail(true);
  };

  // HIRE LOGIC - Accept application via real API
  const handleHireClick = async (id) => {
    const app = applications.find(a => a.id === id);
    if (!app) return;

    const loadingToast = toast.loading('Accepting application...');
    try {
      await employerService.acceptApplication(id);
      toast.dismiss(loadingToast);

      setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'accepted' } : a)));
      setSelected((prev) => (prev?.id === id ? { ...prev, status: 'accepted' } : prev));
      toast.success(`Hired ${app.name}!`);
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error('Accept failed:', err);
      toast.error(err.response?.data?.detail || 'Failed to accept application');
    }
  };

  // REJECT LOGIC
  const handleRejectClick = async (id) => {
    try {
      await employerService.rejectApplication(id);
      setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'rejected' } : a)));
      setSelected((prev) => (prev?.id === id ? { ...prev, status: 'rejected' } : prev));
      toast.error('Application rejected');
    } catch (err) {
      console.error('Reject failed:', err);
      toast.error(err.response?.data?.detail || 'Failed to reject application');
    }
  };

  const handleRateSubmit = async () => {
    if (!rateModal || rateValue === 0) return;
    setRateLoading(true);
    try {
      await employerService.rateWorker(rateModal.jobId, rateValue, rateReview || null);
      toast.success(`Rated ${rateModal.workerName} ${rateValue} ⭐`);
      setRateModal(null);
      setRateValue(0);
      setRateReview('');
    } catch (err) {
      console.error('Rate failed:', err);
      toast.error(err.response?.data?.detail || 'Failed to submit rating');
    } finally {
      setRateLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 md:p-6 lg:p-8 flex flex-col">
          <Toaster position="top-right" />

          {/* Page Header */}
          <div className="mb-4 md:mb-6">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-1">{t('reviewApps.title', 'Review Applications')}</h1>
            <p className="text-gray-600 text-sm md:text-base">{t('reviewApps.subtitle', 'Review and manage worker applications for your jobs')}</p>
          </div>

          {/* Filters - Hidden on mobile detailed view */}
          <div className={`mb-4 ${showDetail ? 'hidden md:block' : 'block'}`}>
            <ApplicationFilters
              filters={{ ...filters, filteredCount: filteredApps.length, totalCount: applications.length }}
              onFilterChange={handleFilterChange}
              onClearAll={handleClearAll}
              jobs={myJobs}
            />
          </div>

          {/* Mobile Back Button */}
          {showDetail && (
            <button
              onClick={() => setShowDetail(false)}
              className="md:hidden flex items-center gap-2 mb-3 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 w-fit shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" /> {t('reviewApps.back', 'Back to Applicants')}
            </button>
          )}

          {/* Main Content Area */}
          <div className="flex flex-1 rounded-xl border border-gray-200 bg-white overflow-hidden" style={{ minHeight: '600px' }}>

            {/* INBOX LIST */}
            <div className={`${showDetail ? 'hidden' : 'flex'} md:flex w-full md:w-auto`}>
              <ApplicationInbox
                applications={filteredApps}
                selected={selected}
                stats={stats}
                onSelect={handleSelect}
              />
            </div>

            {/* DETAIL VIEW */}
            <div className={`${showDetail ? 'flex' : 'hidden'} md:flex flex-1 min-w-0 flex-col`}>
              {currentApp ? (
                <>
                  <ApplicationDetail
                    application={currentApp}
                    onHire={handleHireClick}
                    onReject={handleRejectClick}
                  />
                  {/* Rate Worker button - only for accepted applications that have a jobId */}
                  {currentApp.status === 'accepted' && currentApp.jobId && (
                    <div className="px-6 pb-5 flex-shrink-0">
                      <button
                        onClick={() => setRateModal({ jobId: currentApp.jobId, workerName: currentApp.name })}
                        className="flex items-center gap-2 px-5 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-xl font-bold text-sm transition-all"
                      >
                        <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                        Rate Worker
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="flex flex-col items-center text-center">
                    <UserSearch className="w-14 h-14 text-gray-300 mb-4" />
                    <p className="text-sm font-medium text-gray-500">{t('reviewApps.selectToView', 'Select an applicant to view their profile')}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Rate Worker Modal */}
      {rateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Rate {rateModal.workerName}</h2>
              <button onClick={() => { setRateModal(null); setRateValue(0); setRateReview(''); }} className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Star Picker */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRateValue(star)}
                  onMouseEnter={() => setHoverRate(star)}
                  onMouseLeave={() => setHoverRate(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-10 h-10 transition-colors ${
                      star <= (hoverRate || rateValue)
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-gray-100 text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-center text-sm text-gray-500 mb-5">
              {rateValue === 0 ? 'Select a rating' : `${rateValue} star${rateValue > 1 ? 's' : ''}`}
            </p>

            {/* Optional review message */}
            <textarea
              value={rateReview}
              onChange={(e) => setRateReview(e.target.value)}
              placeholder="Leave an optional review message..."
              rows={3}
              className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-300 resize-none mb-6"
            />

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => { setRateModal(null); setRateValue(0); setRateReview(''); }}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleRateSubmit}
                disabled={rateValue === 0 || rateLoading}
                className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                <Star className="w-4 h-4 fill-white text-white" />
                {rateLoading ? 'Submitting...' : 'Submit Rating'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewApplications;