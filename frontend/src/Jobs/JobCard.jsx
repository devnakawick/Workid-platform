import React from 'react';
import '../global-worker-styles.css';

const JobCard = (props) => {
    const { job, onViewDetails } = props;
    return (
        <div className="job-card">
            <div className="card-header">
                <h3 className="job-title">{job.title}</h3>
                <span className="location-badge">{job.location}</span>
            </div>

            <div className="card-body">
                <div className="meta-row">
                    <div className="info-chip">
                        <span className="label">Wage</span>
                        <span className="value-wage">Rs. {job.wage}</span>
                    </div>
                    <div className="info-chip">
                        <span className="label">Distance</span>
                        <span className="value">{job.distance} km</span>
                    </div>
                </div>
            </div>

            <div className="card-footer">
                <button className="btn-primary w-100" onClick={() => onViewDetails(job)}>
                    View Details
                </button>
            </div>

            <style jsx>{`
                .job-card {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    height: 100%;
                }
                .card-header {
                    margin-bottom: 16px;
                }
                .job-title {
                    margin-bottom: 8px;
                    font-size: 1.25rem;
                }
                .location-badge {
                    font-size: 0.85rem;
                    color: var(--slate-600);
                    display: inline-block;
                    background: var(--slate-100);
                    padding: 4px 10px;
                    border-radius: 20px;
                    font-weight: 500;
                }
                .card-body {
                    flex-grow: 1;
                    margin-bottom: 20px;
                }
                .meta-row {
                    display: flex;
                    gap: 12px;
                }
                .info-chip {
                    display: flex;
                    flex-direction: column;
                }
                .info-chip .label {
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    color: var(--slate-400);
                    font-weight: 700;
                    margin-bottom: 4px;
                }
                .info-chip .value {
                    font-weight: 600;
                    color: var(--slate-900);
                }
                .info-chip .value-wage {
                    font-weight: 700;
                    color: var(--primary-blue);
                }
                .w-100 {
                    width: 100%;
                }
            `}</style>
        </div>
    );
};

export default JobCard;