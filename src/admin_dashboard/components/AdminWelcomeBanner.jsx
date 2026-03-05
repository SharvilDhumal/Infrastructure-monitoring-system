import React from 'react';
import './AdminWelcomeBanner.css';

const AdminWelcomeBanner = ({ userName = "Admin Officer", alertCount = 0 }) => {
    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="admin-welcome-banner">
            <div className="banner-content">
                <div className="banner-text">
                    <h1 className="welcome-title">Welcome back, {userName}</h1>
                    <p className="welcome-subtitle">
                        System Operational Overview | {currentDate}
                    </p>
                </div>
                <div className="banner-stats-preview">
                    <div className="stat-mini">
                        <span className="stat-dot green"></span>
                        <span className="stat-label">System Healthy</span>
                    </div>
                    <div className="stat-mini">
                        <span className="stat-dot amber"></span>
                        <span className="stat-label">{alertCount} Pending Alerts</span>
                    </div>
                </div>
            </div>
            <div className="banner-decoration">
                <div className="decor-line"></div>
            </div>
        </div>
    );
};

export default AdminWelcomeBanner;
