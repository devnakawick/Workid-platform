import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronLeft, UserSearch } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast, Toaster } from 'react-hot-toast';

// Application Components
import ApplicationFilters from '../../components/employer/ApplicationFilters';
import ApplicationInbox from '../../components/employer/ApplicantsList';
import ApplicationDetail from '../../components/employer/ApplicantsDetail';

// API Data Imports
import {
  getAllApplicationsAPI,
  updateApplicationStatusAPI,
  MOCK_JOBS
} from '../../mocks/applicationData';

// Wallet API for Escrow
import {
  getEmployerWalletAPI,
  processEscrowAPI
} from '../../mocks/Walletdata';

const ReviewApplications = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  // State
  const [applications, setApplications] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showDetail, setShowDetail] = useState(false); // Mobile view toggle
  const [walletBalance, setWalletBalance] = useState(0);

  // Filter State
  const [filters, setFilters] = useState({
    searchQuery: '',
    status: 'all',
    jobId: searchParams.get('jobId') || 'all',
  });

  // Sync URL params to filters
  useEffect(() => {
    const urlJobId = searchParams.get('jobId');
    if (urlJobId) setFilters((prev) => ({ ...prev, jobId: urlJobId }));
  }, [searchParams]);

  // Initial Data Fetch (Applications & Wallet)
  useEffect(() => {
    const fetchData = async () => {
    
      const appRes = await getAllApplicationsAPI();
      if (appRes.success) {
        setApplications(appRes.data);
      }

      // Load Wallet Balance (for hiring check)
      const walletRes = await getEmployerWalletAPI();
      if (walletRes.success) {
        setWalletBalance(walletRes.data.balance);
      }
    };

    fetchData();
  }, []);

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

  // HIRE LOGIC (WITH ESCROW)
  const handleHireClick = async (id) => {
    const app = applications.find(a => a.id === id);
    if (!app) return;


    const cost = app.rate ? parseFloat(app.rate.replace(/,/g, '')) : 0;

    // CHECK BALANCE
    if (walletBalance < cost) {
      toast.error(`Insufficient Balance! You have LKR ${fmt(walletBalance)} but need LKR ${fmt(cost)}.`);
      return;
    }

    // PROCESS ESCROW TRANSACTION
    const loadingToast = toast.loading("Processing hiring & escrow...");
    const res = await processEscrowAPI(cost, app.name, app.job);

    if (res.success) {
      await updateApplicationStatusAPI(id, 'accepted');

      toast.dismiss(loadingToast);

      setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'accepted' } : a)));
      setSelected((prev) => (prev?.id === id ? { ...prev, status: 'accepted' } : prev));
      setWalletBalance(prev => prev - cost); // Update local balance immediately

      toast.success(`Hired ${app.name}! Funds moved to Escrow.`);
    } else {
      toast.dismiss(loadingToast);
      toast.error(res.error || "Hiring failed");
    }
  };

  // REJECT LOGIC
  const handleRejectClick = async (id) => {
   
    await updateApplicationStatusAPI(id, 'rejected');

  
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'rejected' } : a)));
    setSelected((prev) => (prev?.id === id ? { ...prev, status: 'rejected' } : prev));

    toast.error('Application rejected');
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
              jobs={MOCK_JOBS}
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
            <div className={`${showDetail ? 'flex' : 'hidden'} md:flex flex-1 min-w-0`}>
              {currentApp ? (
                <ApplicationDetail
                  application={currentApp}
                  onHire={handleHireClick}
                  onReject={handleRejectClick}
                />
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
    </div>
  );
};

export default ReviewApplications;