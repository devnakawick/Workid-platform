import { MapPin, Star, CircleCheck, Briefcase, Clock, Zap } from 'lucide-react';

// Availability badge config — label, dot and badge colors per status
const AVAILABILITY = {
  available: { label: 'Available',   dot: 'bg-green-400',  badge: 'bg-green-50 text-green-700 border-green-200'   },
  busy:      { label: 'Busy',        dot: 'bg-yellow-400', badge: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  inactive:  { label: 'Unavailable', dot: 'bg-gray-400',   badge: 'bg-gray-50 text-gray-500 border-gray-200'      },
};

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

const WorkerCard = ({ worker, onViewProfile }) => {
  const avail = AVAILABILITY[worker.availability] || AVAILABILITY.inactive;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1 flex flex-col">

      {/* Header — avatar, name, location and availability badge */}
      <div className="flex items-start gap-4 mb-4">

        {/* Avatar with verified badge overlay */}
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

        {/* Name, verified badge and availability */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex flex-wrap items-center gap-1.5 min-w-0">
              <h3 className="text-base font-bold text-gray-900 truncate">{worker.name}</h3>
              {worker.verified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-full text-xs font-semibold flex-shrink-0">
                  <CircleCheck className="w-3 h-3" /> Verified
                </span>
              )}
            </div>
            {/* Availability badge with color dot */}
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 border rounded-full text-xs font-semibold flex-shrink-0 ${avail.badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${avail.dot}`} />
              {avail.label}
            </span>
          </div>
          {/* Location, age and member since */}
          <p className="text-xs text-gray-500 flex items-center gap-1 truncate">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            {worker.location} · {worker.age} yrs · Since {worker.memberSince}
          </p>
        </div>
      </div>

      {/* Rating and jobs done */}
      <div className="flex items-center justify-between mb-3">
        <Stars rating={worker.rating} />
        <span className="text-xs text-gray-400">{worker.jobs} jobs done</span>
      </div>

      {/* Bio — clamped to 2 lines */}
      <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2 flex-1">
        {worker.bio}
      </p>

      {/* Skills — show first 3 with overflow count */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {worker.skills.slice(0, 3).map((s) => (
          <span key={s} className="inline-flex items-center px-2.5 py-0.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-full text-xs font-semibold">
            {s}
          </span>
        ))}
        {worker.skills.length > 3 && (
          <span className="inline-flex items-center px-2.5 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs font-semibold">
            +{worker.skills.length - 3} more
          </span>
        )}
      </div>

      <div className="h-px bg-gray-100 mb-4" />

      {/* Stats row — completion rate, response time and daily rate */}
      <div className="flex items-center justify-between mb-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Briefcase className="w-3.5 h-3.5 text-blue-500" />
          <span className="font-semibold text-gray-700">{worker.completionRate}%</span>
          <span>completion</span>
        </div>
        <div className="flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 text-yellow-500" />
          <span>{worker.responseTime}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-green-500" />
          <span className="font-bold text-gray-700">LKR {worker.rate}</span>
          <span>/day</span>
        </div>
      </div>

      {/* View Profile button */}
      <button
        onClick={() => onViewProfile(worker)}
        className="w-full py-2.5 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-md transition-all"
      >
        View Profile
      </button>

    </div>
  );
};

export default WorkerCard;