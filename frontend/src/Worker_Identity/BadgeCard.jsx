import React from 'react';
import '../global-worker-styles.css';

const BadgeCard = () => {
    return (
        <div className="job-card badge-card">
            <div className="badge-icon">🛡️</div>

            <p className="text-muted badge-subtitle">Verified via NIC & Police Record</p>
        </div>
    );
};

export default BadgeCard;