import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Plus, Clock, HourglassIcon, CheckCircle2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { getAllJobsAPI, deleteJobAPI }  from '../../mocks/jobData';
import { getAllApplicationsAPI }   from '../../mocks/applicationData';
import MockSidebar from '../../mocks/MockSidebar';
import MockFooter from '../../mocks/MockFooter';
import JobCard from '../../components/employer/ManageJobCard';
import JobFilters from '../../components/employer/ManageJobFilters';
import DeleteConfirmModal from '../../components/employer/DeleteConfirmModal';
import EmptyState from '../../components/employer/EmptyState';

// ManageJobs page - employer can view, filter and delete their posted jobs
const ManageJobs = () => {
  const navigate = useNavigate();

  const [jobs,          setJobs]          = useState([]);
  const [filteredJobs,  setFilteredJobs]  = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [locations,     setLocations]     = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting,      setDeleting]      = useState(false);

  // Filter state - all filters start at default values
  const [filters, setFilters] = useState({
    searchQuery: '', status: 'all', category: 'all',
    location: 'all', minSalary: '', maxSalary: '', dateFilter: 'all'
  });

  // Statistics calculated from jobs list
  const statistics = {
    total:      jobs.length,
    open:       jobs.filter(j => j.status === 'open').length,
    inProgress: jobs.filter(j => j.status === 'in-progress').length,
    completed:  jobs.filter(j => j.status === 'completed').length,
  };

  useEffect(() => { fetchJobs(); }, []);

  // Extract unique locations from jobs list
  useEffect(() => {
    setLocations([...new Set(jobs.map(j => j.location.split(',')[0].trim()))].sort());
  }, [jobs]);

  useEffect(() => { filterJobs(); }, [filters, jobs]);

  // Fetch jobs and real application counts together
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const [jobsResult, appsResult] = await Promise.all([getAllJobsAPI(), getAllApplicationsAPI()]);
      if (jobsResult.success && appsResult.success) {
        // Attach real application count to each job
        setJobs(jobsResult.data.map(job => ({
          ...job,
          applicationsCount: appsResult.data.filter(app => app.jobId === job.id).length
        })));
      } else toast.error('Failed to fetch jobs');
    } catch { toast.error('An error occurred'); }
    finally  { setLoading(false); }
  };

  // Apply all active filters to jobs list
  const filterJobs = () => {
    let f = [...jobs];
    if (filters.status   !== 'all') f = f.filter(j => j.status   === filters.status);
    if (filters.category !== 'all') f = f.filter(j => j.category === filters.category);
    if (filters.location !== 'all') f = f.filter(j => j.location.split(',')[0].trim() === filters.location);
    if (filters.minSalary !== '')   f = f.filter(j => j.salary >= Number(filters.minSalary));
    if (filters.maxSalary !== '')   f = f.filter(j => j.salary <= Number(filters.maxSalary));

    // Date range filter
    if (filters.dateFilter && filters.dateFilter !== 'all') {
      const now = new Date(); now.setHours(0,0,0,0);
      f = f.filter(j => {
        const d = new Date(j.postedDate); d.setHours(0,0,0,0);
        const diff = Math.floor((now - d) / 86400000);
        if (filters.dateFilter === 'today') return diff === 0;
        if (filters.dateFilter === '7')     return diff >= 0 && diff <= 7;
        if (filters.dateFilter === '30')    return diff >= 0 && diff <= 30;
        if (filters.dateFilter === '90')    return diff >= 0 && diff <= 90;
        return true;
      });
    }

    // Search query filter
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      f = f.filter(j =>
        j.title.toLowerCase().includes(q)    ||
        j.category.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q)
      );
    }
    setFilteredJobs(f);
  };

  const handleFilterChange = (name, value) => setFilters(prev => ({ ...prev, [name]: value }));
  const clearAllFilters    = () => setFilters({ searchQuery: '', status: 'all', category: 'all', location: 'all', minSalary: '', maxSalary: '', dateFilter: 'all' });
  const hasActiveFilters   = () =>
    filters.status !== 'all' || filters.category !== 'all' || filters.location !== 'all' ||
    filters.minSalary !== '' || filters.maxSalary !== ''   ||
    (filters.dateFilter && filters.dateFilter !== 'all')   ||
    filters.searchQuery.trim() !== '';

  // Delete job after confirmation
  const confirmDelete = async () => {
    setDeleting(true);
    try {
      const result = await deleteJobAPI(deleteConfirm);
      if (result.success) {
        setJobs(prev => prev.filter(j => j.id !== deleteConfirm));
        toast.success(result.message);
      } else toast.error(result.error || 'Failed to delete job');
    } catch { toast.error('An error occurred'); }
    finally  { setDeleting(false); setDeleteConfirm(null); }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <MockSidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-4 md:p-8">
          <Toaster position="top-right" />
          <div className="max-w-7xl mx-auto">

            <div className="mb-8">

              {/* Page header and post job button */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                  <h1 className="flex items-center text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    <Briefcase className="w-8 h-8 md:w-10 md:h-10 mr-3 text-blue-600" />
                    My Jobs
                  </h1>
                  <p className="text-gray-600 text-sm md:text-base">Manage and track all your posted jobs.</p>
                </div>
                <button onClick={() => navigate('/employer/jobs/new')}
                  className="flex items-center justify-center w-full md:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-base font-semibold shadow-md transition-all">
                  <Plus className="w-5 h-5 mr-2" />Post New Job
                </button>
              </div>

              {/* Statistics cards — click to filter by status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Total Jobs',  value: statistics.total,      icon: Briefcase,     color: 'blue',   status: null          },
                  { label: 'Open Jobs',   value: statistics.open,       icon: Clock,         color: 'green',  status: 'open'        },
                  { label: 'In Progress', value: statistics.inProgress, icon: HourglassIcon, color: 'yellow', status: 'in-progress' },
                  { label: 'Completed',   value: statistics.completed,  icon: CheckCircle2,  color: 'purple', status: 'completed'   },
                ].map(({ label, value, icon: Icon, color, status }) => (
                  <div key={label}
                    onClick={() => status && handleFilterChange('status', status)}
                    className={`bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow ${status ? 'cursor-pointer' : ''}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 bg-${color}-100 rounded-lg flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 text-${color}-600`} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">{label}</p>
                        <p className="text-2xl font-bold text-gray-900">{value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Filters component */}
              <JobFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearAll={clearAllFilters}
                locations={locations}
                jobsCount={filteredJobs.length}
                totalJobsCount={jobs.length}
              />
            </div>

            {/* Jobs list — loading, empty state or job cards */}
            <div className="space-y-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-md">
                  <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4" />
                  <p className="text-gray-600">Loading your jobs...</p>
                </div>
              ) : filteredJobs.length === 0 ? (
                <EmptyState
                  hasFilters={hasActiveFilters()}
                  onClearFilters={clearAllFilters}
                  onPostJob={() => navigate('/employer/jobs/new')}
                />
              ) : (
                filteredJobs.map(job => (
                  <JobCard key={job.id} job={job}
                    
                    onEdit={(id) => navigate(`/employer/jobs/edit/${id}`)}
                    onDelete={setDeleteConfirm}
                    onViewApplications={(id) => navigate(`/employer/applications/${id}`)}
                  />
                ))
              )}
            </div>

          </div>
        </main>
        <MockFooter />
      </div>

      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <DeleteConfirmModal
          onConfirm={confirmDelete}
          onCancel={() => setDeleteConfirm(null)}
          loading={deleting}
        />
      )}
    </div>
  );
};

export default ManageJobs;