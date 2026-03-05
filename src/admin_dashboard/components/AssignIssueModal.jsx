import React, { useState, useEffect } from 'react';
import './AssignIssueModal.css';

const teams = [
    'Road Maintenance Team Alpha',
    'Road Maintenance Team Beta',
    'Street Light Crew A',
    'Street Light Crew B',
    'Water Infrastructure Unit 1',
    'Water Infrastructure Unit 2',
    'Bridge Inspection Team',
    'Emergency Response Unit'
];

const AssignIssueModal = ({ isOpen, issue, onClose, onConfirm }) => {
    const [selectedTeam, setSelectedTeam] = useState('');

    const now = new Date();
    const currentDate = now.toLocaleDateString();
    const currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    useEffect(() => {
        if (isOpen) {
            setSelectedTeam('');
        }
    }, [isOpen]);

    if (!isOpen || !issue) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container assignment-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="header-left">
                        <span className="check-icon">✔️</span>
                        <h2 className="modal-title">Assign Issue</h2>
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
                            <label className="form-label">Select Team / Person</label>
                            <select
                                className="form-select"
                                value={selectedTeam}
                                onChange={(e) => setSelectedTeam(e.target.value)}
                            >
                                <option value="">Choose a team...</option>
                                {teams.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Assigned By</label>
                                <input className="form-input read-only" value="Admin User" readOnly />
                            </div>
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
                        disabled={!selectedTeam}
                        onClick={() => onConfirm(issue.id, selectedTeam)}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AssignIssueModal;
