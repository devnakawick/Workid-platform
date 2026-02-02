import React from 'react';
import '../global-worker-styles.css';

const CertificateView = ({ courseName }) => {
    return (
        <div className="identity-container certificate-container">
            <div className="certificate-icon">📜</div>
            <h2 className="job-title">Certified Professional</h2>
            <p>This is to certify that the worker has completed</p>
            <h3 className="certificate-course-name">{courseName || "General Skills Training"}</h3>
            <p className="text-muted">Issued by WorkID Academy • 2026</p>
            <button className="btn-primary mt-10">Download PDF</button>
        </div>
    );
};

export default CertificateView;