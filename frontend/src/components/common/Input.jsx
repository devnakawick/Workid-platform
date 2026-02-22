import React from 'react';

const Input = ({ label, icon, error, ...props }) => {
    return (
        <div className="w-full space-y-1.5">
            {label && <label className="text-sm font-semibold text-gray-700 ml-1">{label}</label>}
            <div className="relative group">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                        {icon}
                    </div>
                )}
                <input
                    className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-gray-400 shadow-sm`}
                    {...props}
                />
            </div>
            {error && <p className="text-xs text-red-500 ml-1">{error}</p>}
        </div>
    );
};

export default Input;