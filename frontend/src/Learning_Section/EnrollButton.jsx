import React from 'react';
import '../global-worker-styles.css';

const EnrollButton = ({ onClick, isEnrolled }) => {
    return (
        <button
            className={`btn-primary btn-enroll ${isEnrolled ? 'btn-enroll-active' : ''}`}
            onClick={onClick}
        >
            {isEnrolled ? "✓ Enrolled" : "Enroll Now"}
        </button>
    );
};

export default EnrollButton;