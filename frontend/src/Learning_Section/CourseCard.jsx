import React from 'react';
import '../global-worker-styles.css';

const CourseCard = ({ course, onEnroll }) => {
    return (
        <div className="job-card course-card">
            <h4 className="job-title">{course.title}</h4>
            <p className="text-muted">Duration: {course.duration}</p>
            <div className="course-meta">
                <span className="trust-badge badge-gray">{course.level}</span>
                <button className="btn-primary" onClick={() => onEnroll(course.title)}>View Course</button>
            </div>
        </div>
    );
};

export default CourseCard;