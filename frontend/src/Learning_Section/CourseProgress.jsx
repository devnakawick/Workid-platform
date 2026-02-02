import React from 'react';
import '../global-worker-styles.css';

const CourseProgress = ({ percentage = 0, title }) => {
    return (
        <div className="settings-group">
            <div className="progress-header">
                <span className="font-600">{title}</span>
                <span className="progress-text-blue">{percentage}%</span>
            </div>
            <div className="progress-bar-bg">
                <div
                    className="progress-bar-fill"
                    style={{
                        width: `${percentage}%`,
                    }}
                ></div>
            </div>
        </div>
    );
};

export default CourseProgress;