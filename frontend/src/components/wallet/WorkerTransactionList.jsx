import { Banknote, ArrowDownCircle, Clock, CreditCard } from 'lucide-react';

const WorkerTransactionList = ({ transactions, filters, onFilterChange }) => {

  // Format amount to LKR style
  const fmt = (amount) =>
    (Number(amount) || 0).toLocaleString('en-LK', { minimumFractionDigits: 2 });

  // Format date to readable format
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });

  // Icon, color and sign config per transaction type
  const typeConfig = {
    earning: {
      icon: <ArrowDownCircle className="w-4 h-4 text-blue-500" />,
      iconBg: 'bg-blue-50',
      amountColor: 'text-blue-600',
      sign: '+',
      label: 'Earning',
    },
    withdrawal: {
      icon: <Banknote className="w-4 h-4 text-red-500" />,
      iconBg: 'bg-red-50',
      amountColor: 'text-red-600',
      sign: '−',
      label: 'Withdrawal',
    },
  };

  // Status badge styles per status
  const statusStyle = {
    completed: 'bg-green-50  text-green-700  border border-green-100',
    pending: 'bg-yellow-50 text-yellow-700 border border-yellow-100',
    failed: 'bg-red-50    text-red-600    border border-red-100',
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">

      {/* Header and type filter dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 border-b border-gray-100">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Transaction History</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Filter by earning or withdrawal — full width on mobile */}
        <select
          value={filters.type}
          onChange={(e) => onFilterChange('type', e.target.value)}
          className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm bg-white text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 w-full sm:w-auto sm:min-w-[180px]"
        >
          <option value="all">All Transactions</option>
          <option value="earning">Earnings</option>
          <option value="withdrawal">Withdrawals</option>
        </select>
      </div>

      {/* Empty state — no transactions yet */}
      {transactions.length === 0 ? (
        <div className="text-center py-16 flex flex-col items-center">
          <CreditCard className="w-12 h-12 text-gray-200 mb-3" />
          <h3 className="text-lg font-bold text-gray-900 mb-1">No transactions yet</h3>
          <p className="text-gray-500 text-sm">Your earnings will appear here</p>
        </div>
      ) : (
        <>
          {/* ── Desktop table — hidden below lg ── */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">

              {/* Table column headers */}
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-5 py-3.5">Date</th>
                  <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-5 py-3.5">Description</th>
                  <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-5 py-3.5">Type</th>
                  <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-5 py-3.5">Status</th>
                  <th className="text-right text-xs font-bold text-gray-500 uppercase tracking-wide px-5 py-3.5">Amount</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {transactions.map((txn) => {
                  const cfg = typeConfig[txn.type] || typeConfig.earning;
                  const isPending = txn.status === 'pending';

                  return (
                    <tr key={txn.id} className="hover:bg-gray-50 transition-colors">

                      {/* Date */}
                      <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {formatDate(txn.date)}
                      </td>

                      {/* Description with job title and employer if available */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {/* Clock icon for pending, type icon for completed */}
                          <div className={`w-8 h-8 ${isPending ? 'bg-yellow-50' : cfg.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                            {isPending
                              ? <Clock className="w-4 h-4 text-yellow-500" />
                              : cfg.icon
                            }
                          </div>
                          <div>
                            {/* Gray text for pending transactions */}
                            <p className={`text-sm font-semibold ${isPending ? 'text-gray-400' : 'text-gray-900'}`}>
                              {txn.description}
                            </p>
                            {txn.jobTitle && txn.employer && (
                              <p className="text-xs text-gray-400 mt-0.5">
                                {txn.jobTitle} — {txn.employer}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Transaction type label */}
                      <td className={`px-5 py-4 text-sm ${isPending ? 'text-gray-400' : 'text-gray-900'}`}>
                        {cfg.label}
                      </td>

                      {/* Status badge */}
                      <td className="px-5 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle[txn.status]}`}>
                          {txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
                        </span>
                      </td>

                      {/* Amount — gray and no sign for pending */}
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        {isPending ? (
                          <span className="text-sm font-bold text-gray-400">
                            LKR {fmt(txn.amount)}
                          </span>
                        ) : (
                          <span className={`text-sm font-bold ${cfg.amountColor}`}>
                            {cfg.sign} LKR {fmt(txn.amount)}
                          </span>
                        )}
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ── Mobile card list — visible below lg ── */}
          <div className="lg:hidden divide-y divide-gray-100">
            {transactions.map((txn) => {
              const cfg = typeConfig[txn.type] || typeConfig.earning;
              const isPending = txn.status === 'pending';

              return (
                <div key={txn.id} className="p-4 flex flex-col gap-3">

                  {/* Row 1: icon + description + amount */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      {/* Clock icon for pending, type icon for completed */}
                      <div className={`w-9 h-9 ${isPending ? 'bg-yellow-50' : cfg.iconBg} rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        {isPending ? <Clock className="w-4 h-4 text-yellow-500" /> : cfg.icon}
                      </div>
                      <div className="min-w-0">
                        {/* Gray text for pending transactions */}
                        <p className={`text-sm font-semibold leading-snug ${isPending ? 'text-gray-400' : 'text-gray-900'}`}>
                          {txn.description}
                        </p>
                        {txn.jobTitle && txn.employer && (
                          <p className="text-xs text-gray-400 mt-0.5 truncate">
                            {txn.jobTitle} — {txn.employer}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Amount — gray and no sign for pending */}
                    <div className="flex-shrink-0 text-right">
                      {isPending ? (
                        <span className="text-sm font-bold text-gray-400">LKR {fmt(txn.amount)}</span>
                      ) : (
                        <span className={`text-sm font-bold ${cfg.amountColor}`}>
                          {cfg.sign} LKR {fmt(txn.amount)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Row 2: meta info in a clean 2x2 grid */}
                  <div className="grid grid-cols-2 gap-2 pl-12">

                    {/* Date */}
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-0.5">Date</p>
                      <p className="text-xs text-gray-600 font-medium">{formatDate(txn.date)}</p>
                    </div>

                    {/* Type */}
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-0.5">Type</p>
                      <p className={`text-xs font-medium ${isPending ? 'text-gray-400' : 'text-gray-700'}`}>{cfg.label}</p>
                    </div>

                    {/* Status badge */}
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-0.5">Status</p>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusStyle[txn.status]}`}>
                        {txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
                      </span>
                    </div>

                    {/* Job info — only shown if available */}
                    {txn.jobTitle && txn.employer && (
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-0.5">Job</p>
                        <p className="text-xs text-gray-600 font-medium truncate">{txn.jobTitle}</p>
                      </div>
                    )}

                  </div>

                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default WorkerTransactionList;