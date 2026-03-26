import React, { useState } from 'react'
import { useIssues } from '../hooks/useIssues'
import IssueCard from '../components/IssueCard'
import AssignIssueModal from '../components/AssignIssueModal'
import ResolveIssueModal from '../components/ResolveIssueModal'
import IssueDetailsModal from '../components/IssueDetailsModal'
import { AlertCircle, CheckCircle2, ListFilter, Activity, Loader2 } from 'lucide-react'

const IncidentsMaintenance = ({ hideLayout = false }) => {
  const { allIssues, loading, error, assignIssue, resolveIssue, reopenIssue } = useIssues()
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [severityFilter, setSeverityFilter] = useState('all')

  const filteredIssues = allIssues.filter(issue => {
    const matchesStatus = selectedFilter === 'all' ? true : issue.status === selectedFilter
    const matchesSeverity = severityFilter === 'all' ? true : issue.severity?.toLowerCase() === severityFilter.toLowerCase()
    return matchesStatus && matchesSeverity
  })

  const statusCounts = {
    all: allIssues.length,
    active: allIssues.filter(i => i.status === 'active').length,
    resolved: allIssues.filter(i => i.status === 'resolved').length
  }

  const [selectedIssue, setSelectedIssue] = useState(null)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [showResolveModal, setShowResolveModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  const handleAssignClick = (issue) => {
    setSelectedIssue(issue)
    setShowAssignModal(true)
  }

  const handleResolveClick = (issue) => {
    setSelectedIssue(issue)
    setShowResolveModal(true)
  }

  const handleViewDetails = (issue) => {
    setSelectedIssue(issue)
    setShowDetailsModal(true)
  }

  const handleAssignConfirm = async (issueId, team) => {
    await assignIssue(issueId, team)
    setShowAssignModal(false)
  }

  const handleResolveConfirm = (issueId, resolver) => {
    resolveIssue(issueId, resolver)
    setShowResolveModal(false)
  }

  if (loading) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] text-slate-500 space-y-4">
          <Loader2 size={48} className="animate-spin text-blue-500" />
          <p className="font-bold tracking-widest uppercase text-xs">Parsing network incidents...</p>
        </div>
      )
  }
  
  if (error) {
    return (
        <div className={`mt-12 p-8 bg-rose-50 border border-rose-200 text-rose-600 rounded-[2.5rem] font-black flex items-center justify-center shadow-lg mx-auto ${hideLayout ? 'max-w-none' : 'max-w-[1600px]'}`}>
            {error}
        </div>
    )
  }

  return (
    <div className={`w-full h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 mx-auto ${hideLayout ? 'max-w-none pt-4 px-4 sm:px-10 pb-20' : 'max-w-[1600px] pt-4 px-4 sm:px-6 md:pt-12 md:px-8 pb-20'}`}>
      
      {/* Header Section */}
      <div className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-1 md:mb-2">Incidents <span className="text-rose-600">&</span> Maintenance</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Lifecycle tracking for active network anomalies</p>
        </div>

        {/* Floating Stat Bar */}
        <div className="flex bg-white p-2 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 items-center gap-2 overflow-x-auto hide-scrollbar">
            <StatPill icon={Activity} label="Total" count={statusCounts.all} color="text-slate-500" bg="bg-slate-50" />
            <div className="w-px h-8 bg-slate-100 mx-2" />
            <StatPill icon={AlertCircle} label="Active" count={statusCounts.active} color="text-rose-600" bg="bg-rose-50" />
            <div className="w-px h-8 bg-slate-100 mx-2" />
            <StatPill icon={CheckCircle2} label="Resolved" count={statusCounts.resolved} color="text-emerald-600" bg="bg-emerald-50" />
        </div>
      </div>

      <div className="flex flex-col gap-10">
        {/* Navigation & Filters */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-6">
            <div className="flex items-center gap-6">
                {['all', 'active', 'resolved'].map((status) => (
                <button
                    key={status}
                    className={`relative py-2 text-sm font-black uppercase tracking-wider transition-all ${
                    selectedFilter === status ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
                    }`}
                    onClick={() => setSelectedFilter(status)}
                >
                    {status}
                    {selectedFilter === status && (
                        <div className="absolute -bottom-6 left-0 right-0 h-1 bg-slate-900 rounded-full animate-in slide-in-from-left-2" />
                    )}
                </button>
                ))}
            </div>
            
            <div className="flex items-center gap-3 px-6 py-2.5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-slate-300 transition-all group overflow-hidden">
                <ListFilter size={14} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                <select 
                    value={severityFilter}
                    onChange={(e) => setSeverityFilter(e.target.value)}
                    className="bg-transparent text-[10px] font-black uppercase tracking-widest text-slate-500 focus:outline-none cursor-pointer appearance-none pr-4"
                >
                    <option value="all">Severity: Matrix View</option>
                    <option value="low">Severity: Low</option>
                    <option value="medium">Severity: Medium</option>
                    <option value="high">Severity: High</option>
                    <option value="critical">Severity: Critical</option>
                </select>
                <div className={`w-2 h-2 rounded-full ring-4 shadow-sm transition-all ${
                    severityFilter === 'all' ? 'bg-slate-300 ring-slate-100' :
                    severityFilter === 'low' ? 'bg-emerald-500 ring-emerald-100' :
                    severityFilter === 'medium' ? 'bg-amber-500 ring-amber-100' :
                    severityFilter === 'high' ? 'bg-orange-500 ring-orange-100' : 'bg-rose-500 ring-rose-100'
                }`} />
            </div>
        </div>

        {/* Main Incident Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredIssues.length > 0 ? (
            filteredIssues.map((issue) => (
                <IssueCard
                key={issue.id}
                issue={issue}
                onAssign={handleAssignClick}
                onResolve={handleResolveClick}
                onViewDetails={handleViewDetails}
                />
            ))
            ) : (
            <div className="col-span-full py-32 flex flex-col items-center justify-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 text-slate-400 italic font-bold">
                <CheckCircle2 size={48} className="mb-4 opacity-20" />
                No {selectedFilter} incidents currently reported.
            </div>
            )}
        </div>
      </div>

      {showAssignModal && (
        <AssignIssueModal
          isOpen={showAssignModal}
          issue={selectedIssue}
          onClose={() => setShowAssignModal(false)}
          onConfirm={handleAssignConfirm}
        />
      )}

      {showResolveModal && (
        <ResolveIssueModal
          isOpen={showResolveModal}
          issue={selectedIssue}
          onClose={() => setShowResolveModal(false)}
          onConfirm={handleResolveConfirm}
        />
      )}

      {showDetailsModal && (
        <IssueDetailsModal
          issue={selectedIssue}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
    </div>
  )
}

const StatPill = ({ icon: Icon, label, count, color, bg }) => (
    <div className={`flex items-center gap-3 px-6 py-2 ${bg} rounded-full border border-white/50 transition-transform hover:scale-105 cursor-default`}>
        <Icon size={14} className={color} />
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
        <span className={`text-sm font-black ${color}`}>{count}</span>
    </div>
);

export default IncidentsMaintenance
