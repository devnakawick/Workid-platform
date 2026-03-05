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

      </div>
    </div>
  );
};

export default TopUpModal;