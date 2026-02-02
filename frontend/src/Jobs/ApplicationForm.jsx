import React from 'react';
import '../global-worker-styles.css';

const ApplicationForm = ({ job, onSubmit, onCancel }) => {
    return (
        <div className="identity-container">
            <h3>Confirm Application</h3>
            <p>Applying for: <strong>{job?.title}</strong></p>
            <div className="form-group">
                <label>Expected Daily Wage (Optional)</label>
                <input type="number" className="search-bar" placeholder={job?.wage} />
            </div>
            <div className="form-group">
                <label>Message to Employer</label>
                <textarea className="search-bar" rows="3" placeholder="I am available to start immediately..."></textarea>
            </div>
            <div className="form-actions">
                <button className="btn-primary" onClick={onSubmit}>Submit Application</button>
                <button className="btn-primary btn-secondary" onClick={onCancel}>Cancel</button>
            </div>
        </div>
    );
};

export default ApplicationForm;