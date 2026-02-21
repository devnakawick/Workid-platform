import { useState } from 'react';
import { Search, Filter, X, ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import { categories } from '../../mocks/jobData';

const MAX_SALARY = 100000;

// Filters component — search and filter jobs list
const ManageJobFilters = ({ filters, onFilterChange, onClearAll, locations, jobsCount, totalJobsCount }) => {
  const [showFilters, setShowFilters] = useState(false);

  // Labels for status and date filter dropdowns
  const labels = {
    status: { all: 'All Jobs', open: 'Open', 'in-progress': 'In Progress', completed: 'Completed' },
    date:   { all: 'All Time', today: 'Today', '7': 'Last 7 Days', '30': 'Last 30 Days', '90': 'Last 3 Months' }
  };

  // Count how many filters are active
  const activeCount = [
    filters.status !== 'all',
    filters.category !== 'all',
    filters.location !== 'all',
    filters.minSalary !== '' || filters.maxSalary !== '',
    filters.dateFilter && filters.dateFilter !== 'all'
  ].filter(Boolean).length;

  const hasActive = activeCount > 0 || filters.searchQuery.trim() !== '';

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-4">

      {/* Search bar and filter toggle button */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" value={filters.searchQuery}
            onChange={(e) => onFilterChange('searchQuery', e.target.value)}
            placeholder="Search by job title..."
            className="w-full py-2.5 px-4 pl-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <button onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap ${
            activeCount > 0 ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}>
          <Filter className="w-4 h-4" />
          Filters
          {/* Show active filter count badge */}
          {activeCount > 0 && (
            <span className="min-w-[20px] h-5 px-1.5 bg-white text-blue-600 rounded-full text-xs font-bold flex items-center justify-center">
              {activeCount}
            </span>
          )}
          {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Results count */}
      <div className="text-sm pt-2 border-t border-gray-200 text-gray-600">
        Showing <span className="font-bold text-gray-900">{jobsCount}</span> of <span className="font-bold text-gray-900">{totalJobsCount}</span> jobs
      </div>
    </div>
  );
};

export default ManageJobFilters;