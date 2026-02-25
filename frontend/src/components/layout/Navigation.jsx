import React from 'react';
import './navigation.css';

const Navigation = ({ currentPath }) => {
    // Breadcrumb-style navigation for deep pages
    const paths = currentPath?.split('/').filter(p => p) || ['Dashboard'];

    return (
        <nav className="breadcrumb-nav">
            {paths.map((path, index) => (
                <React.Fragment key={path}>
                    <span className={`crumb ${index === paths.length - 1 ? 'current' : ''}`}>
                        {path.replace('-', ' ')}
                    </span>
                    {index < paths.length - 1 && <span className="sep">/</span>}
                </React.Fragment>
            ))}
        </nav>
    );
};

export default Navigation;