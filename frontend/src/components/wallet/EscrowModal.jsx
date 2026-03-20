import { X, ShieldCheck, CheckCircle, AlertTriangle, Clock, Lock } from 'lucide-react';

const EscrowModal = ({ transactions, onRelease, onDispute, onClose, loading }) => {

    // Filter only 'held' transactions
    const activeEscrows = transactions.filter(t => t.status === 'held' || t.status === 'disputed');
    const totalLocked = activeEscrows.reduce((sum, t) => sum + t.amount, 0);
    const fmt = (n) => (Number(n) || 0).toLocaleString('en-LK', { minimumFractionDigits: 2 });

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="bg-blue-600 p-6 text-white flex-shrink-0 relative">
                    <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>

                    <div className="flex items-center gap-4">

                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <Lock className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Escrow Management</h2>
                            <p className="text-blue-100 text-sm">
                                {activeEscrows.length} active jobs · <span className="font-bold">LKR {fmt(totalLocked)}</span> locked
                            </p>
                        </div>
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-3">
                    {activeEscrows.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            <Lock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>No active escrow payments.</p>
                        </div>
                    ) : (
                        activeEscrows.map((txn) => (
                            <div key={txn.id} className={`bg-white p-5 rounded-xl border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${txn.status === 'disputed' ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>

                                {/* Info */}
                                <div className="flex items-start gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${txn.status === 'disputed' ? 'bg-red-100 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                                        {txn.status === 'disputed' ? <AlertTriangle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{txn.workerName || 'Worker'}</h4>
                                        <p className="text-sm text-gray-500 font-medium">{txn.jobTitle || 'Job Payment'}</p>

                                        {txn.status === 'disputed' ? (
                                            <span className="text-xs font-bold text-red-600 mt-1 block">DISPUTE PENDING REVIEW</span>
                                        ) : (
                                            <div className="flex items-center gap-2 text-xs text-orange-600 font-semibold mt-1">
                                                <Lock className="w-3 h-3" /> LKR {fmt(txn.amount)} Locked
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                {txn.status !== 'disputed' && (
                                    <div className="flex gap-2 w-full sm:w-auto">
                                        <button
                                            onClick={() => onRelease(txn)}
                                            disabled={loading}
                                            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg transition-all shadow-sm"
                                        >
                                            <CheckCircle className="w-3.5 h-3.5" />
                                            Release
                                        </button>
                                        <button
                                            onClick={() => onDispute(txn)}
                                            disabled={loading}
                                            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-xs font-bold rounded-lg transition-all"
                                        >
                                            <AlertTriangle className="w-3.5 h-3.5" />
                                            Dispute
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default EscrowModal;