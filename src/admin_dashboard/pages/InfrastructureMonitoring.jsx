import React, { useState, useMemo } from 'react'
import IssueTable from '../components/IssueTable'
import AssignIssueModal from '../components/AssignIssueModal'
import ResolveIssueModal from '../components/ResolveIssueModal'
import IssueDetailsModal from '../components/IssueDetailsModal'
import KPICard from '../components/KPICard'
import IssueTrendChart from '../components/IssueTrendChart'
import SeverityDonutChart from '../components/IssueDonutChart'
import { useIssues } from '../hooks/useIssues'
import { Settings, BarChart2, PieChart, Info, Map, Loader2 } from 'lucide-react'

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

const InfrastructureMonitoring = ({ hideLayout = false }) => {
  const { allIssues, loading, error, assignIssue, resolveIssue, reopenIssue } = useIssues()
  const [selectedAsset, setSelectedAsset] = useState('roads')
  const [selectedIssue, setSelectedIssue] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [showResolveModal, setShowResolveModal] = useState(false)
  const [timePeriod, setTimePeriod] = useState('7d')

  const assets = useMemo(() => {
    const assetTypes = {
      roads: { name: 'Roads', icon: '🛣️', types: ['Pothole'] },
      streetlights: { name: 'Street Lights', icon: '💡', types: ['Street Light Malfunction', 'Streetlight'] },
      water: { name: 'Water Systems', icon: '💧', types: ['Water Leak', 'Water Leakage'] },
      bridges: { name: 'Bridges', icon: '🌉', types: ['Bridge Structural Anomaly', 'Bridge'] }
    }

    const result = {}
    Object.keys(assetTypes).forEach(key => {
      const typeInfo = assetTypes[key]
      const filteredIssues = allIssues.filter(i =>
        typeInfo.types.some(t => i.issueType?.toLowerCase().includes(t.toLowerCase()) || i.title?.toLowerCase().includes(t.toLowerCase()))
      )

      result[key] = {
        name: typeInfo.name,
        icon: typeInfo.icon,
        detected: filteredIssues.length,
        resolved: filteredIssues.filter(i => i.status === 'resolved').length,
        severity: {
          high: filteredIssues.filter(i => (i.severity?.toLowerCase() === 'critical' || i.severity?.toLowerCase() === 'high') && i.status === 'active').length,
          medium: filteredIssues.filter(i => (i.severity?.toLowerCase() === 'medium' || i.severity?.toLowerCase() === 'warning') && i.status === 'active').length,
          low: filteredIssues.filter(i => i.severity?.toLowerCase() === 'low' && i.status === 'active').length
        },
        recentIssues: filteredIssues.slice(0, 10),
        allFilteredIssues: filteredIssues
      }
    })
    return result
  }, [allIssues])

  const currentAsset = assets[selectedAsset] || { name: 'Loading...', icon: '⌛', detected: 0, resolved: 0, severity: { high: 0, medium: 0, low: 0 }, recentIssues: [], allFilteredIssues: [] }

  const handleViewDetails = (issue) => {
    setSelectedIssue(issue)
    setShowDetailsModal(true)
  }

  const handleAssignClick = (issue) => {
    setSelectedIssue(issue)
    setShowAssignModal(true)
  }

  const handleResolveClick = (issue) => {
    setSelectedIssue(issue)
    setShowResolveModal(true)
  }

  const handleAssignConfirm = async (issueId, team) => {
    await assignIssue(issueId, team)
    setShowAssignModal(false)
  }

  const handleResolveConfirm = (issueId, resolver) => {
    resolveIssue(issueId, resolver)
    setShowResolveModal(false)
  }

  if (loading && allIssues.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] text-slate-500 space-y-4">
        <Loader2 size={48} className="animate-spin text-blue-500" />
        <p className="font-bold tracking-widest uppercase text-xs">Loading Asset Data...</p>
      </div>
    )
  }

  if (error) {
    return (
        <div className={`mt-8 p-6 bg-red-50 border border-red-200 text-red-600 rounded-2xl font-bold flex items-center justify-center shadow-sm mx-auto ${hideLayout ? 'max-w-none' : 'max-w-[1600px]'}`}>
            {error}
        </div>
    )
  }

  return (
    <div className={`w-full h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 mx-auto ${hideLayout ? 'max-w-none pt-4 px-4 sm:px-10 pb-20' : 'max-w-[1600px] pt-4 px-4 sm:px-6 md:pt-12 md:px-8 pb-20'}`}>
      <div className="mb-6 md:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-1 md:mb-2">Infrastructure <span className="text-blue-600">Assets</span></h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] md:text-xs">Asset-wise views and detailed monitoring</p>
        </div>
        
        {/* Modern Asset Selector Pills */}
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto hide-scrollbar shrink-0 w-full md:w-auto snap-x">
          {Object.keys(assets).map((key) => (
            <button
              key={key}
              className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-xl text-sm font-black transition-all whitespace-nowrap snap-start shrink-0 touch-target ${
                selectedAsset === key 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
              onClick={() => setSelectedAsset(key)}
            >
              <span className="text-lg md:text-xl leading-none">{assets[key].icon}</span>
              {assets[key].name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 lg:gap-12 auto-rows-max">
        
        {/* KPI Section */}
        <BentoCard title={`${currentAsset.name} Status`} icon={Map} spanClass="col-span-1 md:col-span-2 lg:col-span-4 xl:col-span-4">
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 h-full items-stretch">
            <div className="flex-1">
                <KPICard
                type="total"
                title="Total Issues"
                value={currentAsset.detected}
                subtext="Real-time count"
                />
            </div>
            <div className="flex-1">
                <KPICard
                type="resolved"
                title="Resolved"
                value={currentAsset.resolved}
                subtext={`Resolution rate: ${currentAsset.detected > 0 ? Math.round((currentAsset.resolved / currentAsset.detected) * 100) : 0}%`}
                />
            </div>
          </div>
        </BentoCard>

        {/* Issue Trends Chart */}
        <BentoCard title="Performance Trends" icon={BarChart2} spanClass="col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-2">
          <div className="absolute top-0 right-0 -mt-16 flex gap-2">
            {['7d', '30d', '90d'].map((p) => (
              <button
                key={p}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                  timePeriod === p 
                    ? 'bg-blue-50 text-blue-600 border border-blue-200 shadow-sm' 
                    : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'
                }`}
                onClick={() => setTimePeriod(p)}
              >
                {p === '7d' ? '7D' : p === '30d' ? '30D' : '90D'}
              </button>
            ))}
          </div>
          <div className="-mx-2 h-full min-h-[250px] flex items-center justify-center">
            <IssueTrendChart issues={currentAsset.allFilteredIssues} period={timePeriod} />
          </div>
        </BentoCard>

        {/* Severity Donut */}
        <BentoCard title="Severity Split" icon={PieChart} spanClass="col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-2">
          <div className="-mx-4 -mt-2 h-full min-h-[250px] flex px-10 items-center justify-center">
            <SeverityDonutChart data={currentAsset.severity} />
          </div>
        </BentoCard>

        {/* Recent Issues Table */}
        <BentoCard title="Recent Network Events" icon={Info} spanClass="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4">
          <div className="-mx-2 -my-2">
            <IssueTable
              issues={currentAsset.recentIssues}
              onAssign={handleAssignClick}
              onResolve={handleResolveClick}
              onViewDetails={handleViewDetails}
            />
          </div>
        </BentoCard>

      </div>

      {showDetailsModal && (
        <IssueDetailsModal
          issue={selectedIssue}
          onClose={() => setShowDetailsModal(false)}
        />
      )}

      {showAssignModal && (
        <AssignIssueModal
          isOpen={showAssignModal}
          issue={selectedIssue}
          onConfirm={handleAssignConfirm}
          onClose={() => setShowAssignModal(false)}
        />
      )}

      {showResolveModal && (
        <ResolveIssueModal
          isOpen={showResolveModal}
          issue={selectedIssue}
          onConfirm={handleResolveConfirm}
          onClose={() => setShowResolveModal(false)}
        />
      )}
    </div>
  )
}

export default InfrastructureMonitoring
