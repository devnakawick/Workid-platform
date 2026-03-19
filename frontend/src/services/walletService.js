import api from './api';

export const walletService = {
    // Worker withdrawal
    withdrawFunds: (amount) => 
        api.post('/wallet/withdraw', Number(amount)),

    // Employer wallet
    getEmployerWallet: (userId) => 
        api.get('/employer/wallet', { params: { user_id: userId } }),

    getEmployerTransactions: (userId) => 
        api.get('/employer/transactions', { params: { user_id: userId } }),

    // Employer deposit
    topUpWallet: (data) => 
        api.post('/employer/deposit', {
            amount: Number(data.amount),
            method: data.method || 'bank'
        }),

    // PayHere session initiation
    createPaymentSession: (amount) => 
        api.post('/payments/create', Number(amount)),

    // Escrow 
    fundEscrow: (data) =>
        api.post('/escrow/fund', {
            job_id: Number(data.job_id),
            worker_id: Number(data.worker_id),
            amount: Number(data.amount)
        }),

    releaseEscrow: (escrowId) =>
        api.post(`/escros/release/${escrowId}`),
};

export default walletService;