import { useState } from 'react';
import { X, Ticket, CheckCircle2 } from 'lucide-react';


import { submitTicketAPI } from '../../mocks/workerSupportData';

const WorkerTicketForm = ({ onClose }) => {
    const [form, setForm] = useState({ subject: '', category: '', message: '' });
    const [submitted, setSubmitted] = useState(false); // Controls success view
    const [ticketId, setTicketId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.subject.trim() || !form.message.trim()) return;

        setLoading(true);
        setError('');

        // Call Mock API
        const result = await submitTicketAPI(form);
        setLoading(false);

        if (result.success) {
            setTicketId(result.data.id);
            setSubmitted(true);
        } else {
            setError(result.error || 'Something went wrong.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            {/* Modal Container */}
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                            <Ticket className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Submit Ticket</h3>
                            <p className="text-blue-200 text-xs">Worker Support Team</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-all">
                        <X className="w-4 h-4 text-white" />
                    </button>
                </div>

                {/* Success Message (after submit) */}
                {submitted ? (
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="w-8 h-8 text-blue-600" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 mb-2">Ticket Submitted!</h4>
                        <p className="text-sm text-gray-500 mb-1">ID: <span className="font-bold text-blue-600">#{ticketId}</span></p>
                        <button onClick={onClose} className="w-full mt-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all">
                            Done
                        </button>
                    </div>
                ) : (
                    // Input Form
                    <form onSubmit={handleSubmit} className="p-5 space-y-4">
                        {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-200">{error}</div>}

                        {/* Category Select */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Category</label>
                            <select
                                value={form.category}
                                onChange={e => handleChange('category', e.target.value)}
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            >
                                <option value="">Select a category</option>
                                <option value="payment">Payment / Wallet</option>
                                <option value="job">Job Issue</option>
                                <option value="profile">Profile / Documents</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        {/* Subject Input */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Subject</label>
                            <input
                                type="text"
                                value={form.subject}
                                onChange={e => handleChange('subject', e.target.value)}
                                placeholder="Brief description"
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        {/* Message Input */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Message</label>
                            <textarea
                                value={form.message}
                                onChange={e => handleChange('message', e.target.value)}
                                placeholder="How can we help?"
                                rows={4}
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 pt-1">
                            <button type="button" onClick={onClose} disabled={loading} className="flex-1 py-2.5 border-2 border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50">
                                Cancel
                            </button>
                            <button type="submit" disabled={loading || !form.subject} className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-md">
                                {loading ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default WorkerTicketForm;