import { useState, useEffect, useCallback } from 'react'
import { 
  fetchAllIssues, 
  getCriticalIssues, 
  getAssignedIssues, 
  assignTeamToIssue 
} from '../services/issuesService'

export const useIssues = () => {
  const [criticalIssues, setCriticalIssues] = useState([])
  const [assignedIssues, setAssignedIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadIssues = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch both critical and assigned issues in parallel
      const [critical, assigned] = await Promise.all([
        getCriticalIssues(4),
        getAssignedIssues()
      ])
      
      setCriticalIssues(critical)
      setAssignedIssues(assigned)
    } catch (err) {
      console.error('Error loading issues:', err)
      setError(err.message || 'Failed to load issues')
    } finally {
      setLoading(false)
    }
  }, [])

  const handleAssignTeam = useCallback(async (issueId, team, notes) => {
    try {
      setError(null)
      // Update in backend/storage
      await assignTeamToIssue(issueId, team, notes)
      // Reload issues to reflect changes
      await loadIssues()
    } catch (err) {
      console.error('Error assigning team:', err)
      setError(err.message || 'Failed to assign team')
      throw err
    }
  }, [loadIssues])

  useEffect(() => {
    loadIssues()
  }, [loadIssues])

  return {
    criticalIssues,
    assignedIssues,
    loading,
    error,
    refreshIssues: loadIssues,
    assignTeam: handleAssignTeam
  }
}






















