import React from 'react'
import './BridgeAIVisualProof.css'

const BridgeAIVisualProof = ({ visualProofs, onViewDetails, onAssign }) => {
  if (!visualProofs || visualProofs.length === 0) {
    return null
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'High':
        return 'var(--accent-red)'
      case 'Medium':
        return 'var(--accent-amber)'
      case 'Low':
        return 'var(--accent-green)'
      default:
        return 'var(--text-secondary)'
    }
  }

  return (
    <div className="bridge-ai-visual-proof-card recent-issues-card">
      <h3 className="card-section-title">AI Visual Proof</h3>
      <div className="visual-proof-grid">
        {visualProofs.map((proof) => {
          const severityColor = getSeverityColor(proof.severity)
          return (
            <div key={proof.id} className="visual-proof-card">
              <div className="visual-proof-image-container">
                <div className="visual-proof-image" style={{ backgroundColor: `${severityColor}15` }}>
                  <span className="visual-proof-icon">🖼️</span>
                  {/* Placeholder for bounding box overlay */}
                  <div className="bounding-box" style={{ borderColor: severityColor }} />
                </div>
              </div>
              <div className="visual-proof-content">
                <div className="visual-proof-header">
                  <h4 className="visual-proof-defect-type">{proof.defectType}</h4>
                  <span 
                    className="visual-proof-severity"
                    style={{
                      backgroundColor: `${severityColor}20`,
                      color: severityColor,
                      borderColor: severityColor
                    }}
                  >
                    {proof.severity}
                  </span>
                </div>
                <div className="visual-proof-meta">
                  <div className="visual-proof-meta-item">
                    <span className="meta-icon">🤖</span>
                    <span className="meta-value">{proof.confidence}% confidence</span>
                  </div>
                </div>
                <div className="visual-proof-actions">
                  <button 
                    className="action-link"
                    onClick={() => onViewDetails && onViewDetails(proof)}
                  >
                    View
                  </button>
                  <button 
                    className="action-link"
                    onClick={() => onAssign && onAssign(proof)}
                  >
                    Assign
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default BridgeAIVisualProof
















