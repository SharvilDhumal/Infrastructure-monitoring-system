import React, { useState } from "react";
import ContextHeader from "../components/ContextHeader";
import InfrastructureBanner from "../components/InfrastructureBanner";
import CriticalIssuesList from "../components/CriticalIssuesList";
import AssignedIssuesList from "../components/AssignedIssuesList";
import OperationsPanel from "../components/OperationsPanel";
import SeverityLadder from "../components/SeverityLadder";
import RecentActivityTimeline from "../components/RecentActivityTimeline";
import LiveDetectionMap from "../components/LiveDetectionMap";
import IssueDonutChart from "../components/IssueDonutChart";
import ModuleBarChart from "../components/ModuleBarChart";
import ViewDetailsModal from "../components/ViewDetailsModal";
import AssignTeamModal from "../components/AssignTeamModal";
import { useIssues } from "../hooks/useIssues";
import "./Overview.css";

const Overview = () => {
  const { criticalIssues, assignedIssues, loading, error, assignTeam } = useIssues();
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  const handleViewDetails = (issue) => {
    setSelectedIssue(issue);
    setShowDetailsModal(true);
  };

  const handleAssignClick = (issue) => {
    setSelectedIssue(issue);
    setShowAssignModal(true);
  };

  const handleAssignTeam = async (issueId, team, notes) => {
    try {
      await assignTeam(issueId, team, notes);
      handleCloseModals();
    } catch (err) {
      console.error("Failed to assign team:", err);
    }
  };

  const handleCloseModals = () => {
    setShowDetailsModal(false);
    setShowAssignModal(false);
    setSelectedIssue(null);
  };

  return (
    <div className="overview">
      {/* Page Header */}
      <div className="overview-header">
        <h1>Overview</h1>
        <p>Real-time infrastructure monitoring and insights</p>
      </div>

      {/* Context strip */}
      <ContextHeader />

      {/* ✅ SINGLE BANNER */}
      <InfrastructureBanner />

      {loading ? (
        <div className="overview-loading">Loading data...</div>
      ) : (
        <div className="overview-grid">
          {/* MAIN */}
          <div className="overview-main">
            <CriticalIssuesList 
              issues={criticalIssues}
              onViewDetails={handleViewDetails}
              onAssign={handleAssignClick}
            />
            {assignedIssues && assignedIssues.length > 0 && (
              <AssignedIssuesList assignedIssues={assignedIssues} />
            )}
            <LiveDetectionMap />

            <div className="overview-charts">
              <IssueDonutChart />
              <ModuleBarChart />
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="overview-sidebar">
            <OperationsPanel />
            <SeverityLadder />
            <RecentActivityTimeline />
          </div>
        </div>
      )}

      {error && <div className="overview-error">{error}</div>}

      {/* Modals */}
      {showDetailsModal && (
        <ViewDetailsModal 
          issue={selectedIssue}
          onClose={handleCloseModals}
        />
      )}

      {showAssignModal && (
        <AssignTeamModal 
          issue={selectedIssue}
          onAssign={handleAssignTeam}
          onClose={handleCloseModals}
        />
      )}
    </div>
  );
};

export default Overview;
