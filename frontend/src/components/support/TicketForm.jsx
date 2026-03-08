import { useState } from 'react';
import { X, Ticket, CheckCircle2 } from 'lucide-react';

// Submit ticket API from mock data file
import { submitTicketAPI } from '../../mocks/supportData';

const TicketForm = ({ onClose }) => {

  // Form field state
  const [form,      setForm]      = useState({ subject: '', category: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [ticketId,  setTicketId]  = useState('');
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');

  // Update a single form field
  const handleChange = (field, value) =>
    setForm(prev => ({ ...prev, [field]: value }));

  // Validate and submit ticket to mock API
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.subject.trim() || !form.message.trim()) return;
    setLoading(true);
    setError('');
    const result = await submitTicketAPI(form);
    setLoading(false);
    if (result.success) {
      // Store ticket ID for success screen
      setTicketId(result.data.id);
      setSubmitted(true);
    } else {
      setError(result.error || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">

        {/* Modal header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <Ticket className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Submit a Ticket</h3>
              <p className="text-blue-200 text-xs">We'll respond within 24 hours</p>
            </div>
          </div>
          {/* Close button */}
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {submitted ? (
          // Success screen — show generated ticket ID
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">Ticket Submitted!</h4>
            <p className="text-sm text-gray-500 mb-1">
              Your ticket ID:{' '}
              <span className="font-bold text-blue-600">#{ticketId}</span>
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Our team will reply to your registered email within 24 hours
            </p>
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all"
            >
              Done
            </button>
          </div>
        ) : (
          // Ticket form
          <form onSubmit={handleSubmit} className="p-5 space-y-4">

            {/* API error message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium">
                {error}
              </div>
            )}

            {/* Category select */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                Category
              </label>
              <select
                value={form.category}
                onChange={e => handleChange('category', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select a category</option>
                <option value="payment">Payment Issue</option>
                <option value="account">Account Problem</option>
                <option value="job">Job / Hiring Issue</option>
                <option value="worker">Worker Complaint</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Subject input */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                Subject *
              </label>
              <input
                type="text"
                value={form.subject}
                onChange={e => handleChange('subject', e.target.value)}
                placeholder="Brief description of your issue"
                maxLength={100}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Message textarea with character count */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                Message *
              </label>
              <textarea
                value={form.message}
                onChange={e => handleChange('message', e.target.value)}
                placeholder="Describe your issue in detail..."
                rows={4}
                maxLength={500}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm resize-none focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
              {/* Character count */}
              <p className="text-xs text-gray-400 text-right mt-1">
                {form.message.length}/500
              </p>
            </div>

            {/* Cancel and submit buttons */}
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 py-2.5 border-2 border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 disabled:opacity-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !form.subject.trim() || !form.message.trim()}
                className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-50 shadow-md transition-all"
              >
                {loading ? 'Submitting...' : 'Submit Ticket'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default TicketForm;