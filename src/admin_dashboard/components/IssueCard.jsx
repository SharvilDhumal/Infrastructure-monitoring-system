import React from 'react';
import './IssueCard.css';
import viewIcon from '../../assets/view.png';
import resolveIcon from '../../assets/resolve.png';
import assignIcon from '../../assets/Assign.png';

const IssueCard = ({
    issue,
    onAssign,
    onResolve,
    onViewDetails
}) => {
    const {
        id,
        title,
        location,
        severity,
        status,
        subStatus,
        description,
        assignedTo,
        reportedTime,
        resolvedAt,
        image,
        issueType
    } = issue;

    const getSeverityStyle = (sev) => {
        const s = sev?.toLowerCase();
        if (s === 'critical' || s === 'high') return { bg: 'var(--accent-red)', color: '#fff' };
        if (s === 'medium' || s === 'warning') return { bg: 'var(--accent-amber)', color: '#fff' };
        if (s === 'low') return { bg: 'var(--accent-green)', color: '#fff' };
        return { bg: '#64748b', color: '#fff' };
    };

    const getStatusStyle = (stat, sub) => {
        if (stat === 'resolved') return { bg: '#f1f5f9', color: '#475569', label: 'Resolved' };
        if (sub === 'assigned') return { bg: 'var(--sidebar-bg)', color: '#fff', label: 'Assigned' };
        if (sub === 'in-progress') return { bg: 'var(--sidebar-bg)', color: '#fff', label: 'In Progress' };
        return { bg: 'var(--accent-red)', color: '#fff', label: 'Detected' };
    };

    const sevStyle = getSeverityStyle(severity);
    const statStyle = getStatusStyle(status, subStatus);

    return (
        <div className={`issue-card ${status === 'resolved' ? 'resolved' : ''}`}>
            <div className="issue-card-header">
                <div className="issue-info-top">
                    <span className="issue-icon">{image || '📋'}</span>
                    <div className="issue-title-group">
                        <h3 className="issue-title">{title}</h3>
                        <span className="issue-location">📍 {location}</span>
                    </div>
                </div>
                <div className="issue-badges">
                    <span className="badge severity-badge" style={{ backgroundColor: sevStyle.bg, color: sevStyle.color }}>
                        {severity}
                    </span>
                    <span className="badge status-badge" style={{ backgroundColor: statStyle.bg, color: statStyle.color }}>
                        {statStyle.label}
                    </span>
                </div>
            </div>

            <div className="issue-card-body">
                <p className="issue-description">{description}</p>
                <div className="issue-meta-grid">
                    <div className="meta-item">
                        <span className="meta-label">Reported:</span>
                        <span className="meta-value">{reportedTime}</span>
                    </div>
                    {assignedTo && (
                        <div className="meta-item">
                            <span className="meta-label">Assigned To:</span>
                            <span className="meta-value">{assignedTo}</span>
                        </div>
                    )}
                    {status === 'resolved' && resolvedAt && (
                        <div className="meta-item">
                            <span className="meta-label">Resolved At:</span>
                            <span className="meta-value">{new Date(resolvedAt).toLocaleString()}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="issue-card-footer">
                <button
                    className="btn-action details"
                    onClick={() => onViewDetails(issue)}
                    title="View Details"
                >
                    <img src={viewIcon} alt="View" className="icon-img" />
                    <span>View</span>
                </button>

                {status !== 'resolved' && (
                    subStatus !== 'assigned' ? (
                        <button
                            className="btn-action assign"
                            onClick={() => onAssign(issue)}
                            title="Assign Team"
                        >
                            <img src={assignIcon} alt="Assign" className="icon-img" />
                            <span>Assign</span>
                        </button>
                    ) : (
                        <button
                            className="btn-action resolve"
                            onClick={() => onResolve(issue)}
                            title="Resolve Issue"
                        >
                            <img src={resolveIcon} alt="Resolve" className="icon-img" />
                            <span>Resolve</span>
                        </button>
                    )
                )}
            </div>
        </div>
    );
};

export default IssueCard;
