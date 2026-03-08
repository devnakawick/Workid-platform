import React from 'react';
import {
	Users,
	FileText,
	DollarSign,
	Calendar,
	MapPin,
	Clock,
	Briefcase,
	TrendingUp,
	TrendingDown,
	Handshake,
	Bell,
	CheckCircle2,
	MessageSquare,
	Filter,
	ChevronRight,
	MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const mock = {
	stats: [
		{ label: 'Posted Jobs', value: '2', change: '+2 this week', icon: Briefcase, color: 'blue', changeColor: 'text-green-500' },
		{ label: 'Applications', value: '10', change: '+3 this week', icon: Users, color: 'green', changeColor: 'text-green-500' },
		{ label: 'Money Spent', value: '7,250', change: '47% of total', icon: DollarSign, color: 'orange', changeColor: 'text-orange-500', isDown: true },
		{ label: 'Hired', value: '2', change: '+1 this week', icon: Handshake, color: 'purple', changeColor: 'text-green-500' },
	],
	recentlyPosted: [
		{
			id: 1,
			title: 'Construction Worker',
			description: 'Experienced construction worker skilled in building, repairing, and maintaining residential and commercial structures with precision and safety.',
			location: 'Dehiwala',
			date: '2 days ago',
			type: 'Full-time',
			price: 'Rs. 2,500/day'
		},
		{
			id: 2,
			title: 'House Cleaner',
			description: 'Reliable house cleaner with experience in deep cleaning, organizing, and maintaining spotless, welcoming homes.',
			location: 'Nugegoda',
			date: '3 days ago',
			type: 'Part-time',
			price: 'Rs. 750/hour'
		}
	],
	notifications: [
		{ id: 1, type: 'application', title: 'New Application', desc: 'Jane applied for your recent job', time: '2 minutes ago', color: 'blue', icon: Users },
		{ id: 2, type: 'completion', title: 'Job Completed', desc: 'House cleaning job finished', time: '1 hour ago', color: 'green', icon: CheckCircle2 },
		{ id: 3, type: 'message', title: 'New Message', desc: 'David sent you a new message', time: '2 hour ago', color: 'purple', icon: MessageSquare },
	],
	applications: [
		{
			id: 'ap1',
			name: 'Jane Smith',
			email: 'jane.s@gmail.com',
			job: 'House Cleaning',
			experience: '5 years',
			date: 'Nov 22, 2025',
			status: 'Under Review',
			avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane'
		}
	]
};

const EmployerDashboard = () => {
	return (
		<div className="max-w-7xl mx-auto space-y-6 pb-12">

			{/* 1. Stats Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				{mock.stats.map((stat) => (
					<div key={stat.label} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group">
						<div className="space-y-1">
							<p className="text-gray-500 text-sm font-medium">{stat.label}</p>
							<h3 className="text-3xl font-extrabold text-gray-900">{stat.value}</h3>
							<div className={`flex items-center gap-1 text-xs font-bold ${stat.changeColor}`}>
								{stat.isDown ? <TrendingUp size={12} className="rotate-180" /> : <TrendingUp size={12} />}
								{stat.change}
							</div>
						</div>
						<div className={`p-4 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 ${stat.color === 'blue' ? 'bg-blue-50 text-blue-500' :
								stat.color === 'green' ? 'bg-green-50 text-green-500' :
									stat.color === 'orange' ? 'bg-orange-50 text-orange-500' :
										'bg-purple-50 text-purple-500'
							}`}>
							<stat.icon size={28} />
						</div>
					</div>
				))}
			</div>

			{/* 2. Middle Row: Recently Posted & Notifications */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Recently Posted */}
				<div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
					<div className="flex items-center justify-between mb-6">
						<h3 className="text-xl font-bold text-gray-900">Recently Posted</h3>
						<button className="text-blue-600 text-sm font-bold hover:underline">View all</button>
					</div>

					<div className="space-y-4">
						{mock.recentlyPosted.map(job => (
							<div key={job.id} className="p-5 rounded-2xl border border-gray-100 hover:border-blue-100 transition-all group">
								<div className="flex justify-between items-start">
									<div className="space-y-2 flex-1">
										<h4 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{job.title}</h4>
										<p className="text-gray-500 text-sm leading-relaxed line-clamp-2 md:max-w-xl">{job.description}</p>
										<div className="flex flex-wrap items-center gap-4 pt-2">
											<span className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
												<MapPin size={14} /> {job.location}
											</span>
											<span className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
												<Calendar size={14} /> {job.date}
											</span>
											<span className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
												<Clock size={14} /> {job.type}
											</span>
										</div>
									</div>
									<div className="text-right whitespace-nowrap pl-4">
										<span className="text-blue-600 font-extrabold text-lg">{job.price}</span>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Recent Notifications */}
				<div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
					<div className="flex items-center justify-between mb-6">
						<h3 className="text-xl font-bold text-gray-900">Recent Notifications</h3>
						<button className="text-blue-600 text-sm font-bold hover:underline">View all</button>
					</div>

					<div className="space-y-4">
						{mock.notifications.map(notif => (
							<div key={notif.id} className={`p-4 rounded-2xl flex items-start gap-4 ${notif.color === 'blue' ? 'bg-blue-50/50' :
									notif.color === 'green' ? 'bg-green-50/50' :
										'bg-purple-50/50'
								}`}>
								<div className={`p-2 rounded-full flex-shrink-0 ${notif.color === 'blue' ? 'bg-blue-500 text-white' :
										notif.color === 'green' ? 'bg-green-500 text-white' :
											'bg-purple-500 text-white'
									}`}>
									<notif.icon size={16} />
								</div>
								<div className="space-y-0.5 min-w-0">
									<h4 className="font-bold text-gray-900 text-sm truncate">{notif.title}</h4>
									<p className="text-gray-600 text-xs truncate">{notif.desc}</p>
									<p className="text-blue-500 text-[10px] font-bold mt-1 uppercase tracking-wider">{notif.time}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* 3. Bottom Table: Recent Applications */}
			<div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6">
				<div className="flex items-center justify-between mb-8">
					<h3 className="text-xl font-bold text-gray-900">Recent Applications</h3>
					<div className="flex items-center gap-4">
						<Button variant="outline" className="flex items-center gap-2 font-bold text-gray-500">
							<Filter size={16} /> Filter
						</Button>
						<button className="text-blue-600 text-sm font-bold hover:underline">View All Applications</button>
					</div>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full text-left">
						<thead>
							<tr className="border-b border-gray-50">
								<th className="pb-4 text-[11px] font-black text-gray-400 uppercase tracking-widest pl-2">Applicant</th>
								<th className="pb-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Job Posting</th>
								<th className="pb-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Experience</th>
								<th className="pb-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Applied Date</th>
								<th className="pb-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Status</th>
								<th className="pb-4 text-[11px] font-black text-gray-400 uppercase tracking-widest pr-2 text-right">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-50">
							{mock.applications.map((app) => (
								<tr key={app.id} className="group hover:bg-slate-50/50 transition-colors">
									<td className="py-5 pl-2">
										<div className="flex items-center gap-3">
											<img src={app.avatar} alt={app.name} className="w-10 h-10 rounded-full border border-gray-100 bg-slate-50" />
											<div>
												<p className="text-sm font-bold text-gray-900">{app.name}</p>
												<p className="text-[11px] font-medium text-gray-400">{app.email}</p>
											</div>
										</div>
									</td>
									<td className="py-5">
										<p className="text-sm font-bold text-gray-600">{app.job}</p>
									</td>
									<td className="py-5">
										<p className="text-sm font-bold text-gray-600">{app.experience}</p>
									</td>
									<td className="py-5">
										<p className="text-sm font-bold text-gray-600">{app.date}</p>
									</td>
									<td className="py-5">
										<Badge variant="outline" className="bg-orange-50 text-orange-600 border-none font-bold py-1 px-3">
											{app.status}
										</Badge>
									</td>
									<td className="py-5 text-right pr-2">
										<button className="p-2 text-gray-300 hover:text-gray-600 transition-colors">
											<MoreHorizontal size={20} />
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default EmployerDashboard;
