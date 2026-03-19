import React, { useState, useMemo, useEffect } from "react";
import { Check, X, MapPin, AlertTriangle, Clock, User, Calendar, Info, Activity, ShieldCheck, FileText } from "lucide-react";

const Bridge = ({ hideLayout = false }) => {
    const [activeTab, setActiveTab] = useState("Overview");
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showResolveModal, setShowResolveModal] = useState(false);
    const [resolverName, setResolverName] = useState("");
    const [userReports, setUserReports] = useState([]);

    useEffect(() => {
        const fetchUserReports = async () => {
            try {
                const res = await fetch('http://localhost:5001/api/issues?faultType=bridge-issue');
                const data = await res.json();
                if (data.success) {
                    setUserReports(data.issues);
                }
            } catch (error) {
                console.error("Error fetching user reports:", error);
            }
        };

        fetchUserReports();
        const interval = setInterval(fetchUserReports, 5000);
        return () => clearInterval(interval);
    }, []);

    const [detectedIssues, setDetectedIssues] = useState([
        {
            id: 1,
            type: "Structural Crack",
            location: "Main Span - Column B4",
            severity: "High",
            detectedAt: "2026-02-22 09:12",
            image: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=2070&auto=format&fit=crop",
            description: "Critical hairline crack detected on the concrete support pillar. Requires immediate structural assessment and potential epoxy injection to prevent moisture ingress.",
        },
        {
            id: 2,
            type: "Surface Corrosion",
            location: "East Girder - Joint 12",
            severity: "Medium",
            detectedAt: "2026-02-22 08:45",
            image: "https://images.unsplash.com/photo-1518107616985-bd48230d3b20?q=80&w=2070&auto=format&fit=crop",
            description: "Significant rust accumulation on the steel girder joint. The protective coating has failed, leading to oxidation of the structural metal.",
        },
        {
            id: 3,
            type: "Concrete Spalling",
            location: "Underpass - Section C",
            severity: "High",
            detectedAt: "2026-02-22 07:30",
            image: "https://images.unsplash.com/photo-1520697904130-9eb37f2613ce?q=80&w=2070&auto=format&fit=crop",
            description: "Concrete cover has delaminated, exposing the internal rebar. High risk of accelerated corrosion and structural capacity loss.",
        },
        {
            id: 4,
            type: "Metal Oxidation",
            location: "South Suspension Cable",
            severity: "Medium",
            detectedAt: "2026-02-22 06:15",
            image: "https://images.unsplash.com/photo-1589939705384-5185138a04b9?q=80&w=2070&auto=format&fit=crop",
            description: "Visible oxidation on the main tension cables. Monitoring required to assess the rate of material loss.",
        },
    ]);

    const [resolvedIssues, setResolvedIssues] = useState([
        {
            id: 101,
            type: "Sealant Application",
            location: "Footbridge - Pier 2",
            severity: "Low",
            detectedAt: "2026-02-21 14:00",
            resolvedAt: "2026-02-21 16:30",
            resolvedBy: "Admin Tanishk",
            image: "https://images.unsplash.com/photo-1590060905727-2b8109d94191?q=80&w=2070&auto=format&fit=crop",
            description: "Superficial hairline cracks in the non-load-bearing section have been successfully sealed and waterproofed."
        },
    ]);

    const stats = useMemo(() => {
        const total = detectedIssues.length + resolvedIssues.length;
        const res = resolvedIssues.length;
        const det = detectedIssues.length;
        const rate = total > 0 ? ((res / total) * 100).toFixed(1) : "0";

        return {
            total: total.toLocaleString(),
            resolved: res.toLocaleString(),
            detected: det.toLocaleString(),
            rate: `${rate}%`
        };
    }, [detectedIssues, resolvedIssues]);

    const handleResolve = () => {
        if (!selectedIssue || !resolverName.trim()) return;

        const newResolved = {
            ...selectedIssue,
            resolvedAt: new Date().toLocaleString(),
            resolvedBy: resolverName,
        };

        setResolvedIssues([newResolved, ...resolvedIssues]);
        setDetectedIssues(detectedIssues.filter((i) => i.id !== selectedIssue.id));
        setShowResolveModal(false);
        setSelectedIssue(null);
        setResolverName("");
    };

    const getSeverityStyles = (severity) => {
        switch (severity) {
            case "High": return "bg-red-50 text-red-600 border-red-200";
            case "Medium": return "bg-orange-50 text-orange-600 border-orange-200";
            case "Low": return "bg-green-50 text-green-600 border-green-200";
            default: return "bg-gray-50 text-gray-600 border-gray-200";
        }
    };

    const StatCard = ({ title, value, unit, icon, description, color }) => {
      const colorMap = {
        indigo: 'from-indigo-500/10 to-transparent border-indigo-500/20',
        emerald: 'from-emerald-500/10 to-transparent border-emerald-500/20',
        red: 'from-red-500/10 to-transparent border-red-500/20',
        amber: 'from-amber-500/10 to-transparent border-amber-500/20',
      };
      return (
        <div className="group relative bg-white border border-slate-200 p-5 rounded-[2rem] transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{title}</span>
            <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 group-hover:scale-110 transition-transform">
              {icon}
            </div>
          </div>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-3xl font-black text-slate-800">{value}</span>
            {unit && <span className="text-xs font-bold text-slate-500 uppercase">{unit}</span>}
          </div>
          <p className="text-[10px] text-slate-500 font-medium">{description}</p>
          <div className={`absolute bottom-0 left-0 right-0 h-1 rounded-full bg-gradient-to-r ${colorMap[color] || colorMap.indigo}`}></div>
        </div>
      );
    };

    const renderContent = () => {
        switch (activeTab) {
            case "Overview":
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                            <StatCard
                              title="Total Issues"
                              value={stats.total}
                              icon={<Activity className="text-indigo-500" size={20} />}
                              color="indigo"
                              description="Historical tracked data"
                            />
                            <StatCard
                              title="Resolved"
                              value={stats.resolved}
                              icon={<Check className="text-emerald-500" size={20} />}
                              color="emerald"
                              description="Maintenance completed"
                            />
                            <StatCard
                              title="Active Defects"
                              value={stats.detected}
                              icon={<AlertTriangle className="text-red-500" size={20} />}
                              color="red"
                              description="Requires immediate attention"
                            />
                            <StatCard
                              title="Resolution Rate"
                              value={stats.rate}
                              icon={<ShieldCheck className="text-amber-500" size={20} />}
                              color="amber"
                              description="Overall efficiency score"
                            />
                        </div>

                        <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <AlertTriangle className="text-indigo-500" size={24} /> Severity Breakdown
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                {[
                                    { label: "High Priority", count: detectedIssues.filter(i => i.severity === "High").length, subtitle: "Needs Immediate Action", bgColor: "bg-red-50", textColor: "text-red-500", ring: "ring-red-500/20" },
                                    { label: "Medium Priority", count: detectedIssues.filter(i => i.severity === "Medium").length, subtitle: "Plan Intervention", bgColor: "bg-orange-50", textColor: "text-orange-500", ring: "ring-orange-500/20" },
                                    { label: "Low Priority", count: detectedIssues.filter(i => i.severity === "Low").length, subtitle: "Routine Monitoring", bgColor: "bg-emerald-50", textColor: "text-emerald-500", ring: "ring-emerald-500/20" },
                                ].map((item, idx) => (
                                    <div key={idx} className={`${item.bgColor} p-8 rounded-[2rem] border border-white/40 shadow-sm flex flex-col items-center text-center relative overflow-hidden group`}>
                                        <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${item.bgColor} ring-8 ${item.ring} opacity-50 group-hover:scale-150 transition-transform duration-700`}></div>
                                        <h3 className={`text-sm font-bold uppercase tracking-widest ${item.textColor} mb-2 relative z-10`}>{item.label}</h3>
                                        <p className="text-5xl font-black text-slate-900 mb-3 relative z-10">{item.count}</p>
                                        <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mt-auto relative z-10">{item.subtitle}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case "Detected Issues":
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {detectedIssues.length === 0 ? (
                                <div className="col-span-full bg-white border border-slate-200 p-12 rounded-[2.5rem] shadow-sm flex flex-col items-center justify-center text-center">
                                  <div className="p-4 bg-emerald-500/10 rounded-full mb-4 ring-8 ring-emerald-500/5">
                                    <Check className="text-emerald-500" size={48} />
                                  </div>
                                  <h3 className="text-xl font-bold text-slate-900 mb-2">All Clear!</h3>
                                  <p className="text-slate-500 font-medium tracking-wide">Structural parameters are nominal.</p>
                                </div>
                            ) : (
                                detectedIssues.map((issue) => (
                                    <div
                                        key={issue.id}
                                        onClick={() => { setSelectedIssue(issue); setShowDetailModal(true); }}
                                        className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200 transition-all flex flex-col group p-1.5 cursor-pointer"
                                    >
                                        <div className="relative h-48 bg-slate-100 overflow-hidden rounded-[1.5rem]">
                                            <img src={issue.image} alt={issue.type} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            <div className="absolute top-3 left-3 flex items-center gap-1.5">
                                               <span className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg backdrop-blur bg-white/90 ${issue.severity === 'High' ? 'text-red-600' : issue.severity === 'Medium' ? 'text-orange-600' : 'text-emerald-600'}`}>
                                                   {issue.severity} Risk
                                               </span>
                                            </div>
                                        </div>
                                        <div className="p-4 flex-1 flex flex-col">
                                            <div className="mb-4">
                                                <h4 className="font-bold text-slate-900 text-lg mb-2">{issue.type}</h4>
                                                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1.5">
                                                    <MapPin size={14} className="text-slate-400" />
                                                    {issue.location}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                                                    <Clock size={14} className="text-slate-400" />
                                                    {issue.detectedAt}
                                                </div>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedIssue(issue);
                                                    setShowResolveModal(true);
                                                }}
                                                className="mt-auto w-full py-3 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl font-bold text-sm transition-colors shadow-sm"
                                            >
                                                Resolve Defect
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                );

            case "Resolved Issues":
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {resolvedIssues.length === 0 ? (
                                <div className="col-span-full bg-white border border-slate-200 p-12 rounded-[2.5rem] shadow-sm flex flex-col items-center justify-center text-center">
                                    <div className="p-4 bg-slate-500/10 rounded-full mb-4 ring-8 ring-slate-500/5">
                                        <FileText className="text-slate-500" size={48} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">No History</h3>
                                    <p className="text-slate-500 font-medium tracking-wide">Archived logs will appear here once maintenance is completed.</p>
                                </div>
                            ) : (
                                resolvedIssues.map((issue) => (
                                    <div
                                        key={issue.id}
                                        className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden flex flex-col p-1.5 opacity-90 hover:opacity-100 transition-opacity"
                                    >
                                        <div className="relative h-40 bg-slate-100 grayscale rounded-[1.5rem] overflow-hidden">
                                            <img src={issue.image} alt={issue.type} className="w-full h-full object-cover" />
                                            <div className="absolute top-3 left-3 bg-emerald-500/90 backdrop-blur text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                                                <Check size={12} /> Fixed
                                            </div>
                                        </div>
                                        <div className="p-4 flex-1 flex flex-col bg-slate-50/50 rounded-b-[1.5rem]">
                                            <h4 className="font-bold text-slate-900 text-lg mb-3 line-through decoration-slate-300">{issue.type}</h4>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
                                                    <User size={14} className="text-slate-400" />
                                                    <span className="truncate">By <strong>{issue.resolvedBy}</strong></span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
                                                    <Calendar size={14} className="text-slate-400" />
                                                    {issue.resolvedAt}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                );

            case "User Reports":
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {userReports.length === 0 ? (
                                <div className="col-span-full bg-white border border-slate-200 p-12 rounded-[2.5rem] shadow-sm flex flex-col items-center justify-center text-center">
                                    <div className="p-4 bg-blue-500/10 rounded-full mb-4 ring-8 ring-blue-500/5">
                                        <User className="text-blue-500" size={48} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">No User Reports</h3>
                                    <p className="text-slate-500 font-medium tracking-wide">Citizen reports will appear here.</p>
                                </div>
                            ) : (
                                userReports.map((issue) => (
                                    <div
                                        key={issue._id}
                                        className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden flex flex-col p-1.5 opacity-90 hover:opacity-100 transition-opacity"
                                    >
                                        <div className="relative h-40 bg-slate-100 rounded-[1.5rem] overflow-hidden">
                                            <img src={issue.imageUrl || 'https://placehold.co/600x400/f1f5f9/94a3b8?text=Image+Unavailable'} alt={issue.title} className="w-full h-full object-cover" />
                                            <div className="absolute top-3 left-3 bg-blue-500/90 backdrop-blur text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                                                {issue.status}
                                            </div>
                                        </div>
                                        <div className="p-4 flex-1 flex flex-col bg-slate-50/50 rounded-b-[1.5rem]">
                                            <h4 className="font-bold text-slate-900 text-lg mb-2">{issue.title}</h4>
                                            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-2">
                                                <MapPin size={14} className="text-slate-400" />
                                                {issue.location}
                                            </div>
                                            <p className="text-xs text-slate-600 mb-4 flex-1">{issue.description}</p>
                                            <div className="text-[10px] font-bold text-slate-400 mt-auto uppercase tracking-widest border-t border-slate-200 pt-3">
                                                Reported By: {issue.user?.name || 'Citizen'}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className={`min-h-screen transition-colors duration-700 bg-slate-50`}>
            <div className={`relative z-10 max-w-[1400px] mx-auto ${hideLayout ? 'px-4 py-4' : 'px-6 py-8'}`}>
                
                {/* Header */}
                {!hideLayout && (
                    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-indigo-600/20 rounded-xl border border-indigo-500/30">
                                <ShieldCheck className="text-indigo-500" size={24} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">InfraVision <span className="text-indigo-500 underline decoration-indigo-500/30 underline-offset-4">Bridge</span></h1>
                                <p className="text-sm text-slate-600 font-medium">Structural Integrity Dashboard</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 bg-white shadow-sm px-4 py-2.5 rounded-2xl border border-slate-200">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20 animate-pulse"></div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">
                                    Sensors Active
                                </span>
                            </div>
                        </div>
                    </header>
                )}

                {/* Tab Navigation */}
                <div className="flex bg-white/60 backdrop-blur-md p-1.5 rounded-2xl w-fit mb-8 border border-slate-200 shadow-sm overflow-x-auto">
                    {["Overview", "Detected Issues", "Resolved Issues", "User Reports"].map(tab => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)} 
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === tab ? 'bg-white shadow-sm border border-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'}`}
                        >
                            {tab === "Overview" && <Activity size={16} className={activeTab === tab ? 'text-indigo-500' : ''} />}
                            {tab === "Detected Issues" && (
                                <>
                                    <AlertTriangle size={16} className={activeTab === tab ? 'text-orange-500' : ''} />
                                    {detectedIssues.length > 0 && <span className={`w-1.5 h-1.5 rounded-full ${activeTab === tab ? 'bg-orange-500' : 'bg-red-500'} animate-pulse hidden sm:inline-block`}></span>}
                                </>
                            )}
                            {tab === "Resolved Issues" && <Check size={16} className={activeTab === tab ? 'text-emerald-500' : ''} />}
                            {tab === "User Reports" && <User size={16} className={activeTab === tab ? 'text-blue-500' : ''} />}
                            {tab}
                        </button>
                    ))}
                </div>

                {renderContent()}

            </div>

            {/* DETAIL MODAL */}
            {showDetailModal && selectedIssue && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setShowDetailModal(false)}>
                    <div className="bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[95vh] overflow-hidden overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                        <div className="relative h-64 sm:h-72 bg-slate-100 overflow-hidden shrink-0">
                            <img src={selectedIssue.image} alt={selectedIssue.type} className="w-full h-full object-cover" />
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="absolute top-4 right-4 w-10 h-10 bg-white/30 hover:bg-white/50 text-slate-800 rounded-full flex items-center justify-center backdrop-blur-xl transition-all shadow-lg border border-white/40"
                            >
                                <X size={20} />
                            </button>
                            <div className="absolute bottom-4 left-4 flex gap-2">
                                <span className={`px-4 py-1.5 text-xs font-black rounded-xl uppercase tracking-widest shadow-lg backdrop-blur bg-white/90 ${selectedIssue.severity === 'High' ? 'text-red-600' : selectedIssue.severity === 'Medium' ? 'text-orange-600' : 'text-emerald-600'}`}>
                                    {selectedIssue.severity} Priority
                                </span>
                            </div>
                        </div>
                        <div className="p-8 md:p-10">
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4">{selectedIssue.type}</h2>
                            <p className="text-slate-500 mb-8 leading-relaxed font-medium">{selectedIssue.description}</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                                <div className="flex flex-col p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 gap-2">
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-400">
                                        <MapPin size={16} /> Location
                                    </div>
                                    <p className="font-bold text-slate-900">{selectedIssue.location}</p>
                                </div>
                                <div className="flex flex-col p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 gap-2">
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-400">
                                        <Clock size={16} /> Detection Time
                                    </div>
                                    <p className="font-bold text-slate-900">{selectedIssue.detectedAt}</p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 bg-slate-50 -mx-10 -mb-10 p-8 border-t border-slate-100 rounded-b-[2.5rem] justify-end">
                                <button
                                    onClick={() => setShowDetailModal(false)}
                                    className="px-8 py-3.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-100 transition-all text-sm shadow-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => { setShowDetailModal(false); setShowResolveModal(true); }}
                                    className="px-8 py-3.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 text-sm"
                                >
                                    Resolve Defect <Check size={18} strokeWidth={3} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* RESOLVE MODAL */}
            {showResolveModal && selectedIssue && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setShowResolveModal(false)}>
                    <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3"><ShieldCheck size={24} className="text-indigo-500" /> Log Maintenance</h3>
                            <button onClick={() => setShowResolveModal(false)} className="text-slate-400 hover:text-slate-900 hover:bg-slate-200 p-2 rounded-full transition-colors"><X size={20} /></button>
                        </div>

                        <div className="p-8">
                            <div className="mb-8 p-4 bg-white border border-slate-200 rounded-[1.5rem] flex items-center gap-4 shadow-sm">
                                <img src={selectedIssue.image} alt={selectedIssue.type} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-slate-900 truncate">{selectedIssue.type}</p>
                                    <p className="text-xs text-slate-500 font-semibold truncate">{selectedIssue.location}</p>
                                </div>
                            </div>

                            <div className="mb-8">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Personnel Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Enter full name"
                                        autoFocus
                                        value={resolverName}
                                        onChange={(e) => setResolverName(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 placeholder:font-semibold"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 -mx-8 -mb-8 p-6 bg-slate-50 border-t border-slate-100 rounded-b-[2.5rem] justify-end mt-4">
                                <button
                                    onClick={() => setShowResolveModal(false)}
                                    className="px-6 py-2.5 text-slate-500 font-bold rounded-xl hover:bg-slate-200 transition-colors text-sm border border-transparent"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleResolve}
                                    disabled={!resolverName.trim()}
                                    className="px-6 py-2.5 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/30 disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-2 text-sm"
                                >
                                    Confirm Update <Check size={18} strokeWidth={3} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Bridge;
