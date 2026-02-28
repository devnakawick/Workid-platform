import { AlertCircle } from 'lucide-react';

const DeleteConfirmModal = ({ onConfirm, onCancel, loading }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
        
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
          Delete Job?
        </h3>
        
        <p className="text-gray-600 text-sm text-center mb-6 leading-relaxed">
          Are you sure you want to delete this job? This action cannot be undone.
        </p>
        
        <div className="flex gap-3">
          <button 
            onClick={onCancel} 
            disabled={loading}
            className="flex-1 px-6 py-3 border-2 border-gray-200 bg-white text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm} 
            disabled={loading}
            className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;