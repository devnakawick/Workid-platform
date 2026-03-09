import { useState, useEffect } from 'react';
import { Wallet } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

import WorkerWalletCard      from '../../components/wallet/WorkerWalletCard';
import WorkerEarningsChart   from '../../components/wallet/WorkerEarningsChart';
import WorkerTransactionList from '../../components/wallet/WorkerTransactionList';
import WithdrawForm          from '../../components/wallet/WithdrawForm';

import {
  getWorkerWalletAPI,
  getWorkerTransactionsAPI,
  withdrawFromWalletAPI,
} from '../../mocks/workerWalletData';

const WorkerWallet = () => {

  // Page state
  const [wallet,            setWallet]            = useState(null);
  const [transactions,      setTransactions]      = useState([]);
  const [filteredTxns,      setFilteredTxns]      = useState([]);
  const [loading,           setLoading]           = useState(true);
  const [withdrawLoading,   setWithdrawLoading]   = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [filters,           setFilters]           = useState({ type: 'all' });

  // Load data on mount
  useEffect(() => { fetchData(); }, []);

  // Re-apply filter when transactions or filter changes
  useEffect(() => { applyFilters(); }, [filters, transactions]);

  // Fetch wallet and transactions from mock API
  const fetchData = async () => {
    setLoading(true);
    try {
      const [walletRes, txnRes] = await Promise.all([
        getWorkerWalletAPI(),
        getWorkerTransactionsAPI(),
      ]);
      if (walletRes.success) setWallet(walletRes.data);
      if (txnRes.success)    setTransactions(txnRes.data);
    } catch {
      toast.error('Failed to load wallet data');
    } finally {
      setLoading(false);
    }
  };

  // Filter transactions by type
  const applyFilters = () => {
    let result = [...transactions];
    if (filters.type !== 'all') result = result.filter(t => t.type === filters.type);
    setFilteredTxns(result);
  };

  // Update filter state
  const handleFilterChange = (name, value) =>
    setFilters(prev => ({ ...prev, [name]: value }));

  // Handle withdrawal — refresh data and close modal on success
  const handleWithdraw = async (amount, bank) => {
    setWithdrawLoading(true);
    try {
      const result = await withdrawFromWalletAPI(amount, bank);
      if (result.success) {
        await fetchData();
        toast.success(result.message);
        setShowWithdrawModal(false);
      } else {
        toast.error(result.error || 'Withdrawal failed');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setWithdrawLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">



      {/* Main content — full width on mobile */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Toaster position="top-right" />

          {/* No max-width on mobile*/}
          <div className="w-full lg:max-w-7xl lg:mx-auto">

            {/* Page title */}
            <div className="mb-6 md:mb-8">
              <h1 className="flex items-center text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                <Wallet className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 mr-2 sm:mr-3 text-blue-600 flex-shrink-0" />
                My Wallet
              </h1>
              <p className="text-gray-500 text-sm md:text-base">
                Track your earnings and withdraw to your bank account.
              </p>
            </div>

            {/* Loading spinner */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-md">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4" />
                <p className="text-gray-500">Loading wallet...</p>
              </div>
            ) : (
              <>
                {/* Balance card + stats */}
                <WorkerWalletCard
                  wallet={wallet}
                  onWithdraw={() => setShowWithdrawModal(true)}
                />

                {/* Earnings chart */}
                <WorkerEarningsChart transactions={transactions} />

                {/* Transaction history table */}
                <WorkerTransactionList
                  transactions={filteredTxns}
                  filters={filters}
                  onFilterChange={handleFilterChange}
                />
              </>
            )}

          </div>
        </main>
      </div>

      {/* Withdraw modal */}
      {showWithdrawModal && (
        <WithdrawForm
          balance={wallet?.balance || 0}
          onConfirm={handleWithdraw}
          onCancel={() => setShowWithdrawModal(false)}
          loading={withdrawLoading}
        />
      )}

    </div>
  );
};

export default WorkerWallet;