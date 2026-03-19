import { useState, useEffect } from 'react';
import { Wallet } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

// Wallet Components
import WalletCard from '../../components/wallet/WalletCard';
import EarningsChart from '../../components/wallet/Earningschart';
import TransactionList from '../../components/wallet/TransactionList';
import TopUpModal from '../../components/wallet/TopUpModal';
import EscrowModal from '../../components/wallet/EscrowModal'; // Changed from PayModal

// API Functions
import {
  getEmployerWalletAPI,
  getEmployerTransactionsAPI,
  depositToWalletAPI,
  releaseEscrowAPI,
  disputeEscrowAPI,
} from '../../mocks/Walletdata';

const EmployerWallet = () => {

  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [filteredTxns, setFilteredTxns] = useState([]);

  const [loading, setLoading] = useState(true);
  const [depositLoading, setDepositLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false); // For release/dispute actions

  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showEscrowModal, setShowEscrowModal] = useState(false);

  const [filters, setFilters] = useState({ type: 'all' });

  // Initial Data Fetch
  useEffect(() => { fetchData(); }, []);

  // Filter Logic
  useEffect(() => { applyFilters(); }, [filters, transactions]);

  const fetchData = async () => {
    // Only show full page spinner on initial load
    if (!wallet) setLoading(true);
    try {
      const [walletRes, txnRes] = await Promise.all([
        getEmployerWalletAPI(),
        getEmployerTransactionsAPI(),
      ]);
      if (walletRes.success) setWallet(walletRes.data);
      if (txnRes.success) {
        setTransactions(txnRes.data);
        setFilteredTxns(txnRes.data); // Update filtered list immediately
      }
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

  // Deposit Handler
  const handleDeposit = async ({ amount, method }) => {
    setDepositLoading(true);
    try {
      const result = await depositToWalletAPI(Number(amount), method);
      if (result.success) {
        toast.success(result.message);
        setShowDepositModal(false);
        await fetchData(); // Refresh data
      } else {
        toast.error(result.error || 'Deposit failed');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setDepositLoading(false);
    }
  };

  // Escrow Released Handler
  const handleRelease = async (txn) => {
    if (!window.confirm(`Release LKR ${txn.amount.toLocaleString()} to ${txn.workerName}?`)) return;
    setActionLoading(true);
    try {
      const res = await releaseEscrowAPI(txn.id);
      if (res.success) {
        toast.success("Funds released successfully!");
        await fetchData();
      } else {
        toast.error(res.error || "Failed to release funds");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setActionLoading(false);
    }
  };

  // Escrow Dispute Handler
  const handleDispute = async (txn) => {
    if (!window.confirm("Are you sure you want to dispute this payment? It will be flagged for admin review.")) return;
    setActionLoading(true);
    try {
      const res = await disputeEscrowAPI(txn.id);
      if (res.success) {
        toast.success("Transaction flagged for dispute.");
        await fetchData();
      } else {
        toast.error(res.error || "Failed to flag transaction");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">

      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Toaster position="top-right" />

          <div className="w-full lg:max-w-7xl lg:mx-auto">

            {/* Page Title */}
            <div className="mb-6 md:mb-8">
              <h1 className="flex items-center text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                <Wallet className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 mr-2 sm:mr-3 text-blue-600 flex-shrink-0" />
                Employer Wallet
              </h1>
              <p className="text-gray-500 text-sm md:text-base">
                Manage funds, top up your wallet, and track escrow payments.
              </p>
            </div>

            {/* Content Area */}
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
                  onEscrow={() => setShowEscrowModal(true)}
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
      </div>

      {/* MODALS*/}

      {showDepositModal && (
        <TopUpModal
          onTopUp={handleDeposit}
          onCancel={() => setShowDepositModal(false)}
          loading={depositLoading}
        />
      )}

      {showEscrowModal && (
        <EscrowModal
          transactions={transactions}
          onRelease={handleRelease}
          onDispute={handleDispute}
          onClose={() => setShowEscrowModal(false)}
          loading={actionLoading}
        />
      )}

    </div>
  );
};

export default EmployerWallet;