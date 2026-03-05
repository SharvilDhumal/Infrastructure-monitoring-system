import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserIssues.css';

const UserIssues = () => {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = 'http://localhost:5001/api/issues';
    const token = sessionStorage.getItem('token');

    const fetchIssues = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Attempting to fetch issues from:', API_URL);
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const response = await axios.get(API_URL, { headers });

            // Backend returns { success: true, issues: [...] }
            const issuesData = response.data.issues || response.data;
            console.log('Issues fetched successfully:', issuesData.length, 'issues found');
            setIssues(issuesData);
            setLoading(false);
        } catch (err) {
            console.error('Detailed error fetching issues:', err);
            const errorMessage = err.response
                ? `Backend Error (${err.response.status}): ${JSON.stringify(err.response.data)}`
                : `Network Error: ${err.message}. Backend might be down or unreachable at ${API_URL}`;
            setError(errorMessage);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIssues();
    }, []);

    const handleStatusUpdate = async (id, status) => {
        try {
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            await axios.put(`${API_URL}/${id}/status`, { status }, { headers });
            // Update local state
            setIssues(issues.map(issue =>
                issue._id === id ? { ...issue, status } : issue
            ));
        } catch (err) {
            console.error('Error updating status:', err);
            alert('Failed to update status');
        }
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="loading-spinner">
                    <div style={{ fontSize: '40px' }}>📋</div>
                </div>
                <p>Loading infrastructure reports...</p>
            </div>
        );
    }
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="user-issues-page">
            <header className="page-header">
                <h2>User Reported Issues</h2>
                <p>Manage and moderate infrastructure reports from the community</p>
            </header>

            <div className="issues-table-container">
                <table className="issues-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Issue Details</th>
                            <th>Location</th>
                            <th>Visual Proof</th>
                            <th>Status</th>
                            <th>Date Reported</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {issues.map((issue, index) => (
                            <tr key={issue._id} style={{ animationDelay: `${index * 0.05}s` }}>
                                <td>
                                    <div className="user-info">
                                        <span className="user-name">{issue.user?.name || 'Anonymous User'}</span>
                                        <span className="user-email">{issue.user?.email || 'No email provided'}</span>
                                    </div>
                                </td>
                                <td>
                                    <span className="issue-title">{issue.title}</span>
                                </td>
                                <td>
                                    <div className="issue-location">
                                        <span>📍</span>
                                        {issue.location}
                                    </div>
                                </td>
                                <td>
                                    <a href={issue.imageUrl} target="_blank" rel="noopener noreferrer">
                                        <img src={issue.imageUrl} alt="Visual Proof" className="issue-img-preview" />
                                    </a>
                                </td>
                                <td>
                                    <span className={`status-badge ${(issue.status || 'Pending').toLowerCase()}`}>
                                        {(issue.status === 'Pending' || !issue.status) && '⏳ '}
                                        {issue.status === 'Approved' && '✅ '}
                                        {issue.status === 'In Progress' && '🚧 '}
                                        {issue.status === 'Resolved' && '🎉 '}
                                        {issue.status === 'Rejected' && '❌ '}
                                        {issue.status}
                                    </span>
                                </td>
                                <td>
                                    <span className="date-text">
                                        {new Date(issue.createdAt).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        {issue.status === 'Pending' && (
                                            <>
                                                <button
                                                    className="btn-approve"
                                                    onClick={() => handleStatusUpdate(issue._id, 'Approved')}
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    className="btn-reject"
                                                    onClick={() => handleStatusUpdate(issue._id, 'Rejected')}
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                        {issue.status === 'Approved' && (
                                            <button
                                                className="btn-approve"
                                                style={{ backgroundColor: '#0ea5e9', borderColor: '#0ea5e9' }}
                                                onClick={() => handleStatusUpdate(issue._id, 'In Progress')}
                                            >
                                                Start Work
                                            </button>
                                        )}
                                        {issue.status === 'In Progress' && (
                                            <button
                                                className="btn-approve"
                                                style={{ backgroundColor: '#10b981', borderColor: '#10b981' }}
                                                onClick={() => handleStatusUpdate(issue._id, 'Resolved')}
                                            >
                                                Finish Work
                                            </button>
                                        )}
                                        {(issue.status === 'Resolved' || issue.status === 'Rejected') && (
                                            <div className="action-done">
                                                <span>{issue.status}</span>
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserIssues;
