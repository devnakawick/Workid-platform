import React, { useState, useEffect } from 'react';
import {
	Briefcase,
	CheckCircle2,
	Star,
	Wallet as WalletIcon,
	MapPin,
	Calendar,
	ChevronRight,
	Circle,
	TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import workerService from '@/services/workerService';
import { jobService } from '@/services/jobService';
import { aiService } from '@/services/aiService';
import { useAuth } from '@/lib/AuthContext';

const WorkerDashboard = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { user } = useAuth();

	const [activeTab, setActiveTab] = useState('thisWeek');
	const [stats, setStats] = useState(null);
	const [activeJobsList, setActiveJobsList] = useState([]);
	const [upcomingJobs] = useState([]);
	const [recommendedJobs, setRecommendedJobs] = useState([]);
	const [trendingJobs, setTrendingJobs] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await workerService.getWorkerStats();
				setStats(res.data);
			} catch (err) {
				console.error('Failed to load worker stats:', err);
			}

			try {
				const jobsRes = await jobService.getActiveJobs();
				const STATUS_MAP = { 'accepted': 'Starting Soon', 'worker_traveling': 'Traveling', 'in_progress': 'In Progress', 'completed': 'Finished' };
				const mapped = (jobsRes.data || []).slice(0, 3).map(j => ({
					id: j.job_id,
					title: j.title,
					excerpt: '',
					price: '',
					status: STATUS_MAP[j.status] || j.status,
					location: j.location?.address || '',
					time: j.scheduled_time ? new Date(j.scheduled_time).toLocaleString() : '',
				}));
				setActiveJobsList(mapped);
			} catch (err) {
				console.error('Failed to load active jobs:', err);
			}
			try {
				const [aiRec, aiTrend] = await Promise.all([
					aiService.getRecommendedJobs(3),
					aiService.getTrendingJobs(3)
				]);
				setRecommendedJobs(aiRec.data?.jobs || []);
				setTrendingJobs(aiTrend.data?.jobs || []);
			} catch (err) {
				console.error('Failed to load AI job features:', err);
			}
		};

		fetchData();
	}, []);

	const filteredUpcoming = upcomingJobs.filter(job => {
		if (activeTab === 'thisMonth') return true;
		return job.category === activeTab;
	});

	const dashboardStats = {
		activeJobs: stats?.accepted_applications ?? 0,
		completedJobs: stats?.total_jobs_completed ?? 0,
		rating: stats?.rating ?? 0,
		earnings: 'Rs. 0'
	};

	return (
		<div className="max-w-7xl mx-auto space-y-8">

			{/* Profile Completion Banner */}
			<div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-8 text-white shadow-lg">
				<div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
					<div className="space-y-4 flex-1">
						<div>
							<h2 className="text-2xl font-bold">{t('workerDashboard.completeProfile')}</h2>
							<p className="text-blue-100 mt-1">{t('workerDashboard.profileCompletionDesc')}</p>
						</div>

						<div className="space-y-4">
							<div className="flex items-center gap-4">
								<div className="flex-1 bg-white/20 h-2.5 rounded-full overflow-hidden">
									<div className="bg-white h-full transition-all duration-500" style={{ width: '75%' }}></div>
								</div>
								<span className="font-bold">75%</span>
							</div>

							<div className="flex flex-wrap gap-4 text-xs font-medium">
								<div className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-green-300" /> {t('workerDashboard.profilePhoto')}</div>
								<div className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-green-300" /> {t('workerDashboard.skillsAdded')}</div>
								<div className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-green-300" /> {t('workerDashboard.bioWritten')}</div>
								<div className="flex items-center gap-1.5 opacity-60"><Circle size={14} /> {t('workerDashboard.profileVerified')}</div>
							</div>
						</div>
					</div>

					<Button
						variant="outline"
						className="bg-white text-blue-600 border-white hover:bg-blue-50 font-bold px-8 py-6 text-lg rounded-xl"
						onClick={() => navigate('/worker/profile')}
					>
						{t('workerDashboard.completeNow')}
					</Button>
				</div>

				<div className="absolute top-[-50%] right-[-10%] w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
			</div>

			{/* Stats Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{[
					{ label: t('workerDashboard.stats.activeJobs'), value: dashboardStats.activeJobs, change: '+ 12%', icon: Briefcase, bgClass: 'bg-blue-50', textClass: 'text-blue-600' },
					{ label: t('workerDashboard.stats.completedJobs'), value: dashboardStats.completedJobs, change: '+ 8%', icon: CheckCircle2, bgClass: 'bg-green-50', textClass: 'text-green-600' },
					{ label: t('workerDashboard.stats.rating'), value: dashboardStats.rating, change: '-', icon: Star, bgClass: 'bg-amber-50', textClass: 'text-amber-600' },
					{ label: t('workerDashboard.stats.thisMonth'), value: dashboardStats.earnings, change: '+ 24%', icon: WalletIcon, bgClass: 'bg-purple-50', textClass: 'text-purple-600' },
				].map((stat) => (
					<div key={stat.label} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group transition-all hover:shadow-md">
						<div className="space-y-1">
							<p className="text-gray-500 text-sm font-medium">{stat.label}</p>
							<h3 className="text-3xl font-extrabold text-gray-900">{stat.value}</h3>
							<p className={`text-xs font-bold ${stat.change.startsWith('+') ? 'text-green-500' : 'text-gray-400'}`}>
								{stat.change}
							</p>
						</div>
						<div className={`p-4 rounded-xl ${stat.bgClass} ${stat.textClass} group-hover:scale-110 transition-transform`}>
							<stat.icon size={28} />
						</div>
					</div>
				))}
			</div>

			{/* Main Content Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<div className="lg:col-span-2 space-y-4">
					<div className="flex items-center justify-between px-2">
						<h3 className="text-xl font-bold text-gray-900">{t('workerDashboard.stats.activeJobs')}</h3>
						<button
							onClick={() => navigate('/worker/current-jobs')}
							className="text-blue-600 text-sm font-bold hover:underline flex items-center gap-1"
						>
							{t('common.viewAll')} <ChevronRight size={14} />
						</button>
					</div>

					<div className="space-y-4">
						{activeJobsList.length === 0 ? (
							<div className="bg-white p-10 rounded-2xl border border-dashed border-gray-200 text-center">
								<Briefcase className="w-12 h-12 text-gray-200 mx-auto mb-3" />
								<p className="text-gray-500 font-medium mb-1">No active jobs right now</p>
								<p className="text-gray-400 text-sm mb-4">Browse available jobs and start working</p>
								<button
									onClick={() => navigate('/worker/find-jobs')}
									className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
								>
									Find Jobs
								</button>
							</div>
						) : (
							activeJobsList.map(job => (
								<div key={job.id} onClick={() => navigate(`/worker/jobs/${job.id}`)} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm transition-all hover:border-blue-100 hover:shadow-lg cursor-pointer">
									<div className="flex justify-between items-start mb-5">
										<div className="space-y-2 flex-1 min-w-0 mr-4">
											<h4 className="text-xl font-bold text-gray-900">{job.title}</h4>
											<p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{job.excerpt || 'Tap to view details'}</p>
										</div>
										<span className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap ${job.status === 'In Progress' ? 'bg-blue-50 text-blue-600' : job.status === 'Traveling' ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'}`}>
											{job.status}
										</span>
									</div>
									<div className="flex flex-wrap items-center justify-between pt-5 border-t border-gray-100 gap-4">
										<div className="flex items-center gap-5 text-sm font-medium text-gray-400">
											<span className="flex items-center gap-1.5"><MapPin size={16} /> {job.location || 'Location pending'}</span>
											<span className="flex items-center gap-1.5"><Calendar size={16} /> {job.time || 'Schedule pending'}</span>
										</div>
										<span className="text-blue-600 font-extrabold text-xl">{job.price}</span>
									</div>
								</div>
							))
						)}
					</div>
				</div>

				<div className="space-y-4">
					<div className="px-2">
						<h3 className="text-xl font-bold text-gray-900">{t('workerDashboard.reputation')}</h3>
					</div>

					<div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center flex flex-col items-center">
						<div className="relative mb-6">
							<div className="w-24 h-24 rounded-full border-4 border-blue-50 flex items-center justify-center relative">
								<span className="text-3xl font-black text-blue-600">{dashboardStats.rating}</span>
								<div className="absolute inset-0 border-t-4 border-blue-600 rounded-full rotate-45"></div>
							</div>
						</div>

						<div className="flex gap-1.5 mb-8">
							{[1, 2, 3, 4, 5].map(i => (
								<Star key={i} size={22} className={i <= Math.floor(Number(dashboardStats.rating) || 0) ? "fill-amber-400 text-amber-400" : "fill-gray-100 text-gray-200"} />
							))}
						</div>

						<div className="w-full space-y-3">
							{[5, 4, 3, 2, 1].map((rating, idx) => (
								<div key={rating} className="flex items-center gap-3 w-full">
									<span className="text-sm font-bold text-gray-500 w-4">{rating}</span>
									<div className="flex-1 bg-gray-50 h-2 rounded-full overflow-hidden">
										<div
											className="h-full bg-amber-400"
											style={{ width: `${[85, 12, 5, 2, 0][idx]}%` }}
										></div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* Upcoming Jobs */}
			<div className="space-y-6">
				<div className="flex items-center justify-between px-2">
					<h3 className="text-xl font-bold text-gray-900">{t('workerDashboard.upcomingJobs')}</h3>
					<div className="flex gap-4 text-sm font-bold text-gray-500">
						<button
							onClick={() => setActiveTab('thisWeek')}
							className={`${activeTab === 'thisWeek' ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : ''}`}
						>
							{t('workerDashboard.thisWeek')}
						</button>
						<button
							onClick={() => setActiveTab('nextWeek')}
							className={`${activeTab === 'nextWeek' ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : ''}`}
						>
							{t('workerDashboard.nextWeek')}
						</button>
						<button
							onClick={() => setActiveTab('thisMonth')}
							className={`${activeTab === 'thisMonth' ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : ''}`}
						>
							{t('workerDashboard.thisMonthTab')}
						</button>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{filteredUpcoming.map(item => (
						<div key={item.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
							<div className="flex justify-between items-center mb-4">
								<span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-black uppercase tracking-wider">{item.day}</span>
								<span className="text-sm font-bold text-gray-400">{item.date}</span>
							</div>
							<h4 className="text-lg font-bold text-gray-900 mb-1">{item.title}</h4>
							<p className="text-gray-500 text-sm mb-4">{item.excerpt}</p>
							<div className="flex items-center gap-2 text-xs font-bold text-gray-400">
								<Calendar size={14} />
								{item.time}
							</div>
						</div>
					))}
					{filteredUpcoming.length === 0 && (
						<div className="col-span-full py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
							<p className="text-gray-400 font-medium">No jobs scheduled for this period</p>
						</div>
					)}
				</div>
			</div>

			{/* 5. Recommended For You (AI Feature) */}
			<div className="space-y-6">
				<div className="flex items-center justify-between px-2">
					<h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
						Recommended For You
					</h3>
					<button onClick={() => navigate('/worker/find-jobs')} className="text-blue-600 text-sm font-bold hover:underline">{t('common.viewAll')}</button>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{recommendedJobs.length > 0 ? recommendedJobs.map((job) => (
						<div key={job.id} onClick={() => navigate(`/worker/jobs/${job.id}`)} className="bg-gradient-to-br from-white to-blue-50/30 p-6 rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition-all cursor-pointer group">
							<h4 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">{job.title}</h4>
							<p className="text-gray-500 text-sm mb-4 line-clamp-2">{job.description}</p>
							<div className="flex justify-between items-center text-xs font-bold text-gray-500">
								<span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{job.payment_type}</span>
								<span className="text-gray-900">Rs. {job.budget}</span>
							</div>
						</div>
					)) : (
						<div className="col-span-full py-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
							<p className="text-gray-400 font-medium">Keep completing jobs to get personalized recommendations!</p>
						</div>
					)}
				</div>
			</div>

			{/* 6. Trending Jobs (AI Feature) */}
			<div className="space-y-6">
				<div className="flex items-center justify-between px-2">
					<h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
						Trending Jobs
					</h3>
					<button onClick={() => navigate('/worker/find-jobs')} className="text-blue-600 text-sm font-bold hover:underline">{t('common.viewAll')}</button>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{trendingJobs.length > 0 ? trendingJobs.map((job) => (
						<div key={job.id} onClick={() => navigate(`/worker/jobs/${job.id}`)} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-green-200 hover:shadow-md transition-all cursor-pointer group">
							<h4 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors mb-2">{job.title}</h4>
							<p className="text-gray-500 text-sm mb-4 line-clamp-2">{job.description}</p>
							<div className="flex justify-between items-center text-xs font-bold text-gray-500">
								<span className="flex items-center gap-1"><MapPin size={12}/> {job.city || 'Remote'}</span>
								<span className="text-green-600 bg-green-50 px-2 py-1 rounded-md">High Demand</span>
							</div>
						</div>
					)) : (
						<div className="col-span-full py-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
							<p className="text-gray-400 font-medium">No trending data available right now.</p>
						</div>
					)}
				</div>
			</div>

		</div>
	);
};

export default WorkerDashboard;
