// Simulate API delay
const delay = (ms = 700) => new Promise(resolve => setTimeout(resolve, ms));

// Employer wallet balance info
export const mockEmployerWallet = {
  id:             'wallet_employer_001',
  balance:        45000.00,
  currency:       'LKR',
  totalSpent:     120000.00,
  totalDeposited: 165000.00,
  lastUpdated:    new Date().toISOString(),
};

// Employer transaction history
export const mockEmployerTransactions = [
  {
    id:          'txn_001',
    type:        'payment',
    method:      'wallet',
    amount:      7500.00,
    description: 'Payment to Sunil Fernando – Kitchen Electrical Wiring',
    date:        new Date(Date.now() - 0  * 86400000).toISOString(),
    status:      'completed',
    workerName:  'Sunil Fernando',
    jobTitle:    'Kitchen Electrical Wiring Update',
  },
  {
    id:          'txn_002',
    type:        'deposit',
    method:      'bank',
    amount:      50000.00,
    description: 'Wallet top-up via Bank Transfer',
    date:        new Date(Date.now() - 1  * 86400000).toISOString(),
    status:      'completed',
    workerName:  null,
    jobTitle:    null,
  },
  {
    id:          'txn_003',
    type:        'payment',
    method:      'wallet',
    amount:      2200.00,
    description: 'Payment to Saman Perera – Office Deep Cleaning',
    date:        new Date(Date.now() - 3  * 86400000).toISOString(),
    status:      'completed',
    workerName:  'Saman Perera',
    jobTitle:    'Office Deep Cleaning Service',
  },
  {
    id:          'txn_004',
    type:        'payment',
    method:      'wallet',
    amount:      2500.00,
    description: 'Payment to Ranjith Bandara – Garden Landscaping',
    date:        new Date(Date.now() - 5  * 86400000).toISOString(),
    status:      'completed',
    workerName:  'Ranjith Bandara',
    jobTitle:    'Complete Garden Landscaping Project',
  },
  {
    id:          'txn_005',
    type:        'deposit',
    method:      'bank',
    amount:      115000.00,
    description: 'Wallet top-up via Bank Transfer',
    date:        new Date(Date.now() - 10 * 86400000).toISOString(),
    status:      'completed',
    workerName:  null,
    jobTitle:    null,
  },
  {
    // Pending — waiting for employer to pay
    id:          'txn_006',
    type:        'payment',
    method:      null,
    cardLast4:   null,
    amount:      7500.00,
    description: 'Payment to Sunil Fernando – Kitchen Electrical Wiring',
    date:        new Date(Date.now() - 12 * 86400000).toISOString(),
    status:      'pending',
    workerName:  'Sunil Fernando',
    jobTitle:    'Kitchen Electrical Wiring Update',
  },
  {
    // Pending — waiting for employer to pay
    id:          'txn_007',
    type:        'payment',
    method:      null,
    cardLast4:   null,
    amount:      4800.00,
    description: 'Payment to Kasun Perera – House Painting',
    date:        new Date(Date.now() - 13 * 86400000).toISOString(),
    status:      'pending',
    workerName:  'Kasun Perera',
    jobTitle:    'House Painting',
  },
  {
    id:          'txn_008',
    type:        'refund',
    method:      'bank',
    amount:      2200.00,
    description: 'Refund – Job cancelled by worker',
    date:        new Date(Date.now() - 15 * 86400000).toISOString(),
    status:      'completed',
    workerName:  null,
    jobTitle:    'Office Deep Cleaning Service',
  },
];

// Get wallet balance
export const getEmployerWalletAPI = async () => {
  await delay();
  return { success: true, data: { ...mockEmployerWallet } };
};

// Get all transactions — deep copy so React detects changes
export const getEmployerTransactionsAPI = async () => {
  await delay();
  return { success: true, data: mockEmployerTransactions.map(t => ({ ...t })) };
};

// Add money to wallet
export const depositToWalletAPI = async (amount, method = 'bank') => {
  await delay(800);
  if (!amount || Number(amount) <= 0)
    return { success: false, error: 'Invalid amount' };

  // Update wallet balance and total deposited
  mockEmployerWallet.balance        += Number(amount);
  mockEmployerWallet.totalDeposited += Number(amount);
  mockEmployerWallet.lastUpdated     = new Date().toISOString();

  // Add new deposit transaction to top of list
  mockEmployerTransactions.unshift({
    id:          `txn_${Date.now()}`,
    type:        'deposit',
    method:      method,
    amount:      Number(amount),
    description: `Wallet top-up via ${method === 'bank' ? 'Bank Transfer' : 'Card'}`,
    date:        new Date().toISOString(),
    status:      'completed',
    workerName:  null,
    jobTitle:    null,
  });

  return { success: true, message: `LKR ${Number(amount).toLocaleString()} added to wallet!` };
};

// Pay a worker — finds and updates the matching pending transaction
export const payWorkerAPI = async (workerName, amount, jobTitle, txnId) => {
  await delay(800);

  if (!amount || Number(amount) <= 0)
    return { success: false, error: 'Invalid amount' };
  if (Number(amount) > mockEmployerWallet.balance)
    return { success: false, error: 'Insufficient balance' };

  // Find the pending transaction by id
  const idx = mockEmployerTransactions.findIndex(
    t => t.id === txnId && t.status === 'pending'
  );

  if (idx === -1)
    return { success: false, error: 'Transaction not found or already completed' };

  // Mark as completed — paid via platform wallet
  mockEmployerTransactions[idx] = {
    ...mockEmployerTransactions[idx],
    status: 'completed',
    method: 'wallet',
    date:   new Date().toISOString(),
  };

  // Deduct from wallet balance and update total spent
  mockEmployerWallet.balance    -= Number(amount);
  mockEmployerWallet.totalSpent += Number(amount);
  mockEmployerWallet.lastUpdated = new Date().toISOString();

  return {
    success: true,
    message: `LKR ${Number(amount).toLocaleString()} sent to ${workerName}!`,
  };
};