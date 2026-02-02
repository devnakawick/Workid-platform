import React from 'react';
import '../global-worker-styles.css';

const DocumentUpload = () => {
    return (
        <div className="identity-container">
            <h3 className="job-title">Identity Verification</h3>
            <p className="text-muted">Upload a clear photo of your NIC or License to get the "Verified" badge.</p>
            <div className="upload-box">
                <p>Click to upload or drag and drop</p>
                <small>(PDF, JPG, PNG up to 5MB)</small>
            </div>
            <button className="btn-primary mt-15">Submit for Review</button>
        </div>
    );
};

export default DocumentUpload;