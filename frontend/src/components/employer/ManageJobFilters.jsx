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

  // Clamp salary value between 0 and MAX_SALARY
  const clampSalary = (value) => value === '' ? '' : Math.min(MAX_SALARY, Math.max(0, Number(value)));

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
          {activeCount > 0 && (
            <span className="min-w-[20px] h-5 px-1.5 bg-white text-blue-600 rounded-full text-xs font-bold flex items-center justify-center">
              {activeCount}
            </span>
          )}
          {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded filter panel */}
      {showFilters && (
        <div className="space-y-6 pt-4 border-t border-gray-200">

          {/* Status, category, location and date dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Status',      value: filters.status,              options: ['all', 'open', 'in-progress', 'completed'], key: 'status'     },
              { label: 'Category',    value: filters.category,            options: ['all', ...categories],                      key: 'category'   },
              { label: 'Location',    value: filters.location,            options: ['all', ...locations],                       key: 'location'   },
              { label: 'Posted Date', value: filters.dateFilter || 'all', options: ['all', 'today', '7', '30', '90'],           key: 'dateFilter' }
            ].map(({ label, value, options, key }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">{label}</label>
                <select value={value} onChange={(e) => onFilterChange(key, e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500">
                  {options.map(opt => (
                    <option key={opt} value={opt}>
                      {key === 'status'     ? labels.status[opt] || opt :
                       key === 'dateFilter' ? labels.date[opt]   || opt :
                       opt === 'all' ? (label === 'Category' ? 'All Categories' : 'All Locations') : opt}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          {/* Salary range slider */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">Salary Range (LKR)</label>
            <div className="relative px-2 mb-6">
              <div className="relative h-1.5 bg-gray-200 rounded-full">
                {/* Blue fill between min and max handles */}
                <div className="absolute h-1.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                  style={{
                    left:  `${((filters.minSalary || 0)               / MAX_SALARY) * 100}%`,
                    right: `${100 - ((filters.maxSalary || MAX_SALARY) / MAX_SALARY) * 100}%`
                  }} />
              </div>
              {/* Min and max range inputs stacked on same track */}
              {[{ value: filters.minSalary || 0, key: 'minSalary' }, { value: filters.maxSalary || MAX_SALARY, key: 'maxSalary' }].map(({ value, key }) => (
                <input key={key} type="range" min="0" max={MAX_SALARY} step="1000" value={value}
                  onChange={(e) => onFilterChange(key, e.target.value)}
                  className="absolute w-full h-1.5 top-0 bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:shadow-lg"
                />
              ))}
            </div>
          </div>

          {/* Min and max salary number inputs */}
          <div className="grid grid-cols-2 gap-4">
            {[{ label: 'Minimum Salary', value: filters.minSalary, key: 'minSalary' }, { label: 'Maximum Salary', value: filters.maxSalary, key: 'maxSalary' }].map(({ label, value, key }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-gray-600 mb-2">{label}</label>
                <input type="number" value={value} onChange={(e) => onFilterChange(key, clampSalary(e.target.value))}
                  placeholder={`${key === 'minSalary' ? 'Min' : 'Max'} (LKR)`} min="0" max={MAX_SALARY} step="1000"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
              </div>
            ))}
          </div>

        </div>
      )}

      {/* Results count */}
      <div className="text-sm pt-2 border-t border-gray-200 text-gray-600">
        Showing <span className="font-bold text-gray-900">{jobsCount}</span> of <span className="font-bold text-gray-900">{totalJobsCount}</span> jobs
      </div>
    </div>
  );
};

export default ManageJobFilters;