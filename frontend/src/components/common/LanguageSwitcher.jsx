import React from 'react';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
    return (
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
            <Globe size={16} className="text-gray-400" />
            <select
                className="bg-transparent text-sm font-medium text-gray-700 outline-none cursor-pointer pr-1"
                onChange={(e) => console.log(`Language changed to: ${e.target.value}`)}
            >
                <option value="en">English</option>
                <option value="si">සිංහල</option>
                <option value="ta">தமிழ்</option>
            </select>
        </div>
    );
};

export default LanguageSwitcher;