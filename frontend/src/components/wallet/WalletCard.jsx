import { Wallet, TrendingUp, TrendingDown, Plus, Clock, ShieldCheck, Lock } from 'lucide-react';

const WalletCard = ({ wallet, onDeposit, onEscrow }) => {
  if (!wallet) return null;

  // Format numbers to LKR style
  const fmt = (amount) =>
    (Number(amount) || 0).toLocaleString('en-LK', { minimumFractionDigits: 2 });

  // Show last updated time
  const lastUpdated = wallet.lastUpdated
    ? new Date(wallet.lastUpdated).toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit', hour12: true,
    })
    : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">

      {/* Main balance card */}
      <div className="lg:col-span-1 relative bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl shadow-blue-500/30 overflow-hidden flex flex-col justify-between">

        {/* Background decoration circles */}
        <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full" />
        <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/10 rounded-full" />

        <div className="relative z-10">

          {/* Wallet icon + label */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-blue-100 text-sm font-medium">Wallet Balance</p>
              <p className="text-white/70 text-xs">Available to spend</p>
            </div>
          </div>

          {/* Balance amount */}
          <div className="mb-4">
            <p className="text-xs text-blue-200 font-semibold uppercase tracking-widest mb-1">LKR</p>
            <p className="text-4xl font-bold text-white tracking-tight">
              {fmt(wallet.balance)}
            </p>
          </div>

          {/* Locked Balance Display (New) */}
          {wallet.locked > 0 && (
            <div className="flex items-center gap-2 mb-6 bg-black/20 p-2.5 rounded-lg border border-white/10">
              <Lock className="w-4 h-4 text-orange-300" />
              <div>
                <p className="text-[10px] text-blue-100 uppercase font-bold tracking-wider">Locked in Escrow</p>
                <p className="text-sm font-bold text-white">LKR {fmt(wallet.locked)}</p>
              </div>
            </div>
          )}

          {/* Last updated time */}
          {lastUpdated && !wallet.locked && (
            <div className="flex items-center gap-1 mb-6">
              <Clock className="w-3 h-3 text-blue-300" />
              <p className="text-xs text-blue-300">Updated at {lastUpdated}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mt-auto">
            <button
              onClick={onDeposit}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-white text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-50 transition-all shadow-lg active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Add Money
            </button>
            <button
              onClick={onEscrow}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl font-bold text-sm transition-all border border-white/30 active:scale-95"
            >
              <Lock className="w-4 h-4" />
              Escrow
            </button>
          </div>
        </div>
      </div>

      {/* Total deposited stat */}
      <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow flex flex-col justify-center">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-7 h-7 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Deposited</p>
            <p className="text-2xl font-bold text-gray-900">LKR {fmt(wallet.totalDeposited)}</p>
            <p className="text-xs text-green-600 font-semibold mt-1">↑ All time deposits</p>
          </div>
        </div>
      </div>

      {/* Total spent stat */}
      <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow flex flex-col justify-center">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <TrendingDown className="w-7 h-7 text-red-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Spent</p>
            <p className="text-2xl font-bold text-gray-900">LKR {fmt(wallet.totalSpent)}</p>
            <p className="text-xs text-red-500 font-semibold mt-1">↓ Escrow & Payments</p>
          </div>
        </div>
      </div>

    </div>
  );
};


export default WalletCard;