import React from 'react';
import { MapPin, User, DollarSign, FileText, Star } from 'lucide-react';

const ActiveJobDetails = ({ job, isEmployer = false }) => {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-8 tracking-tight">{job.title}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                            <User size={20} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{isEmployer ? "Worker" : "Employer"}</p>
                            <div className="flex items-center gap-2">
                                <p className="font-bold text-gray-900 text-xl tracking-tight">{job.employerName}</p>
                                {job.employerTrustScore && (
                                    <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                                        <Star size={10} className="fill-blue-600 outline-none" /> AI Trust: {job.employerTrustScore}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                            <DollarSign size={20} className="text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Budget</p>
                            <p className="font-extrabold text-emerald-600 text-xl tracking-tight">{job.budget}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                            <MapPin size={20} className="text-purple-600" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Location</p>
                            <p className="font-bold text-gray-900 text-base">{job.location}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 h-full">
                    <div className="flex items-center gap-2 mb-4">
                        <FileText size={18} className="text-slate-400" />
                        <h3 className="font-bold text-slate-700 tracking-tight">Job Description</h3>
                    </div>
                    <p className="text-sm md:text-base text-slate-600 leading-relaxed font-medium">
                        {job.description}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ActiveJobDetails;
