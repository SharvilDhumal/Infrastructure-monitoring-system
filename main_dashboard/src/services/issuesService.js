// Issues Service - Simulates backend API with localStorage persistence
import { issuesData as initialIssues } from '../data/issuesData'

const STORAGE_KEY = 'infravision_issues'
const API_DELAY = 300 // Simulate network delay

// Initialize storage with default issues if empty
const initializeStorage = () => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    const issuesWithStatus = initialIssues.map(issue => ({
      ...issue,
      status: 'unassigned', // unassigned, assigned, resolved
      assignedTeam: null,
      assignedNotes: null,
      assignedAt: null
    }))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(issuesWithStatus))
    return issuesWithStatus
  }
  return JSON.parse(stored)
}

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Fetch all issues from storage
export const fetchAllIssues = async () => {
  await delay(API_DELAY)
  try {
    return initializeStorage()
  } catch (error) {
    console.error('Error fetching issues:', error)
    return initializeStorage()
  }
}

// Update issue status in storage
export const updateIssueStatus = async (issueId, status, team = null, notes = null) => {
  await delay(API_DELAY)
  try {
    const issues = initializeStorage()
    const updatedIssues = issues.map(issue => {
      if (issue.id === issueId) {
        return {
          ...issue,
          status,
          assignedTeam: team,
          assignedNotes: notes,
          assignedAt: status === 'assigned' ? new Date().toISOString() : issue.assignedAt
        }
      }
      return issue
    })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedIssues))
    return updatedIssues.find(issue => issue.id === issueId)
  } catch (error) {
    console.error('Error updating issue status:', error)
    throw error
  }
}

// Get issues by status
export const getIssuesByStatus = async (status) => {
  const allIssues = await fetchAllIssues()
  return allIssues.filter(issue => issue.status === status)
}

// Get critical issues (unassigned, sorted by severity)
export const getCriticalIssues = async (limit = 4) => {
  const unassigned = await getIssuesByStatus('unassigned')
  const sorted = unassigned.sort((a, b) => {
    if (a.severity === 'critical' && b.severity !== 'critical') return -1
    if (a.severity !== 'critical' && b.severity === 'critical') return 1
    return 0
  })
  return sorted.slice(0, limit)
}

// Get assigned issues
export const getAssignedIssues = async () => {
  const assigned = await getIssuesByStatus('assigned')
  return assigned.map(issue => ({
    issue: {
      id: issue.id,
      type: issue.type,
      title: issue.title,
      severity: issue.severity,
      location: issue.location,
      exactLocation: issue.exactLocation,
      aiConfidence: issue.aiConfidence,
      detectionTime: issue.detectionTime,
      timestamp: issue.timestamp,
      lat: issue.lat,
      lng: issue.lng,
      image: issue.image,
      description: issue.description
    },
    team: issue.assignedTeam,
    notes: issue.assignedNotes,
    assignedAt: issue.assignedAt
  }))
}

// Assign team to issue
export const assignTeamToIssue = async (issueId, team, notes = '') => {
  return await updateIssueStatus(issueId, 'assigned', team, notes)
}






















