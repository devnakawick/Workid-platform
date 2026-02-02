import React from 'react';
import '../global-worker-styles.css';

const JobFilters = ({ onCategoryChange, maxDistance, onDistanceChange }) => {
    return (
        <div className="job-filters-panel">
            <h4 className="filters-header">Filter Jobs</h4>

            <div className="filter-group">
                <label className="filter-label">Distance: {maxDistance}km</label>
                <div className="range-wrapper">
                    <input
                        type="range"
                        min="1"
                        max="50"
                        value={maxDistance}
                        onChange={(e) => onDistanceChange && onDistanceChange(Number(e.target.value))}
                        className="range-input"
                    />
                    <div className="range-labels">
                        <span>1km</span>
                        <span>50km</span>
                    </div>
                </div>
            </div>

            <div className="filter-group">
                <label className="filter-label">Category</label>
                <select
                    className="input-select"
                    onChange={(e) => onCategoryChange && onCategoryChange(e.target.value)}
                >
                    <option>All Categories</option>
                    <option>Construction</option>
                    <option>Cleaning</option>
                    <option>Gardening</option>
                    <option>Electrician</option>
                    <option>Plumbing</option>
                </select>
            </div>

            <style jsx>{`
                .job-filters-panel {
                    /* Panel styles handled by parent grid usually, but local internal spacing here */
                }
                .filters-header {
                    font-size: 1.1rem;
                    margin-bottom: 24px;
                    padding-bottom: 12px;
                    border-bottom: 1px solid var(--border-color);
                }
                .filter-group {
                    margin-bottom: 28px;
                }
                .filter-label {
                    display: block;
                    font-size: 0.85rem;
                    font-weight: 700;
                    color: var(--slate-900);
                    margin-bottom: 10px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .range-input {
                    width: 100%;
                    cursor: pointer;
                }
                .range-labels {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.8rem;
                    color: var(--slate-400);
                    margin-top: 8px;
                }
                .input-select {
                    width: 100%;
                    padding: 12px;
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-md);
                    background: var(--white);
                    color: var(--slate-900);
                    font-size: 0.95rem;
                    outline: none;
                    transition: border 0.2s;
                }
                .input-select:focus {
                    border-color: var(--primary-blue);
                }
            `}</style>
        </div>
    );
};

export default JobFilters;