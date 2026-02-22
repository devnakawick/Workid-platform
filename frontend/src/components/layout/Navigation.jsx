import React from 'react';

const Navigation = ({ currentPath }) => {
    // Breadcrumb-style navigation for deep pages
    const paths = currentPath?.split('/').filter(p => p) || ['Dashboard'];

    return (
        <nav className="flex items-center text-sm text-gray-500 mb-6">
            {paths.map((path, index) => (
                <React.Fragment key={path}>
                    <span className={`capitalize ${index === paths.length - 1 ? 'font-semibold text-gray-900' : ''}`}>
                        {path.replace('-', ' ')}
                    </span>
                    {index < paths.length - 1 && <span className="mx-2 text-gray-400">/</span>}
                </React.Fragment>
            ))}
        </nav>
    );
};

export default Navigation;