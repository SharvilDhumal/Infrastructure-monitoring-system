import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AlertCircle,
    Lightbulb,
    Droplets,
    Activity,
    ArrowRight
} from 'lucide-react';
import './LiveMonitoring.css';

const monitoringModules = [
    {
        id: 'pothole',
        title: 'Pothole Monitoring',
        description: 'Real-time detection and analysis of road surface defects using AI sensors.',
        icon: <AlertCircle size={32} className="module-icon" />,
        path: '/main-dashboard/live-monitoring/pothole',
        color: '#002147'
    },
    {
        id: 'streetlight',
        title: 'Streetlight Monitoring',
        description: 'Automated management and fault detection for smart city lighting systems.',
        icon: <Lightbulb size={32} className="module-icon" />,
        path: '/main-dashboard/live-monitoring/streetlight',
        color: '#002147'
    },
    {
        id: 'water-leakage',
        title: 'Water Leakage Monitoring',
        description: 'IoT-based leak detection, moisture sensing and real-time water flow analytics.',
        icon: <Droplets size={32} className="module-icon" />,
        path: '/main-dashboard/live-monitoring/water-leakage',
        color: '#002147'
    },
    {
        id: 'bridge',
        title: 'Bridge Monitoring',
        description: 'Structural health monitoring, vibration analysis and load tracking for critical bridges.',
        icon: <Activity size={32} className="module-icon" />,
        path: '/main-dashboard/live-monitoring/bridge',
        color: '#002147'
    }
];

const LiveMonitoring = () => {
    const navigate = useNavigate();

    return (
        <div className="live-monitoring-container">
            <div className="live-monitoring-header">
                <h1 className="page-title">Live Infrastructure Monitoring</h1>
                <p className="page-subtitle">Select a specialized module to view real-time data and system health.</p>
            </div>

            <div className="module-grid">
                {monitoringModules.map((module) => (
                    <div key={module.id} className="module-card">
                        <div className="module-card-icon-wrapper">
                            {module.icon}
                        </div>
                        <div className="module-card-content">
                            <h3 className="module-title">{module.title}</h3>
                            <p className="module-description">{module.description}</p>
                            <button
                                className="open-dashboard-btn"
                                onClick={() => window.open(module.path, '_blank')}
                            >
                                Open Dashboard <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LiveMonitoring;
