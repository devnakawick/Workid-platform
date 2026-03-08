// Simulate API delay
const delay = (ms = 700) => new Promise(resolve => setTimeout(resolve, ms));

// Worker wallet balance info
export const mockWorkerWallet = {
  id:             'wallet_worker_001',
  balance:        12500.00,
  currency:       'LKR',
  totalEarned:    45000.00,
  totalWithdrawn: 32500.00,
  lastUpdated:    new Date().toISOString(),
};

// Worker transaction history
export const mockWorkerTransactions = [
  {
    id:           'wtxn_001',
    type:         'earning',
    amount:       7500.00,
    description:  'Payment received – Kitchen Electrical Wiring Update',
    date:         new Date(Date.now() - 0  * 86400000).toISOString(),
    status:       'completed',
    employerName: 'Kamal Enterprises',
    jobTitle:     'Kitchen Electrical Wiring Update',
  },
  {
    id:           'wtxn_002',
    type:         'withdrawal',
    amount:       5000.00,
    description:  'Withdrawal to Bank Account – Sampath Bank',
    date:         new Date(Date.now() - 2  * 86400000).toISOString(),
    status:       'completed',
    employerName: null,
    jobTitle:     null,
  },
  {
    id:           'wtxn_003',
    type:         'earning',
    amount:       2200.00,
    description:  'Payment received – Office Deep Cleaning Service',
    date:         new Date(Date.now() - 4  * 86400000).toISOString(),
    status:       'completed',
    employerName: 'Nimal Holdings',
    jobTitle:     'Office Deep Cleaning Service',
  },
  {
    id:           'wtxn_004',
    type:         'withdrawal',
    amount:       8000.00,
    description:  'Withdrawal to Bank Account – BOC Bank',
    date:         new Date(Date.now() - 7  * 86400000).toISOString(),
    status:       'completed',
    employerName: null,
    jobTitle:     null,
  },
  {
    id:           'wtxn_005',
    type:         'earning',
    amount:       2500.00,
    description:  'Payment received – Garden Landscaping Project',
    date:         new Date(Date.now() - 10 * 86400000).toISOString(),
    status:       'completed',
    employerName: 'Sunil Residencies',
    jobTitle:     'Complete Garden Landscaping Project',
  },
  {
    // Pending — payment not yet released by employer
    id:           'wtxn_006',
    type:         'earning',
    amount:       4800.00,
    description:  'Payment received – House Painting',
    date:         new Date(Date.now() - 14 * 86400000).toISOString(),
    status:       'pending',
    employerName: 'Perera Constructions',
    jobTitle:     'House Painting – 3 Bedrooms',
  },
  {
    id:           'wtxn_007',
    type:         'withdrawal',
    amount:       19500.00,
    description:  'Withdrawal to Bank Account – Sampath Bank',
    date:         new Date(Date.now() - 20 * 86400000).toISOString(),
    status:       'completed',
    employerName: null,
    jobTitle:     null,
  },
];

// Get worker wallet balance
export const getWorkerWalletAPI = async () => {
  await delay();
  return { success: true, data: { ...mockWorkerWallet } };
};

// Get all worker transactions — shallow copy so React detects changes
export const getWorkerTransactionsAPI = async () => {
  await delay();
  return { success: true, data: [...mockWorkerTransactions] };
};

// Withdraw from wallet — validates amount and updates balance
export const withdrawFromWalletAPI = async (amount, bank) => {
  await delay(800);

  if (amount <= 0)
    return { success: false, error: 'Invalid amount' };
  if (amount < 500)
    return { success: false, error: 'Minimum withdrawal is LKR 500' };
  if (amount > mockWorkerWallet.balance)
    return { success: false, error: 'Insufficient balance' };

  // Deduct from balance and update total withdrawn
  mockWorkerWallet.balance        -= Number(amount);
  mockWorkerWallet.totalWithdrawn += Number(amount);

  // Add new withdrawal transaction to top of list
  mockWorkerTransactions.unshift({
    id:           `wtxn_${Date.now()}`,
    type:         'withdrawal',
    amount:       Number(amount),
    description:  `Withdrawal to Bank Account – ${bank}`,
    date:         new Date().toISOString(),
    status:       'completed',
    employerName: null,
    jobTitle:     null,
  });

  return {
    success: true,
    message: `LKR ${Number(amount).toLocaleString()} withdrawn successfully!`,
  };
};