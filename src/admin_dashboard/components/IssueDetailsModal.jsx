import React, { useEffect } from 'react';
import './IssueDetailsModal.css';

const IssueDetailsModal = ({ issue, onClose }) => {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    if (!issue) return null;

    const getSeverityStyle = (severity) => {
        switch (severity?.toLowerCase()) {
            case 'critical':
            case 'high':
                return { color: 'var(--accent-red, #dc2626)', bg: 'rgba(220, 38, 38, 0.1)' };
            case 'warning':
            case 'medium':
                return { color: 'var(--accent-amber, #f59e0b)', bg: 'rgba(245, 158, 11, 0.1)' };
            default:
                return { color: 'var(--accent-green, #10b981)', bg: 'rgba(16, 185, 129, 0.1)' };
        }
    };

    const severityStyle = getSeverityStyle(issue.severity);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Issue Analysis Details</h2>
                    <button className="modal-close" onClick={onClose} aria-label="Close">
                        ×
                    </button>
                </div>

                <div className="modal-body">
                    <div className="modal-section-main">
                        <div className="issue-hero" style={{ backgroundColor: severityStyle.bg }}>
                            <span className="hero-icon">{issue.image || '⚠️'}</span>
                            <div className="hero-text">
                                <h3>{issue.title}</h3>
                                <span className="hero-module">{issue.module}</span>
                            </div>
                        </div>

                        <div className="details-grid">
                            <DetailItem label="Severity" value={issue.severity} valueStyle={{ color: severityStyle.color, fontWeight: 'bold' }} />
                            <DetailItem label="Status" value={issue.status} />
                            <DetailItem label="Location" value={issue.location} />
                            <DetailItem label="Reported" value={issue.reportedTime} />
                            <DetailItem label="Confidence" value={`${issue.confidence}%`} />
                            <DetailItem label="Assigned Team" value={issue.assignedTeam || 'Not Assigned'} />
                        </div>

                        <div className="description-section">
                            <h4>Description</h4>
                            <p>{issue.description || 'No additional description provided.'}</p>
                        </div>

                        <div className="location-section">
                            <h4>Exact Location Coordinates</h4>
                            <code>{issue.exactLocation}</code>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn-close-footer" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

const DetailItem = ({ label, value, valueStyle }) => (
    <div className="detail-item">
        <span className="detail-label">{label}</span>
        <span className="detail-value" style={valueStyle}>{value}</span>
    </div>
);

export default IssueDetailsModal;
