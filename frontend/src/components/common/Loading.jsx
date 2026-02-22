import React from 'react';

const Loading = ({ size = "medium" }) => {
    const sizes = {
        small: "w-5 h-5 border-2",
        medium: "w-8 h-8 border-3",
        large: "w-12 h-12 border-4"
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 space-y-3">
            <div className={`animate-spin rounded-full border-indigo-100 border-t-indigo-600 ${sizes[size]}`}></div>
            <p className="text-sm font-medium text-gray-500 animate-pulse">Please wait...</p>
        </div>
    );
};

export default Loading;