import React from 'react';
import '../global-worker-styles.css';

const ApplicationCard = () => {
    return (
        <div className="job-card">
            <div className="flex-between">
                <strong>Painting Project</strong>
                <span className="trust-badge badge-pending">Pending</span>
            </div>
            <p className="text-muted">Applied on: Jan 28, 2026</p>
        </div>
    );
};

export default ApplicationCard;