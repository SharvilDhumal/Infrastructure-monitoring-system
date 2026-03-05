import React from 'react';
import './PotholeDashboard.css';

const PotholeDashboard = () => {
  return (
    <div className="pothole-dashboard-container">
      {/* 
        Assuming pothole-frontend runs on Vite's default alternate port 5174 
        when 5173 is taken by main_dashboard.
      */}
      <iframe
        src="http://localhost:5174"
        title="Pothole Detection Dashboard"
        className="pothole-iframe"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default PotholeDashboard;
