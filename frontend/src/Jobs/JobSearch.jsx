import React from 'react';
import '../global-worker-styles.css';

const JobSearch = ({ onSearch }) => {
    return (
        <div className="job-search-container">
            <input
                type="text"
                className="search-input-lg"
                placeholder="Search for jobs (e.g. Plumber, Mason)..."
                onChange={(e) => onSearch && onSearch(e.target.value)}
            />

            <style jsx>{`
                .job-search-container {
                    margin-bottom: 24px;
                }
                .search-input-lg {
                    width: 100%;
                    padding: 16px 20px;
                    font-size: 1rem;
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-md);
                    box-shadow: var(--shadow-sm);
                    transition: all 0.2s;
                    outline: none;
                }
                .search-input-lg:focus {
                    border-color: var(--primary-blue);
                    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
                }
                .search-input-lg::placeholder {
                    color: var(--slate-400);
                }
            `}</style>
        </div>
    );
};

export default JobSearch;