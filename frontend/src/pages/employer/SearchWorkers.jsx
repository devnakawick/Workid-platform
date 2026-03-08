import { useState, useEffect } from 'react';
import { Users, Star, CheckCircle2, UserSearch, UserCheck } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

import MockSidebar        from '../../mocks/MockSidebar';
import MockFooter         from '../../mocks/MockFooter';
import WorkerCard         from '../../components/employer/WorkerCard';
import WorkerFilters      from '../../components/employer/WorkerFilters';
import WorkerProfileModal from '../../components/employer/WorkerProfileModal';
import { getAllWorkersAPI } from '../../mocks/workerSearchData';

const SearchWorkers = () => {

  // Workers list and filtered results
  const [workers,         setWorkers]         = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [loading,         setLoading]         = useState(true);

  // Selected worker for profile modal
  const [selectedWorker, setSelectedWorker] = useState(null);

  // Filter state
  const [filters, setFilters] = useState({
    searchQuery:  '',
    availability: 'all',
    category:     'all',
    location:     'all',
    minRating:    'all',
    verified:     'all',
  });

  // Stats derived from full workers list
  const statistics = {
    total:     workers.length,
    available: workers.filter(w => w.availability === 'available').length,
    verified:  workers.filter(w => w.verified).length,
    topRated:  workers.filter(w => w.rating >= 4.5).length,
  };

  // Load workers on mount
  useEffect(() => { fetchWorkers(); }, []);

  // Re-apply filters when filters or workers change
  useEffect(() => { applyFilters(); }, [filters, workers]);

  // Fetch all workers from mock API
  const fetchWorkers = async () => {
    setLoading(true);
    try {
      const result = await getAllWorkersAPI();
      if (result.success) {
        setWorkers(result.data);
      } else {
        toast.error('Failed to load workers');
      }
    } catch {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Apply all active filters to the workers list
  const applyFilters = () => {
    let f = [...workers];

    if (filters.availability !== 'all')
      f = f.filter(w => w.availability === filters.availability);

    if (filters.category !== 'all')
      f = f.filter(w => w.category === filters.category);

    if (filters.location !== 'all')
      f = f.filter(w => w.location.includes(filters.location));

    if (filters.minRating !== 'all')
      f = f.filter(w => w.rating >= Number(filters.minRating));

    if (filters.verified !== 'all')
      f = f.filter(w => String(w.verified) === filters.verified);

    // Search by name, skill, location or category
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      f = f.filter(w =>
        w.name.toLowerCase().includes(q)              ||
        w.skills.some(s => s.toLowerCase().includes(q)) ||
        w.location.toLowerCase().includes(q)          ||
        w.category.toLowerCase().includes(q)
      );
    }

    setFilteredWorkers(f);
  };

  // Update a single filter value
  const handleFilterChange = (key, value) =>
    setFilters(prev => ({ ...prev, [key]: value }));

  // Reset all filters to default
  const clearAllFilters = () =>
    setFilters({ searchQuery: '', availability: 'all', category: 'all', location: 'all', minRating: 'all', verified: 'all' });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <MockSidebar />

      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-4 md:p-8">
          <Toaster position="top-right" />

          <div className="max-w-7xl mx-auto">

            {/* Page header */}
            <div className="mb-8">
              <div className="mb-6">
                <h1 className="flex items-center text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  <UserSearch className="w-8 h-8 md:w-10 md:h-10 mr-3 text-blue-600" />
                  Find Workers
                </h1>
                <p className="text-gray-600 text-sm md:text-base">
                  Browse and connect with skilled workers available in your area.
                </p>
              </div>

              {/* Statistics cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Total Workers',    value: statistics.total,     icon: Users,        color: 'gray'   },
                  { label: 'Available Now',    value: statistics.available, icon: UserCheck, color: 'green'  },
                  { label: 'Verified Workers', value: statistics.verified,  icon: CheckCircle2, color: 'blue' },
                  { label: 'Top Rated (4.5+)', value: statistics.topRated,  icon: Star,         color: 'yellow' },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="bg-white rounded-xl p-4 md:p-5 shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 md:w-12 md:h-12 bg-${color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-5 h-5 md:w-6 md:h-6 text-${color}-600`} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs md:text-sm text-gray-600 font-medium truncate">{label}</p>
                        <p className="text-xl md:text-2xl font-bold text-gray-900">{value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Filter bar */}
              <WorkerFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearAll={clearAllFilters}
                workersCount={filteredWorkers.length}
                totalWorkersCount={workers.length}
              />
            </div>

            {/* Loading spinner */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-md">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4" />
                <p className="text-gray-600">Loading workers...</p>
              </div>

            ) : filteredWorkers.length === 0 ? (
              // Empty state — no workers match filters
              <div className="text-center py-16 bg-white rounded-2xl shadow-md">
                <UserSearch className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No workers found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
                <button
                  onClick={clearAllFilters}
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-red-800 text-red-600 rounded-lg text-base font-semibold hover:bg-red-800 hover:text-white shadow-md transition-all duration-200"
                >
                  Clear All Filters
                </button>
              </div>

            ) : (
              // Worker cards grid
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredWorkers.map(worker => (
                  <WorkerCard
                    key={worker.id}
                    worker={worker}
                    onViewProfile={setSelectedWorker}
                  />
                ))}
              </div>
            )}

          </div>
        </main>

        <MockFooter />
      </div>

      {/* Worker profile modal — opens when a card is clicked */}
      {selectedWorker && (
        <WorkerProfileModal
          worker={selectedWorker}
          onClose={() => setSelectedWorker(null)}
        />
      )}
    </div>
  );
};

export default SearchWorkers;