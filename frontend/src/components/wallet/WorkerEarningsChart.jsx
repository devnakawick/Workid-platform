import { useState } from 'react';
import {
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { BarChart2 } from 'lucide-react';

const WorkerEarningsChart = ({ transactions }) => {
  const [range, setRange] = useState('7d');

  // Build chart data based on selected range
  const buildData = () => {
    const now  = new Date();
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
    const data = [];

    for (let i = days - 1; i >= 0; i--) {
      const date    = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();

      // Label — show day, date or month based on range
      let label = '';
      if (range === '7d') {
        label = date.toLocaleDateString('en-US', { weekday: 'short' });
      } else if (range === '30d') {
        label = i % 7 === 0
          ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          : '';
      } else {
        label = i % 30 === 0
          ? date.toLocaleDateString('en-US', { month: 'short' })
          : '';
      }

      // Sum earnings for this day
      const earned = transactions
        .filter(t => new Date(t.date).toDateString() === dateStr && t.type === 'earning')
        .reduce((s, t) => s + t.amount, 0);

      // Sum withdrawals for this day
      const withdrawn = transactions
        .filter(t => new Date(t.date).toDateString() === dateStr && t.type === 'withdrawal')
        .reduce((s, t) => s + t.amount, 0);

      data.push({ label, Earned: earned, Withdrawn: withdrawn });
    }

    return data;
  };

  const data = buildData();

  // Show empty state if no data in range
  const isEmpty = data.every(d => d.Earned === 0 && d.Withdrawn === 0);

  // Custom tooltip showing LKR amounts
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-3 text-xs">
        {label && <p className="font-bold text-gray-600 mb-2">{label}</p>}
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
            <span className="text-gray-500">{entry.name}:</span>
            <span className="font-bold text-gray-800">LKR {Number(entry.value).toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-6">

      {/* Header with range filter toggle */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <BarChart2 className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Earnings Overview</h2>
        </div>

        {/* Range toggle — 7d, 30d, 90d */}
        <div className="flex bg-gray-100 p-1 rounded-xl gap-1">
          {['7d', '30d', '90d'].map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                range === r
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Empty state — no transactions in range */}
      {isEmpty ? (
        <div className="h-56 flex flex-col items-center justify-center text-gray-400">
          <BarChart2 className="w-12 h-12 text-gray-200 mb-3" />
          <p className="text-sm font-semibold text-gray-500">No earnings data yet</p>
          <p className="text-xs text-gray-400 mt-1">Your chart will appear once you complete jobs</p>
        </div>
      ) : (
        /* Area chart with earned and withdrawn areas */
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>

              {/* Gradient fills for earned and withdrawn areas */}
              <defs>
                <linearGradient id="gEarned" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}   />
                </linearGradient>
                <linearGradient id="gWithdrawn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}   />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
                width={35}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />

              {/* Earned area — blue */}
              <Area
                type="monotone"
                dataKey="Earned"
                stroke="#3b82f6"
                strokeWidth={2.5}
                fill="url(#gEarned)"
                dot={false}
                activeDot={{ r: 5, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
              />

              {/* Withdrawn area — red */}
              <Area
                type="monotone"
                dataKey="Withdrawn"
                stroke="#ef4444"
                strokeWidth={2.5}
                fill="url(#gWithdrawn)"
                dot={false}
                activeDot={{ r: 5, fill: '#ef4444', stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

    </div>
  );
};


export default WorkerEarningsChart;