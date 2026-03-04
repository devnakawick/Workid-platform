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

      {/* Search bar */}
      <div className="flex items-center gap-3">
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
      </div>

    </div>
  );
};

export default ApplicationFilters;