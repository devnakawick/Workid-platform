import api from './api';

export const walletService = {
    // Worker withdrawal
    withdrawFunds: (amount) => 
        api.post('api/wallet/withdraw', Number(amount)),

    // Employer wallet
    getEmployerWallet: (userId) => 
        api.get('api/employer/wallet', { params: { user_id: userId } }),

    getEmployerTransactions: (userId) => 
        api.get('api/employer/transactions', { params: { user_id: userId } }),

    // Employer deposit
    topUpWallet: (data) => 
        api.post('api/employer/deposit', {
            amount: Number(data.amount),
            method: data.method || 'bank'
        }),

    // PayHere session initiation
    createPaymentSession: (amount) => 
        api.post('api/payments/create', Number(amount)),

    // Escrow 
    fundEscrow: (data) =>
        api.post('api/escrow/fund', {
            job_id: Number(data.job_id),
            worker_id: Number(data.worker_id),
            amount: Number(data.amount)
        }),

    releaseEscrow: (escrowId) =>
        api.post(`api/escrow/release/${escrowId}`),

    disputeEscrow: (escrowId) =>
        api.post(`api/escrow/dispute/${escrowId}`),

    // Worker wallet
    getWorkerWallet: () =>
        api.get('api/wallet/'),

    getWorkerTransactions: () =>
        api.get('api/wallet/transactions'),

    // Payment history
    getPaymentHistory: () =>
        api.get('api/payments/history'),
};

export default walletService;