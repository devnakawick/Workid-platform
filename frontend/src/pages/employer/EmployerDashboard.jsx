import React from 'react';
import { Users, FileText, DollarSign, Calendar, Star } from 'lucide-react';

const mock = {
	name: 'Samantha',
	company: 'Homeowner',
	stats: {
		postedJobs: 8,
		activeHires: 3,
		pendingApplications: 5,
		spendThisMonth: 'Rs. 24,300'
	},
	postedJobs: [
		{ id: 1, title: 'Kitchen Sink Repair', applicants: 4, date: '2 days ago', status: 'Open' },
		{ id: 2, title: 'AC Service', applicants: 2, date: '5 days ago', status: 'Interviewing' },
		{ id: 3, title: 'Garden Cleanup', applicants: 6, date: '1 week ago', status: 'Completed' }
	],
	recentApplicants: [
		{ id: 'a1', name: 'Anura Perera', job: 'Kitchen Sink Repair', applied: 'Today' },
		{ id: 'a2', name: 'Nimal Silva', job: 'AC Service', applied: 'Yesterday' }
	],
	upcoming: [
		{ id: 'u1', title: 'Carpenter Visit', date: 'Tomorrow, 10:00 AM' },
		{ id: 'u2', title: 'Plumber Arrival', date: 'Nov 28, 2:00 PM' }
	]
};

const styles = {
	page: { background: '#f1f5f9', minHeight: '100vh', padding: 20 },
	container: { maxWidth: 1200, margin: '0 auto' },
	headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
	title: { fontSize: 20, fontWeight: 700, color: '#0f172a' },
	subtitle: { color: '#64748b', fontSize: 13 },
	statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginTop: 12 },
	statCard: { background: '#fff', borderRadius: 10, padding: 14, boxShadow: '0 6px 14px rgba(2,6,23,0.04)', display: 'flex', alignItems: 'center', gap: 12 },
	mainGrid: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 18, marginTop: 18 },
	card: { background: '#fff', borderRadius: 10, padding: 16, boxShadow: '0 6px 14px rgba(2,6,23,0.04)' },
	jobRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #eef2ff' },
	smallText: { fontSize: 13, color: '#64748b' }
};

export default function EmployerDashboard() {
	return (
		<div style={styles.page}>
			<div style={styles.container}>
				<div style={styles.headerRow}>
					<div>
						<div style={styles.title}>Welcome back, {mock.name}</div>
						<div style={styles.subtitle}>Manage your household jobs and hires</div>
					</div>
					<div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
						<button style={{ padding: '8px 12px', borderRadius: 8, background: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer' }}>Post a Job</button>
						<div style={{ width: 36, height: 36, borderRadius: 8, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🔔</div>
						<div style={{ width: 36, height: 36, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>SP</div>
					</div>
				</div>

				<div style={styles.statsGrid}>
					<div style={styles.statCard}><FileText size={20} /><div><div style={{ fontSize: 12, color: '#64748b' }}>Posted Jobs</div><div style={{ fontWeight: 700 }}>{mock.stats.postedJobs}</div></div></div>
					<div style={styles.statCard}><Users size={20} /><div><div style={{ fontSize: 12, color: '#64748b' }}>Active Hires</div><div style={{ fontWeight: 700 }}>{mock.stats.activeHires}</div></div></div>
					<div style={styles.statCard}><Calendar size={20} /><div><div style={{ fontSize: 12, color: '#64748b' }}>Pending Applications</div><div style={{ fontWeight: 700 }}>{mock.stats.pendingApplications}</div></div></div>
					<div style={styles.statCard}><DollarSign size={20} /><div><div style={{ fontSize: 12, color: '#64748b' }}>This Month</div><div style={{ fontWeight: 700 }}>{mock.stats.spendThisMonth}</div></div></div>
				</div>

				<div style={styles.mainGrid}>
					<div>
						<div style={styles.card}>
							<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
								<h3 style={{ margin: 0 }}>Your Posted Jobs</h3>
								<a href="#" style={{ color: '#2563eb', fontSize: 13 }}>Manage jobs</a>
							</div>
							<div>
								{mock.postedJobs.map((j) => (
									<div key={j.id} style={styles.jobRow}>
										<div>
											<div style={{ fontWeight: 700 }}>{j.title}</div>
											<div style={styles.smallText}>{j.applicants} applicants • {j.date}</div>
										</div>
										<div style={{ textAlign: 'right' }}>
											<div style={{ fontSize: 13, color: j.status === 'Completed' ? '#10b981' : '#2563eb', fontWeight: 700 }}>{j.status}</div>
										</div>
									</div>
								))}
							</div>
						</div>

						<div style={{ ...styles.card, marginTop: 18 }}>
							<h3 style={{ marginTop: 0 }}>Recent Applicants</h3>
							<div style={{ display: 'grid', gap: 12 }}>
								{mock.recentApplicants.map((a) => (
									<div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
										<div>
											<div style={{ fontWeight: 700 }}>{a.name}</div>
											<div style={styles.smallText}>{a.job} • {a.applied}</div>
										</div>
										<div>
											<button style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer' }}>View</button>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>

					<aside>
						<div style={styles.card}>
							<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
								<div>
									<div style={{ fontSize: 13, color: '#64748b' }}>Upcoming Visits</div>
									<div style={{ fontWeight: 700, marginTop: 6 }}>Home visits scheduled</div>
								</div>
								<div style={{ textAlign: 'right' }}> </div>
							</div>
							<div style={{ marginTop: 12, display: 'grid', gap: 10 }}>
								{mock.upcoming.map((u) => (
									<div key={u.id} style={{ border: '1px solid #eef2ff', padding: 10, borderRadius: 8 }}>
										<div style={{ fontWeight: 700 }}>{u.title}</div>
										<div style={styles.smallText}>{u.date}</div>
									</div>
								))}
							</div>
						</div>

						<div style={{ ...styles.card, marginTop: 18 }}>
							<div style={{ fontWeight: 700, marginBottom: 8 }}>Quick Actions</div>
							<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
								<button style={{ padding: '10px', borderRadius: 8, background: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer' }}>Post New Job</button>
								<button style={{ padding: '10px', borderRadius: 8, background: '#fff', color: '#0f172a', border: '1px solid #e5e7eb', cursor: 'pointer' }}>Manage Hires</button>
								<button style={{ padding: '10px', borderRadius: 8, background: '#fff', color: '#0f172a', border: '1px solid #e5e7eb', cursor: 'pointer' }}>Payments</button>
							</div>
						</div>
					</aside>
				</div>
			</div>
		</div>
	);
}

