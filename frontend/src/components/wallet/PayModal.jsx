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

        {/* Pending payments list */}
        <div className="p-5 flex flex-col gap-3 max-h-[380px] overflow-y-auto">
          {pendingPayments.length === 0 ? (

            // All paid — show success state
            <div className="text-center py-12">
              <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
              <p className="text-lg font-bold text-gray-800">All Caught Up!</p>
              <p className="text-sm text-gray-400 mt-1">No pending payments right now</p>
            </div>
          ) : (
            pendingPayments.map((txn) => {
              // Check if balance covers this single payment
              const canPay = walletBalance >= txn.amount;
              return (
                <div
                  key={txn.id}
                  className="flex items-center justify-between p-4 border-2 border-gray-100 rounded-xl hover:border-blue-100 hover:bg-blue-50/30 transition-all"
                >
                  {/* Worker name, job title and amount */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{txn.workerName}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{txn.jobTitle}</p>
                      <p className="text-xs font-bold text-gray-700 mt-1">
                        LKR {fmt(txn.amount)}
                      </p>
                    </div>
                  </div>

                  {/* Pay now button — disabled if balance too low */}
                  <button
                    onClick={() => onConfirm(txn)}
                    disabled={loading || !canPay}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                      canPay
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {loading ? '...' : canPay ? 'Pay Now' : 'Low Balance'}
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer — total pending amount and low balance warning */}
        {pendingPayments.length > 0 && (
          <div className="border-t border-gray-100 px-5 py-4 bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-500">Total Pending</span>
              <span className="text-sm font-bold text-gray-900">LKR {fmt(totalPending)}</span>
            </div>
            {/* Show warning if balance not enough for all */}
            {!canPayAll && (
              <div className="flex items-center gap-2 mt-2 p-2.5 bg-red-50 border border-red-100 rounded-xl">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p className="text-xs text-red-600 font-medium">
                  Insufficient balance to pay all. Please top up your wallet first.
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default PayModal;