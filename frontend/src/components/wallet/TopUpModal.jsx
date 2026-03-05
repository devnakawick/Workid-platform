import { useState } from 'react';
import { CreditCard, Building2, X, CheckCircle, Copy, Lock, CheckCircle2 } from 'lucide-react';

// Quick amount options
const QUICK_AMOUNTS = [1000, 5000, 10000, 25000, 50000];

// Bank account details for transfer
const BANK_DETAILS = [
  { label: 'Bank Name',      value: 'Bank of Ceylon (BOC)' },
  { label: 'Account Name',   value: 'WorkID (Pvt) Ltd'     },
  { label: 'Account Number', value: '8001234567890'         },
  { label: 'Branch',         value: 'Colombo Main'         },
  { label: 'Reference',      value: 'WRKID-EMP-001'        },
];

const TopUpModal = ({ onTopUp, onCancel, loading }) => {

  // Form state
  const [amount,     setAmount]     = useState('');
  const [method,     setMethod]     = useState('bank');
  const [error,      setError]      = useState('');
  const [copied,     setCopied]     = useState('');
  const [showCvv,    setShowCvv]    = useState(false);
  const [success,    setSuccess]    = useState(false);
  const [paidAmount, setPaidAmount] = useState(0);
  const [card,       setCard]       = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [cardErrors, setCardErrors] = useState({});

  // Format card number with spaces
  const fmtCard   = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

  // Format expiry as MM/YY
  const fmtExpiry = (v) => { const d = v.replace(/\D/g, '').slice(0, 4); return d.length >= 3 ? `${d.slice(0,2)}/${d.slice(2)}` : d; };

  // Detect card type from number
  const cardType  = () => { const n = card.number.replace(/\s/g,''); return n.startsWith('4') ? 'Visa' : n.startsWith('5') ? 'Mastercard' : ''; };

  // Copy value to clipboard with temporary tick
  const copy      = (val, key) => { navigator.clipboard.writeText(val); setCopied(key); setTimeout(() => setCopied(''), 2000); };

  // Update card field and clear its error
  const inp       = (field, val) => { setCard(p => ({ ...p, [field]: val })); setCardErrors(p => ({ ...p, [field]: '' })); };

  // Input style — red border on error
  const inputCls  = (err) => `w-full px-3 py-2.5 border-2 rounded-xl text-sm focus:outline-none transition-all ${err ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-blue-500'}`;

  // Validate form and submit top up
  const handleSubmit = async () => {
    const num = Number(amount);
    if (!num || num < 500)  { setError('Minimum top-up is LKR 500');     return; }
    if (num > 500000)       { setError('Maximum top-up is LKR 500,000'); return; }
    setError('');
    setPaidAmount(num);
    await onTopUp({ amount: num, method });
    setSuccess(true);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden">

        {/* Modal header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5 text-white flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">Top Up Wallet</h3>
            <p className="text-blue-200 text-sm">Add funds to your employer wallet</p>
          </div>
          {/* Close button */}
          <button onClick={onCancel} disabled={loading}
            className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex min-h-[420px]">

          {/* Left panel — amount and method */}
          <div className="w-[44%] border-r border-gray-100 p-5 flex flex-col gap-5">

            {/* Quick select preset amounts */}
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Quick Select</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_AMOUNTS.map(v => (
                  <button key={v} onClick={() => { setAmount(String(v)); setError(''); }}
                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all ${
                      amount === String(v)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-blue-300'
                    }`}>
                    {v.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Manual amount input */}
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Amount (LKR)</p>
              <input type="number" value={amount} placeholder="Min. 500"
                onChange={e => { setAmount(e.target.value); setError(''); }}
                className={inputCls(error)} />
              {/* Show validation error */}
              {error && <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>}
            </div>

            {/* Payment method selector — bank or card */}
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Payment Method</p>
              <div className="space-y-2">
                {[
                  { id: 'bank', label: 'Bank Transfer',       icon: Building2,  desc: 'Direct from your bank' },
                  { id: 'card', label: 'Debit / Credit Card', icon: CreditCard, desc: 'Visa, Mastercard'       },
                ].map(({ id, label, icon: Icon, desc }) => (
                  <button key={id} onClick={() => setMethod(id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                      method === id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${method === id ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      <Icon className={`w-5 h-5 ${method === id ? 'text-blue-600' : 'text-gray-500'}`} />
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-semibold ${method === id ? 'text-blue-700' : 'text-gray-700'}`}>{label}</p>
                      <p className="text-xs text-gray-400">{desc}</p>
                    </div>
                    {/* Checkmark for selected method */}
                    {method === id && <CheckCircle className="w-4 h-4 text-blue-500" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right panel — bank details */}
          <div className="flex-1 p-5 flex flex-col gap-4">
            {method === 'bank' && (
              <div className="flex-1 flex flex-col gap-4">
                <div className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl p-4 flex flex-col gap-3">

                  {/* Bank details header */}
                  <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">Bank Transfer Details</p>
                      <p className="text-xs text-gray-400">Transfer to complete top-up</p>
                    </div>
                    {/* Show entered amount if valid */}
                    {amount && Number(amount) >= 500 && (
                      <span className="ml-auto text-sm font-bold text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1 rounded-lg">
                        LKR {Number(amount).toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Each bank detail row with copy button */}
                  {BANK_DETAILS.map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-400">{label}</p>
                        <p className="text-sm font-bold text-gray-800">{value}</p>
                      </div>
                      {/* Copy to clipboard button */}
                      <button onClick={() => copy(value, label)}
                        className="flex items-center gap-1 px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-all">
                        <Copy className="w-3 h-3" />
                        {copied === label ? '✓' : 'Copy'}
                      </button>
                    </div>
                  ))}

                  {/* Reference warning note */}
                  <div className="mt-auto pt-3 border-t border-gray-200">
                    <p className="text-xs text-yellow-700 font-medium bg-yellow-50 border border-yellow-100 rounded-lg p-2.5">
                      Use <span className="font-bold">WRKID-EMP-001</span> as reference. Wallet tops up within 24 hours.
                    </p>
                  </div>
                </div>

                {/* Cancel and confirm buttons */}
                <div className="flex gap-3">
                  <button onClick={onCancel} disabled={loading}
                    className="flex-1 py-2.5 border-2 border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 disabled:opacity-50 transition-all">
                    Cancel
                  </button>
                  <button onClick={handleSubmit} disabled={loading || !amount}
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md disabled:opacity-50 transition-all">
                    {loading ? 'Processing...' : 'Done ✓'}
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default TopUpModal;