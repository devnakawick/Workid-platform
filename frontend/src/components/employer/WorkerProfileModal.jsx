import { useState } from 'react';
import { X, MapPin, CircleCheck, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Renders star icons at given size
const Stars = ({ rating, size = 14 }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <svg key={i} width={size} height={size} viewBox="0 0 10 10">
        <path
          d="M5 1l1.1 2.2 2.4.35-1.75 1.7.41 2.45L5 6.5 2.84 7.7l.41-2.45L1.5 3.55l2.4-.35L5 1z"
          fill={i <= Math.round(rating) ? '#F59E0B' : '#E5E7EB'}
        />
      </svg>
    ))}
    <span className="text-sm font-bold text-gray-700 ml-1">{rating}</span>
  </div>
);

const WorkerProfileModal = ({ worker, onClose }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  // Tab options for modal content
  const TABS = [
    { id: 'overview', label: t('workerProfile.tabs.overview') },
    { id: 'reviews', label: t('workerProfile.tabs.reviews') },
  ];

  // Static rating breakdown percentages for mock
  const breakdown = [
    { star: 5, pct: 58 },
    { star: 4, pct: 26 },
    { star: 3, pct: 10 },
    { star: 2, pct: 4 },
    { star: 1, pct: 2 },
  ];

  // Close modal then navigate to messages with workerId
  const handleMessage = () => {
    onClose();
    navigate(`/employer/messages?workerId=${worker.id}`);
  };

  return (
    // Backdrop — click outside to close
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">

        {/* Modal header — avatar, name, meta and tabs */}
        <div className="bg-white border-b border-gray-200 px-5 py-4 flex-shrink-0">
          <div className="flex items-start gap-4">

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

            {/* Name, verified badge and location */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-bold text-gray-900">{worker.name}</h2>
                  {worker.verified && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-full text-xs font-semibold">
                      <CircleCheck className="w-3 h-3" /> {t('workerProfile.verified')}
                    </span>
                  )}
                </div>
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all flex-shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {worker.location} · {worker.age} {t('common.yrs')} · {t('common.since')} {worker.memberSince}
              </p>
              <div className="mt-2">
                <Stars rating={worker.rating} />
              </div>
            </div>
          </div>

          {/* Overview / Reviews tabs */}
          <div className="flex items-center gap-1 mt-4 border-b border-gray-200 -mb-4 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all -mb-px whitespace-nowrap ${activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable tab content */}
        <div className="flex-1 overflow-y-auto p-5">

          {/* Overview tab — stats, bio, skills, completion and rate */}
          {activeTab === 'overview' && (
            <div className="space-y-4">

              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { key: 'jobsDone', value: worker.jobs },
                  { key: 'completion', value: `${worker.completionRate}%` },
                  { key: 'response', value: worker.responseTime },
                ].map(({ key, value }) => (
                  <div key={key} className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                    <p className="text-lg font-black text-blue-600">{value}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{t(`workerProfile.stats.${key}`)}</p>
                  </div>
                ))}
              </div>

              {/* Bio */}
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{t('workerProfile.about')}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{worker.bio}</p>
              </div>

              {/* Skills list */}
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">{t('workerProfile.skills')}</p>
                <div className="flex flex-wrap gap-2">
                  {worker.skills.map((s) => (
                    <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-full text-xs font-semibold">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Job completion rate progress bar */}
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-700">{t('reviewApps.detail.completionRate')}</span>
                  <span className="text-sm font-black text-blue-600">{worker.completionRate}%</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${worker.completionRate}%` }}
                  />
                </div>
              </div>

              {/* Daily rate */}
              <div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">{t('common.dailyRate')}</span>
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-900">{t('common.currency')} {worker.rate}</p>
                  <p className="text-xs text-gray-400">{t('common.perDay')}</p>
                </div>
              </div>
            </div>
          )}

          {/* Reviews tab — overall rating breakdown and review list */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">

              {/* Overall rating with star breakdown bars */}
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-6">
                  <div className="text-center flex-shrink-0">
                    <p className="text-4xl font-black text-gray-900 leading-none">{worker.rating}</p>
                    <div className="mt-2"><Stars rating={worker.rating} /></div>
                    <p className="text-xs text-gray-400 mt-1">{worker.jobs} {t('workerProfile.reviewsSection.count', { count: worker.jobs })}</p>
                  </div>
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

              {/* Individual reviews list */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">{t('workerProfile.reviewsSection.title')}</span>
                </div>
                <div className="divide-y divide-gray-100">
                  {(worker.reviews || []).map((review) => (
                    <div key={review.id} className="px-4 py-4">
                      <div className="flex items-start gap-3">
                        {/* Reviewer initials avatar */}
                        <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 flex-shrink-0">
                          {review.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                            <span className="text-sm font-semibold text-gray-800">{review.employer}</span>
                            <span className="text-xs text-gray-400 flex-shrink-0">{review.date}</span>
                          </div>
                          {/* Review star rating */}
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
                          <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer — close and message buttons */}
        <div className="border-t border-gray-100 px-5 py-4 flex-shrink-0 bg-white flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
          >
            {t('workerProfile.actions.close')}
          </button>
          {/* Message button — navigates to messages page with workerId */}
          <button
            onClick={handleMessage}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-md transition-all flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            {t('workerProfile.actions.message')}
          </button>
        </div>

      </div>
    </div>
  );
};

export default WorkerProfileModal;