import React, { useState, useEffect } from 'react';
import './AssignIssueModal.css'; // Reuse common styles

const ResolveIssueModal = ({ isOpen, issue, onClose, onConfirm }) => {
    const [resolverName, setResolverName] = useState('Admin User');

    const now = new Date();
    const currentDate = now.toLocaleDateString();
    const currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (!isOpen || !issue) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container assignment-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="header-left">
                        <span className="check-icon" style={{ backgroundColor: '#10b981' }}>✔️</span>
                        <h2 className="modal-title">Resolve Issue</h2>
                    </div>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">
                    {/* Issue Preview Card */}
                    <div className="issue-preview-card">
                        <span className="preview-icon">{issue.image || '📋'}</span>
                        <div className="preview-info">
                            <h4 className="preview-title">{issue.title}</h4>
                            <span className="preview-location">📍 {issue.location}</span>
                        </div>
                        <span className="preview-severity" data-severity={issue.severity?.toLowerCase()}>
                            {issue.severity}
                        </span>
                    </div>

                    <div className="assignment-form">
                        <div className="form-group">
                            <label className="form-label">Resolver Name</label>
                            <input
                                className="form-input"
                                value={resolverName}
                                onChange={(e) => setResolverName(e.target.value)}
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Date</label>
                                <input className="form-input read-only" value={currentDate} readOnly />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Time</label>
                                <input className="form-input read-only" value={currentTime} readOnly />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn-modal secondary" onClick={onClose}>Cancel</button>
                    <button
                        className="btn-modal primary"
                        style={{ backgroundColor: '#10b981' }}
                        onClick={() => onConfirm(issue.id, resolverName)}
                    >
                        Confirm Resolution
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResolveIssueModal;
