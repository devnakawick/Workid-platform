import { useState } from 'react';
import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { categories } from '../../mocks/jobData';

// Available location options for filter
const LOCATIONS = ['Colombo', 'Nugegoda', 'Kelaniya', 'Maharagama', 'Battaramulla', 'Galle', 'Kandy', 'Negombo'];

const WorkerFilters = ({ filters, onFilterChange, onClearAll, workersCount, totalWorkersCount }) => {
  const [showFilters, setShowFilters] = useState(false);

  // Count active filters excluding search query
  const activeCount = [
    filters.availability !== 'all',
    filters.category     !== 'all',
    filters.location     !== 'all',
    filters.minRating    !== 'all',
    filters.verified     !== 'all',
  ].filter(Boolean).length;

  // Has any active filter including search
  const hasActive = activeCount > 0 || filters.searchQuery.trim() !== '';

  // Remove a single filter by resetting to 'all'
  const removeFilter = (key) => onFilterChange(key, 'all');

  // Removable chip for each active filter
  const FilterChip = ({ label, filterKey }) => (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 text-gray-700 rounded-full text-xs font-medium shadow-sm">
      {label}
      <button onClick={() => removeFilter(filterKey)} className="hover:bg-gray-100 rounded-full p-0.5 transition-colors">
        <X className="w-3 h-3" />
      </button>
    </span>
  );

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 space-y-4">

      {/* Search bar and filter toggle button */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange('searchQuery', e.target.value)}
            placeholder="Search by worker name or skill..."
            className="w-full py-2.5 px-4 pl-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        {/* Filter button — blue when filters active */}
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
          {/* Active filter count badge */}
          {activeCount > 0 && (
            <span className="min-w-[20px] h-5 px-1.5 bg-white text-blue-600 rounded-full text-xs font-bold flex items-center justify-center">
              {activeCount}
            </span>
          )}
          {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded filter dropdowns */}
      {showFilters && (
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* Availability filter */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Availability</label>
              <select
                value={filters.availability}
                onChange={(e) => onFilterChange('availability', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">All Workers</option>
                <option value="available">Available Now</option>
                <option value="busy">Busy</option>
              </select>
            </div>

            {/* Category filter */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => onFilterChange('category', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Location filter */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Location</label>
              <select
                value={filters.location}
                onChange={(e) => onFilterChange('location', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">All Locations</option>
                {LOCATIONS.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Minimum rating filter */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Minimum Rating</label>
              <select
                value={filters.minRating}
                onChange={(e) => onFilterChange('minRating', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">Any Rating</option>
                <option value="4.5">4.5+ ⭐</option>
                <option value="4.0">4.0+ ⭐</option>
                <option value="3.5">3.5+ ⭐</option>
                <option value="3.0">3.0+ ⭐</option>
              </select>
            </div>

            {/* Verified only filter */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Verification</label>
              <select
                value={filters.verified}
                onChange={(e) => onFilterChange('verified', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="all">All Workers</option>
                <option value="true">Verified Only</option>
                <option value="false">Unverified Only</option>
              </select>
            </div>

          </div>

          {/* Active filter chips */}
          {activeCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">Active:</span>
              {filters.availability !== 'all' && (
                <FilterChip label={filters.availability === 'available' ? 'Available Now' : 'Busy'} filterKey="availability" />
              )}
              {filters.category !== 'all' && <FilterChip label={filters.category} filterKey="category"  />}
              {filters.location  !== 'all' && <FilterChip label={filters.location}  filterKey="location"  />}
              {filters.minRating !== 'all' && <FilterChip label={`${filters.minRating}+ Stars`} filterKey="minRating" />}
              {filters.verified  !== 'all' && (
                <FilterChip label={filters.verified === 'true' ? 'Verified Only' : 'Unverified Only'} filterKey="verified" />
              )}
            </div>
          )}

          {/* Clear all filters button */}
          {hasActive && (
            <div className="flex justify-center">
              <button
                onClick={onClearAll}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm font-medium hover:bg-red-50 hover:border-red-400 transition-all"
              >
                <X className="w-4 h-4" />
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Results count */}
      <div className="text-sm pt-2 border-t border-gray-200 text-gray-600">
        Showing <span className="font-bold text-gray-900">{workersCount}</span> of{' '}
        <span className="font-bold text-gray-900">{totalWorkersCount}</span> workers
      </div>
    </div>
  );
};

export default WorkerFilters;