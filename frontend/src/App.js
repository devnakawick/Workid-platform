import React, { useState } from 'react';
import './global-worker-styles.css';
import heroBg from './assets/hero-bg.png';

// Core Layout Components
import NavBar from './components/NavBar';
import Footer from './components/Footer';

// Section Components
import JobCard from './Jobs/JobCard';
import JobSearch from './Jobs/JobSearch';
import JobFilters from './Jobs/JobFilters';
import JobDetails from './Jobs/JobDetails';
import VerificationStatus from './Worker_Identity/VerificationStatus';
import SkillsList from './Worker_Identity/SkillsList';
import CourseCard from './Learning_Section/CourseCard';
import AccountSettings from './Settings_Section/AccountSettings';
import PrivacySettings from './Settings_Section/PrivacySettings';
import NotificationSettings from './Settings_Section/NotificationSettings';

const JOBS_DATA = [
    {
        id: 1,
        title: 'Electrician',
        location: 'Colombo',
        wage: '4,500',
        distance: '1.2',
        category: 'Electrician',
        description: 'Looking for a certified electrician to handle residential wiring for a newly built 2-story house. Tasks include installing circuit breakers, wiring outlets, and setting up lighting fixtures. Standard safety gear required.',
        requirements: ['Circuit breaker installation', 'Wiring certification', 'Own tools required', 'Safety gear'],
        postedTime: '2 hours ago',
        tags: ['Urgent', 'Residential']
    },
    {
        id: 2,
        title: 'Carpenter',
        location: 'Mount Lavinia',
        wage: '3,800',
        distance: '3.5',
        category: 'Construction',
        description: 'Need a skilled carpenter for custom furniture making (kitchen cabinets and wardrobes). Must be experienced with teak and mahogany wood types. Previous workshop experience is a plus.',
        requirements: ['Furniture design', 'Wood carving', 'Finishing & Polishing', '3+ years experience'],
        postedTime: '5 hours ago',
        tags: ['Workshop', 'Furniture']
    },
    {
        id: 3,
        title: 'Plumber',
        location: 'Dehiwala',
        wage: '4,000',
        distance: '2.0',
        category: 'Plumbing',
        description: 'Urgent requirement for a plumber to fix a main line leakage in an apartment complex. Must be able to diagnose pressure issues and replace PVC piping efficiently.',
        requirements: ['Leak detection', 'Pipe replacement', 'Emergency repair', 'Own transport'],
        postedTime: '1 day ago',
        tags: ['Emergency', 'Maintenance']
    },
    {
        id: 4,
        title: 'Mason',
        location: 'Rajagiriya',
        wage: '4,200',
        distance: '5.1',
        category: 'Construction',
        description: 'Experienced mason needed for wall plastering and floor tiling work. Project duration is approximately 2 weeks. Daily payment available.',
        requirements: ['Plastering', 'Tiling', 'Cement mixing', 'Hardworking'],
        postedTime: '3 hours ago',
        tags: ['Construction', 'Long-term']
    },
    {
        id: 5,
        title: 'Garden Helper',
        location: 'Nugegoda',
        wage: '2,500',
        distance: '1.8',
        category: 'Gardening',
        description: 'Looking for a helper to clean and maintain a home garden. Tasks involve weeding, grass cutting, and watering plants. Equipment will be provided.',
        requirements: ['Weeding', 'Grass cutting', 'Punctual', 'Nature lover'],
        postedTime: 'Just now',
        tags: ['Part-time', 'Easy Apply']
    },
    {
        id: 6,
        title: 'House Cleaner',
        location: 'Wellawatte',
        wage: '3,000',
        distance: '0.5',
        category: 'Cleaning',
        description: 'Deep cleaning service required for a 3-bedroom apartment. Includes floor mopping, window cleaning, and dusting. Lunch provided.',
        requirements: ['Deep cleaning', 'Trustworthy', 'Window cleaning', 'Attention to detail'],
        postedTime: '4 hours ago',
        tags: ['Cleaning', 'One-off']
    },
];

function App() {
    const [activeTab, setActiveTab] = useState('home');
    const [selectedJob, setSelectedJob] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All Categories');
    const [maxDistance, setMaxDistance] = useState(50);

    const handleViewDetails = (job) => {
        setSelectedJob(job);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBackToJobs = () => {
        setSelectedJob(null);
    };

    const handleApply = () => {
        alert("Application submitted successfully! The client will contact you shortly.");
        setSelectedJob(null);
    };

    const handleEnroll = () => {
        alert("Enrolled in course successfully!");
    };

    const filteredJobs = JOBS_DATA.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === 'All Categories' || job.category === activeCategory;
        const matchesDistance = parseFloat(job.distance) <= maxDistance;
        return matchesSearch && matchesCategory && matchesDistance;
    });

    return (
        <div className="app-container">

            {/* Unified Navigation (Desktop Top Bar / Mobile Header & Pill) */}
            <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />

            <main className="main-content">
                {activeTab === 'home' && (
                    <div className="animate-fade">
                        <section className="hero-section">
                            {/* Animated Background */}
                            <div className="hero-bg-anim" style={{ backgroundImage: `url(${heroBg})` }}></div>

                            <div className="hero-overlay"></div>

                            <div className="hero-content">
                                <h1 className="hero-title animate-up delay-100">FIND YOUR NEXT<br />BIG OPPORTUNITY</h1>
                                <p className="subtitle animate-up delay-200">Connect with top clients and build your career.</p>
                                <button className="btn-hero animate-up delay-300" onClick={() => setActiveTab('jobs')}>
                                    Browse Jobs
                                </button>
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === 'jobs' && (
                    <div className="animate-fade">
                        <div className="jobs-layout-container">
                            <aside className="jobs-sidebar">
                                <JobFilters
                                    onCategoryChange={setActiveCategory}
                                    maxDistance={maxDistance}
                                    onDistanceChange={setMaxDistance}
                                />
                            </aside>

                            <div className="jobs-main-feed">
                                {selectedJob ? (
                                    <JobDetails
                                        job={selectedJob}
                                        onBack={handleBackToJobs}
                                        onApply={handleApply}
                                    />
                                ) : (
                                    <>
                                        <JobSearch onSearch={setSearchTerm} />
                                        <div className="cards-grid">
                                            {filteredJobs.length > 0 ? (
                                                filteredJobs.map(job => (
                                                    <JobCard
                                                        key={job.id}
                                                        job={job}
                                                        onViewDetails={handleViewDetails}
                                                    />
                                                ))
                                            ) : (
                                                <div className="no-results">
                                                    <p>No jobs found matching your criteria.</p>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'identity' && (
                    <div className="animate-fade">
                        <section className="section-header">
                            <h1 className="text-gradient">My Identity</h1>
                            <p className="subtitle">Manage your verified profile</p>
                        </section>
                        <div className="identity-grid">
                            <VerificationStatus />
                            <SkillsList />
                        </div>
                    </div>
                )}

                {activeTab === 'learning' && (
                    <div className="animate-fade">
                        <section className="section-header">
                            <h1 className="text-gradient">Skill Up</h1>
                            <p className="subtitle">Enhance your career with courses</p>
                        </section>
                        <div className="learning-grid">
                            <CourseCard course={{ title: 'Safety 101', duration: '2h', level: 'Beginner' }} onEnroll={handleEnroll} />
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="animate-fade">
                        <section className="section-header">
                            <h1 className="text-gradient">Settings</h1>
                            <p className="subtitle">Manage your account preferences</p>
                        </section>
                        <div className="settings-grid">
                            <AccountSettings />
                            <NotificationSettings />
                            <PrivacySettings />
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}

export default App;