import { X, Clock, CheckCircle2, AlertCircle, CreditCard } from 'lucide-react';

const PayModal = ({ transactions, walletBalance, onConfirm, onCancel, loading }) => {

  // Format amount to LKR style
  const fmt = (amount) =>
    (Number(amount) || 0).toLocaleString('en-LK', { minimumFractionDigits: 2 });

  // Filter only pending worker payments
  const pendingPayments = transactions.filter(
    t => t.type === 'payment' && t.status === 'pending'
  );

  // Total of all pending payments
  const totalPending = pendingPayments.reduce((sum, t) => sum + t.amount, 0);

  // Check if wallet has enough to cover all pending
  const canPayAll = walletBalance >= totalPending;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">

        {/* Modal header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5 text-white flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">Pay Workers</h3>
            <p className="text-blue-200 text-sm">
              {pendingPayments.length} pending payment{pendingPayments.length !== 1 ? 's' : ''}
            </p>
          </div>
          {/* Close button */}
          <button
            onClick={onCancel}
            disabled={loading}
            className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Wallet balance bar — green if enough, red if not */}
        <div className={`flex items-center justify-between px-5 py-3 border-b ${
          canPayAll ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'
        }`}>
          <div className="flex items-center gap-2">
            <CreditCard className={`w-4 h-4 ${canPayAll ? 'text-green-600' : 'text-red-500'}`} />
            <span className="text-sm font-semibold text-gray-700">Wallet Balance</span>
          </div>
          <span className={`text-sm font-bold ${canPayAll ? 'text-green-600' : 'text-red-500'}`}>
            LKR {fmt(walletBalance)}
          </span>
        </div>

        {/* Empty state — all payments done */}
        <div className="p-5">
          {pendingPayments.length === 0 && (
            <div className="text-center py-12">
              <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
              <p className="text-lg font-bold text-gray-800">All Caught Up!</p>
              <p className="text-sm text-gray-400 mt-1">No pending payments right now</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default PayModal;