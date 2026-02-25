import React from 'react';
import { Star } from 'lucide-react';

const mock = {
  name: 'Anura Perera',
  title: 'Plumber',
  experience: '5 Years Experience',
  phone: '077-1234567',
  location: 'Colombo 07',
  badges: [
    { text: 'ID Verified', color: '#e6f4ff', textColor: '#0369a1' },
    { text: 'Skill Verified - Gold', color: '#fff7ed', textColor: '#b45309' },
    { text: 'Safety Trained', color: '#ecfdf5', textColor: '#065f46' }
  ],
  reputation: { rating: 4.8, jobsCompleted: 42, onTime: '97%', trust: '92%' },
  reviews: [
    { reviewer: 'S. Fernando', rating: 5.0, text: 'Anura was on time and did excellent work.' },
    { reviewer: 'T. Perera', rating: 4.9, text: 'Very professional and friendly.' },
    { reviewer: 'N. Silva', rating: 4.7, text: 'Quick and reliable service.' }
  ]
};

const container = {
  background: '#f8fafc',
  minHeight: '100vh',
  padding: '24px'
};

const inner = {
  maxWidth: '1180px',
  margin: '0 auto',
  display: 'grid',
  gridTemplateColumns: '320px 1fr',
  gap: '24px'
};

const card = {
  background: '#ffffff',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(15,23,42,0.06)',
  padding: '20px'
};

const profileAvatar = {
  width: '96px',
  height: '96px',
  borderRadius: '50%',
  background: '#e6e8ee',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '36px',
  color: '#475569',
  margin: '0 auto'
};

const badgeStyle = (bg, color) => ({
  background: bg,
  color,
  padding: '6px 10px',
  borderRadius: '999px',
  fontSize: '12px',
  display: 'inline-block',
  marginRight: '8px'
});

export default function WorkerProfile({ buttons = {}, handlers = {} }) {
  const defaultButtonStyle = {
    marginTop: '18px',
    padding: '10px 20px',
    borderRadius: '8px',
    border: '1px solid #2563eb',
    background: 'white',
    color: '#2563eb',
    cursor: 'pointer'
  };

  const EditButton = () => {
    const cfg = buttons.editProfile || {};
    const label = cfg.label || 'Edit Profile';
    const style = { ...defaultButtonStyle, ...(cfg.style || {}) };
    const onClick = cfg.onClick || handlers.onEditProfile || (() => {});
    return (
      <button style={style} onClick={onClick}>{label}</button>
    );
  };

  return (
    <div style={container}>
      <div style={inner}>
        {/* Left column */}
        <div>
          <div style={{ ...card, textAlign: 'center' }}>
            <div style={profileAvatar}>A</div>
            <h2 style={{ marginTop: '16px', marginBottom: '6px', fontSize: '20px', color: '#0f172a' }}>{mock.name}</h2>
            <p style={{ margin: 0, color: '#475569' }}>{mock.title} • {mock.experience}</p>

            <div style={{ marginTop: '14px' }}>
              {mock.badges.map((b, i) => (
                <span key={i} style={badgeStyle(b.color, b.textColor)}>{b.text}</span>
              ))}
            </div>

            <div style={{ marginTop: '18px', color: '#475569' }}>
              <div style={{ marginBottom: '6px' }}>📞 {mock.phone}</div>
              <div>📍 {mock.location}</div>
            </div>

            <EditButton />
          </div>

          {/* Reviews card below profile on left */}
          <div style={{ ...card, marginTop: '18px' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Employer Reviews</h3>
            <div style={{ display: 'grid', gap: '10px' }}>
              {mock.reviews.map((r, idx) => (
                <div key={idx} style={{ border: '1px solid #eef2ff', borderRadius: '8px', padding: '10px', background: '#ffffff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{`Reviewer: ${r.reviewer}`}</div>
                      <div style={{ fontSize: '13px', color: '#475569' }}>{`⭐ ${r.rating}`}</div>
                    </div>
                  </div>
                  <p style={{ marginTop: '8px', marginBottom: 0, color: '#334155' }}>&quot;{r.text}&quot;</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div>
          <div style={{ ...card, marginBottom: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>Reputation Overview</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: '#fff7ed', padding: '8px 12px', borderRadius: '999px', fontWeight: 700 }}>{mock.reputation.rating} <Star width={14} height={14} /></div>
              </div>
            </div>

            <div style={{ marginTop: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ flex: 1, background: '#f8fafc', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontWeight: 700, fontSize: '18px' }}>{mock.reputation.jobsCompleted}</div>
                <div style={{ fontSize: '12px', color: '#475569' }}>Jobs Completed</div>
              </div>
              <div style={{ flex: 1, background: '#f8fafc', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontWeight: 700, fontSize: '18px' }}>{mock.reputation.onTime}</div>
                <div style={{ fontSize: '12px', color: '#475569' }}>On-Time Rate</div>
              </div>
              <div style={{ flex: 2, background: '#f8fafc', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontWeight: 700, fontSize: '14px' }}>Employer Trust Score: {mock.reputation.trust}</div>
              </div>
            </div>
          </div>

          <div style={{ ...card, marginBottom: '18px' }}>
            <h3 style={{ margin: 0, marginBottom: '12px' }}>Verified Skills & Badges</h3>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {mock.badges.map((b, i) => (
                <div key={i} style={{ padding: '8px 12px', borderRadius: '999px', background: b.color, color: b.textColor }}>{b.text}</div>
              ))}
            </div>
          </div>

          <div style={{ ...card }}>
            <h3 style={{ margin: 0, marginBottom: '12px' }}>Recent Activity</h3>
            <p style={{ margin: 0, color: '#475569' }}>No recent activity to show.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
