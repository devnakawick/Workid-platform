import { useState } from 'react';
import { MapPin, Calendar, CircleCheck } from 'lucide-react';
import HireButton from './HireButton';

// Renders star icons based on rating value
const Stars = ({ rating }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((i) => (
      <svg key={i} width="14" height="14" viewBox="0 0 10 10">
        <path
          d="M5 1l1.1 2.2 2.4.35-1.75 1.7.41 2.45L5 6.5 2.84 7.7l.41-2.45L1.5 3.55l2.4-.35L5 1z"
          fill={i <= Math.round(rating) ? '#F59E0B' : '#E5E7EB'}
        />
      </svg>
    ))}
    {/* Show numeric rating next to stars */}
    <span className="text-sm font-bold text-gray-700 ml-1">{rating}</span>
  </div>
);

// Shows bio, skills, completion rate and applied job info
const OverviewTab = ({ app, onHire }) => (
  <div className="space-y-4">

    {/* Bio section */}
    <div className="bg-white rounded-xl p-4 md:p-5 border border-gray-200">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">About</p>
      <p className="text-sm text-gray-600 leading-relaxed">{app.bio}</p>
    </div>

    {/* Skills list */}
    <div className="bg-white rounded-xl p-4 md:p-5 border border-gray-200">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Skills</p>
      <div className="flex flex-wrap gap-2">
        {app.skills.map((s) => (
          <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-full text-xs font-semibold">
            {s}
          </span>
        ))}
      </div>
    </div>

    {/* Job completion rate progress bar */}
    <div className="bg-white rounded-xl p-4 md:p-5 border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-gray-700">Job Completion Rate</span>
        <span className="text-sm font-black text-blue-600">{app.completionRate}%</span>
      </div>
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${app.completionRate}%` }} />
      </div>
    </div>

    {/* Applied job info-show hire button if pending */}
    <div className="bg-white rounded-xl p-4 md:p-5 border border-gray-200">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Applied For</p>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <p className="text-sm font-bold text-gray-900 mb-1">{app.job}</p>
          <p className="text-xs text-gray-500 flex items-center gap-1"><Calendar className="w-3 h-3" /> {app.appliedDate}</p>
        </div>
        {/* Daily rate */}
        <div className="text-right">
          <p className="text-lg font-bold text-gray-900">LKR {app.rate}</p>
          <p className="text-xs text-gray-400">per day</p>
        </div>
      </div>
      {/* Show hire button only if application is still pending */}
      {app.status === 'pending' && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={() => onHire(app.id)}
            className="w-full py-2.5 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-md transition-all"
          >
            ✓ Hire for this Role
          </button>
        </div>
      )}
    </div>
  </div>
);

export default ApplicantsDetail;