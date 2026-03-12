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

// Shows overall rating score, star breakdown and recent reviews
const RatingTab = ({ app }) => {

  // Static star breakdown percentages
  const breakdown = [
    { star: 5, pct: 58 },
    { star: 4, pct: 26 },
    { star: 3, pct: 10 },
    { star: 2, pct: 4  },
    { star: 1, pct: 2  },
  ];

  return (
    <div className="space-y-4">

      {/* Overall rating score with star breakdown bars */}
      <div className="bg-white rounded-xl p-4 md:p-5 border border-gray-200">
        <div className="flex items-center gap-6 md:gap-8">

          {/* Average rating number and stars */}
          <div className="text-center flex-shrink-0">
            <p className="text-4xl md:text-5xl font-black text-gray-900 leading-none">{app.rating}</p>
            <div className="mt-2"><Stars rating={app.rating} /></div>
            <p className="text-xs text-gray-400 mt-1">{app.jobs} reviews</p>
          </div>

          {/* Star by star percentage bars */}
          <div className="flex-1 space-y-2">
            {breakdown.map(({ star, pct }) => (
              <div key={star} className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-2">{star}</span>
                <svg width="10" height="10" viewBox="0 0 10 10">
                  <path d="M5 1l1.1 2.2 2.4.35-1.75 1.7.41 2.45L5 6.5 2.84 7.7l.41-2.45L1.5 3.55l2.4-.35L5 1z" fill="#F59E0B" />
                </svg>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs text-gray-400 w-7 text-right">{pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent reviews list */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 md:px-5 py-3 border-b border-gray-200 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
          <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">Recent Reviews</span>
        </div>

        {/* Each review row */}
        <div className="divide-y divide-gray-100">
          {(app.reviews || []).map((review) => (
            <div key={review.id} className="px-4 md:px-5 py-4">
              <div className="flex items-start gap-3">

                {/* Reviewer initials avatar */}
                <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 flex-shrink-0">
                  {review.initials}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Reviewer name and date */}
                  <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                    <span className="text-sm font-semibold text-gray-800">{review.employer}</span>
                    <span className="text-xs text-gray-400 flex-shrink-0">{review.date}</span>
                  </div>

                  {/* Star rating for this review */}
                  <div className="flex items-center gap-0.5 mb-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <svg key={i} width="12" height="12" viewBox="0 0 10 10">
                        <path
                          d="M5 1l1.1 2.2 2.4.35-1.75 1.7.41 2.45L5 6.5 2.84 7.7l.41-2.45L1.5 3.55l2.4-.35L5 1z"
                          fill={i <= review.rating ? '#F59E0B' : '#E5E7EB'}
                        />
                      </svg>
                    ))}
                  </div>

                  {/* Review comment */}
                  <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

// Tab options for switching between Overview and Rating
const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'rating',   label: 'Rating'   },
];

// Status badge styles mapped by application status
const STATUS_BADGE = {
  pending:  'bg-yellow-100 text-yellow-700 border-yellow-200',
  accepted: 'bg-green-100 text-green-700 border-green-200',
  rejected: 'bg-red-100 text-red-700 border-red-200',
};

// Main component-displays full applicant detail with tabs
const ApplicantsDetail = ({ application, onHire, onReject }) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 min-w-0">

      {/* Worker header-avatar, name, location, status */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">

        <div className="flex items-start gap-3">

          {/* Avatar with verified badge */}
          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-base md:text-lg">
              {application.initials}
            </div>
            {/* Show verified tick if worker is verified */}
            {application.verified && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 md:w-6 md:h-6 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center">
                <CircleCheck className="w-3 h-3 md:w-3.5 md:h-3.5 text-white" />
              </div>
            )}
          </div>

          {/* Name,verified badge and status */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                <h2 className="text-sm md:text-base font-bold text-gray-900">{application.name}</h2>
                {/* Verified label badge */}
                {application.verified && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-full text-xs font-semibold flex-shrink-0">
                    <CircleCheck className="w-3 h-3" />
                    Verified
                  </span>
                )}
              </div>
              {/* Application status badge */}
              <span className={`inline-flex items-center px-2.5 py-0.5 border rounded-full text-xs font-semibold flex-shrink-0 ${STATUS_BADGE[application.status]}`}>
                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
              </span>
            </div>

            {/* Location,age and member since */}
            <p className="text-xs text-gray-500 truncate flex items-center gap-1">
              <MapPin className="w-3 h-3 flex-shrink-0" /> {application.location} · {application.age} yrs · Since {application.memberSince}
            </p>
          </div>
        </div>

        {/* Hire/Reject action buttons */}
        <div className="mt-3">
          <HireButton
            status={application.status}
            onHire={() => onHire(application.id)}
            onReject={() => onReject(application.id)}
          />
        </div>

        {/* Tab navigation-Overview and Rating */}
        <div className="flex items-center gap-1 mt-4 border-b border-gray-200 -mb-4 overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all -mb-px whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Render active tab content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {activeTab === 'overview' && <OverviewTab app={application} onHire={onHire} />}
        {activeTab === 'rating'   && <RatingTab   app={application} />}
      </div>

    </div>
  );
};

export default ApplicantsDetail;