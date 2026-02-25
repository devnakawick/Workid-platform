import React from 'react';
import { Star } from 'lucide-react';

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
		{ id: 1, title: 'Kitchen Sink Repair', excerpt: 'Fix leaking kitchen sink and replace faucet. Materials provided.', price: 'Rs. 4,000.00', tag: 'In Progress' },
		{ id: 2, title: 'Bathroom Plumbing Install', excerpt: 'Complete bathroom plumbing installation for new construction.', price: 'Rs. 65,000.00', tag: 'Starting Soon' }
	],
	upcoming: [
		{ id: 'u1', title: 'Pipe Replacement', date: 'Mon', day: 'Nov 26', time: '10:00 AM - 2:00 PM' },
		{ id: 'u2', title: 'Drain Cleaning', date: 'Tue', day: 'Nov 27', time: '1:00 PM - 3:00 PM' },
		{ id: 'u3', title: 'Toilet Repair', date: 'Thu', day: 'Nov 29', time: '9:00 AM - 11:00 AM' }
	]
};

const styles = {
	page: { background: '#f1f5f9', minHeight: '100vh', padding: '20px 28px' },
	container: { maxWidth: 1200, margin: '0 auto' },
	topRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
	title: { fontSize: 20, fontWeight: 700, color: '#0f172a' },
	subtitle: { color: '#64748b', fontSize: 13 },
	banner: { background: 'linear-gradient(90deg,#0ea5e9,#2563eb)', borderRadius: 12, padding: 18, color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 },
	bannerLeft: { flex: 1 },
	bannerTitle: { fontSize: 16, fontWeight: 700, marginBottom: 8 },
	progressWrap: { background: 'rgba(255,255,255,0.12)', height: 10, borderRadius: 999, overflow: 'hidden', marginTop: 8 },
	progressFill: (pct) => ({ width: `${pct}%`, height: '100%', background: 'rgba(255,255,255,0.9)' }),
	bannerCta: { marginLeft: 12, padding: '10px 16px', borderRadius: 8, background: 'white', color: '#2563eb', fontWeight: 700, cursor: 'pointer' },
	statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginTop: 18 },
	statCard: { background: 'white', borderRadius: 10, padding: 14, boxShadow: '0 4px 10px rgba(2,6,23,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
	mainGrid: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 18, marginTop: 18 },
	card: { background: 'white', borderRadius: 10, padding: 16, boxShadow: '0 6px 14px rgba(2,6,23,0.04)' },
	jobItem: { borderBottom: '1px solid #eef2ff', padding: '12px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
	upcomingWrap: { marginTop: 18, background: 'white', borderRadius: 10, padding: 16, boxShadow: '0 6px 14px rgba(2,6,23,0.04)' },
	upcomingRow: { display: 'flex', gap: 12 }
};

