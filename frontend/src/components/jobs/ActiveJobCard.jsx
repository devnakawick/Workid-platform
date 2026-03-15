import React from 'react';
import { MapPin, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ActiveJobCard = ({ job, basePath = '/worker/job-details' }) => {
    const navigate = useNavigate();

    const getStatusColor = (status) => {
        switch (status) {
            case 'Accepted': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'Traveling': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'In Progress': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
            case 'Waiting Payment': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'Finished': return 'bg-gray-100 text-gray-700 border-gray-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div
            onClick={() => navigate(`${basePath}/${job.id}`)}
            className="flex flex-col bg-white border border-gray-100 rounded-2xl shadow-sm p-5 md:p-6 cursor-pointer hover:border-blue-200 hover:shadow-lg transition-all group duration-300 h-full"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3 md:gap-4 flex-1">
                    <div className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                        <Briefcase size={20} className="md:w-6 md:h-6" />
                    </div>
                    <div className="min-w-0 pr-2">
                        <h4 className="font-extrabold text-gray-900 group-hover:text-blue-600 transition-colors truncate text-sm md:text-base">{job.title}</h4>
                        <p className="text-xs md:text-sm font-bold text-gray-400 truncate">{job.employerName}</p>
                    </div>
                </div>
                <span className={`px-2 md:px-3 py-1 text-[10px] md:text-xs font-black uppercase tracking-wider rounded-lg border flex-shrink-0 ${getStatusColor(job.status)}`}>
                    {job.status}
                </span>
            </div>

            <p className="text-gray-500 text-xs md:text-sm mb-6 line-clamp-2 leading-relaxed flex-1">
                {job.description}
            </p>

            <div className="flex items-center justify-between border-t border-gray-50 pt-4 mt-auto">
                <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-bold text-gray-400">
                    <MapPin size={14} className="text-gray-300" />
                    <span className="truncate max-w-[120px] md:max-w-[200px]">{job.location}</span>
                </div>
                <span className="font-extrabold text-blue-600 text-sm md:text-base">{job.budget}</span>
            </div>
        </div>
    );
};

export default ActiveJobCard;
