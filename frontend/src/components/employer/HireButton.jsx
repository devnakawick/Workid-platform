import { useTranslation } from 'react-i18next';

// HireButton - reusable hire/reject button component
const HireButton = ({ status, onHire, onReject }) => {
  const { t } = useTranslation();

  // Show hired badge if worker is already accepted
  if (status === 'accepted') {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
        <span className="w-2 h-2 rounded-full bg-green-500" />
        <span className="text-sm font-semibold text-green-700">{t('reviewApps.hire.hired')}</span>
      </div>
    );
  }

  // Show declined badge if application was rejected
  if (status === 'rejected') {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
        <span className="w-2 h-2 rounded-full bg-red-500" />
        <span className="text-sm font-semibold text-red-700">{t('reviewApps.hire.declined')}</span>
      </div>
    );
  }

  // Show hire and reject action buttons for pending applications
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onReject}
        className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-white text-gray-700 border border-gray-300 hover:bg-red-50 hover:border-red-400 hover:text-red-600 transition-all"
      >
        {t('reviewApps.hire.reject')}
      </button>
      <button
        onClick={onHire}
        className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-md transition-all"
      >
        ✓ {t('reviewApps.hire.hireNow')}
      </button>
    </div>
  );
};


export default HireButton;