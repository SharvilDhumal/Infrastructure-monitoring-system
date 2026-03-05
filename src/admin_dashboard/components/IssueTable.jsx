import React from 'react';
import './IssueTable.css';
import viewIcon from '../../assets/view.png';
import resolveIcon from '../../assets/resolve.png';
import assignIcon from '../../assets/Assign.png';

const IssueTable = ({
    issues,
    onAssign,
    onResolve,
    onViewDetails
}) => {
    if (!issues || issues.length === 0) {
        return <p className="no-issues">No issues found.</p>;
    }

    const getSeverityStyle = (sev) => {
        const s = sev?.toLowerCase();
        if (s === 'critical' || s === 'high') return { bg: 'var(--accent-red)', color: '#fff' };
        if (s === 'medium' || s === 'warning') return { bg: 'var(--accent-amber)', color: '#fff' };
        if (s === 'low') return { bg: 'var(--accent-green)', color: '#fff' };
        return { bg: '#64748b', color: '#fff' };
    };

    const getStatusLabel = (stat, sub) => {
        if (stat === 'resolved') return 'Resolved';
        if (sub === 'assigned') return 'Assigned';
        if (sub === 'in-progress') return 'In Progress';
        return 'Detected';
    };

    return (
        <div className="issue-table-wrapper">
            <table className="issue-table">
                <thead>
                    <tr>
                        <th>Issue Type</th>
                        <th>Severity</th>
                        <th>Reported Time</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {issues.map((issue) => {
                        const sevStyle = getSeverityStyle(issue.severity);
                        const statusLabel = getStatusLabel(issue.status, issue.subStatus);

                        return (
                            <tr key={issue.id}>
                                <td className="col-type">
                                    <div className="type-container">
                                        <span className="type-icon">{issue.image || '📋'}</span>
                                        <div className="type-info">
                                            <div className="type-title">{issue.title}</div>
                                            <div className="type-loc">📍 {issue.location}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="col-severity">
                                    <span
                                        className="table-badge"
                                        style={{ backgroundColor: sevStyle.bg, color: sevStyle.color }}
                                    >
                                        {issue.severity}
                                    </span>
                                </td>
                                <td className="col-time">{issue.reportedTime}</td>
                                <td className="col-status">
                                    <span className={`status-text ${issue.status}`}>
                                        {statusLabel}
                                    </span>
                                </td>
                                <td className="col-actions">
                                    <div className="action-buttons-inline">
                                        <button
                                            className="btn-circle details"
                                            onClick={() => onViewDetails(issue)}
                                            title="View Details"
                                        >
                                            <img src={viewIcon} alt="View" className="icon-img" />
                                        </button>

                                        {!issue.isAssigned && !issue.isResolved && (
                                            <button
                                                className="btn-circle assign"
                                                onClick={() => onAssign(issue)}
                                                title="Assign Team"
                                            >
                                                <img src={assignIcon} alt="Assign" className="icon-img" />
                                            </button>
                                        )}

                                        {issue.isAssigned && !issue.isResolved && (
                                            <button
                                                className="btn-circle resolve"
                                                onClick={() => onResolve(issue)}
                                                title="Resolve Issue"
                                            >
                                                <img src={resolveIcon} alt="Resolve" className="icon-img" />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default IssueTable;
