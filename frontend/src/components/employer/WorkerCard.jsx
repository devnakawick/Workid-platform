import { MapPin, CircleCheck, Briefcase, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Availability badge mapping
const getAvailabilityConfig = (t) => ({
  available: { label: t('searchWorkers.filters.available'), dot: 'bg-green-400', badge: 'bg-green-50 text-green-700 border-green-200' },
  busy: { label: t('searchWorkers.filters.busy'), dot: 'bg-yellow-400', badge: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  inactive: { label: t('common.status.inactive'), dot: 'bg-gray-400', badge: 'bg-gray-50 text-gray-500 border-gray-200' },
});

// Renders star icons for a given rating
const Stars = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <svg key={i} width="12" height="12" viewBox="0 0 10 10">
        <path
          d="M5 1l1.1 2.2 2.4.35-1.75 1.7.41 2.45L5 6.5 2.84 7.7l.41-2.45L1.5 3.55l2.4-.35L5 1z"
          fill={i <= Math.round(rating) ? '#F59E0B' : '#E5E7EB'}
        />
      </svg>
    ))}
    <span className="text-xs font-bold text-gray-700 ml-1">{rating}</span>
  </div>
);

const WorkerCard = ({ worker, onViewProfile, onInvite }) => {
  const { t } = useTranslation();
  const AVAILABILITY = getAvailabilityConfig(t);
  const avail = AVAILABILITY[worker.availability] || AVAILABILITY.inactive;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">

      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="relative flex-shrink-0">
          <div className="w-14 h-14 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-lg">
            {worker.initials}
          </div>
          {worker.verified && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center">
              <CircleCheck className="w-3 h-3 text-white" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex flex-wrap items-center gap-1.5 min-w-0">
              <h3 className="text-base font-bold text-gray-900 truncate">{worker.name}</h3>
              {worker.verified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-full text-xs font-semibold flex-shrink-0">
                  <CircleCheck className="w-3 h-3" /> {t('workerProfile.verified')}
                </span>
              )}
            </div>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 border rounded-full text-xs font-semibold flex-shrink-0 ${avail.badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${avail.dot}`} />
              {avail.label}
            </span>
          </div>
          <p className="text-xs text-gray-500 flex items-center gap-1 truncate">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            {worker.location} · {worker.age} {t('workerProfile.yrs', { defaultValue: 'yrs' })} · {t('workerProfile.memberSince')} {worker.memberSince}
          </p>
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center justify-between mb-3">
        <Stars rating={worker.rating} />
        <span className="text-xs text-gray-400">{worker.jobs} {t('workerProfile.completed')}</span>
      </div>

      {/* Bio - Removed 'flex-1' to fix overlap issue, added 'min-h' for alignment */}
      <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2 min-h-[2.5rem]">
        {worker.bio}
      </p>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {worker.skills.slice(0, 3).map((s) => (
          <span key={s} className="inline-flex items-center px-2.5 py-0.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-full text-xs font-semibold">
            {s}
          </span>
        ))}
        {worker.skills.length > 3 && (
          <span className="inline-flex items-center px-2.5 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs font-semibold">
            +{worker.skills.length - 3} {t('common.more', { defaultValue: 'more' })}
          </span>
        )}
      </div>

      {/* Divider - Added mt-auto to push footer to bottom */}
      <div className="h-px bg-gray-100 mb-4 mt-auto" />

      {/* Stats */}
      <div className="flex items-center gap-6 mb-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Briefcase className="w-3.5 h-3.5 text-blue-500" />
          <span className="font-semibold text-gray-700">{worker.completionRate}%</span>
          <span className="text-gray-400">Completion</span>
        </div>
        <div className="flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 text-yellow-500" />
          <span className="font-semibold text-gray-700">{worker.responseTime}</span>
          <span className="text-gray-400">Response</span>
        </div>
      </div>

      {/* View Profile Button */}
      <button
        onClick={() => onViewProfile(worker)}
        className="w-full py-2.5 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-md transition-all"
      >
        {t('workerProfile.viewProfile', { defaultValue: 'View Profile' })}
      </button>

    </div>
  );
};

export default WorkerCard;