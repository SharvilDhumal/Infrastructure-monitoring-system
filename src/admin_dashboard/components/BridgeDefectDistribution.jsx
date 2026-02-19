import React, { useState } from 'react'
import './BridgeDefectDistribution.css'

const BridgeDefectDistribution = ({ defectData }) => {
  const [hovered, setHovered] = useState(null)

  if (!defectData || defectData.length === 0) {
    return null
  }

  const total = defectData.reduce((sum, item) => sum + item.count, 0)
  const colors = {
    'Cracks': 'var(--accent-red)',
    'Corrosion': 'var(--accent-amber)',
    'Spalling': 'var(--accent-blue, #3b82f6)'
  }

  // Calculate segments for pie chart using arc paths
  const radius = 45
  const segments = []
  let currentAngle = -90 // Start from top

  defectData.forEach((item) => {
    const percentage = (item.count / total) * 100
    const angle = (percentage / 100) * 360
    const startAngle = currentAngle
    const endAngle = currentAngle + angle

    // Convert angles to radians
    const startRad = (startAngle * Math.PI) / 180
    const endRad = (endAngle * Math.PI) / 180

    // Calculate arc path
    const x1 = 50 + radius * Math.cos(startRad)
    const y1 = 50 + radius * Math.sin(startRad)
    const x2 = 50 + radius * Math.cos(endRad)
    const y2 = 50 + radius * Math.sin(endRad)

    const largeArcFlag = angle > 180 ? 1 : 0

    const pathData = [
      `M 50 50`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      `Z`
    ].join(' ')

    segments.push({
      ...item,
      percentage: Math.round(percentage),
      pathData,
      color: colors[item.type] || 'var(--text-secondary)'
    })

    currentAngle += angle
  })

  return (
    <div className="bridge-defect-distribution-card recent-issues-card">
      <h3 className="card-section-title">Defect Distribution</h3>
      <div className="defect-distribution-content">
        <div className="defect-chart-container">
          <svg viewBox="0 0 100 100" className="defect-pie-chart">
            {segments.map((segment, index) => (
              <path
                key={index}
                className="pie-chart-segment"
                d={segment.pathData}
                fill={segment.color}
                onMouseEnter={() => setHovered(segment.type)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: 'pointer', transition: 'opacity 0.2s ease' }}
              />
            ))}
          </svg>
          {hovered && (
            <div className="defect-chart-tooltip">
              {(() => {
                const hoveredSegment = segments.find(s => s.type === hovered)
                return hoveredSegment ? (
                  <>
                    <div className="tooltip-type">{hoveredSegment.type}</div>
                    <div className="tooltip-count">{hoveredSegment.count} occurrences</div>
                    <div className="tooltip-percentage">{hoveredSegment.percentage}%</div>
                  </>
                ) : null
              })()}
            </div>
          )}
        </div>
        <div className="defect-legend">
          {segments.map((segment, index) => (
            <div
              key={index}
              className="defect-legend-item"
              onMouseEnter={() => setHovered(segment.type)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="legend-color-dot" style={{ backgroundColor: segment.color }} />
              <div className="legend-content">
                <div className="legend-type">{segment.type}</div>
                <div className="legend-stats">
                  {segment.count} ({segment.percentage}%)
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BridgeDefectDistribution
