import React from 'react';
import '../global-worker-styles.css';

const PrivacySettings = () => {
    return (
        <div className="settings-group">
            <h2 className="job-title">Privacy</h2>
            <div className="setting-row">
                <span>Show profile to verified employers only</span>
                <input type="checkbox" defaultChecked />
            </div>
            <div className="setting-row">
                <span>Show my rating to other workers</span>
                <input type="checkbox" />
            </div>
            <div className="setting-row">
                <span>Share location for nearby jobs</span>
                <input type="checkbox" defaultChecked />
            </div>
            <button className="btn-primary mt-15 badge-gray">Manage Data</button>
        </div>
    );
};

export default PrivacySettings;