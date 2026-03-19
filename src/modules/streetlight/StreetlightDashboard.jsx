import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  Lightbulb, Activity, Zap, Clock, AlertTriangle, ShieldCheck,
  Wifi, WifiOff, TrendingUp, TrendingDown, Layers, Cpu, User, MapPin, 
  Signal, ToggleRight, ToggleLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const STALE_THRESHOLD_MS = 15000;
const OVERLOAD_CURRENT_A = 5.0;

// Helper components

const SegmentedControl = ({ activeView, setActiveView }) => (
  <div className="flex bg-[#F1F5F9] p-1 rounded-xl w-fit border border-[#E2E8F0]">
    <button
      onClick={() => setActiveView('telemetry')}
      className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
        activeView === 'telemetry'
          ? 'bg-white shadow-sm text-[#0F172A]'
          : 'text-[#475569] hover:text-[#0F172A] hover:bg-black/5'
      }`}
    >
      <Activity size={16} /> Live Telemetry
    </button>
    <button
      onClick={() => setActiveView('reports')}
      className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
        activeView === 'reports'
          ? 'bg-white shadow-sm text-[#0F172A]'
          : 'text-[#475569] hover:text-[#0F172A] hover:bg-black/5'
      }`}
    >
      <User size={16} /> User Reports
    </button>
  </div>
);

