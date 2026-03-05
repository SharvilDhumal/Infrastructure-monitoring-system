import React, { useState, useMemo } from "react";
import { Check, X, MapPin, AlertTriangle, Clock, User, Calendar, Menu, Info } from "lucide-react";

const Bridge = () => {
    const [activeTab, setActiveTab] = useState("Overview");
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showResolveModal, setShowResolveModal] = useState(false);
    const [resolverName, setResolverName] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // State Management for Bridge-Specific Issues with Photos
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

    const sidebarItems = ["Overview", "Detected Issues", "Resolved Issues"];

    // Dynamic Statistics
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
            case "High": return "bg-red-50 text-red-600 border-red-100";
            case "Medium": return "bg-orange-50 text-orange-600 border-orange-100";
            case "Low": return "bg-green-50 text-green-600 border-green-100";
            default: return "bg-gray-50 text-gray-600 border-gray-100";
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case "Overview":
                return (
                    <>
                        <header className="mb-6 md:mb-10">
                            <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">Overview</h1>
                            <p className="text-gray-500 text-xs md:text-sm italic">Status summary of bridge structural health and intervention metrics.</p>
                        </header>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12 font-bold">
                            {[
                                { label: "TOTAL ISSUES", value: stats.total, color: "text-gray-900" },
                                { label: "RESOLVED", value: stats.resolved, color: "text-green-600" },
                                { label: "DETECTED", value: stats.detected, color: "text-red-600" },
                                { label: "RESOLUTION RATE", value: stats.rate, color: "text-blue-600" },
                            ].map((card, idx) => (
                                <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                                    <p className="text-[10px] font-bold text-gray-400 tracking-wider mb-2 uppercase">{card.label}</p>
                                    <h3 className={`text-3xl md:text-4xl font-extrabold ${card.color}`}>{card.value}</h3>
                                </div>
                            ))}
                        </div>

                        <section>
                            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6 uppercase tracking-tight">Severity Breakdown</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                                {[
                                    { label: "High", count: detectedIssues.filter(i => i.severity === "High").length, subtitle: "NEEDS IMMEDIATE ACTION", bgColor: "bg-red-50", textColor: "text-red-600" },
                                    { label: "Medium", count: detectedIssues.filter(i => i.severity === "Medium").length, subtitle: "PLAN INTERVENTION", bgColor: "bg-orange-50", textColor: "text-orange-600" },
                                    { label: "Low", count: detectedIssues.filter(i => i.severity === "Low").length, subtitle: "ROUTINE MONITORING", bgColor: "bg-green-50", textColor: "text-green-600" },
                                ].map((item, idx) => (
                                    <div key={idx} className={`${item.bgColor} p-6 md:p-8 rounded-2xl shadow-sm flex flex-col items-start`}>
                                        <h3 className={`text-base md:text-lg font-bold ${item.textColor} mb-1`}>{item.label}</h3>
                                        <p className="text-4xl md:text-5xl font-black text-gray-900 mb-3">{item.count}</p>
                                        <p className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mt-auto">{item.subtitle}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </>
                );

            case "Detected Issues":
                return (
                    <>
                        <header className="mb-6 md:mb-10">
                            <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">Detected Issues</h1>
                            <p className="text-gray-500 text-xs md:text-sm">Real-time analysis of structural defects and corrosion detection.</p>
                        </header>
                        <div className="flex flex-col gap-4">
                            {detectedIssues.length === 0 ? (
                                <div className="bg-white p-12 rounded-2xl text-center border border-dashed border-gray-300">
                                    <p className="text-gray-400 font-bold">All parameters within safety thresholds.</p>
                                </div>
                            ) : (
                                detectedIssues.map((issue) => (
                                    <div
                                        key={issue.id}
                                        onClick={() => { setSelectedIssue(issue); setShowDetailModal(true); }}
                                        className="w-full bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-4 md:gap-6 cursor-pointer hover:shadow-md transition-all group"
                                    >
                                        <div className="w-full md:w-24 h-48 md:h-24 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 shrink-0">
                                            <img src={issue.image} alt={issue.type} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        </div>
                                        <div className="flex-1 min-w-0 text-center md:text-left">
                                            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 mb-2">
                                                <h3 className="text-lg md:text-xl font-bold text-gray-900 truncate tracking-tight">{issue.type}</h3>
                                                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-lg uppercase border shrink-0 ${getSeverityStyles(issue.severity)}`}>
                                                    {issue.severity}
                                                </span>
                                            </div>
                                            <div className="flex flex-col md:flex-row flex-wrap justify-center md:justify-start gap-x-6 gap-y-1 text-xs md:text-sm text-gray-500 font-medium font-bold">
                                                <span className="flex items-center justify-center md:justify-start gap-1.5"><MapPin size={16} className="text-blue-500/80" /> {issue.location}</span>
                                                <span className="flex items-center justify-center md:justify-start gap-1.5"><Clock size={16} className="text-blue-500/80" /> Detected: {issue.detectedAt}</span>
                                            </div>
                                        </div>
                                        <div className="w-full md:w-auto mt-2 md:mt-0">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedIssue(issue);
                                                    setShowResolveModal(true);
                                                }}
                                                className="w-full md:w-12 h-12 bg-green-50 text-green-600 rounded-xl md:rounded-full flex items-center justify-center hover:bg-green-600 hover:text-white transition-all border border-green-100 shadow-sm py-3 md:py-0"
                                                title="Resolve"
                                            >
                                                <span className="md:hidden text-xs font-black uppercase tracking-widest mr-2">Mark Resolved</span>
                                                <Check size={26} strokeWidth={3} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </>
                );

            case "Resolved Issues":
                return (
                    <>
                        <header className="mb-6 md:mb-10">
                            <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">Resolved Issues</h1>
                            <p className="text-gray-500 text-sm">Archived logs of completed structural maintenance.</p>
                        </header>
                        <div className="flex flex-col gap-4">
                            {resolvedIssues.length === 0 ? (
                                <div className="bg-white p-12 rounded-2xl text-center border border-dashed border-gray-300">
                                    <p className="text-gray-400 font-bold">Archive currently empty.</p>
                                </div>
                            ) : (
                                resolvedIssues.map((issue) => (
                                    <div
                                        key={issue.id}
                                        className="w-full bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-4 md:gap-6 opacity-80"
                                    >
                                        <div className="w-full md:w-24 h-48 md:h-24 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 shrink-0 grayscale">
                                            <img src={issue.image} alt={issue.type} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0 text-center md:text-left">
                                            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 mb-2">
                                                <h3 className="text-lg md:text-xl font-bold text-gray-400 line-through truncate">{issue.type}</h3>
                                                <span className="px-2 py-0.5 text-[10px] font-bold rounded uppercase bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
                                                    RESOLVED
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs md:text-sm text-gray-500 font-medium font-bold">
                                                <span className="flex items-center justify-center md:justify-start gap-1.5"><MapPin size={16} /> {issue.location}</span>
                                                <span className="flex items-center justify-center md:justify-start gap-1.5"><User size={16} /> By: {issue.resolvedBy}</span>
                                                <span className="flex items-center justify-center md:justify-start gap-1.5 font-bold"><Clock size={16} /> Detected: {issue.detectedAt}</span>
                                                <span className="flex items-center justify-center md:justify-start gap-1.5 text-green-600 font-bold"><Check size={16} /> Resolved: {issue.resolvedAt}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </>
                );

            default:
                return null;
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans overflow-hidden relative">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar - Left Fixed Panel */}
            <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gray-100 border-r border-gray-200 flex flex-col h-full shrink-0 transition-transform duration-300 lg:relative lg:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
                <div className="p-8">
                    <div className="flex items-center justify-between lg:block mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/30 transform -rotate-3">
                                IA
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-gray-900 leading-tight tracking-tight">InfravisionAI</h2>
                                <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">BRIDGEDASHBOARD</p>
                            </div>
                        </div>
                        <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-500 p-2">
                            <X size={24} />
                        </button>
                    </div>

                    <nav className="space-y-1.5">
                        {sidebarItems.map((item) => (
                            <button
                                key={item}
                                onClick={() => { setActiveTab(item); setIsSidebarOpen(false); }}
                                className={`w-full text-left px-4 py-3.5 rounded-xl flex items-center transition-all duration-300 font-bold ${activeTab === item
                                    ? "bg-white border-l-4 border-blue-600 text-gray-900 shadow-sm"
                                    : "text-gray-500 hover:bg-gray-200"
                                    }`}
                            >
                                <span className="text-sm tracking-tight">{item}</span>
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="mt-auto p-6 border-t border-gray-200 bg-gray-50/50">
                    <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">System Status</p>
                    <div className="flex items-center gap-2 mt-2 font-bold">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-xs font-bold text-gray-600">Active Monitoring</span>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 bg-gray-50 relative">
                {/* Mobile Header */}
                <div className="lg:hidden flex items-center justify-between mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-sm">IA</div>
                        <span className="font-black text-gray-900 text-sm tracking-tight">InfravisionAI</span>
                    </div>
                    <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                        <Menu size={24} />
                    </button>
                </div>

                {renderContent()}
            </main>

            {/* DETAIL MODAL */}
            {showDetailModal && selectedIssue && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-md">
                    <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] w-full max-w-lg max-h-[95vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-300 border border-white/20">
                        <div className="relative h-48 sm:h-64 md:h-72 bg-gray-200 overflow-hidden shrink-0">
                            <img src={selectedIssue.image} alt={selectedIssue.type} className="w-full h-full object-cover" />
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="absolute top-4 right-4 w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center backdrop-blur-xl transition-all shadow-lg"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 sm:p-8 md:p-10">
                            <div className="flex flex-col sm:flex-row items-center gap-3 mb-4 text-center sm:text-left">
                                <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">{selectedIssue.type}</h2>
                                <span className={`px-2.5 py-1 text-[10px] font-black rounded-lg uppercase border-2 shadow-sm ${getSeverityStyles(selectedIssue.severity)}`}>
                                    {selectedIssue.severity}
                                </span>
                            </div>
                            <p className="text-gray-500 mb-6 md:mb-10 leading-relaxed text-xs sm:text-sm font-medium text-center sm:text-left">{selectedIssue.description}</p>

                            <div className="grid grid-cols-1 gap-3 mb-8 md:mb-10 font-bold">
                                <div className="flex items-center gap-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50 group hover:border-blue-300 transition-colors">
                                    <MapPin size={22} className="text-blue-600 shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-0.5">Location</p>
                                        <p className="text-xs sm:text-sm text-gray-900 font-bold truncate">{selectedIssue.location}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50 group hover:border-blue-300 transition-colors">
                                    <Clock size={22} className="text-blue-600 shrink-0" />
                                    <div>
                                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-0.5">Detection Time</p>
                                        <p className="text-xs sm:text-sm text-gray-900 font-bold">{selectedIssue.detectedAt}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={() => setShowDetailModal(false)}
                                    className="w-full sm:flex-1 bg-gray-100 text-gray-600 py-4 rounded-2xl font-black hover:bg-gray-200 transition-all text-xs uppercase tracking-widest"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => { setShowDetailModal(false); setShowResolveModal(true); }}
                                    className="w-full sm:flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-blue-700 shadow-xl shadow-blue-500/30 transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2 group"
                                >
                                    Resolve <Check size={18} strokeWidth={3} className="group-hover:scale-125 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* RESOLVE MODAL */}
            {showResolveModal && selectedIssue && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-md">
                    <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] w-full max-w-md shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-300 overflow-hidden overflow-y-auto max-h-[95vh] font-bold">
                        <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 px-6 sm:px-8">
                            <h3 className="text-lg md:text-xl font-black text-gray-900 flex items-center gap-3 tracking-tight"><Check size={24} className="text-green-600" /> Resolve Issue</h3>
                            <button onClick={() => setShowResolveModal(false)} className="text-gray-400 hover:text-gray-900 transition-colors bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-sm"><X size={20} /></button>
                        </div>

                        <div className="p-6 sm:p-8 md:p-10 font-bold">
                            <div className="mb-6 md:mb-8 font-bold">
                                <div className="flex items-center gap-4 md:gap-5 p-4 md:p-5 bg-gray-50 rounded-2xl border border-gray-100 shadow-inner">
                                    <img src={selectedIssue.image} alt={selectedIssue.type} className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover shrink-0 shadow-sm" />
                                    <div className="min-w-0 font-bold">
                                        <p className="text-sm font-black text-gray-900 truncate tracking-tight">{selectedIssue.type}</p>
                                        <p className="text-xs text-gray-500 truncate font-semibold font-bold">{selectedIssue.location}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6 md:mb-8 font-bold">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Resolver Name</label>
                                <div className="relative font-bold">
                                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-500" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Enter full name"
                                        autoFocus
                                        value={resolverName}
                                        onChange={(e) => setResolverName(e.target.value)}
                                        className="w-full pl-14 pr-6 py-4 bg-white border-2 border-gray-100 rounded-2xl text-sm focus:outline-none focus:border-blue-500 transition-all font-bold placeholder-gray-300 shadow-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 mb-8 md:mb-10 font-bold">
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Date</label>
                                    <div className="flex items-center gap-2 text-xs font-black text-gray-900">
                                        <Calendar size={16} className="text-blue-500" /> {new Date().toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 font-bold">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Time</label>
                                    <div className="flex items-center gap-2 text-xs font-black text-gray-900">
                                        <Clock size={16} className="text-blue-500" /> {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 font-bold">
                                <button
                                    onClick={() => setShowResolveModal(false)}
                                    className="w-full sm:flex-1 px-4 py-4 border-2 border-gray-100 text-gray-500 rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleResolve}
                                    disabled={!resolverName.trim()}
                                    className="w-full sm:flex-1 px-4 py-4 bg-green-600 text-white rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest hover:bg-green-700 transition-all shadow-lg shadow-green-500/30 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    Confirm <Check size={18} strokeWidth={3} />
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
