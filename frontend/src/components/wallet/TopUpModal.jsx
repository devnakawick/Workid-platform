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

  const fmtCard   = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const fmtExpiry = (v) => { const d = v.replace(/\D/g, '').slice(0, 4); return d.length >= 3 ? `${d.slice(0,2)}/${d.slice(2)}` : d; };
  const cardType  = () => { const n = card.number.replace(/\s/g,''); return n.startsWith('4') ? 'Visa' : n.startsWith('5') ? 'Mastercard' : ''; };
  const copy      = (val, key) => { navigator.clipboard.writeText(val); setCopied(key); setTimeout(() => setCopied(''), 2000); };
  const inp       = (field, val) => { setCard(p => ({ ...p, [field]: val })); setCardErrors(p => ({ ...p, [field]: '' })); };
  const inputCls  = (err) => `w-full px-3 py-2.5 border-2 rounded-xl text-sm focus:outline-none transition-all ${err ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-blue-500'}`;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden">

        {/* Modal header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5 text-white flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">Top Up Wallet</h3>
            <p className="text-blue-200 text-sm">Add funds to your employer wallet</p>
          </div>
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

          </div>
        </div>

      </div>
    </div>
  );
};

export default TopUpModal;