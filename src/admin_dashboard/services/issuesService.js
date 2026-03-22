import axios from 'axios';
import API_BASE_URL_GLOBAL from '../../config/api';

const API_BASE_URL = API_BASE_URL_GLOBAL + '/api';

/**
 * Helper to convert timestamp into "5 min ago", "2 hours ago", etc.
 */
export const formatTimeAgo = (date) => {
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  return `${days} day${days > 1 ? 's' : ''} ago`;
};

/**
 * Normalize module names to a standard format
 */
export const normalizeModuleName = (moduleName) => {
  if (!moduleName) return 'Other';

  const normalized = moduleName.toLowerCase().trim();

  if (normalized.includes('streetlight') || normalized.includes('street light')) return 'Street Lights';
  if (normalized.includes('road') || normalized.includes('pothole')) return 'Roads';
  if (normalized.includes('bridge')) return 'Bridges';
  if (normalized.includes('water')) return 'Water';

  // Default: capitalize first letter of each word
  return moduleName.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

/**
 * Fetch and unify issues from all infrastructure endpoints
 */
export const fetchAllIssues = async () => {
  try {
    const [potholesRes, bridgesRes, waterRes, streetlightsRes] = await Promise.all([
      axios.get(`${API_BASE_URL}/potholes`),
      axios.get(`${API_BASE_URL}/bridges`),
      axios.get(`${API_BASE_URL}/waterleakage`),
      axios.get(`${API_BASE_URL}/streetlights`)
    ]);

    const potholes = (potholesRes.data.data || []).map(p => ({
      id: p._id || p.id,
      issueType: 'Pothole',
      module: 'Roads',
      title: 'Pothole Detected',
      location: p.location?.latitude ? `Lat: ${p.location.latitude.toFixed(4)}, Lng: ${p.location.longitude.toFixed(4)}` : (p.location || 'Road Sector Analysis'),
      exactLocation: p.location?.latitude ? `Lat: ${p.location.latitude.toFixed(4)}, Lng: ${p.location.longitude.toFixed(4)}` : (p.location || 'GPS Data Pending'),
      severity: p.severity || 'Medium',
      description: p.issue || 'Automated detection: Road surface damage identified.',
      reportedTime: formatTimeAgo(p.timestamp || p.time),
      confidence: p.confidence ? Math.round(p.confidence * 100) : 100,
      aiConfidence: p.confidence ? Math.round(p.confidence * 100) : 100,
      status: p.status?.toLowerCase() || 'unassigned',
      timestamp: p.timestamp || p.time,
      image: '🕳️'
    }));

    const bridges = (bridgesRes.data.data || []).map(b => ({
      id: b._id,
      issueType: 'Bridge',
      module: 'Bridges',
      title: `Bridge Issue (${b.bridgeId})`,
      location: b.bridgeId || 'Unknown Bridge',
      exactLocation: b.bridgeId || 'Unknown Bridge',
      severity: b.severity || 'Medium',
      description: b.issue || 'Structural integrity alert.',
      reportedTime: formatTimeAgo(b.timestamp),
      confidence: b.confidence ? Math.round(b.confidence * 100) : 90,
      aiConfidence: b.confidence ? Math.round(b.confidence * 100) : 90,
      status: b.status?.toLowerCase() || 'unassigned',
      timestamp: b.timestamp,
      image: '🌉'
    }));

    const water = (waterRes.data.data || []).map(w => ({
      id: w._id,
      issueType: 'Water Leak',
      module: 'Water',
      title: 'Water Line Leak',
      location: 'Main Supply Line',
      exactLocation: 'Main Supply Line',
      severity: w.leakSeverity || 'High',
      description: `Leak detected with ${w.groundMoisture || 0}% ground moisture. Auto-shutoff: ${w.autoShutoffTriggered ? 'Yes' : 'No'}`,
      reportedTime: formatTimeAgo(w.timestamp),
      confidence: 95,
      aiConfidence: 95,
      status: w.status?.toLowerCase() || 'unassigned',
      timestamp: w.timestamp,
      image: '💧'
    }));

    const streetlights = (streetlightsRes.data.data || [])
      .filter(s => s.status?.toUpperCase().includes('FAULT') || s.status?.toUpperCase() === 'RELAY OFF')
      .map(s => ({
        id: s._id,
        issueType: 'Streetlight',
        module: 'Street Lights',
        title: 'Streetlight Fault',
        location: s.streetlightId || 'Line Segment',
        exactLocation: s.streetlightId || 'Line Segment',
        severity: s.status?.toUpperCase().includes('OVERCURRENT') ? 'High' : 'Medium',
        description: `Streetlight ${s.streetlightId} reporting ${s.status}. Voltage: ${s.voltage}V, Current: ${s.current}A`,
        reportedTime: formatTimeAgo(s.timestamp),
        confidence: 100,
        aiConfidence: 100,
        status: s.status?.toLowerCase().includes('fault') ? 'detected' : 'unassigned',
        timestamp: s.timestamp,
        image: '💡'
      }));

    // Combine and sort by timestamp descending
    const allIssues = [...potholes, ...bridges, ...water, ...streetlights].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    return allIssues;
  } catch (error) {
    console.error('Error fetching real-time issues:', error);
    throw new Error('Failed to fetch real-time data from backend');
  }
};

/**
 * Filter only high severity issues (Critical/High)
 */
export const filterHighSeverityIssues = (issues) => {
  return issues.filter(issue =>
    issue.severity?.toLowerCase() === 'critical' ||
    issue.severity?.toLowerCase() === 'high'
  );
};

/**
 * Calculate severity counts for the Severity Ladder
 */
export const calculateSeverityCounts = (issues) => {
  return {
    critical: issues.filter(i => i.severity?.toLowerCase() === 'critical' || i.severity?.toLowerCase() === 'high').length,
    warning: issues.filter(i => i.severity?.toLowerCase() === 'medium' || i.severity?.toLowerCase() === 'warning').length,
    normal: issues.filter(i => i.severity?.toLowerCase() === 'low').length
  };
};

/**
 * Calculate workflow status counts for the Operations Panel
 */
export const calculateWorkflowStatus = (issues) => {
  return {
    detected: issues.length,
    unassigned: issues.filter(i => i.status?.toLowerCase() === 'unassigned' || i.status?.toLowerCase() === 'detected').length,
    assigned: issues.filter(i => i.status?.toLowerCase() === 'assigned').length,
    fixed: issues.filter(i => i.status?.toLowerCase() === 'fixed' || i.status?.toLowerCase() === 'resolved').length
  };
};

/**
 * Group issues by module for the Bar Chart
 */
export const groupIssuesByModule = (issues) => {
  const defaultModules = ['Roads', 'Bridges', 'Water', 'Street Lights'];

  // Get counts for all modules present in the issues
  const moduleCounts = issues.reduce((acc, issue) => {
    const normalized = normalizeModuleName(issue.module);
    acc[normalized] = (acc[normalized] || 0) + 1;
    return acc;
  }, {});

  // Ensure all default modules are included, even with 0 count
  defaultModules.forEach(name => {
    if (moduleCounts[name] === undefined) {
      moduleCounts[name] = 0;
    }
  });

  // Convert to array format for Recharts
  return Object.entries(moduleCounts).map(([name, count]) => ({
    name,
    value: count,
    color: 'var(--primary-navy, #001f3f)'
  })).sort((a, b) => {
    // Keep default order if possible
    const indexA = defaultModules.indexOf(a.name);
    const indexB = defaultModules.indexOf(b.name);
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return a.name.localeCompare(b.name);
  });
};

/**
 * Calculate severity breakdown for a specific module
 */
export const calculateSeverityBreakdownByModule = (issues, moduleName) => {
  const filtered = moduleName ? issues.filter(i => i.module === moduleName) : issues;
  const counts = {
    critical: filtered.filter(i => i.severity?.toLowerCase() === 'critical' || i.severity?.toLowerCase() === 'high').length,
    warning: filtered.filter(i => i.severity?.toLowerCase() === 'medium' || i.severity?.toLowerCase() === 'warning').length,
    normal: filtered.filter(i => i.severity?.toLowerCase() === 'low').length
  };

  const total = filtered.length || 1;
  return [
    { name: 'Critical', value: counts.critical, percentage: Math.round((counts.critical / total) * 100), color: 'var(--accent-red, #dc2626)' },
    { name: 'Warning', value: counts.warning, percentage: Math.round((counts.warning / total) * 100), color: 'var(--accent-amber, #f59e0b)' },
    { name: 'Normal', value: counts.normal, percentage: Math.round((counts.normal / total) * 100), color: 'var(--accent-green, #10b981)' }
  ];
};

/**
 * Get critical issues (HIGH severity only from the full dataset)
 */
export const getCriticalIssues = async (limit = 10) => {
  const allIssues = await fetchAllIssues();
  const highSeverity = filterHighSeverityIssues(allIssues);
  return highSeverity.slice(0, limit);
};

/**
 * Get assigned issues from real data
 */
export const getAssignedIssues = async () => {
  const allIssues = await fetchAllIssues();
  return allIssues.filter(i => i.status?.toLowerCase() === 'assigned');
};

/**
 * Assign team logic (placeholder for now)
 */
export const assignTeamToIssue = async (issueId, team, notes = '', issueType = 'potholes') => {
  try {
    const typeMap = {
      'Pothole': 'potholes',
      'Bridge': 'bridges',
      'Water Leak': 'waterleakage'
    };
    const mappedType = typeMap[issueType] || issueType;

    const response = await axios.patch(`${API_BASE_URL}/status/${mappedType}/${issueId}`, {
      status: 'assigned',
      assignedTeam: team,
      assignmentNotes: notes
    });
    return response.data;
  } catch (error) {
    console.error('Error assigning team:', error);
    throw error;
  }
};

/**
 * Fetch assigned and resolved issues references
 */
export const fetchActionStatuses = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/issues/actions`);
    return response.data;
  } catch (error) {
    console.error('Error fetching action statuses:', error);
    return { assigned_issues: [], resolved_issues: [] };
  }
};

/**
 * Assign an issue (Admin Action)
 */
export const assignIssueAction = async (issueId, assignedTo, sourceCollection) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/issues/assign/${issueId}`, {
      assignedTo,
      sourceCollection
    });
    return response.data;
  } catch (error) {
    console.error('Error in assignIssueAction:', error);
    throw error;
  }
};

/**
 * Resolve an issue (Admin Action)
 */
export const resolveIssueAction = async (issueId, resolvedBy) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/issues/resolve/${issueId}`, {
      resolvedBy
    });
    return response.data;
  } catch (error) {
    console.error('Error in resolveIssueAction:', error);
    throw error;
  }
};






















