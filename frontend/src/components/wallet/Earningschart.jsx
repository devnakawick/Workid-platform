import { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { BarChart2 } from 'lucide-react';

const EarningsChart = ({ transactions }) => {
  const [range, setRange] = useState('7d');

  // Build chart data based on selected range
  const buildData = () => {
    const now = new Date();

    // 7d — one data point per day for last 7 days
    if (range === '7d') {
      return Array.from({ length: 7 }, (_, i) => {
        const date = new Date(now);
        date.setDate(date.getDate() - (6 - i));
        const ds = date.toDateString();

        // Sum amounts by type for this day
        const filter = (type) => transactions
          .filter(t => new Date(t.date).toDateString() === ds && t.type === type)
          .reduce((s, t) => s + t.amount, 0);

        return {
          label:    date.toLocaleDateString('en-US', { weekday: 'short' }),
          Deposits: filter('deposit'),
          Payments: filter('payment'),
          Refunds:  filter('refund'),
        };
      });
    }

    // 30d — one data point per week for last 4 weeks
    if (range === '30d') {
      return Array.from({ length: 4 }, (_, i) => {
        const start = new Date(now); start.setDate(start.getDate() - (3 - i) * 7 - 6);
        const end   = new Date(now); end.setDate(end.getDate() - (3 - i) * 7);

        // Sum amounts by type within this week range
        const filter = (type) => transactions
          .filter(t => { const d = new Date(t.date); return d >= start && d <= end && t.type === type; })
          .reduce((s, t) => s + t.amount, 0);

        return {
          label:    `Week ${i + 1}`,
          Deposits: filter('deposit'),
          Payments: filter('payment'),
          Refunds:  filter('refund'),
        };
      });
    }

    // 90d — one data point per month for last 3 months
    return Array.from({ length: 3 }, (_, i) => {
      const date = new Date(now); date.setMonth(date.getMonth() - (2 - i));
      const m = date.getMonth(), y = date.getFullYear();

      // Sum amounts by type within this month
      const filter = (type) => transactions
        .filter(t => { const d = new Date(t.date); return d.getMonth() === m && d.getFullYear() === y && t.type === type; })
        .reduce((s, t) => s + t.amount, 0);

      return {
        label:    date.toLocaleDateString('en-US', { month: 'short' }),
        Deposits: filter('deposit'),
        Payments: filter('payment'),
        Refunds:  filter('refund'),
      };
    });
  };

  const data = buildData();

  // Format Y axis numbers — show 1000 as 1k
  const fmt = (n) => n >= 1000 ? `${(n / 1000).toFixed(0)}k` : n;

  // Custom tooltip showing LKR amounts per type
  const Tip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-3 text-xs">
        <p className="font-bold text-gray-700 mb-2">{label}</p>
        {payload.map((e, i) => (
          <div key={i} className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full" style={{ background: e.color }} />
            <span className="text-gray-500">{e.name}:</span>
            <span className="font-bold">LKR {Number(e.value).toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  };

  // Area config — key, color and gradient id per transaction type
  const areas = [
    { key: 'Deposits', color: '#22c55e', grad: 'gD' },
    { key: 'Payments', color: '#ef4444', grad: 'gP' },
    { key: 'Refunds',  color: '#3b82f6', grad: 'gR' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-6">

      {/* Header with title and range filter buttons */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <BarChart2 className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Financial Overview</h2>
        </div>

        {/* Range toggle - 7d, 30d, 90d */}
        <div className="flex bg-gray-100 p-1 rounded-lg gap-1">
          {['7d', '30d', '90d'].map(r => (
            <button key={r} onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                range === r ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'
              }`}
            >{r}</button>
          ))}
        </div>
      </div>

      {/* Area chart */}
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>

            {/* Gradient fills for each area */}
            <defs>
              {areas.map(a => (
                <linearGradient key={a.grad} id={a.grad} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={a.color} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={a.color} stopOpacity={0}   />
                </linearGradient>
              ))}
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={fmt} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={35} />
            <Tooltip content={<Tip />} />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />

            {/* Render one area per transaction type */}
            {areas.map(a => (
              <Area key={a.key} type="monotone" dataKey={a.key}
                stroke={a.color} strokeWidth={2.5}
                fill={`url(#${a.grad})`}
                dot={false}
                activeDot={{ r: 5, fill: a.color, stroke: '#fff', strokeWidth: 2 }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default EarningsChart;