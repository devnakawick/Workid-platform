import React from 'react';
import '../global-worker-styles.css';

const AccountSettings = () => {
    return (
        <div className="settings-group">
            <h2 className="job-title">Account Settings</h2>
            <div className="setting-row">
                <div>
                    <label className="d-block font-bold">Phone Number</label>
                    <input type="text" className="search-bar mt-5" defaultValue="+94 77 123 4567" />
                </div>
            </div>
            <div className="setting-row">
                <div>
                    <label className="d-block font-bold">Default Work Location</label>
                    <input type="text" className="search-bar mt-5" defaultValue="Colombo, SL" />
                </div>
            </div>
            <button className="btn-primary mt-10">Update Profile</button>
        </div>
    );
};

export default AccountSettings;