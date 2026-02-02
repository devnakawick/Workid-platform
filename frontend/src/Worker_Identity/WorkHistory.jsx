import React from 'react';
import '../global-worker-styles.css';

const WorkHistory = () => {
    const history = [
        { id: 1, job: "House Wiring", date: "Jan 15, 2026", rating: "5.0" },
        { id: 2, job: "Leak Repair", date: "Jan 02, 2026", rating: "4.8" }
    ];
    return (
        <div className="settings-group">
            <h4 className="job-title">Recent Work</h4>
            {history.map(item => (
                <div key={item.id} className="setting-row">
                    <span>{item.job}</span>
                    <span className="rating-star">★ {item.rating}</span>
                </div>
            ))}
        </div>
    );
};

export default WorkHistory;