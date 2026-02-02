import React from 'react';
import '../global-worker-styles.css';

const JobDetails = ({ job, onBack, onApply }) => {
    if (!job) return null;

    return (
        <div className="job-details-container animate-fade">
            {/* Header / Nav */}
            <div className="details-header-nav">
                <button onClick={onBack} className="btn-text-back">
                    <span>←</span> Back
                </button>
            </div>

            {/* Main Content Card */}
            <div className="details-card">
                {/* Job Header */}
                <div className="job-hero">
                    <div className="hero-top">
                        <h2 className="detail-title">{job.title}</h2>
                        <span className="wage-badge">Rs. {job.wage}<span className="wage-period">/day</span></span>
                    </div>

                    <div className="hero-meta">
                        <span className="meta-badge location">📍 {job.location}</span>
                        <span className="meta-text">{job.distance} km away</span>
                        <span className="meta-dot">•</span>
                        <span className="meta-text">{job.postedTime || 'Recently'}</span>
                    </div>

                    <div className="tags-row">
                        {job.tags && job.tags.map((tag, index) => (
                            <span key={index} className="job-tag">{tag}</span>
                        ))}
                    </div>
                </div>

                <hr className="divider" />

                {/* Description */}
                <div className="section-block">
                    <h3 className="section-title">Description</h3>
                    <p className="section-text">
                        {job.description || `This job requires a skilled ${job.title.toLowerCase()} for immediate work. Please review the requirements below.`}
                    </p>
                </div>

                {/* Requirements */}
                <div className="section-block">
                    <h3 className="section-title">Requirements</h3>
                    <ul className="req-list">
                        {job.requirements ? (
                            job.requirements.map((req, i) => (
                                <li key={i} className="req-item">
                                    <span className="check-icon">✓</span> {req}
                                </li>
                            ))
                        ) : (
                            <>
                                <li className="req-item"><span className="check-icon">✓</span> Previous experience required</li>
                                <li className="req-item"><span className="check-icon">✓</span> Own tools preferred</li>
                                <li className="req-item"><span className="check-icon">✓</span> References available</li>
                            </>
                        )}
                    </ul>
                </div>

                <hr className="divider" />

                {/* About Client (Mock) */}
                <div className="client-section">
                    <div className="client-avatar">C</div>
                    <div className="client-info">
                        <h4 className="client-name">Client: Residential Owner</h4>
                        <div className="client-rating">★★★★★ <span>(12 Jobs Posted)</span></div>
                    </div>
                </div>

                {/* Sticky Footer Action */}
                <div className="action-footer">
                    <button className="btn-primary btn-large" onClick={onApply}>
                        Apply Now
                    </button>
                </div>
            </div>

            <style jsx>{`
                .job-details-container {
                    animation: fadeIn 0.3s ease-out;
                    padding-bottom: 20px;
                }
                
                .details-header-nav {
                    margin-bottom: 16px;
                }

                .details-card {
                    background: var(--white);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-lg);
                    padding: 32px;
                    box-shadow: var(--shadow-sm);
                }

                .job-hero {
                    margin-bottom: 24px;
                }

                .hero-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 12px;
                }

                .detail-title {
                    font-size: 1.8rem;
                    color: var(--slate-900);
                    margin: 0;
                    font-weight: 700;
                    line-height: 1.2;
                }

                .wage-badge {
                    background: #f0fdf4;
                    color: #166534;
                    padding: 8px 16px;
                    border-radius: var(--radius-full);
                    font-weight: 700;
                    font-size: 1.1rem;
                    border: 1px solid #dcfce7;
                    white-space: nowrap;
                    margin-left: 16px;
                }

                .wage-period {
                    font-size: 0.8rem;
                    font-weight: 500;
                    opacity: 0.8;
                }

                .hero-meta {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 16px;
                    flex-wrap: wrap;
                }

                .meta-badge {
                    background: var(--slate-100);
                    padding: 4px 10px;
                    border-radius: var(--radius-sm);
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: var(--slate-700);
                }

                .meta-text {
                    font-size: 0.9rem;
                    color: var(--slate-500);
                }

                .meta-dot {
                    color: var(--slate-300);
                }

                .tags-row {
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                }

                .job-tag {
                    background: #eff6ff;
                    color: var(--primary-blue);
                    font-size: 0.8rem;
                    padding: 4px 12px;
                    border-radius: var(--radius-full);
                    font-weight: 500;
                }

                .divider {
                    border: none;
                    border-top: 1px solid var(--border-color);
                    margin: 24px 0;
                }

                .section-block {
                    margin-bottom: 24px;
                }

                .section-title {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: var(--slate-900);
                    margin-bottom: 12px;
                }

                .section-text {
                    font-size: 1rem;
                    line-height: 1.6;
                    color: var(--slate-600);
                }

                .req-list {
                    list-style: none;
                    padding: 0;
                }

                .req-item {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 10px;
                    color: var(--slate-700);
                    font-size: 0.95rem;
                }

                .check-icon {
                    color: var(--primary-blue);
                    font-weight: bold;
                }

                .client-section {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    background: var(--slate-50);
                    padding: 16px;
                    border-radius: var(--radius-md);
                    margin-bottom: 24px;
                }

                .client-avatar {
                    width: 48px;
                    height: 48px;
                    background: var(--slate-200);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    color: var(--slate-500);
                    font-size: 1.2rem;
                }

                .client-name {
                    margin: 0 0 4px 0;
                    font-size: 1rem;
                    color: var(--slate-900);
                }

                .client-rating {
                    font-size: 0.9rem;
                    color: #eab308; /* Yellow-500 */
                }

                .client-rating span {
                    color: var(--slate-400);
                    margin-left: 6px;
                    font-size: 0.85rem;
                }

                .btn-large {
                    padding: 14px;
                    font-size: 1.1rem;
                }

                @media (max-width: 640px) {
                    .details-card {
                        padding: 20px;
                    }
                    .hero-top {
                        flex-direction: column;
                        gap: 8px;
                    }
                    .wage-badge {
                        margin-left: 0;
                        align-self: flex-start;
                    }
                }
            `}</style>
        </div>
    );
};

export default JobDetails;