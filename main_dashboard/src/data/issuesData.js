// Shared issues data - synchronized across map and critical issues list
export const issuesData = [
  {
    id: 2,
    type: 'Street Light Malfunction',
    title: 'Street Light Malfunction',
    severity: 'warning',
    location: 'Delhi, NCR',
    exactLocation: 'Park Boulevard',
    aiConfidence: 87,
    detectionTime: '12 min ago',
    timestamp: '12 min ago',
    lat: 28.6139,
    lng: 77.2090,
    image: '💡',
    description: 'Street light #1247 not responding'
  },
  {
    id: 3,
    type: 'Water Leak',
    title: 'Water Leak Detected',
    severity: 'critical',
    location: 'Bangalore, Karnataka',
    exactLocation: 'River Road',
    aiConfidence: 91,
    detectionTime: '18 min ago',
    timestamp: '18 min ago',
    lat: 12.9716,
    lng: 77.5946,
    image: '💧',
    description: 'Potential water main leak identified'
  },
  {
    id: 4,
    type: 'Bridge Structural Anomaly',
    title: 'Bridge Structural Anomaly',
    severity: 'critical',
    location: 'Chennai, Tamil Nadu',
    exactLocation: 'Highway Bridge #3',
    aiConfidence: 89,
    detectionTime: '25 min ago',
    timestamp: '25 min ago',
    lat: 13.0827,
    lng: 80.2707,
    image: '🌉',
    description: 'AI detected unusual stress patterns'
  }
]

// Get top N most severe issues (critical first, then warning)
export const getTopIssues = (count = 3) => {
  const sorted = [...issuesData].sort((a, b) => {
    if (a.severity === 'critical' && b.severity !== 'critical') return -1
    if (a.severity !== 'critical' && b.severity === 'critical') return 1
    return 0
  })
  return sorted.slice(0, count)
}





























