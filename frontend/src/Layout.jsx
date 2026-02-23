import React from 'react';

export default function Layout({ children }) {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Main Content */}
            <main>{children}</main>
        </div>
    );
}