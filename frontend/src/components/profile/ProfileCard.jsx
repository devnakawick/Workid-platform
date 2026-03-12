import React from 'react';
import { MapPin, ShieldCheck } from 'lucide-react';

const ProfileCard = ({ user }) => {
    // Fallback data if no user object is passed
    const {
        name = "Dishan S.",
        role = "Skilled Carpenter",
        location = "Colombo, Western Province",
        isVerified = true
    } = user || {};

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
                <div className="w-24 h-24 rounded-full bg-indigo-100 border-4 border-white shadow-sm flex items-center justify-center text-indigo-600 text-3xl font-bold">
                    {name.charAt(0)}
                </div>
                {isVerified && (
                    <div className="absolute bottom-1 right-1 bg-white rounded-full p-1 shadow-sm">
                        <ShieldCheck className="text-green-500" size={20} />
                    </div>
                )}
            </div>

            <div className="text-center md:text-left space-y-1">
                <h2 className="text-2xl font-bold text-gray-900">{name}</h2>
                <p className="text-indigo-600 font-medium">{role}</p>
                <div className="flex items-center justify-center md:justify-start gap-1 text-gray-500 text-sm">
                    <MapPin size={14} />
                    <span>{location}</span>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;