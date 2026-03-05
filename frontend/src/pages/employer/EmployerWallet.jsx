import { useState, useEffect } from 'react';
import { Wallet } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

import MockSidebar from '../../mocks/MockSidebar';
import MockFooter  from '../../mocks/MockFooter';

import WalletCard from '../../components/wallet/WalletCard';
import EarningsChart from '../../components/wallet/Earningschart';
import TransactionList from '../../components/wallet/TransactionList';
import TopUpModal from '../../components/wallet/TopUpModal';
import PayModal from '../../components/wallet/PayModal';

import {
  getEmployerWalletAPI,
  getEmployerTransactionsAPI,
  depositToWalletAPI,
  payWorkerAPI,
} from '../../mocks/Walletdata';

const EmployerWallet = () => {

  // Page state
  const [wallet,           setWallet]           = useState(null);
  const [transactions,     setTransactions]     = useState([]);
  const [filteredTxns,     setFilteredTxns]     = useState([]);
  const [loading,          setLoading]          = useState(true);
  const [depositLoading,   setDepositLoading]   = useState(false);
  const [payLoading,       setPayLoading]       = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showPayModal,     setShowPayModal]     = useState(false);
  const [filters,          setFilters]          = useState({ type: 'all' });

  // Load data on mount
  useEffect(() => { fetchData(); }, []);

  // Re-apply filter when transactions or filter changes
  useEffect(() => { applyFilters(); }, [filters, transactions]);

  // Fetch wallet + transactions from mock API
  const fetchData = async () => {
    setLoading(true);
    try {
      const [walletRes, txnRes] = await Promise.all([
        getEmployerWalletAPI(),
        getEmployerTransactionsAPI(),
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

  // Handle wallet top-up
  const handleDeposit = async ({ amount, method }) => {
    setDepositLoading(true);
    try {
      const result = await depositToWalletAPI(Number(amount), method);
      if (result.success) {
        // Refresh data and close modal on success
        await fetchData();
        toast.success(result.message);
        setShowDepositModal(false);
      } else {
        toast.error(result.error || 'Deposit failed');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setDepositLoading(false);
    }
  };

  // Handle pay worker — modal stays open, paid row removed, list updates
  const handlePayWorker = async (txn) => {
    setPayLoading(true);
    try {
      const result = await payWorkerAPI(
        txn.workerName,
        txn.amount,
        txn.jobTitle,
        txn.id,
      );
      if (result.success) {
        // Refresh data — pending row removed, transaction list updated
        await fetchData();
        toast.success(result.message);
      } else {
        toast.error(result.error || 'Payment failed');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setPayLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <MockSidebar />

      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-4 md:p-8">
          <Toaster position="top-right" />

          <div className="max-w-7xl mx-auto">

            {/* Page title */}
            <div className="mb-8">
              <h1 className="flex items-center text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                <Wallet className="w-8 h-8 md:w-10 md:h-10 mr-3 text-blue-600" />
                Employer Wallet
              </h1>
              <p className="text-gray-500 text-sm md:text-base">
                Manage your balance and track all payment transactions.
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
                <WalletCard
                  wallet={wallet}
                  onDeposit={() => setShowDepositModal(true)}
                  onPay={() => setShowPayModal(true)}
                />

                {/* Spending chart */}
                <EarningsChart transactions={transactions} />

                {/* Transaction history table */}
                <TransactionList
                  transactions={filteredTxns}
                  filters={filters}
                  onFilterChange={handleFilterChange}
                />
              </>
            )}
          </div>
        </main>

        <MockFooter />
      </div>

      {/* Top Up Modal */}
      {showDepositModal && (
        <TopUpModal
          onTopUp={handleDeposit}
          onCancel={() => setShowDepositModal(false)}
          loading={depositLoading}
        />
      )}

      {/* Pay Worker Modal — passes live transactions so list updates after each pay */}
      {showPayModal && (
        <PayModal
          transactions={transactions}
          walletBalance={wallet?.balance || 0}
          onConfirm={handlePayWorker}
          onCancel={() => setShowPayModal(false)}
          loading={payLoading}
        />
      )}

    </div>
  );
};

export default EmployerWallet;