const KPICard = ({ title, value, unit, icon: Icon, colorClass, borderClass, trendLabel, trendUp = true }) => (
  <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-5 relative overflow-hidden group hover:-translate-y-1 hover:shadow-md transition-all duration-300">
    {/* Subtle top border accent */}
    <div className={`absolute top-0 left-0 w-full h-1 ${borderClass}`}></div>
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2 text-[#475569]">
        <Icon size={18} className={colorClass} />
        <span className="text-sm font-semibold">{title}</span>
      </div>
      <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${trendUp ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'bg-[#EF4444]/10 text-[#EF4444]'}`}>
        {trendUp ? <TrendingUp size={12} strokeWidth={2.5} /> : <TrendingDown size={12} strokeWidth={2.5} />}
        {trendLabel}
      </div>
    </div>
    <div className="flex items-baseline gap-1">
      <span className="text-3xl font-bold text-[#0F172A]">{value}</span>
      {unit && <span className="text-sm font-medium text-[#94A3B8]">{unit}</span>}
    </div>
  </div>
);

const NodeCard = ({ data, index, onToggle }) => {
  const isStale = !data.timestamp || Date.now() - new Date(data.timestamp).getTime() > STALE_THRESHOLD_MS;
  const isOverload = data.current > OVERLOAD_CURRENT_A;
  const isRelayOn = data.relayState === true;
  const backendStatus = data.status || "Unknown";

  const statusConfig = isStale
    ? {
        color: "text-[#EF4444]",
        bg: "bg-[#EF4444]/10",
        label: "OFFLINE",
        icon: WifiOff,
      }
    : backendStatus.includes("OVERCURRENT") || backendStatus.includes("FAULTY")
    ? {
        color: "text-[#F59E0B]",
        bg: "bg-[#F59E0B]/10",
        label: "MAINTENANCE",
        icon: AlertTriangle,
      }
    : {
        color: "text-[#22C55E]",
        bg: "bg-[#22C55E]/10",
        label: "ONLINE",
        icon: Wifi,
      };

  const StatusIcon = statusConfig.icon;
  const uptime = isStale ? Math.floor(Math.random() * 20 + 70) : Math.floor(Math.random() * 5 + 95); 
  const signal = isStale ? 0 : Math.floor(Math.random() * 30 + 70);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)" }}
      className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-5 flex flex-col transition-all duration-300 relative overflow-hidden"
    >
      <div className="flex justify-between items-start border-b border-[#F1F5F9] pb-4 mb-4">
        <div>
          <h3 className="text-lg font-bold text-[#0F172A] tracking-tight">NODE #{index + 1}</h3>
          <p className="text-xs text-[#94A3B8] font-mono leading-none">{data.streetlightId}</p>
        </div>
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase ${statusConfig.bg} ${statusConfig.color} border border-current/10`}>
          <StatusIcon size={12} strokeWidth={2.5} />
          {statusConfig.label}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-[#F1F5F9] rounded-lg p-3">
          <div className="text-xs text-[#475569] font-semibold flex items-center gap-1.5 mb-1 tracking-wide">
            <Zap size={14} className="text-[#F59E0B]" /> VOLTAGE
          </div>
          <div className="text-lg font-bold text-[#0F172A]">{data.voltage?.toFixed(1) || "0.0"} <span className="text-[10px] text-[#94A3B8] font-medium uppercase">V</span></div>
        </div>
        <div className={`rounded-lg p-3 border ${isOverload ? 'bg-[#EF4444]/5 border-[#EF4444]/20' : 'bg-[#F1F5F9] border-transparent'}`}>
          <div className="text-xs text-[#475569] font-semibold flex items-center gap-1.5 mb-1 tracking-wide">
            <Activity size={14} className={isOverload ? "text-[#EF4444]" : "text-[#2563EB]"} /> CURRENT
          </div>
          <div className={`text-lg font-bold ${isOverload ? "text-[#EF4444]" : "text-[#0F172A]"}`}>
            {data.current?.toFixed(2) || "0.00"} <span className="text-[10px] text-[#94A3B8] font-medium uppercase">A</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-5 bg-[#F8FAFC] p-4 rounded-xl border border-[#F1F5F9]">
        <div>
          <div className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1 items-center gap-1 flex">
             ENERGY UTILIZATION
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-[#0F172A]">{(data.power || 0).toFixed(0)}</span>
            <span className="text-xs font-bold text-[#94A3B8]">W</span>
          </div>
        </div>
        <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
                <circle cx="24" cy="24" r="21" fill="none" stroke="#F1F5F9" strokeWidth="4" />
                <circle cx="24" cy="24" r="21" fill="none" stroke={isRelayOn && !isStale ? "#2563EB" : "#CBD5E1"} strokeWidth="4" strokeDasharray="131.95" strokeDashoffset={131.95 - (131.95 * ((Math.min((data.power || 0), 100)) / 100))} className="transition-all duration-1000 ease-in-out" strokeLinecap="round" />
            </svg>
            <div className="absolute text-[10px] font-bold text-[#0F172A]">
                {Math.min((data.power || 0), 100).toFixed(0)}%
            </div>
        </div>
      </div>

      {/* NEW RELAY STATE DESIGN */}
      <div className="flex items-center justify-between border-t border-[#F1F5F9] pt-4 mb-3">
           <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-[#475569] uppercase tracking-wider">Relay State:</span>
              <div className="flex items-center gap-1.5 bg-[#F8FAFC] px-2 py-0.5 rounded border border-[#E2E8F0]">
                  <div className={`w-1.5 h-1.5 rounded-full ${isRelayOn && !isStale ? 'bg-[#22C55E] shadow-[0_0_8px_rgba(34,197,94,0.6)]' : isStale ? 'bg-[#EF4444]' : 'bg-[#94A3B8]'}`}></div>
                  <span className={`text-[10px] font-extrabold tracking-widest uppercase ${isRelayOn && !isStale ? 'text-[#22C55E]' : isStale ? 'text-[#EF4444]' : 'text-[#94A3B8]'}`}>
                      {isRelayOn && !isStale ? 'ACTIVE' : isStale ? 'OFFLINE' : 'STANDBY'}
                  </span>
              </div>
           </div>
           
           <button 
             onClick={() => onToggle(index + 1, isRelayOn ? "off" : "on")}
             disabled={isStale}
             className={`flex items-center transition-all ${isStale ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:scale-105 active:scale-95'}`}
           >
              {isRelayOn ? (
                  <ToggleRight size={32} className="text-[#22C55E]" strokeWidth={2} />
              ) : (
                  <ToggleLeft size={32} className="text-[#CBD5E1]" strokeWidth={2} />
              )}
           </button>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4 text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider">
        <div className="flex items-center gap-1"><Signal size={10} /> {signal}% Signal</div>
        <div className="flex items-center gap-1 justify-end"><Clock size={10} /> {uptime}% Uptime</div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-auto pt-4 border-t border-[#F1F5F9]">
        <button
          onClick={() => onToggle(index + 1, "on")}
          disabled={isRelayOn || isStale}
          className="flex-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white py-2.5 rounded-lg text-xs font-bold transition-all disabled:bg-[#F1F5F9] disabled:text-[#94A3B8] disabled:cursor-not-allowed shadow-sm shadow-[#2563EB]/20 disabled:shadow-none active:scale-[0.98] uppercase tracking-widest"
        >
          Power ON
        </button>
        <button
          onClick={() => onToggle(index + 1, "off")}
          disabled={!isRelayOn || isStale}
          className="flex-1 border border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444] hover:text-white py-2.5 rounded-lg text-xs font-bold transition-all disabled:border-[#E2E8F0] disabled:text-[#94A3B8] disabled:hover:bg-transparent disabled:cursor-not-allowed active:scale-[0.98] uppercase tracking-widest"
        >
          Deactivate
        </button>
      </div>
    </motion.div>
  );
};

const StreetlightDashboard = ({ hideLayout = false }) => {
  const [streetlights, setStreetlights] = useState([]);
  const [displayData, setDisplayData] = useState(() =>
    Array.from({ length: 4 }, (_, i) => ({
      streetlightId: `SL-0${i + 1}`,
      voltage: 0,
      current: 0,
      power: 0,
      status: "OFF",
      relayState: false,
      timestamp: null,
    }))
  );
  
  const [activeView, setActiveView] = useState("telemetry");
  const [userReports, setUserReports] = useState([]);
  const [lastUpdated, setLastUpdated] = useState("Just now");
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());

  const fetchUserReports = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/issues?faultType=street-light");
      const data = await res.json();
      if (data.success) {
        setUserReports(data.issues);
      }
    } catch (error) {
      console.error("Error fetching user reports", error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/latest");
      if (Array.isArray(response.data)) {
          setStreetlights(response.data);
          setLastUpdateTime(Date.now());
      }
    } catch (e) {
      console.error("Link to streetlights not active");
    }
  };

  useEffect(() => {
    fetchData();
    fetchUserReports();
    const interval = setInterval(() => { fetchData(); fetchUserReports(); }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (streetlights.length > 0) {
      const dataMap = new Map(streetlights.map((item) => [item.streetlightId, item]));
      setDisplayData((prev) =>
        prev.map((item) => dataMap.get(item.streetlightId) || item),
      );
    }
  }, [streetlights]);

  useEffect(() => {
    const timeInterval = setInterval(() => {
        const diff = Math.floor((Date.now() - lastUpdateTime) / 1000);
        if (diff < 2) setLastUpdated("Just now");
        else setLastUpdated(`${diff}s ago`);
    }, 1000);
    return () => clearInterval(timeInterval);
  }, [lastUpdateTime]);

  const handleToggle = async (channel, state) => {
    const toastId = toast.loading(`Turning ${state.toUpperCase()} Streetlight ${channel}...`);
    try {
      await axios.post("http://localhost:5001/api/toggle-relay", { id: channel, state, });
      toast.success(`Streetlight ${channel} turned ${state.toUpperCase()}`, { id: toastId, });
      fetchData();
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || `Failed to control Streetlight ${channel}`;
      toast.error(errorMsg, { id: toastId });
    }
  };

  const stats = useMemo(() => {
    const total = displayData.length;
    const now = Date.now();
    const online = displayData.filter((d) => d.timestamp && (now - new Date(d.timestamp).getTime() < STALE_THRESHOLD_MS)).length;
    const faulty = displayData.filter((d) => d.status && d.status.includes("FAULTY")).length;
    const power = displayData.reduce((acc, curr) => acc + (curr.power || 0), 0);
    const isOptimal = online === total && faulty === 0;
    const isWarning = online > 0 && (online < total || faulty > 0);
    const health = isOptimal ? "Operational" : isWarning ? "Warning" : "Critical";
    return { total, online, offline: total - online, faulty, power, health, isOptimal, isWarning };
  }, [displayData]);

  const statusChipColors = {
      "Operational": "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20",
      "Warning": "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20",
      "Critical": "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20"
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-[#F8FAFC] flex flex-col pt-8 pb-16 px-6 lg:px-12 font-sans selection:bg-[#2563EB]/20">
        <div className="max-w-[1400px] mx-auto w-full">
            
            {/* Header section */}
            {!hideLayout && (
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-[#E2E8F0] gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white border border-[#E2E8F0] rounded-2xl shadow-sm text-[#0F172A] hidden sm:block">
                            <Lightbulb size={24} strokeWidth={2} />
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">Smart Lighting</h1>
                                <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border ${statusChipColors[stats.health]}`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${stats.isOptimal ? 'bg-[#22C55E]' : stats.isWarning ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'} animate-pulse`}></div>
                                    {stats.health}
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-xs font-semibold text-[#475569] mt-1 tracking-wide">
                                <span className="flex items-center gap-1.5"><div className="w-2 h-2 bg-[#22C55E] rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div> Live System</span>
                                <span className="text-[#CBD5E1]">|</span>
                                <span className="text-[#94A3B8]">Last updated: {lastUpdated}</span>
                            </div>
                        </div>
                    </div>
                    
                    <SegmentedControl activeView={activeView} setActiveView={setActiveView} />
                </div>
            )}

            {activeView === 'telemetry' ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-8">
                    {/* Top KPI Cards section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <KPICard 
                            title="Grid Nodes" 
                            value={stats.total} 
                            icon={Layers} 
                            colorClass="text-[#2563EB]"
                            borderClass="bg-[#2563EB]"
                            trendLabel="100% active"
                            trendUp={true}
                        />
                        <KPICard 
                            title="Telemetry Latency" 
                            value={stats.online} 
                            unit={`/ ${stats.total} Sync`}
                            icon={Cpu} 
                            colorClass="text-[#0D9488]" // teal
                            borderClass="bg-[#0D9488]"
                            trendLabel="+2ms ping"
                            trendUp={true}
                        />
                        <KPICard 
                            title="Anomalies" 
                            value={stats.faulty} 
                            icon={AlertTriangle} 
                            colorClass="text-[#EF4444]"
                            borderClass="bg-[#EF4444]"
                            trendLabel={stats.faulty > 0 ? "Requires action" : "System clear"}
                            trendUp={stats.faulty === 0}
                        />
                        <KPICard 
                            title="Power Draw" 
                            value={stats.power.toFixed(1)} 
                            unit="W"
                            icon={Zap} 
                            colorClass="text-[#F59E0B]"
                            borderClass="bg-[#F59E0B]"
                            trendLabel="Standard load"
                            trendUp={true}
                        />
                    </div>

                    {/* Nodes Grid */}
                    <div>
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-sm font-bold text-[#0F172A] flex items-center gap-2"><Layers size={16} className="text-[#2563EB]"/> LIVE NODE TELEMETRY</h2>
                            <div className="px-3 py-1 bg-white border border-[#E2E8F0] rounded text-xs font-bold uppercase tracking-widest text-[#475569] shadow-sm">
                                {displayData.length} ACTIVE SOCKETS
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                            <AnimatePresence mode="popLayout">
                                {displayData.map((data, index) => (
                                    <NodeCard key={data.streetlightId} data={data} index={index} onToggle={handleToggle} />
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            ) : (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="pt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {userReports.length === 0 ? (
                            <div className="col-span-full bg-white border border-[#E2E8F0] p-16 rounded-xl shadow-sm flex flex-col items-center justify-center text-center">
                                <div className="p-5 bg-[#F8FAFC] rounded-full mb-5 border border-[#E2E8F0]">
                                    <ShieldCheck className="text-[#2563EB]" size={48} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-xl font-bold text-[#0F172A] mb-2 tracking-tight">No Reports Found</h3>
                                <p className="text-[#475569] text-sm max-w-sm">The community has not reported any issues related to streetlights recently.</p>
                            </div>
                        ) : (
                            userReports.map((issue) => (
                                <div key={issue._id} className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col group">
                                    <div className="relative h-48 bg-[#F8FAFC] overflow-hidden">
                                        <img src={issue.imageUrl || 'https://placehold.co/600x400/f8fafc/94a3b8?text=Image+Unavailable'} alt={issue.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-[#0F172A] text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded shadow-sm border border-[#E2E8F0]">
                                            {issue.status}
                                        </div>
                                    </div>
                                    <div className="p-5 flex-1 flex flex-col">
                                        <h4 className="text-base font-bold text-[#0F172A] mb-1.5 truncate uppercase tracking-wide">{issue.title}</h4>
                                        <div className="flex items-center gap-1.5 text-xs text-[#475569] font-medium mb-3 truncate bg-[#F8FAFC] border border-[#E2E8F0] w-fit px-2 py-0.5 rounded">
                                            <MapPin size={12} className="text-[#2563EB]" />
                                            {issue.location}
                                        </div>
                                        <p className="text-sm text-[#475569] mb-4 flex-1 line-clamp-3 leading-relaxed">{issue.description}</p>
                                        <div className="text-[10px] font-bold text-[#94A3B8] border-t border-[#F1F5F9] pt-4 uppercase tracking-widest">
                                            Reported By: <span className="text-[#0F172A] ml-1">{issue.user?.name || 'Citizen'}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>
            )}
        </div>
    </div>
  );
};

export default StreetlightDashboard;
