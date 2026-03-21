import React, { useState, useEffect } from 'react';
import {
	Briefcase,
	CheckCircle2,
	Star,
	Wallet as WalletIcon,
	MapPin,
	Calendar,
	ChevronRight,
	Circle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import workerService from '@/services/workerService';
import { useAuth } from '@/lib/AuthContext';

const mock = {
	user: 'John',
	completion: 75,
	stats: {
		activeJobs: 5,
		completedJobs: 12,
		rating: 4.8,
		earnings: 'Rs. 7,500'
	},
	activeJobsList: [
		{ id: 1, title: 'Kitchen Sink Repair', excerpt: 'Fix leaking kitchen sink and replace faucet. Materials provided.', price: 'Rs. 4000.00', status: 'In Progress', location: '2.3 KM', time: 'Today, 2:00 PM' },
		{ id: 2, title: 'Bathroom Plumbing Install', excerpt: 'Complete bathroom plumbing installation for new construction.', price: 'Rs. 65,000.00', status: 'Starting Soon', location: '2.3 4.1 KM', time: 'Tomorrow, 9:00 AM' }
	],
	upcoming: [
		{ id: 'u1', title: 'Pipe Replacement', excerpt: 'Replace old pipes', day: 'MON', date: 'Nov 26', time: '10:00 AM - 2:00 PM', category: 'thisWeek' },
		{ id: 'u2', title: 'Drain Cleaning', excerpt: 'Clear clogged bathroom drain', day: 'TUE', date: 'Nov 27', time: '1:00 PM - 3:00 PM', category: 'thisWeek' },
		{ id: 'u3', title: 'Toilet Repair', excerpt: 'Fix running toilet issue', day: 'THU', date: 'Nov 29', time: '9:00 AM - 11:00 AM', category: 'nextWeek' },
		{ id: 'u4', title: 'Garden Maintenance', excerpt: 'Seasonal garden cleanup', day: 'SAT', date: 'Dec 05', time: '8:00 AM - 12:00 PM', category: 'thisMonth' }
	]
};

const WorkerDashboard = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { user } = useAuth();

	const [activeTab, setActiveTab] = useState('thisWeek');
	const [stats, setStats] = useState(null);

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const res = await workerService.getWorkerStats();
				setStats(res.data);
			} catch (err) {
				console.error('Failed to load worker stats:', err);
			}
		};

		fetchStats();
	}, []);

	const filteredUpcoming = mock.upcoming.filter(job => {
		if (activeTab === 'thisMonth') return true;
		return job.category === activeTab;
	});

	const dashboardStats = {
		activeJobs: stats?.accepted_applications ?? mock.stats.activeJobs,
		completedJobs: stats?.total_jobs_completed ?? mock.stats.completedJobs,
		rating: stats?.rating ?? mock.stats.rating,
		earnings: mock.stats.earnings 
	};

	return (
		<div className="max-w-7xl mx-auto space-y-8">

			{/* 1. Profile Completion Banner */}
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

			{/* 2. Stats Grid */}
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

			{/* 3. Main Content Grid */}
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
						{mock.activeJobsList.map(job => (
							<div key={job.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:border-blue-100 hover:shadow-md">
								<div className="flex justify-between items-start mb-4">
									<div className="space-y-1">
										<h4 className="text-lg font-bold text-gray-900">{job.title}</h4>
										<p className="text-gray-500 text-sm leading-relaxed">{job.excerpt}</p>
									</div>
									<span className={`px-4 py-1.5 rounded-full text-xs font-bold ${job.status === 'In Progress' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
										{job.status}
									</span>
								</div>
								<div className="flex flex-wrap items-center justify-between pt-4 border-t border-gray-50 gap-4 mt-2">
									<div className="flex items-center gap-4 text-xs font-bold text-gray-400">
										<span className="flex items-center gap-1.5"><MapPin size={14} /> {job.location}</span>
										<span className="flex items-center gap-1.5"><Calendar size={14} /> {job.time}</span>
									</div>
									<span className="text-blue-600 font-extrabold text-lg">{job.price}</span>
								</div>
							</div>
						))}
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

			{/* 4. Upcoming Jobs */}
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
		</div>
	);
};

export default WorkerDashboard;
