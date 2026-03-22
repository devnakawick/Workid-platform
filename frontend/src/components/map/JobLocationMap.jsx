import React from 'react';
import { MapPin, User, Briefcase } from 'lucide-react';

const JobLocationMap = ({ employerLocation, workerLocation }) => {
    // A mock visual representation of a map since we don't have a real maps API key
    return (
        <div className="relative w-full h-64 bg-slate-100 rounded-xl border border-gray-200 overflow-hidden flex items-center justify-center bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=colombo&zoom=12&size=600x300&maptype=roadmap&sensor=false')] bg-cover bg-center">
            {/* Overlay grid for map-like feel if image fails */}
            <div className="absolute inset-0 saturate-50 opacity-80 mix-blend-multiply bg-indigo-50/40" />

            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-sm text-xs font-bold space-y-1 border border-gray-100">
                <div className="flex items-center gap-2 text-gray-700">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm"></div> Employer
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm"></div> You (Worker)
                </div>
            </div>

            {employerLocation && (
                <div className="absolute top-1/4 left-1/3 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-1000">
                    <div className="bg-blue-600 p-2.5 rounded-full shadow-lg border-[3px] border-white relative">
                        <Briefcase size={16} className="text-white relative z-10" />
                        <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white" />
                    </div>
                </div>
            )}

            {workerLocation && (
                <div className="absolute bottom-1/3 right-1/4 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    <div className="bg-emerald-600 p-2.5 rounded-full shadow-lg border-[3px] border-white animate-pulse relative">
                        <User size={16} className="text-white relative z-10" />
                        <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobLocationMap;
