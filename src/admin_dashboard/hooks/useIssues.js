import { useContext, useMemo } from 'react'
import { IssuesContext } from '../context/IssuesContext'

export const useIssues = () => {
  const context = useContext(IssuesContext)

  if (!context) {
    throw new Error('useIssues must be used within an IssuesProvider')
  }

  const { allIssues, loading, error, refreshIssues, assignIssue, resolveIssue, reopenIssue } = context

  const criticalIssues = useMemo(() =>
    allIssues.filter(i =>
      (i.severity?.toLowerCase() === 'critical' || i.severity?.toLowerCase() === 'high') &&
      i.status === 'active'
    ).slice(0, 10),
    [allIssues])

  const assignedIssues = useMemo(() =>
    allIssues.filter(i => i.subStatus?.toLowerCase() === 'assigned'),
    [allIssues])

  const severityCounts = useMemo(() => {
    const active = allIssues.filter(i => i.status === 'active');
    return {
      critical: active.filter(i => i.severity?.toLowerCase() === 'critical' || i.severity?.toLowerCase() === 'high').length,
      warning: active.filter(i => i.severity?.toLowerCase() === 'medium' || i.severity?.toLowerCase() === 'warning').length,
      normal: active.filter(i => i.severity?.toLowerCase() === 'low').length
    }
  }, [allIssues])

  const workflowStats = useMemo(() => {
    return {
      detected: allIssues.length,
      unassigned: allIssues.filter(i => !i.isAssigned && !i.isResolved).length,
      assigned: allIssues.filter(i => i.isAssigned).length,
      fixed: allIssues.filter(i => i.isResolved).length
    }
  }, [allIssues])

  return {
    allIssues,
    criticalIssues,
    assignedIssues,
    severityCounts,
    workflowStats,
    loading,
    error,
    refreshIssues,
    assignIssue,
    resolveIssue,
    reopenIssue
  }
}






















