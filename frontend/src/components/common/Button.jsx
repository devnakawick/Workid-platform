import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    const baseStyles = "px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 active:scale-95";

    const variants = {
        // Matches the "Quick Apply" button in your screenshot
        primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-100",
        // Matches the "Details" button in your screenshot
        secondary: "border border-gray-200 text-gray-600 hover:bg-gray-50 bg-white",
        danger: "bg-red-50 text-red-600 hover:bg-red-100",
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;