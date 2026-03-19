import React, { useState } from "react";
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
import { Loader2, Activity, Settings, AlertTriangle, Layers, PieChart } from "lucide-react";

// The Bento Card Wrapper makes any component fit into a rounded aesthetic
const BentoCard = ({ children, title, icon: Icon, spanClass = "col-span-1" }) => (
  <div className={`bg-white border border-slate-200 rounded-[2.5rem] p-6 md:p-8 shadow-sm hover:shadow-xl hover:scale-[1.015] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] overflow-hidden flex flex-col ${spanClass}`}>
    {title && (
      <h2 className="text-lg font-black text-slate-900 mb-10 flex items-center gap-3">
        {Icon && <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl"><Icon className="text-blue-500" size={20} /></div>}
        {title}
      </h2>
    )}
    <div className="flex-1 w-full h-full relative">
      {children}
    </div>
  </div>
);

const Overview = ({ hideLayout = false }) => {
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
    <div className={`w-full h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 mx-auto ${hideLayout ? 'max-w-none pt-4 px-10 pb-20' : 'max-w-[1600px] pt-12 pb-20'}`}>
      <AdminWelcomeBanner alertCount={criticalIssues.length} />

      {loading && allIssues.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] text-slate-500 space-y-4">
          <Loader2 size={48} className="animate-spin text-blue-500" />
          <p className="font-bold tracking-widest uppercase text-xs">Loading Overview Data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 auto-rows-max">
            
          {/* Main Tables */}
          <BentoCard title="Critical Issues Action Required" icon={AlertTriangle} spanClass="col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-3">
             <div className="-mx-2 -my-2">
              <IssueTable
                issues={criticalIssues}
                onAssign={handleAssignClick}
                onResolve={handleResolveClick}
                onViewDetails={handleViewDetails}
              />
             </div>
          </BentoCard>

          {/* Operations Panel side */}
          <BentoCard title="Operations Overview" icon={Settings} spanClass="col-span-1 md:col-span-2 lg:col-span-1 xl:col-span-1">
             <div className="-mx-4 -my-4 h-full flex items-center justify-center">
               <OperationsPanel stats={workflowStats} />
             </div>
          </BentoCard>

          {/* Module Velocity Chart */}
          <BentoCard title="Velocity Chart" icon={Activity} spanClass="col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-2">
             <ModuleIssueVelocityChart data={moduleData} />
          </BentoCard>

          {/* Severity Ladder */}
          <BentoCard title="Severity Ladder" icon={Layers} spanClass="col-span-1">
             <div className="-mx-4 -my-4 h-full flex items-center justify-center">
               <SeverityLadder counts={severityCounts} />
             </div>
          </BentoCard>

          {/* Severity Distribution */}
          <BentoCard title="Severity Distribution" icon={PieChart} spanClass="col-span-1">
             <SeverityDistributionChart issues={allIssues} />
          </BentoCard>

          {/* Assigned Tasks */}
          {assignedIssues.length > 0 && (
            <BentoCard title="Currently Assigned Tasks" spanClass="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4">
              <div className="-mx-2 -my-2">
                <IssueTable
                  issues={assignedIssues}
                  onAssign={handleAssignClick}
                  onResolve={handleResolveClick}
                  onViewDetails={handleViewDetails}
                />
              </div>
            </BentoCard>
          )}
        </div>
      )}

      {error && (
        <div className="mt-8 p-6 bg-red-50 border border-red-200 text-red-600 rounded-2xl font-bold flex items-center justify-center shadow-sm">
           <AlertTriangle className="mr-3" /> {error}
        </div>
      )}

      {/* Modals */}
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
