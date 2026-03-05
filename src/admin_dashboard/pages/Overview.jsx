import React, { useState } from "react";
import ContextHeader from "../components/ContextHeader";
import IssueTable from "../components/IssueTable";
import OperationsPanel from "../components/OperationsPanel";
import SeverityLadder from "../components/SeverityLadder";
import IssueDetailsModal from "../components/IssueDetailsModal";
import AssignIssueModal from "../components/AssignIssueModal";
import ResolveIssueModal from "../components/ResolveIssueModal";
import { useIssues } from "../hooks/useIssues";
import AdminWelcomeBanner from "../components/AdminWelcomeBanner";
import SeverityDistributionChart from "../components/SeverityDistributionChart";
import ModuleIssueVelocityChart from "../components/ModuleIssueVelocityChart";
import { groupIssuesByModule } from "../services/issuesService";
import "./Overview.css";

const Overview = () => {
  const {
    allIssues,
    criticalIssues,
    assignedIssues,
    severityCounts,
    workflowStats,
    loading,
    error,
    assignIssue,
    resolveIssue,
    reopenIssue
  } = useIssues();

  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);

  const moduleData = React.useMemo(() => groupIssuesByModule(allIssues), [allIssues]);

  const handleViewDetails = (issue) => {
    setSelectedIssue(issue);
    setShowDetailsModal(true);
  };

  const handleAssignClick = (issue) => {
    setSelectedIssue(issue);
    setShowAssignModal(true);
  };

  const handleResolveClick = (issue) => {
    setSelectedIssue(issue);
    setShowResolveModal(true);
  };

  const handleAssignConfirm = async (issueId, team) => {
    await assignIssue(issueId, team);
    handleCloseModals();
  };

  const handleResolveConfirm = (issueId, resolver) => {
    resolveIssue(issueId, resolver);
    handleCloseModals();
  };

  const handleCloseModals = () => {
    setShowDetailsModal(false);
    setShowAssignModal(false);
    setShowResolveModal(false);
    setSelectedIssue(null);
  };

  return (
    <div className="overview">
      <AdminWelcomeBanner alertCount={criticalIssues.length} />
      <ContextHeader />

      {loading && allIssues.length === 0 ? (
        <div className="dashboard-loading">
          <div className="loading-spinner">
            <img src="/logo192.png" alt="Loading..." style={{ width: '60px', height: '60px', opacity: 0.7 }}
              onError={(e) => { e.target.src = '📋'; e.target.style.fontSize = '40px'; }} />
          </div>
          <p>Loading overview data...</p>
        </div>
      ) : (
        <div className="overview-content">
          <div className="overview-main">
            <section className="overview-section-group">
              <h2 className="section-title">Critical Issues – Action Required</h2>
              <IssueTable
                issues={criticalIssues}
                onAssign={handleAssignClick}
                onResolve={handleResolveClick}
                onViewDetails={handleViewDetails}
              />
            </section>

            {assignedIssues.length > 0 && (
              <section className="overview-section-group">
                <h2 className="section-title">Currently Assigned Tasks</h2>
                <IssueTable
                  issues={assignedIssues}
                  onAssign={handleAssignClick}
                  onResolve={handleResolveClick}
                  onViewDetails={handleViewDetails}
                />
              </section>
            )}

            <ModuleIssueVelocityChart data={moduleData} />
          </div>

          <div className="overview-sidebar">
            <OperationsPanel stats={workflowStats} />
            <SeverityLadder counts={severityCounts} />
            <SeverityDistributionChart issues={allIssues} />
          </div>
        </div>
      )}

      {error && <div className="overview-error">{error}</div>}

      {showDetailsModal && (
        <IssueDetailsModal
          issue={selectedIssue}
          onClose={handleCloseModals}
        />
      )}

      {showAssignModal && (
        <AssignIssueModal
          isOpen={showAssignModal}
          issue={selectedIssue}
          onConfirm={handleAssignConfirm}
          onClose={handleCloseModals}
        />
      )}

      {showResolveModal && (
        <ResolveIssueModal
          isOpen={showResolveModal}
          issue={selectedIssue}
          onConfirm={handleResolveConfirm}
          onClose={handleCloseModals}
        />
      )}
    </div>
  );
};

export default Overview;