export default function WorkerDashboard() {
	return (
		<div style={styles.page}>
			<div style={styles.container}>
				<div style={styles.topRow}>
					<div>
						<div style={styles.title}>Welcome back, {mock.user}</div>
						<div style={styles.subtitle}>Here's what's happening with your work today!</div>
					</div>
					<div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
						<div style={{ width: 36, height: 36, borderRadius: 8, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🔔</div>
						<div style={{ width: 36, height: 36, borderRadius: 8, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✉️</div>
						<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
							<div style={{ width: 36, height: 36, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>JD</div>
						</div>
					</div>
				</div>

				<div style={styles.banner}>
					<div style={styles.bannerLeft}>
						<div style={styles.bannerTitle}>Complete Your Profile</div>
						<div style={{ color: 'rgba(255,255,255,0.9)' }}>You're almost there! Complete your profile to get more job opportunities</div>
						<div style={styles.progressWrap}>
							<div style={styles.progressFill(mock.completion)} />
						</div>
					</div>
					<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
						<div style={{ color: 'rgba(255,255,255,0.9)', marginBottom: 8 }}>{mock.completion}%</div>
						<button style={styles.bannerCta}>Complete Now</button>
					</div>
				</div>

				<div style={styles.statsGrid}>
					<div style={styles.statCard}>
						<div>
							<div style={{ fontSize: 12, color: '#64748b' }}>Active Jobs</div>
							<div style={{ fontSize: 20, fontWeight: 700 }}>{mock.stats.activeJobs}</div>
						</div>
						<div style={{ color: '#10b981' }}>▲ 12%</div>
					</div>
					<div style={styles.statCard}>
						<div>
							<div style={{ fontSize: 12, color: '#64748b' }}>Completed Jobs</div>
							<div style={{ fontSize: 20, fontWeight: 700 }}>{mock.stats.completedJobs}</div>
						</div>
						<div style={{ color: '#10b981' }}>▲ 8%</div>
					</div>
					<div style={styles.statCard}>
						<div>
							<div style={{ fontSize: 12, color: '#64748b' }}>Rating</div>
							<div style={{ fontSize: 20, fontWeight: 700 }}>{mock.stats.rating}</div>
						</div>
						<div style={{ fontSize: 18, color: '#f59e0b' }}>★</div>
					</div>
					<div style={styles.statCard}>
						<div>
							<div style={{ fontSize: 12, color: '#64748b' }}>This Month</div>
							<div style={{ fontSize: 20, fontWeight: 700 }}>{mock.stats.earnings}</div>
						</div>
						<div style={{ color: '#10b981' }}>▲ 24%</div>
					</div>
				</div>

				<div style={styles.mainGrid}>
					<div>
						<div style={styles.card}>
							<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
								<h3 style={{ margin: 0 }}>Active Jobs</h3>
								<a href="#" style={{ color: '#2563eb', fontSize: 13 }}>View all</a>
							</div>
							<div>
								{mock.activeJobsList.map((j) => (
									<div key={j.id} style={styles.jobItem}>
										<div style={{ maxWidth: '70%' }}>
											<div style={{ fontWeight: 700 }}>{j.title}</div>
											<div style={{ fontSize: 13, color: '#64748b' }}>{j.excerpt}</div>
										</div>
										<div style={{ textAlign: 'right' }}>
											<div style={{ color: '#2563eb', fontWeight: 700 }}>{j.price}</div>
											<div style={{ fontSize: 12, color: '#10b981' }}>{j.tag}</div>
										</div>
									</div>
								))}
							</div>
						</div>
						<div style={{ ...styles.card, marginTop: 18 }}>
							<h3 style={{ marginTop: 0 }}>Upcoming Jobs</h3>
							<div style={styles.upcomingRow}>
								{mock.upcoming.map((u) => (
									<div key={u.id} style={{ flex: 1, border: '1px solid #eef2ff', borderRadius: 8, padding: 12 }}>
										<div style={{ fontSize: 12, color: '#64748b' }}>{u.date} • {u.day}</div>
										<div style={{ fontWeight: 700, marginTop: 6 }}>{u.title}</div>
										<div style={{ fontSize: 12, color: '#64748b', marginTop: 8 }}>{u.time}</div>
									</div>
								))}
							</div>
						</div>
					</div>

					<div>
						<div style={{ ...styles.card }}>
							<h3 style={{ marginTop: 0 }}>Reputation</h3>
							<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
								<div style={{ width: 64, height: 64, borderRadius: 12, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{mock.stats.rating}</div>
								<div style={{ flex: 1 }}>
									<div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
										{Array.from({ length: 5 }).map((_, i) => (
											<Star key={i} size={16} color={i < Math.round(mock.stats.rating) ? '#f59e0b' : '#e6eaf0'} />
										))}
									</div>
									<div style={{ height: 8, background: '#eef2ff', borderRadius: 999, marginTop: 12, overflow: 'hidden' }}>
										<div style={{ width: `${(mock.stats.rating / 5) * 100}%`, height: '100%', background: '#f59e0b' }} />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

