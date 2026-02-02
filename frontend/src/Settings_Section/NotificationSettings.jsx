import React from 'react';
import '../global-worker-styles.css';

const NotificationSettings = () => {
    return (
        <div className="settings-group">
            <h2 className="job-title">Job Alerts</h2>
            <p className="text-muted">Stay notified about new jobs in your area.</p>

            <div className="setting-row">
                <span>SMS Notifications</span>
                <input type="checkbox" defaultChecked />
            </div>

            <div className="setting-row">
                <span>App Push Alerts</span>
                <input type="checkbox" defaultChecked />
            </div>

            <div className="setting-row">
                <span>Email Summary</span>
                <input type="checkbox" />
            </div>

            <button className="btn-primary mt-15">Save Preferences</button>
        </div>
    );
};

export default NotificationSettings;