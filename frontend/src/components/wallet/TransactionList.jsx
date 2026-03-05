import { ArrowUpCircle, ArrowDownCircle, RefreshCcw, CreditCard, Building2, Clock, Wallet } from 'lucide-react';

const TransactionList = ({ transactions, filters, onFilterChange }) => {

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
    payment: {
      icon:        <ArrowUpCircle   className="w-4 h-4 text-red-500"   />,
      iconBg:      'bg-red-50',
      amountColor: 'text-red-600',
      sign:        '−',
      label:       'Payment',
    },
    deposit: {
      icon:        <ArrowDownCircle className="w-4 h-4 text-green-500" />,
      iconBg:      'bg-green-50',
      amountColor: 'text-green-600',
      sign:        '+',
      label:       'Deposit',
    },
    refund: {
      icon:        <RefreshCcw      className="w-4 h-4 text-blue-500"  />,
      iconBg:      'bg-blue-50',
      amountColor: 'text-blue-600',
      sign:        '+',
      label:       'Refund',
    },
  };

  // Status badge styles per status
  const statusStyle = {
    completed: 'bg-green-50  text-green-700  border border-green-100',
    pending:   'bg-yellow-50 text-yellow-700 border border-yellow-100',
    failed:    'bg-red-50    text-red-600    border border-red-100',
  };

  // Sort transactions newest first
  const sorted = [...transactions].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // Shows correct payment method icon and label per transaction
  const MethodBadge = ({ txn }) => {

    // Pending — method not confirmed yet
    if (txn.status === 'pending') {
      return <span className="text-sm text-gray-400 font-medium">— Not confirmed yet</span>;
    }

    // Worker payments — always via platform wallet
    if (txn.type === 'payment') {
      return (
        <div className="flex items-center gap-2">
          <Wallet className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-600 font-medium">Platform Wallet</span>
        </div>
      );
    }

    // Bank transfer deposit or refund
    if (txn.method === 'bank') {
      return (
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-600 font-medium">Bank Transfer</span>
        </div>
      );
    }

    // Card deposit — show masked card number
    if (txn.method === 'card') {
      return (
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-500 font-mono">•••• {txn.cardLast4 || '****'}</span>
        </div>
      );
    }

    return <span className="text-sm text-gray-400">—</span>;
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">

      {/* Header and type filter dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border-b border-gray-100">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Transaction History</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Filter by transaction type */}
        <select
          value={filters.type}
          onChange={(e) => onFilterChange('type', e.target.value)}
          className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm bg-white text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 min-w-[180px]"
        >
          <option value="all">All Transactions</option>
          <option value="payment">Payments</option>
          <option value="deposit">Deposits</option>
          <option value="refund">Refunds</option>
        </select>
      </div>

      {/* Empty state — no transactions yet */}
      {sorted.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">💳</p>
          <h3 className="text-lg font-bold text-gray-900 mb-1">No transactions yet</h3>
          <p className="text-gray-500 text-sm">Your transaction history will appear here</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">

            {/* Table column headers */}
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-5 py-3.5">Date</th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-5 py-3.5">Description</th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-5 py-3.5">Type</th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-5 py-3.5">Payment Method</th>
                <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wide px-5 py-3.5">Status</th>
                <th className="text-right text-xs font-bold text-gray-500 uppercase tracking-wide px-5 py-3.5">Price</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {sorted.map((txn) => {
                const cfg       = typeConfig[txn.type];
                const isPending = txn.status === 'pending';

                return (
                  <tr key={txn.id} className="hover:bg-gray-50 transition-colors">

                    {/* Date */}
                    <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">
                      {formatDate(txn.date)}
                    </td>

                    {/* Description with worker name if available */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {/* Clock icon for pending, type icon for completed */}
                        <div className={`w-8 h-8 ${isPending ? 'bg-yellow-50' : cfg.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          {isPending ? <Clock className="w-4 h-4 text-yellow-500" /> : cfg.icon}
                        </div>
                        <div>
                          {/* Gray text for pending transactions */}
                          <p className={`text-sm font-semibold ${isPending ? 'text-gray-400' : 'text-gray-900'}`}>
                            {txn.description}
                          </p>
                          {txn.workerName && txn.jobTitle && (
                            <p className="text-xs text-gray-400 mt-0.5">
                              {txn.workerName} — {txn.jobTitle}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Transaction type label */}
                    <td className={`px-5 py-4 text-sm ${isPending ? 'text-gray-400' : 'text-gray-900'}`}>
                      {cfg.label}
                    </td>

                    {/* Payment method badge */}
                    <td className="px-5 py-4">
                      <MethodBadge txn={txn} />
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
                        <span className="text-sm font-bold text-gray-400">LKR {fmt(txn.amount)}</span>
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
      )}
    </div>
  );
};

export default TransactionList;