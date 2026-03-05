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

};

export default EmployerWallet;