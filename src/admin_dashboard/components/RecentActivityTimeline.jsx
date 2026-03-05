import React from 'react'
import './RecentActivityTimeline.css'

const RecentActivityTimeline = ({ issues = [] }) => {
  const activities = issues.slice(0, 10).map(issue => ({
    id: issue.id,
    type: issue.status === 'fixed' ? 'resolution' : 'issue',
    action: issue.status === 'fixed' ? 'Issue resolved' : 'New issue detected',
    description: `${issue.title} at ${issue.location}`,
    timestamp: issue.reportedTime,
    icon: issue.status === 'fixed' ? '✅' : issue.image || '⚠️',
    color: issue.severity === 'critical' ? 'var(--accent-red)' : 'var(--accent-amber)'
  }))

  // Show only last 5 events
  const recentActivities = activities.slice(0, 5)

  return (
    <div className="activity-timeline-card">
      <div className="card-header">
        <h2 className="card-title">Live Activity</h2>
      </div>
      <div className="timeline">
        {recentActivities.map((activity, index) => (
          <TimelineItem
            key={activity.id}
            activity={activity}
            isLast={index === recentActivities.length - 1}
          />
        ))}
      </div>
    </div>
  )
}

const TimelineItem = ({ activity, isLast }) => {
  return (
    <div className="timeline-item">
      <div className="timeline-marker" style={{ backgroundColor: `${activity.color}20` }}>
        <span className="timeline-icon" style={{ color: activity.color }}>
          {activity.icon}
        </span>
      </div>
      {!isLast && <div className="timeline-line" />}
      <div className="timeline-content">
        <div className="timeline-action">{activity.action}</div>
        <div className="timeline-description">{activity.description}</div>
        <div className="timeline-timestamp">{activity.timestamp}</div>
      </div>
    </div>
  )
}

export default RecentActivityTimeline



