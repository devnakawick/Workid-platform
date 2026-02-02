import React from 'react';

const NavBar = ({ activeTab, setActiveTab }) => {
    const icons = {
        jobs: '💼',
        identity: '👤',
        learning: '📖',
        settings: '⚙️'
    };

    return (
        <header className="navbar-main">
            <div className="navbar-logo" onClick={() => setActiveTab('home')} style={{ cursor: 'pointer' }}>
                <h2>Work<span>ID</span></h2>

            </div>
            <div className="navbar-links">
                {Object.keys(icons).map((tab) => (
                    <button
                        key={tab}
                        className={`nav-item ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        <span className="nav-icon">{icons[tab]}</span>
                        <span className="nav-label">{tab.toUpperCase()}</span>
                    </button>
                ))}
            </div>
        </header>
    );
};

export default NavBar;
