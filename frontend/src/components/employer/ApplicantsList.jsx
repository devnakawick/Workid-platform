import { FileX, CircleCheck } from "lucide-react";
import { useTranslation, Trans } from 'react-i18next';

const ApplicantsList = ({ applications, selected, stats, onSelect }) => {
  const { t } = useTranslation();

  const STATUS_CONFIG = {
    pending: { label: t('reviewApps.filters.pending'), dot: 'bg-yellow-400', text: 'text-yellow-600', badge: 'bg-yellow-100 text-yellow-700' },
    accepted: { label: t('reviewApps.filters.accepted'), dot: 'bg-green-400', text: 'text-green-600', badge: 'bg-green-100 text-green-700' },
    rejected: { label: t('reviewApps.filters.rejected'), dot: 'bg-red-400', text: 'text-red-600', badge: 'bg-red-100 text-red-700' },
  };

  return (
    <div className="w-72 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 h-full">

      <div className="p-4 border-b border-gray-200 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
            {t('reviewApps.list.title')}
          </h2>

          {/* pending, accepted, rejected */}
          <div className="flex items-center gap-1.5">
            {[
              { value: stats.pending, cls: 'bg-yellow-100 text-yellow-700' },
              { value: stats.accepted, cls: 'bg-green-100 text-green-700' },
              { value: stats.rejected, cls: 'bg-red-100 text-red-700' },
            ].map(({ value, cls }, i) => (
              <span key={i} className={`min-w-[22px] h-5 px-1.5 rounded-full text-xs font-bold flex items-center justify-center ${cls}`}>
                {value}
              </span>
            ))}
          </div>
        </div>

        <p className="text-sm text-gray-600 pt-1 border-t border-gray-200">
          <Trans
            i18nKey="reviewApps.list.summary"
            values={{ filtered: applications.length, total: stats.total }}
            components={{
              1: <span className="font-bold text-gray-900" />,
              2: <span className="font-bold text-gray-900" />
            }}
          />
        </p>
      </div>

      <div className="overflow-y-auto flex-1">
        {applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <span className="text-3xl mb-2"><FileX /></span>
            <p className="text-sm font-medium">{t('reviewApps.list.empty')}</p>
          </div>
        ) : (
          applications.map((app) => {
            const s = STATUS_CONFIG[app.status];
            const isSel = selected?.id === app.id;

            return (
              <button
                key={app.id}
                onClick={() => onSelect(app)}
                className={`w-full text-left px-4 py-3.5 border-b border-gray-100 transition-colors relative ${isSel ? 'bg-blue-50' : 'bg-white hover:bg-gray-50'
                  }`}
              >

                {isSel && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-600" />}

                <div className="flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                      {app.initials}
                    </div>
                    {app.verified && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center">
                        <CircleCheck className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* pending rows stay bold to draw attention */}
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={`text-sm truncate ${isSel || app.status === 'pending' ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                        {app.name}
                      </span>
                      <span className="text-xs text-gray-400 flex-shrink-0 ml-2">{app.appliedAgo}</span>
                    </div>

                    <p className="text-xs text-gray-500 truncate mb-1.5">{app.job}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                        <span className={`text-xs font-semibold ${s.text}`}>{s.label}</span>
                      </div>
                      <span className="text-xs font-bold text-gray-700">{t('common.currency')} {app.rate}</span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ApplicantsList;