import { useState } from 'react';
import { X, CheckCircle, Clock, Banknote, UserCheck, Send, Briefcase, XCircle } from 'lucide-react';
import { MOCK_APPLICATIONS, MOCK_INVITATIONS } from '../../mocks/applicationData';

const InviteModal = ({ worker, jobs, isOpen, onClose, onSend }) => {
    const [selectedJobId, setSelectedJobId] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    if (!isOpen || !worker) return null;

    const selectedJob = jobs.find(j => j.id === selectedJobId);

    const handleSend = () => {
        onSend(selectedJobId);
        setIsSuccess(true);
    };

    const handleClose = () => {
        setIsSuccess(false);
        setSelectedJobId('');
        onClose();
    };


    const getJobStatus = (job) => {

        //CHECK ACTIVE APPLICATIONS (Worker Accepted / Hired / Rejected)
        const existingApp = MOCK_APPLICATIONS.find(app =>
            app.jobId === job.id && (app.id === worker.id || app.name === worker.name)
        );

        if (existingApp) {
            // Employer Hired them
            if (existingApp.status === 'accepted') {
                return {
                    disabled: true,
                    label: 'Already Hired',
                    color: 'bg-green-100 text-green-700 border-green-200',
                    icon: CheckCircle
                };
            }
            // Employer Rejected them
            if (existingApp.status === 'rejected') {
                return {
                    disabled: true,
                    label: 'Rejected',
                    color: 'bg-red-100 text-red-700 border-red-200',
                    icon: XCircle
                };
            }
            // Worker Accepted (Waiting for review)
            if (existingApp.status === 'pending') {
                return {
                    disabled: true,
                    label: 'Worker Accepted',
                    color: 'bg-blue-100 text-blue-700 border-blue-200',
                    icon: UserCheck
                };
            }
        }

        // 2. CHECK PENDING INVITATIONS (Sent, but not accepted yet)
        const existingInvite = MOCK_INVITATIONS.find(inv =>
            inv.jobId === job.id && inv.workerId === worker.id && inv.status === 'sent'
        );

        if (existingInvite) {
            return {
                disabled: true,
                label: 'Invite Sent',

                color: 'bg-blue-100 text-blue-700 border-blue-200',
                icon: Send
            };
        }

        // CHECK JOB STATUS (Closed jobs)
        if (job.status === 'hired' || job.status === 'closed') {
            return {
                disabled: true,
                label: 'Job Closed',
                color: 'bg-gray-100 text-gray-500 border-gray-200',
                icon: Briefcase
            };
        }

        return null; // Available to invite
    };


    if (isSuccess) {
        return (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm text-center p-8">

                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Send className="w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Invite Sent!</h2>
                    <p className="text-sm text-gray-500 mb-6">
                        Invited <span className="font-bold text-gray-800">{worker.name}</span> to <span className="font-bold text-gray-800">{selectedJob?.title}</span>.
                    </p>
                    <button
                        onClick={handleClose}
                        className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/30"
                    >
                        Done
                    </button>
                </div>
            </div>
        );
    }


    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[85vh]">

                {/* Header */}
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
                    <h3 className="font-bold text-lg text-gray-900">Invite {worker.name}</h3>
                    <button onClick={handleClose} className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="overflow-y-auto p-4 space-y-4">

                    {/* Worker Info Card */}
                    <div className="flex items-center gap-3 bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
                            {worker.name.charAt(0)}
                        </div>
                        <div>
                            <h4 className="font-bold text-sm text-gray-900">{worker.name}</h4>
                            <p className="text-xs text-gray-500">{worker.role || 'Worker'} • {worker.location}</p>
                        </div>
                    </div>

                    {/* Job Selection List */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Select a Job</label>
                        <div className="space-y-2">
                            {jobs.map((job) => {
                                const status = getJobStatus(job);
                                const isDisabled = status?.disabled;
                                const isSelected = selectedJobId === job.id;

                                let priceLabel = '';
                                if (job.salary) {
                                    const pMap = { daily: 'day', hourly: 'hour', weekly: 'week', monthly: 'month', fixed: 'total' };
                                    priceLabel = `LKR ${job.salary.toLocaleString()}/${pMap[job.salaryPeriod] || ''}`;
                                } else if (job.budget) {
                                    priceLabel = `LKR ${job.budget.toLocaleString()} budget`;
                                }

                                return (
                                    <button
                                        key={job.id}
                                        disabled={isDisabled}
                                        onClick={() => setSelectedJobId(job.id)}
                                        className={`w-full text-left p-3 rounded-lg border transition-all ${isDisabled
                                            ? 'bg-gray-50 border-gray-100 opacity-60 cursor-not-allowed'
                                            : isSelected
                                                ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500'
                                                : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm'
                                            }`}
                                    >
                                        <div className="flex justify-between items-center mb-1">
                                            <span className={`font-bold text-sm truncate pr-2 ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>{job.title}</span>
                                            {status ? (
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border flex items-center gap-1 ${status.color}`}>
                                                    {status.icon && <status.icon className="w-3 h-3" />} {status.label}
                                                </span>
                                            ) : isSelected && <CheckCircle className="w-4 h-4 text-blue-600" />}
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-gray-500">
                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {job.duration || 'Flexible'}</span>
                                            <span className="flex items-center gap-1"><Banknote className="w-3 h-3" /> <span className="font-semibold">{priceLabel}</span></span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-gray-100 flex gap-3 bg-white">
                    <button onClick={handleClose} className="flex-1 py-2.5 text-gray-600 font-bold hover:bg-gray-50 rounded-lg text-sm transition-colors">Cancel</button>
                    <button
                        onClick={handleSend}
                        disabled={!selectedJobId}
                        className={`flex-1 py-2.5 rounded-lg font-bold text-sm text-white shadow-md transition-all ${selectedJobId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed shadow-none'}`}
                    >
                        Send Invite
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InviteModal;