import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = ({ label, icon, error, type, ...props }) => {
    const [showPassword, setShowPassword] = useState(false);
    
    // Determine the actual input type to pass to the DOM
    const isPasswordType = type === 'password';
    const inputType = isPasswordType && showPassword ? 'text' : type;
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
                    type={inputType}
                    className={`w-full ${icon ? 'pl-10' : 'pl-4'} ${isPasswordType ? 'pr-10' : 'pr-4'} py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-gray-400 shadow-sm`}
                    {...props}
                />
                {isPasswordType && (
                    <button
                        type="button"
                        tabIndex="-1"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                )}
            </div>
            {error && <p className="text-xs text-red-500 ml-1">{error}</p>}
        </div>
    );
};

export default Input;