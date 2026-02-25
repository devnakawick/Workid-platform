import React from 'react';

const mock = {
  name: 'Samantha Perera',
  role: 'Homeowner',
  location: 'Colombo 05',
  contact: '077-9876543',
  ongoing: [
    { id: 1, title: 'Kitchen Faucet Replacement', progress: 60, eta: 'Today, 3:00 PM', note: 'Plumber assigned' },
    { id: 2, title: 'Window Repair', progress: 30, eta: 'Tomorrow, 10:00 AM', note: 'In inspection' }
  ],
  history: [
    { id: 'h1', title: 'Bathroom Re-tiling', summary: 'Completed full bathroom re-tiling and plumbing fixes. Satisfied with outcome.' },
    { id: 'h2', title: 'Ceiling Fan Install', summary: 'Installed 3 ceiling fans and replaced wiring in kitchen.' }
  ],
  rating: 4.6
};

const page = { background: '#f8fafc', minHeight: '100vh', padding: 24 };
const wrap = { maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 420px', gap: 20 };
const card = { background: '#fff', borderRadius: 12, padding: 18, boxShadow: '0 6px 18px rgba(2,6,23,0.06)' };
const avatar = { width: 84, height: 84, borderRadius: '50%', background: '#e6e8ee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, color: '#0f172a' };
const progressBar = (pct) => ({ height: 10, background: '#eef2ff', borderRadius: 999, overflow: 'hidden', marginTop: 8, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6)' , position: 'relative'});
const progressFill = (pct) => ({ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg,#22c55e,#06b6d4)' });

export default function EmployerProfile() {
  return (
    <div style={page}>
      <div style={wrap}>
        {/* Left: main profile & ongoing jobs */}
        <div>
          <div style={card}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={avatar}>S</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{mock.name}</div>
                <div style={{ color: '#475569', marginTop: 4 }}>{mock.role} • {mock.location}</div>
                <div style={{ marginTop: 8, color: '#334155' }}>Contact: {mock.contact}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 14, color: '#64748b' }}>Rating</div>
                <div style={{ fontWeight: 700, fontSize: 18, color: '#0f172a' }}>{mock.rating} ★</div>
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <button style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #2563eb', background: '#2563eb', color: '#fff', cursor: 'pointer' }}>Message</button>
              <button style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', color: '#0f172a', marginLeft: 12, cursor: 'pointer' }}>Share Profile</button>
            </div>
          </div>

          <div style={{ ...card, marginTop: 18 }}>
            <h3 style={{ margin: 0, marginBottom: 12 }}>Ongoing Jobs</h3>
            <div style={{ display: 'grid', gap: 12 }}>
              {mock.ongoing.map((job) => (
                <div key={job.id} style={{ border: '1px solid #eef2ff', borderRadius: 10, padding: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{job.title}</div>
                      <div style={{ fontSize: 13, color: '#64748b' }}>{job.note} • {job.eta}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 12, color: '#2563eb', fontWeight: 700 }}>{job.progress}%</div>
                    </div>
                  </div>
                  <div style={progressBar(job.progress)}>
                    <div style={progressFill(job.progress)} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ ...card, marginTop: 18 }}>
            <h3 style={{ margin: 0, marginBottom: 12 }}>Past Jobs</h3>
            <div style={{ display: 'grid', gap: 12 }}>
              {mock.history.map((h) => (
                <div key={h.id} style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: 8 }}>
                  <div style={{ fontWeight: 700 }}>{h.title}</div>
                  <div style={{ color: '#475569', marginTop: 6 }}>{h.summary}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: sidebar summary */}
        <aside>
          <div style={card}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Household Details</div>
            <div style={{ color: '#475569', fontSize: 13 }}>Family size: 4</div>
            <div style={{ color: '#475569', fontSize: 13, marginTop: 6 }}>Preferred hours: Morning & Afternoon</div>
            <div style={{ color: '#475569', fontSize: 13, marginTop: 6 }}>Payment method: Online</div>
          </div>

          <div style={{ ...card, marginTop: 18 }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Contact & Actions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button style={{ padding: '10px 12px', borderRadius: 8, background: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer' }}>Create New Job</button>
              <button style={{ padding: '10px 12px', borderRadius: 8, background: '#fff', color: '#0f172a', border: '1px solid #e5e7eb', cursor: 'pointer' }}>View All Jobs</button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
