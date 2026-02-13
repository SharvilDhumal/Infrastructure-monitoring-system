import React from 'react'
import './ContextHeader.css'

// ContextHeader is kept as a lightweight spacer / future context strip.
// The main banner is rendered ONLY via the standalone InfrastructureBanner
// component in Overview.jsx to avoid duplicate banners.
const ContextHeader = () => {
  return <div className="context-header" />
}

export default ContextHeader


