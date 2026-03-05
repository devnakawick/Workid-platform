import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronLeft, UserSearch } from 'lucide-react';
import { MOCK_APPLICATIONS, MOCK_JOBS } from '../../mocks/applicationData';
import ApplicationFilters from '../../components/employer/ApplicationFilters';
import ApplicationInbox   from '../../components/employer/ApplicantsList';
import ApplicationDetail  from '../../components/employer/ApplicantsDetail';
import MockSidebar from '../../mocks/MockSidebar';
import MockFooter  from '../../mocks/MockFooter';

const ReviewApplications = () => {
  const [searchParams] = useSearchParams();

  // Applications list and selected applicant
  const [applications, setApplications] = useState(MOCK_APPLICATIONS);
  const [selected, setSelected]         = useState(null);

  // On mobile: true = showing detail panel, false = showing inbox list
  const [showDetail, setShowDetail] = useState(false);

  // Filter state — sync jobId from URL param if present
  const [filters, setFilters] = useState({
    searchQuery: '',
    status:      'all',
    jobId:       searchParams.get('jobId') || 'all',
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
    const matchJob    = filters.jobId  === 'all' || app.jobId  === filters.jobId;
    return matchSearch && matchStatus && matchJob;
  });

  // Always use latest version of selected application
  const currentApp = applications.find((a) => a.id === selected?.id) || selected;

  // Count applications by status for stats
  const stats = {
    total:    applications.length,
    pending:  applications.filter((a) => a.status === 'pending').length,
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
    setSelected((prev)      => (prev?.id === id ? { ...prev, status: 'accepted' } : prev));
  };

  // Mark application as rejected
  const handleReject = (id) => {
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'rejected' } : a)));
    setSelected((prev)      => (prev?.id === id ? { ...prev, status: 'rejected' } : prev));
  };

};

export default ReviewApplications;