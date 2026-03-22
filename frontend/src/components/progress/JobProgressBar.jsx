import React from 'react';
import { CheckCircle2, Navigation, Clock, Check, Briefcase } from 'lucide-react';

const JobProgressBar = ({ currentStatus }) => {
    const stages = [
        { id: 'Accepted', label: 'Accepted', icon: CheckCircle2 },
        { id: 'Traveling', label: 'Traveling', icon: Navigation },
        { id: 'In Progress', label: 'In Progress', icon: Briefcase },
        { id: 'Waiting Payment', label: 'Awaiting Pay', icon: Clock },
        { id: 'Finished', label: 'Finished', icon: Check }
    ];

    const currentStageIndex = stages.findIndex(s => s.id === currentStatus);
    const safeIndex = currentStageIndex === -1 ? 0 : currentStageIndex;

    return (
        <div className="w-full py-6 pb-8">
            <div className="relative flex items-center justify-between mx-4 md:mx-8">
                {/* Background line */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1.5 bg-gray-100 rounded-full z-0"></div>

                {/* Active line */}
                <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 bg-blue-600 rounded-full z-0 transition-all duration-700 ease-in-out"
                    style={{ width: `${(safeIndex / (stages.length - 1)) * 100}%` }}
                ></div>

                {/* Steps */}
                {stages.map((stage, index) => {
                    const isCompleted = index <= safeIndex;
                    const isActive = index === safeIndex;
                    const Icon = stage.icon;

                    return (
                        <div key={stage.id} className="relative z-10 flex flex-col items-center">
                            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${isCompleted
                                    ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200 scale-110'
                                    : 'bg-white border-gray-200 text-gray-400'
                                } ${isActive ? 'ring-4 ring-blue-100' : ''}`}
                            >
                                <Icon size={18} className="md:w-5 md:h-5" />
                            </div>
                            <span className={`absolute -bottom-7 w-24 text-center text-xs font-bold transition-colors ${isCompleted ? 'text-gray-900' : 'text-gray-400'
                                }`}>
                                {stage.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default JobProgressBar;
