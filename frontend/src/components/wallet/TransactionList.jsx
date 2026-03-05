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

    </div>
  );
};

export default TransactionList;