import { useState } from 'react';
import { X, ArrowDownCircle, Building2, CheckCircle2 } from 'lucide-react';

// Quick withdrawal amount options
const QUICK_AMOUNTS = [500, 1000, 2500, 5000, 10000];

// Available banks for withdrawal
const BANKS = [
  'Sampath Bank', 'BOC Bank', 'Commercial Bank',
  'HNB Bank', 'NSB Bank', 'Peoples Bank',
];

const WithdrawForm = ({ balance, onConfirm, onCancel, loading }) => {

  // Form state
  const [amount, setAmount] = useState('');
  const [bank, setBank] = useState('');
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [withdrawn, setWithdrawn] = useState(0);

  // Format numbers to LKR style
  const fmt = (n) => (Number(n) || 0).toLocaleString('en-LK', { minimumFractionDigits: 2 });

  // Validate amount and bank before submitting
  const validate = () => {
    const newErrors = {};
    if (!amount || isNaN(amount) || Number(amount) <= 0)
      newErrors.amount = 'Please enter a valid amount';
    else if (Number(amount) < 500)
      newErrors.amount = 'Minimum withdrawal is LKR 500';
    else if (Number(amount) > balance)
      newErrors.amount = `Insufficient balance (Available: LKR ${fmt(balance)})`;
    if (!bank)
      newErrors.bank = 'Please select a bank';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit withdrawal if valid
  const handleConfirm = async () => {
    if (!validate()) return;
    setWithdrawn(Number(amount));
    await onConfirm(Number(amount), bank);
    setSuccess(true);
  };

  // Success screen — shown after withdrawal completes
  if (success) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
        <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5">
            <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Withdrawal Successful!</h3>
          <p className="text-gray-500 text-sm mb-4 leading-relaxed">
            Your withdrawal has been processed successfully.
          </p>
          {/* Amount withdrawn */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 sm:px-6 py-4 mb-3">
            <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide mb-1">Amount Withdrawn</p>
            <p className="text-2xl sm:text-3xl font-black text-blue-600">LKR {fmt(withdrawn)}</p>
          </div>
          {/* Bank and processing time */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 sm:px-6 py-3 mb-5 sm:mb-6">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Sent To</p>
            <p className="text-sm font-bold text-gray-800">{bank}</p>
            <p className="text-xs text-gray-400 mt-0.5">Processing within 1���2 business days</p>
          </div>
          <button
            onClick={onCancel}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-md"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  // Main withdrawal form
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-2xl p-5 sm:p-8 max-w-md w-full shadow-2xl max-h-[95dvh] overflow-y-auto">

        {/* Header with available balance */}
        <div className="flex items-center justify-between mb-5 sm:mb-6">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <ArrowDownCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Withdraw Money</h3>
              <p className="text-xs sm:text-sm text-gray-500 truncate">
                Available: <span className="font-bold text-blue-600">LKR {fmt(balance)}</span>
              </p>
            </div>
          </div>
          {/* Close button */}
          <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-xl transition-all flex-shrink-0 ml-2">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Quick select preset amounts — disabled if exceeds balance */}
        <div className="mb-4 sm:mb-5">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Quick Select</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_AMOUNTS.map(q => (
              <button
                key={q}
                onClick={() => { setAmount(String(q)); setErrors({}); }}
                disabled={q > balance}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all ${Number(amount) === q
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                    : q > balance
                      ? 'opacity-40 cursor-not-allowed bg-gray-50 text-gray-400 border-gray-200'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:text-blue-600'
                  }`}
              >
                {q.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Manual amount input — red border on error */}
        <div className="mb-4 sm:mb-5">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
            Amount (LKR)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-sm">LKR</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => { setAmount(e.target.value); setErrors({}); }}
              placeholder="0.00"
              min="500"
              max={balance}
              className={`w-full py-3 pl-14 pr-4 border-2 rounded-xl text-lg font-bold text-gray-900 focus:outline-none transition-all ${errors.amount ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-blue-500'
                }`}
            />
          </div>
          {errors.amount && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.amount}</p>}
        </div>

        {/* Bank selector — red border on error */}
        <div className="mb-5 sm:mb-6">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
            Bank Account
          </label>
          <div className="relative">
            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={bank}
              onChange={(e) => { setBank(e.target.value); setErrors({}); }}
              className={`w-full py-3 pl-10 pr-4 border-2 rounded-xl text-sm bg-white text-gray-900 focus:outline-none transition-all appearance-none ${errors.bank ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-blue-500'
                }`}
            >
              <option value="">Select your bank</option>
              {BANKS.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
          {errors.bank && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.bank}</p>}
        </div>

        {/* Cancel and withdraw buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading || !amount || !bank}
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm shadow-md transition-all disabled:opacity-50"
          >
            {loading ? 'Processing...' : `Withdraw LKR ${Number(amount || 0).toLocaleString()}`}
          </button>
        </div>

      </div>
    </div>
  );
};

export default WithdrawForm;