import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronLeft, UserSearch } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { MOCK_APPLICATIONS, MOCK_JOBS } from '../../mocks/applicationData';
import ApplicationFilters from '../../components/employer/ApplicationFilters';
import ApplicationInbox from '../../components/employer/ApplicantsList';
import ApplicationDetail from '../../components/employer/ApplicantsDetail';

const ReviewApplications = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  // Applications list and selected applicant
  const [applications, setApplications] = useState(MOCK_APPLICATIONS);
  const [selected, setSelected] = useState(null);

  // On mobile: true = showing detail panel, false = showing inbox list
  const [showDetail, setShowDetail] = useState(false);

  // Filter state — sync jobId from URL param if present
  const [filters, setFilters] = useState({
    searchQuery: '',
    status: 'all',
    jobId: searchParams.get('jobId') || 'all',
  });

  // Sync jobId filter if URL param changes
  useEffect(() => {
    const urlJobId = searchParams.get('jobId');
    if (urlJobId) setFilters((prev) => ({ ...prev, jobId: urlJobId }));
  }, [searchParams]);

  // Filter applications by search, status and job
  const filteredApps = applications.filter((app) => {
    const matchSearch = app.name.toLowerCase().includes(filters.searchQuery.toLowerCase());
    const matchStatus = filters.status === 'all' || app.status === filters.status;
    const matchJob = filters.jobId === 'all' || app.jobId === filters.jobId;
    return matchSearch && matchStatus && matchJob;
  });

  // Always use latest version of selected application
  const currentApp = applications.find((a) => a.id === selected?.id) || selected;

  // Count applications by status for stats
  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === 'pending').length,
    accepted: applications.filter((a) => a.status === 'accepted').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
  };

  // Update a single filter value
  const handleFilterChange = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  // Reset all filters to default
  const handleClearAll = () =>
    setFilters({ searchQuery: '', status: 'all', jobId: 'all' });

  // On mobile, selecting an applicant also switches to detail view
  const handleSelect = (app) => {
    setSelected(app);
    setShowDetail(true);
  };

  // Mark application as accepted
  const handleHire = (id) => {
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'accepted' } : a)));
    setSelected((prev) => (prev?.id === id ? { ...prev, status: 'accepted' } : prev));
  };

  // Mark application as rejected
  const handleReject = (id) => {
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'rejected' } : a)));
    setSelected((prev) => (prev?.id === id ? { ...prev, status: 'rejected' } : prev));
  };

  return (
    <div className="flex min-h-screen bg-gray-50">

      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 md:p-8 flex flex-col">

          {/* Page header */}
          <div className="mb-4 md:mb-6">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-1">
              {t('reviewApps.title')}
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              {t('reviewApps.subtitle')}
            </p>
          </div>

          {/* Filters — hidden on mobile when viewing detail */}
          <div className={`mb-4 ${showDetail ? 'hidden md:block' : 'block'}`}>
            <ApplicationFilters
              filters={{
                ...filters,
                filteredCount: filteredApps.length,
                totalCount: applications.length,
              }}
              onFilterChange={handleFilterChange}
              onClearAll={handleClearAll}
              jobs={MOCK_JOBS}
            />
          </div>

          {/* Mobile back button — visible only when detail is open */}
          {showDetail && (
            <button
              onClick={() => setShowDetail(false)}
              className="md:hidden flex items-center gap-2 mb-3 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 w-fit shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              {t('reviewApps.back')}
            </button>
          )}

          {/* Split panel — inbox left, detail right */}
          <div className="flex flex-1 rounded-xl border border-gray-200 bg-white overflow-hidden" style={{ minHeight: '600px' }}>

            {/* Inbox — full width on mobile, fixed width on desktop */}
            <div className={`${showDetail ? 'hidden' : 'flex'} md:flex w-full md:w-auto`}>
              <ApplicationInbox
                applications={filteredApps}
                selected={selected}
                stats={stats}
                onSelect={handleSelect}
              />
            </div>

            {/* Detail panel — full width on mobile, flex-1 on desktop */}
            <div className={`${showDetail ? 'flex' : 'hidden'} md:flex flex-1 min-w-0`}>
              {currentApp ? (
                <ApplicationDetail
                  application={currentApp}
                  onHire={handleHire}
                  onReject={handleReject}
                />
              ) : (
                // Empty state — no applicant selected yet
                <div className="flex-1 flex items-center justify-center">
                  <div className="flex flex-col items-center text-center">
                    <UserSearch className="w-14 h-14 text-gray-300 mb-4" />
                    <p className="text-sm font-medium text-gray-500">
                      {t('reviewApps.selectToView')}
                    </p>
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