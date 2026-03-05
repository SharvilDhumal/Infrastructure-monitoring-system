import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { fetchAllIssues, assignTeamToIssue, fetchActionStatuses, assignIssueAction, resolveIssueAction } from '../services/issuesService';

export const IssuesContext = createContext();

export const IssuesProvider = ({ children }) => {
    const [allIssues, setAllIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadIssues = useCallback(async (isSilent = false) => {
        try {
            if (!isSilent) setLoading(true);
            setError(null);
            const fetched = await fetchAllIssues();
            // Unify status: ensure we use 'active' or 'resolved' at the top level
            const unified = fetched.map(issue => ({
                ...issue,
                status: (issue.status === 'fixed' || issue.status === 'resolved' || issue.status === 'completed') ? 'resolved' : 'active',
                subStatus: issue.status || 'detected'
            }));
            setAllIssues(unified);
        } catch (err) {
            console.error('Error loading issues:', err);
            if (!isSilent) setError(err.message || 'Failed to load issues');
        } finally {
            if (!isSilent) setLoading(false);
        }
    }, []);

    const [actionStatus, setActionStatus] = useState({ assigned: [], resolved: [] });

    const loadActionData = useCallback(async () => {
        try {
            const data = await fetchActionStatuses();
            setActionStatus({
                assigned: data.assigned_issues || [],
                resolved: data.resolved_issues || []
            });
        } catch (err) {
            console.error('Error loading action data:', err);
        }
    }, []);

    useEffect(() => {
        loadIssues();
        loadActionData();
        const interval = setInterval(() => {
            loadIssues(true);
            loadActionData();
        }, 15000);
        return () => clearInterval(interval);
    }, [loadIssues, loadActionData]);

    const enrichedIssues = useMemo(() => {
        return allIssues.map(issue => {
            const assigned = actionStatus.assigned.find(a => a.issueId === issue.id);
            const resolved = actionStatus.resolved.find(r => r.issueId === issue.id);

            let status = issue.status;
            let subStatus = issue.subStatus;

            if (resolved) {
                status = 'resolved';
                subStatus = 'completed';
            } else if (assigned) {
                status = 'active';
                subStatus = 'assigned';
            }

            return {
                ...issue,
                status,
                subStatus,
                actionData: assigned || resolved || null,
                isAssigned: !!assigned,
                isResolved: !!resolved
            };
        });
    }, [allIssues, actionStatus]);

    const assignIssue = useCallback(async (issueId, team, notes) => {
        try {
            const issue = enrichedIssues.find(i => i.id === issueId);
            if (!issue) return;

            // Map frontend module to backend collection if possible
            const collectionMap = {
                'Roads': 'potholes',
                'Bridges': 'bridge',
                'Water': 'waterleakage',
                'Street Lights': 'streetlights'
            };
            const sourceCollection = collectionMap[issue.module] || 'issues';

            await assignIssueAction(issueId, team, sourceCollection);
            await loadActionData();
            await loadIssues(true);
        } catch (err) {
            console.error('Failed to assign issue:', err);
            throw err;
        }
    }, [enrichedIssues, loadIssues, loadActionData]);

    const resolveIssue = useCallback(async (issueId, resolver) => {
        try {
            await resolveIssueAction(issueId, resolver);
            await loadActionData();
            await loadIssues(true);
        } catch (err) {
            console.error('Failed to resolve issue:', err);
            throw err;
        }
    }, [loadIssues, loadActionData]);

    const reopenIssue = useCallback((issueId) => {
        setAllIssues(prev => prev.map(i =>
            i.id === issueId ? {
                ...i,
                status: 'active',
                subStatus: 'detected',
                resolvedAt: null
            } : i
        ));
    }, []);

    const value = useMemo(() => ({
        allIssues: enrichedIssues,
        loading,
        error,
        refreshIssues: loadIssues,
        assignIssue,
        resolveIssue,
        reopenIssue,
        assignedCount: actionStatus.assigned.length,
        resolvedCount: actionStatus.resolved.length
    }), [enrichedIssues, loading, error, loadIssues, assignIssue, resolveIssue, reopenIssue, actionStatus]);

    return (
        <IssuesContext.Provider value={value}>
            {children}
        </IssuesContext.Provider>
    );
};
