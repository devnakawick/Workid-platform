import { MapPin, Users, Clock, Edit, Trash2, MessageCircle } from 'lucide-react';


const ManageJobCard = ({ job, onView, onEdit, onDelete, onViewApplications }) => {

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

    </div>
  );
};

export default ManageJobCard;