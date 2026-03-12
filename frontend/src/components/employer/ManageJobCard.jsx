import { MapPin, Users, Clock, Edit, Trash2, MessageCircle } from 'lucide-react';


const ManageJobCard = ({ job,  onEdit, onDelete, onViewApplications }) => {

  // Format date to readable format
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  // Return color classes based on job status
  const getStatusColors = () => {
    if (job.status === 'open')        return 'bg-green-50 text-green-700 border border-green-200';
    if (job.status === 'in-progress') return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
    return 'bg-blue-50 text-blue-700 border border-blue-200';
  };

  // Return label based on job status
  const getStatusLabel = () => {
    if (job.status === 'open')        return 'Open';
    if (job.status === 'in-progress') return 'In Progress';
    return 'Completed';
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1">

      {/* Job title, status badge and salary */}
      <div className="flex items-start justify-between gap-6 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h3 className="text-2xl font-bold text-gray-900 leading-tight">{job.title}</h3>
            <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${getStatusColors()}`}>
              {getStatusLabel()}
            </span>
          </div>
          <span className="text-sm font-medium text-gray-600">{job.category}</span>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-2xl font-bold text-gray-900">LKR {job.salary.toLocaleString()}</div>
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-1">per {job.salaryPeriod}</div>
        </div>
      </div>

      <div className="h-px bg-gray-100 my-4" />

      {/* Job description */}
      <p className="text-sm text-gray-500 leading-relaxed mb-5 line-clamp-2">{job.description}</p>

      {/* Location, workers needed and duration */}
      <div className="flex items-center gap-6 mb-5 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center">
            <MapPin className="w-4 h-4 text-gray-600" />
          </div>
          <span className="text-sm font-medium text-gray-700">{job.location.split(',')[0]}</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center">
            <Users className="w-4 h-4 text-gray-600" />
          </div>
          <span className="text-sm font-medium text-gray-700">{job.workersNeeded} needed</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center">
            <Clock className="w-4 h-4 text-gray-600" />
          </div>
          <span className="text-sm font-medium text-gray-700">{job.duration}</span>
        </div>
      </div>

      {/* Bottom row — applications button, posted date, edit and delete */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 flex-wrap gap-4">

        <div className="flex items-center gap-4 flex-wrap">
          {/* Applications button with ping animation when count more than 0 */}
          <button onClick={() => onViewApplications(job.id)} className="relative">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/30 font-bold text-sm transition-all duration-200">
              <MessageCircle className="w-4 h-4" />
              <span>{job.applicationsCount || 0}</span>
              <span className="opacity-90">applications</span>
            </div>
            {/* Ping animation only shows when there are applications */}
            {job.applicationsCount > 0 && (
              <div className="absolute inset-0 bg-blue-400 rounded-xl animate-ping opacity-20 pointer-events-none" />
            )}
          </button>

          {/* Posted date */}
          <span className="text-sm text-gray-500">
            Posted on <span className="font-semibold text-gray-700">{formatDate(job.postedDate)}</span>
          </span>
        </div>

        {/* Edit and delete action buttons with tooltips */}
        <div className="flex items-center gap-2">
          <button onClick={() => onEdit(job.id)} className="relative group/btn p-2.5 text-gray-600 rounded-lg hover:bg-green-50 hover:text-green-600 transition-all">
            <Edit className="w-5 h-5" />
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Edit</span>
          </button>
          <button onClick={() => onDelete(job.id)} className="relative group/btn p-2.5 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all">
            <Trash2 className="w-5 h-5" />
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Delete</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default ManageJobCard;