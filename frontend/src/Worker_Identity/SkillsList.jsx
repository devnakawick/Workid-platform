import React from 'react';
import '../global-worker-styles.css';

const SkillsList = () => {
    const skills = ["Plumbing", "Electrical", "Emergency Repairs"];
    return (
        <div className="settings-group">
            <h4 className="job-title">Your Skills</h4>
            <div className="skills-container">
                {skills.map(skill => (
                    <span key={skill} className="trust-badge">{skill}</span>
                ))}
                <button className="add-skill-btn">+ Add Skill</button>
            </div>
        </div>
    );
};

export default SkillsList;