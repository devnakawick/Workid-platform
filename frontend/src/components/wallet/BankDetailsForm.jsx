import { Building2 } from 'lucide-react';

const BankDetailsForm = ({ selectedBank, accountDetails, onChange, errors }) => {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <Building2 className="w-5 h-5 text-blue-600" />
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-gray-900">Bank Details</h3>
          <p className="text-sm text-gray-500 truncate">
            {selectedBank}
          </p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="flex-1 space-y-4 overflow-y-auto">
        {/* Account Number */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
            Account Number
          </label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={accountDetails.accountNumber}
            onChange={(e) => {
              
              const onlyNumbers = e.target.value.replace(/\D/g, '');
              onChange('accountNumber', onlyNumbers);
            }}
            placeholder="Enter your account number"
            className={`w-full py-3 px-4 border-2 rounded-xl text-sm bg-white text-gray-900 focus:outline-none transition-all ${errors.accountNumber ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-blue-500'
              }`}
          />
          {errors.accountNumber && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.accountNumber}</p>}
        </div>

        {/* Account Holder Name */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
            Account Holder Name
          </label>
          <input
            type="text"
            value={accountDetails.accountHolderName}
            onChange={(e) => onChange('accountHolderName', e.target.value)}
            placeholder="Enter account holder name"
            className={`w-full py-3 px-4 border-2 rounded-xl text-sm bg-white text-gray-900 focus:outline-none transition-all ${errors.accountHolderName ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-blue-500'
              }`}
          />
          {errors.accountHolderName && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.accountHolderName}</p>}
        </div>

        {/* Branch */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
            Branch
          </label>
          <input
            type="text"
            value={accountDetails.branch}
            onChange={(e) => onChange('branch', e.target.value)}
            placeholder="Enter branch name"
            className={`w-full py-3 px-4 border-2 rounded-xl text-sm bg-white text-gray-900 focus:outline-none transition-all ${errors.branch ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-blue-500'
              }`}
          />

          {errors.branch && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.branch}</p>}
        </div>
      </div>
    </div>
  );
};

export default BankDetailsForm;