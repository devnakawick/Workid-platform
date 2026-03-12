import { Briefcase, Plus, X } from 'lucide-react';

const EmptyState = ({ hasFilters, onClearFilters, onPostJob }) => {
  if (hasFilters) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl shadow-md">
        <Briefcase className="w-20 h-20 text-gray-300 mx-auto mb-6" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">No jobs found</h3>
        <p className="text-gray-600 mb-6 text-base">
          Try adjusting your search or filters
        </p>
        <button 
          onClick={onClearFilters}
          className="inline-flex items-center gap-2 px-5 py-2.5 
          border border-red-800 text-red-600 
          rounded-lg  text-base font-semibold
          hover:bg-red-800 hover:text-white
           shadow-md hover:shadow-lg 
          transition-all duration-200"
        >
          <X className="w-5 h-5" />
          Clear All Filters
        </button>
      </div>
    );
  }

  return (
    <div className="text-center py-16 bg-white rounded-2xl shadow-md">
      <Briefcase className="w-20 h-20 text-gray-300 mx-auto mb-6" />
      <h3 className="text-2xl font-bold text-gray-900 mb-2">No jobs found</h3>
      <p className="text-gray-600 mb-6 text-base">
        Start by posting your first job
      </p>
      <button 
        onClick={onPostJob}
        className="inline-flex items-center gap-2 px-5 py-2.5 
        border border-blue-600 text-blue-600 
        rounded-lg font-semibold
        hover:bg-blue-600 hover:text-white
        transition-all duration-200"


      >
        <Plus className="w-5 h-5" />
        Post Your First Job
      </button>
    </div>
  );
};


export default EmptyState;