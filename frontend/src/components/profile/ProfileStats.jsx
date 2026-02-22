import React from 'react';
import { Star, CheckCircle, Clock } from 'lucide-react';

const ProfileStats = () => {
    const stats = [
        { label: 'Rating', value: '4.9', icon: <Star className="text-yellow-500" size={20} />, sub: 'Out of 5' },
        { label: 'Completed', value: '128', icon: <CheckCircle className="text-green-500" size={20} />, sub: 'Total Jobs' },
        { label: 'Reliability', value: '99%', icon: <Clock className="text-blue-500" size={20} />, sub: 'On-time rate' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((stat, index) => (
                <div key={index} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-gray-50 rounded-xl">
                        {stat.icon}
                    </div>
                    <div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                            <span className="text-xs text-gray-400 font-medium">{stat.sub}</span>
                        </div>
                        <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProfileStats;