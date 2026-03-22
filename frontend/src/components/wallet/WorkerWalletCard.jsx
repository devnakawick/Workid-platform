import { Wallet, TrendingUp, TrendingDown, Banknote } from 'lucide-react';

const WorkerWalletCard = ({ wallet, onWithdraw }) => {
  if (!wallet) return null;

  // Format numbers to LKR style
  const fmt = (amount) =>
    (Number(amount) || 0).toLocaleString('en-LK', { minimumFractionDigits: 2 });

  // Disable withdraw button if no balance
  const hasBalance = wallet.balance > 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-6">

      {/* Main balance card — full width on mobile, spans 2 cols on sm, 1 on lg */}
      <div className="sm:col-span-2 lg:col-span-1 relative bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 sm:p-6 text-white shadow-xl shadow-blue-500/30 overflow-hidden">

        {/* Background decoration circles */}
        <div className="absolute -top-6   -right-6 w-32 h-32 bg-white/10 rounded-full" />
        <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/10 rounded-full" />

        <div className="relative z-10">

          {/* Wallet icon + label */}
          <div className="flex items-center gap-3 mb-5 sm:mb-6">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-blue-100 text-sm font-medium">My Wallet</p>
              <p className="text-white/70 text-xs">Available to withdraw</p>
            </div>
          </div>

          {/* Balance amount */}
          <div className="mb-5 sm:mb-6">
            <p className="text-xs text-blue-200 font-semibold uppercase tracking-widest mb-1">LKR</p>
            <p className="text-3xl sm:text-4xl font-bold text-white tracking-tight break-all">
              {fmt(wallet.balance)}
            </p>
          </div>

          {/* Withdraw button — disabled when no balance */}
          <button
            onClick={onWithdraw}
            disabled={!hasBalance}
            className={`w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 rounded-xl font-bold text-sm transition-all shadow-lg ${hasBalance
                ? 'bg-white text-blue-600 hover:bg-blue-50'
                : 'bg-white/30 text-white/50 cursor-not-allowed'
              }`}
          >
            <Banknote className="w-4 h-4" />
            {hasBalance ? 'Withdraw Money' : 'No Balance to Withdraw'}
          </button>
        </div>
      </div>

      {/* Total earned stat */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-500 mb-1">Total Earned</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 break-all">LKR {fmt(wallet.totalEarned)}</p>
            {/* All time earnings summary */}
            <p className="text-xs text-blue-600 font-semibold mt-1">↑ All time earnings</p>
          </div>
        </div>
      </div>

      {/* Total withdrawn stat */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <TrendingDown className="w-6 h-6 sm:w-7 sm:h-7 text-red-500" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-500 mb-1">Total Withdrawn</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 break-all">LKR {fmt(wallet.totalWithdrawn)}</p>
            {/* All time bank withdrawal summary */}
            <p className="text-xs text-red-500 font-semibold mt-1">↓ Bank withdrawals</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default WorkerWalletCard;