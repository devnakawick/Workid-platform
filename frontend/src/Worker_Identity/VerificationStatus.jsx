import React from 'react';
import '../global-worker-styles.css';

const VerificationStatus = () => {
    return (
        <div className="settings-group">
            <h4>Verification Progress</h4>
            <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: '60%' }}></div>
            </div>
            <p className="text-muted">Status: <strong>Level 2 - Background Check in Progress</strong></p>
        </div>
    );
};

export default VerificationStatus;