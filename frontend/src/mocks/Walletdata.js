// Simulate API delay
const delay = (ms = 700) => new Promise(resolve => setTimeout(resolve, ms));

// Store Data Outside  Functions To Persist State
let mockEmployerWallet = {
  id: 'wallet_emp_01',
  balance: 45000.00,
  locked: 0.00, // New field for Escrow
  currency: 'LKR',
  totalSpent: 120000.00,
  totalDeposited: 165000.00,
  lastUpdated: new Date().toISOString(),
};

let mockEmployerTransactions = [
  {
    id: 'txn_001',
    type: 'payment',
    method: 'wallet',
    amount: 7500.00,
    description: 'Payment to Sunil Fernando – Kitchen Electrical Wiring',
    date: new Date(Date.now() - 2 * 86400000).toISOString(),
    status: 'completed',
    workerName: 'Sunil Fernando',
    jobTitle: 'Kitchen Electrical Wiring Update',
  },
  {
    id: 'txn_002',
    type: 'deposit',
    method: 'bank',
    amount: 50000.00,
    description: 'Wallet top-up via Bank Transfer',
    date: new Date(Date.now() - 5 * 86400000).toISOString(),
    status: 'completed',
    workerName: null,
    jobTitle: null,
  },
  // Example of a held escrow transaction
  {
    id: 'txn_escrow_demo',
    type: 'escrow',
    status: 'held',
    amount: 5000.00,
    description: 'Funds locked in Escrow',
    workerName: 'Nimal Silva',
    jobTitle: 'Garden Cleanup',
    date: new Date().toISOString()
  }
];

// API FUNCTIONS

// Get wallet balance
export const getEmployerWalletAPI = async () => {
  await delay();
  // Return copy to force React update
  return { success: true, data: { ...mockEmployerWallet } };
};

// Get all transactions
export const getEmployerTransactionsAPI = async () => {
  await delay();
  return { success: true, data: mockEmployerTransactions.map(t => ({ ...t })) };
};

//  DEPOSIT (Top Up)
export const depositToWalletAPI = async (amount, method = 'card') => {
  await delay();
  const val = Number(amount);
  if (!val || val <= 0) return { success: false, error: 'Invalid amount' };

  // Update Balance
  mockEmployerWallet.balance += val;
  mockEmployerWallet.totalDeposited += val;
  mockEmployerWallet.lastUpdated = new Date().toISOString();

  // Add Transaction
  const newTxn = {
    id: `txn_deposit_${Date.now()}`,
    type: 'deposit',
    method: method,
    amount: val,
    description: `Wallet top-up via ${method === 'bank' ? 'Bank Transfer' : 'Card'}`,
    date: new Date().toISOString(),
    status: 'completed',
    workerName: null,
    jobTitle: null
  };

  mockEmployerTransactions = [newTxn, ...mockEmployerTransactions];

  return { success: true, message: `LKR ${val.toLocaleString()} added to wallet!` };
};

// PROCESS ESCROW (Used when Hiring)
export const processEscrowAPI = async (amount, workerName, jobTitle) => {
  await delay(800);
  const cost = Number(amount);

  if (cost > mockEmployerWallet.balance) {
    return { success: false, error: 'Insufficient wallet balance' };
  }

  // Move funds: Balance -> Locked
  mockEmployerWallet.balance -= cost;
  mockEmployerWallet.locked += cost;
  mockEmployerWallet.lastUpdated = new Date().toISOString();

  const newTxn = {
    id: `txn_escrow_${Date.now()}`,
    type: 'escrow',
    status: 'held', // Funds are held
    amount: cost,
    workerName: workerName,
    jobTitle: jobTitle,
    date: new Date().toISOString(),
    description: 'Funds locked in Escrow'
  };

  mockEmployerTransactions = [newTxn, ...mockEmployerTransactions];

  return { success: true, message: 'Funds secured in Escrow' };
};

//  RELEASE ESCROW (Job Finished)
export const releaseEscrowAPI = async (txnId) => {
  await delay(800);
  const idx = mockEmployerTransactions.findIndex(t => t.id === txnId);

  if (idx === -1) return { success: false, error: 'Invalid transaction' };

  const txn = mockEmployerTransactions[idx];
  if (txn.status !== 'held') return { success: false, error: 'Funds not in escrow' };

  // Update Transaction
  mockEmployerTransactions[idx] = {
    ...txn,
    status: 'released',
    type: 'payment', // Converts to payment
    description: 'Escrow Released - Job Completed',
    date: new Date().toISOString()
  };

  // Move funds: Locked -> Spent
  mockEmployerWallet.locked -= txn.amount;
  mockEmployerWallet.totalSpent += txn.amount;
  mockEmployerWallet.lastUpdated = new Date().toISOString();

  return { success: true, message: 'Funds released to worker' };
};

// DISPUTE (Flag for admin)
export const disputeEscrowAPI = async (txnId) => {
  await delay(800);
  const idx = mockEmployerTransactions.findIndex(t => t.id === txnId);
  if (idx === -1) return { success: false, error: 'Transaction not found' };

  mockEmployerTransactions[idx] = {
    ...mockEmployerTransactions[idx],
    status: 'disputed'
  };

  return { success: true, message: 'Transaction flagged for Admin review' };
};