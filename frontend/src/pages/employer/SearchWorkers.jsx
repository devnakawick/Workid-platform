import { useState, useEffect } from 'react';
import { Users, Star, CheckCircle2, UserCheck, Search as SearchIcon } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

// Components
import WorkerCard from '../../components/employer/WorkerCard';
import WorkerFilters from '../../components/employer/WorkerFilters';
import WorkerProfileModal from '../../components/employer/WorkerProfileModal';
import InviteModal from '../../components/employer/InviteModal';

// Mock Data APIs
import { getAllWorkersAPI } from '../../mocks/workerSearchData';
import { getAllJobsAPI } from '../../mocks/jobData';
import { sendInviteAPI } from '../../mocks/applicationData';

const SearchWorkers = () => {
  const { t } = useTranslation();


  // Worker Data
  const [workers, setWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Job Data (Needed for Invite Modal)
  const [jobs, setJobs] = useState([]);

  // Modal State
  const [selectedWorker, setSelectedWorker] = useState(null); // For Profile Modal
  const [inviteModalOpen, setInviteModalOpen] = useState(false); // For Invite Modal
  const [workerToInvite, setWorkerToInvite] = useState(null); // Worker being invited

  // Filter Criteria
  const [filters, setFilters] = useState({
    searchQuery: '',
    availability: 'all',
    category: 'all',
    location: 'all',
    minRating: 'all',
    verified: 'all',
  });



  useEffect(() => {
    fetchWorkers();
    fetchJobs();
  }, []);


  useEffect(() => {
    applyFilters();
  }, [filters, workers]);

  const fetchWorkers = async () => {
    setLoading(true);
    try {
      const result = await getAllWorkersAPI();
      if (result.success) {
        setWorkers(result.data);
        setFilteredWorkers(result.data);
      } else {
        toast.error(t('searchWorkers.errors.fetchFailed') || "Failed to load workers");
      }
    } catch {
      toast.error(t('searchWorkers.errors.generic') || "Error loading data");
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      const result = await getAllJobsAPI();
      if (result.success) {
        setJobs(result.data);
      }
    } catch (error) {
      console.error("Failed to load jobs for invite", error);
    }
  };



  const applyFilters = () => {
    let f = [...workers];

    // Filter by specific dropdowns
    if (filters.availability !== 'all') f = f.filter(w => w.availability === filters.availability);
    if (filters.category !== 'all') f = f.filter(w => w.category === filters.category);
    if (filters.location !== 'all') f = f.filter(w => w.location.includes(filters.location));
    if (filters.minRating !== 'all') f = f.filter(w => w.rating >= Number(filters.minRating));
    if (filters.verified !== 'all') f = f.filter(w => String(w.verified) === filters.verified);

    // Filter by search text (Name, Skill, Location, Category)
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      f = f.filter(w =>
        w.name.toLowerCase().includes(q) ||
        w.skills.some(s => s.toLowerCase().includes(q)) ||
        w.location.toLowerCase().includes(q) ||
        w.category.toLowerCase().includes(q)
      );
    }
    setFilteredWorkers(f);
  };

  const handleFilterChange = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));

  const clearAllFilters = () => setFilters({
    searchQuery: '', availability: 'all', category: 'all',
    location: 'all', minRating: 'all', verified: 'all'
  });



  const handleInviteClick = (worker) => {
    setWorkerToInvite(worker);
    setInviteModalOpen(true);
  };

  const handleSendInvite = async (jobId) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job || !workerToInvite) return;

    // Send invite to mock API (Adds to 'Invited' list, hidden from Review list)
    await sendInviteAPI(jobId, workerToInvite);


  };

  const handleCloseInvite = () => {
    setInviteModalOpen(false);
    setWorkerToInvite(null);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        <Toaster position="top-right" />

        {/* --- HEADER & STATS --- */}
        <div className="mb-8">
          <div className="mb-6">
            <h1 className="flex items-center text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              <SearchIcon className="w-8 h-8 md:w-10 md:h-10 mr-3 text-blue-600" />
              {t('searchWorkers.title') || "Find Workers"}
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              {t('searchWorkers.subtitle') || "Browse and invite top talent for your jobs"}
            </p>
          </div>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600"><Users className="w-5 h-5" /></div>
              <div><p className="text-xs text-gray-500 font-medium">Total</p><p className="text-xl font-bold">{workers.length}</p></div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600"><UserCheck className="w-5 h-5" /></div>
              <div><p className="text-xs text-gray-500 font-medium">Available</p><p className="text-xl font-bold">{workers.filter(w => w.availability === 'available').length}</p></div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600"><CheckCircle2 className="w-5 h-5" /></div>
              <div><p className="text-xs text-gray-500 font-medium">Verified</p><p className="text-xl font-bold">{workers.filter(w => w.verified).length}</p></div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600"><Star className="w-5 h-5" /></div>
              <div><p className="text-xs text-gray-500 font-medium">Top Rated</p><p className="text-xl font-bold">{workers.filter(w => w.rating >= 4.5).length}</p></div>
            </div>
          </div>

          <WorkerFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearAll={clearAllFilters}
            workersCount={filteredWorkers.length}
            totalWorkersCount={workers.length}
          />
        </div>


        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 border-4 border-gray-100 border-t-blue-600 rounded-full animate-spin mb-4" />
            <p className="text-gray-500">{t('searchWorkers.loading') || "Loading..."}</p>
          </div>
        ) : filteredWorkers.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
            <SearchIcon className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('searchWorkers.empty.title') || "No workers found"}</h3>
            <p className="text-gray-500 mb-6">{t('searchWorkers.empty.subtitle') || "Try adjusting your filters"}</p>
            <button onClick={clearAllFilters} className="px-5 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredWorkers.map(worker => (
              <WorkerCard
                key={worker.id}
                worker={worker}
                onViewProfile={setSelectedWorker}
                onInvite={() => handleInviteClick(worker)}
              />
            ))}
          </div>
        )}
      </div>

      {/*MODALS*/}

      {selectedWorker && (
        <WorkerProfileModal
          worker={selectedWorker}
          onClose={() => setSelectedWorker(null)}
          onInvite={() => {
            setSelectedWorker(null);
            handleInviteClick(selectedWorker);
          }}
        />
      )}

      {workerToInvite && (
        <InviteModal
          isOpen={inviteModalOpen}
          onClose={handleCloseInvite}
          worker={workerToInvite}
          jobs={jobs}
          onSend={handleSendInvite}
        />
      )}
    </>
  );
};

export default SearchWorkers;