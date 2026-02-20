import React from 'react'
import './RecentActivityTimeline.css'

const RecentActivityTimeline = () => {
  const activities = [
    {
      id: 2,
      type: 'assignment',
      action: 'Issue assigned',
      description: 'Street light #1247 → Team Alpha',
      timestamp: '8 min ago',
      icon: '👤',
      color: 'var(--accent-green)'
    },
    {
      id: 3,
      type: 'resolution',
      action: 'Issue resolved',
      description: 'Water leak on River Road',
      timestamp: '15 min ago',
      icon: '✅',
      color: 'var(--accent-green)'
    },
    {
      id: 4,
      type: 'scan',
      action: 'AI scan completed',
      description: 'Full infrastructure scan',
      timestamp: '22 min ago',
      icon: '🤖',
      color: 'var(--accent-amber)'
    },
    {
      id: 5,
      type: 'alert',
      action: 'Alert triggered',
      description: 'Bridge structural anomaly detected',
      timestamp: '35 min ago',
      icon: '⚠️',
      color: 'var(--accent-red)'
    }
  ]

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



