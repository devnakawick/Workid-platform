import { useState, useEffect } from 'react';
import { Wallet } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

import MockSidebar from '../../mocks/MockSidebar';
import MockFooter  from '../../mocks/MockFooter';

import WalletCard       from '../../components/wallet/WalletCard';
import EarningsChart    from '../../components/wallet/Earningschart';
import TransactionList  from '../../components/wallet/TransactionList';
import TopUpModal       from '../../components/wallet/TopUpModal';
import PayModal         from '../../components/wallet/PayModal';

import {
  getEmployerWalletAPI,
  getEmployerTransactionsAPI,
  depositToWalletAPI,
  payWorkerAPI,
} from '../../mocks/Walletdata';

const EmployerWallet = () => {

  const [wallet,           setWallet]           = useState(null);
  const [transactions,     setTransactions]     = useState([]);
  const [filteredTxns,     setFilteredTxns]     = useState([]);
  const [loading,          setLoading]          = useState(true);
  const [depositLoading,   setDepositLoading]   = useState(false);
  const [payLoading,       setPayLoading]       = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showPayModal,     setShowPayModal]     = useState(false);
  const [filters,          setFilters]          = useState({ type: 'all' });

  useEffect(() => { fetchData(); }, []);
  useEffect(() => { applyFilters(); }, [filters, transactions]);

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

  const applyFilters = () => {
    let result = [...transactions];
    if (filters.type !== 'all') result = result.filter(t => t.type === filters.type);
    setFilteredTxns(result);
  };

  const handleFilterChange = (name, value) =>
    setFilters(prev => ({ ...prev, [name]: value }));

  const handleDeposit = async ({ amount, method }) => {
    setDepositLoading(true);
    try {
      const result = await depositToWalletAPI(Number(amount), method);
      if (result.success) {
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
      {/* Sidebar — hidden on mobile, shown on lg+ */}
      <div className="hidden lg:block">
        <MockSidebar />
      </div>

      {/* Main content — always full width on mobile */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Toaster position="top-right" />

          
          <div className="w-full lg:max-w-7xl lg:mx-auto">

            {/* Page title */}
            <div className="mb-6 md:mb-8">
              <h1 className="flex items-center text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                <Wallet className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 mr-2 sm:mr-3 text-blue-600 flex-shrink-0" />
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
                <WalletCard
                  wallet={wallet}
                  onDeposit={() => setShowDepositModal(true)}
                  onPay={() => setShowPayModal(true)}
                />
                <EarningsChart transactions={transactions} />
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

      {/* Pay Worker Modal */}
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