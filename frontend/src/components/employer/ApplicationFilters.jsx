import { useState } from 'react';
import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';

const ApplicationFilters = ({ filters, onFilterChange, onClearAll, jobs }) => {
  const [showFilters, setShowFilters] = useState(false);

  // Count how many filters are active
  const activeCount = [
    filters.status !== 'all',
    filters.jobId  !== 'all',
  ].filter(Boolean).length;

  const hasActive = activeCount > 0 || filters.searchQuery?.trim() !== '';

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 space-y-4">

      {/* Search bar and filters toggle button */}
      <div className="flex items-center gap-3">

        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={filters.searchQuery || ''}
            onChange={(e) => onFilterChange('searchQuery', e.target.value)}
            placeholder="Search by worker name..."
            className="w-full py-2.5 px-4 pl-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Filters toggle button*/}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
            activeCount > 0
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
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

      {/* Expanded filter dropdowns - visible when filters toggled open */}
      {showFilters && (
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Filter by application status */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => onFilterChange('status', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Filter by job title */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                Job
              </label>
              <select
                value={filters.jobId}
                onChange={(e) => onFilterChange('jobId', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">All Jobs</option>
                {jobs.map(job => (
                  <option key={job.id} value={job.id}>{job.title}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ApplicationFilters;