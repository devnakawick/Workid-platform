import { useState } from 'react';
import { MapPin, Calendar, CircleCheck, Loader2, TrendingUp } from 'lucide-react';
import HireButton from './HireButton';
import { getJobDetails, getJobLocations, updateEmployerLocationSettings } from '@/services/jobProgressApi';
import JobProgressBar from '@/components/progress/JobProgressBar';
import JobLocationMap from '@/components/map/JobLocationMap';
import LocationShareSettings from '@/components/settings/LocationShareSettings';
import { toast } from 'sonner';

import { useTranslation } from 'react-i18next';

// Renders star icons based on rating value
const Stars = ({ rating }) => {
  const { t } = useTranslation();
  return (
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
};

// Shows bio, skills, completion rate and applied job info
const OverviewTab = ({ app, onHire }) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">

      {/* Bio section */}
      <div className="bg-white rounded-xl p-4 md:p-5 border border-gray-200">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          {t('reviewApps.detail.about')}
        </p>
        <p className="text-sm text-gray-600 leading-relaxed">{app.bio}</p>
      </div>

      {/* Skills list */}
      <div className="bg-white rounded-xl p-4 md:p-5 border border-gray-200">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          {t('reviewApps.detail.skills')}
        </p>
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
          <span className="text-sm font-semibold text-gray-700">
            {t('reviewApps.detail.completionRate')}
          </span>
          <span className="text-sm font-black text-blue-600">{app.completionRate}%</span>
        </div>
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 rounded-full" style={{ width: `${app.completionRate}%` }} />
        </div>
      </div>

      {/* Applied job info-show hire button if pending */}
      <div className="bg-white rounded-xl p-4 md:p-5 border border-gray-200">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          {t('reviewApps.detail.appliedFor')}
        </p>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <p className="text-sm font-bold text-gray-900 mb-1">{app.job}</p>
            <p className="text-xs text-gray-500 flex items-center gap-1"><Calendar className="w-3 h-3" /> {app.appliedDate}</p>
          </div>
          {/* Daily rate */}
          <div className="text-right">
            <p className="text-lg font-bold text-gray-900">{t('common.currency')} {app.rate}</p>
            <p className="text-xs text-gray-400">{t('reviewApps.detail.perDay')}</p>
          </div>
        </div>
        {/* Show hire button only if application is still pending */}
        {app.status === 'pending' && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <button
              onClick={() => onHire(app.id)}
              className="w-full py-2.5 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-md transition-all"
            >
              ✓ {t('reviewApps.detail.hireButton')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const JobProgressTab = ({ app }) => {
  const { t } = useTranslation();
  const [job, setJob] = useState(null);
  const [locations, setLocations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      setRefreshing(true);
      // Try application's jobId first, fallback to 'job-1' if it fails
      const jobId = app.jobId || 'job-1';
      let jobData;
      try {
        jobData = await getJobDetails(jobId);
      } catch (e) {
        jobData = await getJobDetails('job-1');
      }
      setJob(jobData);

      const locData = await getJobLocations(jobData.id);
      setLocations(locData);
    } catch (error) {
      console.error("Failed to load job details:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useState(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSaveSettings = async (setting) => {
    const jobId = app.jobId || 'job-1';
    await updateEmployerLocationSettings(jobId, setting);
    toast.success("Location sharing settings updated successfully");
  };

  if (loading && !job) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!job) {
    return <div className="text-center py-10 text-gray-500 font-bold">{t('reviewApps.detail.noTracking')}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
        <h3 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-wider text-xs font-semibold text-gray-500">
          {t('reviewApps.detail.workerProgress')}
        </h3>
        <JobProgressBar currentStatus={job.status} />
      </div>

      {/* Map - Show when active or locations exist */}
      {locations && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${job.status === 'Traveling' || job.status === 'In Progress' ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></span>
            {job.status === 'Traveling' || job.status === 'In Progress'
              ? t('reviewApps.detail.liveLocation')
              : t('reviewApps.detail.acceptedLocation')}
          </h3>
          <JobLocationMap
            employerLocation={locations.employerLocation}
            workerLocation={locations.workerLocation}
          />
          <p className="text-[10px] text-gray-400 mt-3 text-center">
            {job.status === 'Traveling' || job.status === 'In Progress'
              ? t('reviewApps.detail.updateInterval')
              : t('reviewApps.detail.locationSnapshot')}
          </p>
        </div>
      )}

      {job.status !== 'Finished' && (
        <LocationShareSettings job={job} onSave={handleSaveSettings} />
      )}
    </div>
  );
};

// Status badge styles mapped by application status
const STATUS_BADGE = {
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  accepted: 'bg-green-100 text-green-700 border-green-200',
  rejected: 'bg-red-100 text-red-700 border-red-200',
};

// Main component-displays full applicant detail with tabs
const ApplicantsDetail = ({ application, onHire, onReject }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');

  const TABS = [
    { id: 'overview', label: t('reviewApps.tabs.overview') },
    { id: 'rating', label: t('reviewApps.tabs.rating') },
    { id: 'progress', label: t('reviewApps.tabs.progress') },
  ];

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
                    {t('reviewApps.detail.verified')}
                  </span>
                )}
              </div>
              {/* Application status badge */}
              <span className={`inline-flex items-center px-2.5 py-0.5 border rounded-full text-xs font-semibold flex-shrink-0 ${STATUS_BADGE[application.status]}`}>
                {t(`reviewApps.filters.${application.status}`)}
              </span>
            </div>

            {/* Location,age and member since */}
            <p className="text-xs text-gray-500 truncate flex items-center gap-1">
              <MapPin className="w-3 h-3 flex-shrink-0" /> {application.location} · {application.age} {t('common.yrs')} · {t('common.since')} {application.memberSince}
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
          {TABS.filter(tab => tab.id !== 'progress' || application.status === 'accepted').map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all -mb-px whitespace-nowrap ${activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              <div className="flex items-center gap-2">
                {tab.id === 'progress' && <TrendingUp className="w-3.5 h-3.5" />}
                {tab.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Render active tab content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {activeTab === 'overview' && <OverviewTab app={application} onHire={onHire} />}
        {activeTab === 'rating' && <RatingTab app={application} />}
        {activeTab === 'progress' && <JobProgressTab app={application} />}
      </div>

    </div>
  );
};

export default ApplicantsDetail;