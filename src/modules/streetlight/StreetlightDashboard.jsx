import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  Lightbulb,
  Activity,
  Zap,
  Power,
  Clock,
  AlertTriangle,
  ShieldCheck,
  Wifi,
  WifiOff,
  TrendingUp,
  BarChart3,
  Radio,
  PowerOff,
  ChevronRight,
  Database,
  Layers,
  Cpu
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

// Thresholds & Constants
const STALE_THRESHOLD_MS = 15000; // 15 seconds
const OVERLOAD_CURRENT_A = 5.0;

const RelativeTime = ({ timestamp }) => {
  const [secondsAgo, setSecondsAgo] = useState(0);

  useEffect(() => {
    const update = () => {
      if (!timestamp) return;
      setSecondsAgo(
        Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000),
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [timestamp]);

  if (!timestamp) return "No data";
  if (secondsAgo < 0) return "Just now";
  return `${secondsAgo}s ago`;
};

const StreetlightCard = ({ data, index, onToggle }) => {
  const isStale =
    !data.timestamp ||
    Date.now() - new Date(data.timestamp).getTime() > STALE_THRESHOLD_MS;
  const isOverload = data.current > OVERLOAD_CURRENT_A;
  const isRelayOn = data.relayState === true;
  const backendStatus = data.status || "Unknown";

  const statusConfig = isStale
    ? {
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
      label: "Node Offline",
      icon: <WifiOff size={14} />,
    }
    : backendStatus.includes("OVERCURRENT")
      ? {
        color: "text-red-500",
        bg: "bg-red-500/10",
        border: "border-red-500/30",
        label: "Hardware Fault",
        icon: <AlertTriangle size={14} />,
      }
      : backendStatus.includes("FAULTY")
        ? {
          color: "text-amber-500",
          bg: "bg-amber-500/10",
          border: "border-amber-500/30",
          label: "Maintenance Req.",
          icon: <AlertTriangle size={14} />,
        }
        : isRelayOn
          ? {
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            border: "border-emerald-500/20",
            label: "Synchronized",
            icon: <Wifi size={14} />,
          }
          : {
            color: "text-slate-500",
            bg: "bg-slate-100",
            border: "border-slate-200",
            label: "Standby Mode",
            icon: <Radio size={14} />,
          };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className={`relative group bg-white/80 backdrop-blur-3xl border border-white/50 rounded-[3rem] p-8 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col min-h-[440px]`}
    >
      {/* Dynamic Glow Effect */}
      {isRelayOn && !isStale && (
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-400/20 rounded-full blur-[80px] -z-10 group-hover:scale-125 transition-transform duration-1000" />
      )}

      <div className="relative z-10 flex-1">
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-2xl border border-white flex items-center justify-center transition-all duration-500 shadow-inner ${
                    isRelayOn && !isStale ? "bg-amber-400 text-white shadow-amber-500/20" : "bg-slate-50 text-slate-400"
                }`}
              >
                <Lightbulb
                  size={28}
                  strokeWidth={2.5}
                  className={isRelayOn && !isStale ? "drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]" : ""}
                />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic">
                  Node <span className="text-blue-600">#{index + 1}</span>
                </h3>
                <span className="text-slate-400 font-black text-[9px] tracking-[0.2em] uppercase">
                  {data.streetlightId}
                </span>
              </div>
            </div>

            <div
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase border ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border}`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${statusConfig.color.replace('text', 'bg')} animate-pulse`} />
              {statusConfig.label}
            </div>
          </div>

          {/* Telemetry Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <BentoMetrics label="Voltage" value={data.voltage?.toFixed(1) || "0.0"} unit="V" icon={Zap} />
            <BentoMetrics 
                label="Current" 
                value={data.current?.toFixed(2) || "0.00"} 
                unit="A" 
                icon={Activity} 
                alert={isOverload}
            />
            
            <div className="col-span-2 bg-slate-50/50 border border-slate-100 rounded-[1.5rem] p-4 flex items-center justify-between group-hover:bg-white transition-colors">
                <div>
                   <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Energy Utilization</div>
                   <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-slate-900 tracking-tighter italic">{(data.power || 0).toFixed(1)}</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Watts</span>
                   </div>
                </div>
                <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center transition-all duration-500 ${
                    isRelayOn ? 'border-emerald-500/20' : 'border-slate-100'
                }`}>
                    <div className={`w-3 h-3 rounded-full ${isRelayOn ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-slate-200'}`} />
                </div>
            </div>
          </div>
      </div>

      {/* Control Actions */}
      <div className="relative z-10 pt-6 border-t border-slate-50">
        <div className="grid grid-cols-2 gap-4 mb-6">
            <ControlButton 
                active={isRelayOn && !isStale}
                onClick={() => onToggle(index + 1, "on")}
                label="Power On"
                color="emerald"
                icon={Power}
            />
            <ControlButton 
                active={!isRelayOn && !isStale}
                onClick={() => onToggle(index + 1, "off")}
                label="Deactivate"
                color="rose"
                icon={PowerOff}
            />
        </div>

        <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2 text-[9px] text-slate-400 font-black uppercase tracking-widest italic">
              <Clock size={12} strokeWidth={2.5} />
              <RelativeTime timestamp={data.timestamp} />
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`text-[8px] font-black uppercase tracking-widest ${isStale ? "text-rose-500" : "text-emerald-500"}`}>
                {isStale ? "Protocol Stale" : "Live Link Active"}
              </span>
            </div>
        </div>
      </div>
    </motion.div>
  );
};

const BentoMetrics = ({ label, value, unit, icon: Icon, alert }) => (
    <div className={`bg-slate-50/50 border rounded-2xl p-4 transition-all group-hover:bg-white ${
        alert ? 'border-rose-200 bg-rose-50/50' : 'border-slate-100'
    }`}>
        <div className="flex items-center gap-2 text-slate-400 mb-2">
            <Icon size={12} />
            <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
        </div>
        <div className="flex items-baseline gap-1.5">
            <span className={`text-xl font-black italic tracking-tighter ${alert ? 'text-rose-600' : 'text-slate-900'}`}>{value}</span>
            <span className="text-[9px] font-black text-slate-400 uppercase">{unit}</span>
        </div>
    </div>
);

const ControlButton = ({ active, onClick, label, color, icon: Icon }) => {
    const activeStyles = {
        emerald: 'bg-emerald-50/50 text-emerald-400 border-emerald-100 cursor-not-allowed',
        rose: 'bg-rose-50/50 text-rose-400 border-rose-100 cursor-not-allowed'
    };
    const hoverStyles = {
        emerald: 'bg-slate-900 text-white hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/20',
        rose: 'bg-slate-900 text-white hover:bg-rose-600 hover:shadow-lg hover:shadow-rose-500/20'
    };
    
    return (
        <button
          onClick={onClick}
          disabled={active}
          className={`flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[9px] font-black uppercase tracking-widest border transition-all ${
              active ? activeStyles[color] : hoverStyles[color]
          }`}
        >
          <Icon size={14} strokeWidth={2.5} />
          {label}
        </button>
    );
};

const BentoStat = ({ label, value, unit, icon: Icon, color, description }) => {
    const variants = {
        blue: 'text-blue-600 bg-blue-50 border-blue-100',
        amber: 'text-amber-600 bg-amber-50 border-amber-100',
        emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100',
        rose: 'text-rose-600 bg-rose-50 border-rose-100'
    };
    return (
        <div className="bg-white/80 backdrop-blur-3xl border border-white/50 rounded-[3rem] p-8 shadow-sm group hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between mb-6">
                <div className={`p-3 rounded-2xl border ${variants[color]}`}>
                    <Icon size={20} strokeWidth={2.5} />
                </div>
                <TrendingUp size={16} className="text-slate-200" />
            </div>
            <div className="flex items-baseline gap-2 mb-2">
                <div className="text-4xl font-black text-slate-900 tracking-tighter">{value}</div>
                {unit && <span className="text-sm font-black text-slate-400 uppercase">{unit}</span>}
            </div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</div>
            <p className="text-[10px] font-bold text-slate-300 italic">{description}</p>
        </div>
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
    })),
  );

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/latest");
      if (Array.isArray(response.data)) setStreetlights(response.data);
    } catch (e) {
      console.error("Link to streetlights not active");
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (streetlights.length > 0) {
      const dataMap = new Map(
        streetlights.map((item) => [item.streetlightId, item]),
      );
      setDisplayData((prev) =>
        prev.map((item) => dataMap.get(item.streetlightId) || item),
      );
    }
  }, [streetlights]);

  const handleToggle = async (channel, state) => {
    const toastId = toast.loading(
      `Turning ${state.toUpperCase()} Streetlight ${channel}...`,
    );
    try {
      await axios.post("http://localhost:5001/api/toggle-relay", {
        id: channel,
        state,
      });
      toast.success(`Streetlight ${channel} turned ${state.toUpperCase()}`, {
        id: toastId,
      });
      fetchData();
    } catch (error) {
      console.error(error);
      const errorMsg =
        error.response?.data?.message ||
        `Failed to control Streetlight ${channel}`;
      toast.error(errorMsg, { id: toastId });
    }
  };

  const stats = useMemo(() => {
    const total = displayData.length;
    const now = Date.now();
    const online = displayData.filter(
      (d) =>
        d.timestamp &&
        now - new Date(d.timestamp).getTime() < STALE_THRESHOLD_MS,
    ).length;
    const faulty = displayData.filter(
      (d) => d.status && d.status.includes("FAULTY"),
    ).length;
    const power = displayData.reduce((acc, curr) => acc + (curr.power || 0), 0);
    const health =
      online === total ? "OPTIMAL" : online > 0 ? "WARNING" : "CRITICAL";
    return { total, online, offline: total - online, faulty, power, health };
  }, [displayData]);

  return (
    <div className="w-full h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1600px] mx-auto pt-16 pb-24 px-4 md:px-0">
        {!hideLayout && (
            <div className="mb-14 px-2 flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                   <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-amber-500 rounded-2xl shadow-lg shadow-amber-500/25 text-white">
                        <Lightbulb size={24} strokeWidth={2.5} />
                      </div>
                      <h1 className="text-5xl font-black text-slate-900 tracking-tighter capitalize underline decoration-amber-500/10 underline-offset-8">Smart <span className="text-amber-500 italic">Lighting</span></h1>
                   </div>
                   <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] ml-1 leading-relaxed max-w-lg">Neural Grid Telemetry & Remote Luminary Interface</p>
                </div>

                <div className="flex items-center gap-6 bg-white/80 backdrop-blur-3xl px-6 py-4 rounded-[2rem] border border-white/50 shadow-xl shadow-slate-200/50">
                    <div className="flex items-center gap-3">
                        <div className={`w-2.5 h-2.5 rounded-full shadow-lg animate-pulse ${stats.health === "OPTIMAL" ? "bg-emerald-500 shadow-emerald-500/40" : "bg-amber-500 shadow-amber-500/40"}`} />
                        <span className={`text-[10px] font-black uppercase tracking-widest italic ${stats.health === "OPTIMAL" ? "text-emerald-500" : "text-amber-500"}`}>System {stats.health}</span>
                    </div>
                    <div className="w-px h-6 bg-slate-200" />
                    <div className="flex items-center gap-3">
                        <ShieldCheck size={16} className={stats.health === "OPTIMAL" ? "text-emerald-500" : "text-amber-500"} />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Grid Protection Active</span>
                    </div>
                </div>
            </div>
        )}

        {/* Global Bento Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 px-2">
          <BentoStat
            label="Grid Nodes"
            value={stats.total}
            icon={Layers}
            color="blue"
            description="Active luminary hardware"
          />
          <BentoStat
            label="Telemetry Latency"
            value={stats.online}
            icon={Cpu}
            color="emerald"
            description="Synchronized edge clients"
          />
          <BentoStat
            label="Grid Anomalies"
            value={stats.faulty}
            icon={AlertTriangle}
            color="rose"
            description="Critical hardware repairs"
          />
          <BentoStat
            label="Total Power Draw"
            value={stats.power.toFixed(1)}
            unit="W"
            icon={Zap}
            color="amber"
            description="Live energy consumption"
          />
        </div>

        <div className="flex items-center justify-between mb-8 px-4 border-b border-slate-100 pb-4">
          <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
            <Radio size={14} className="text-blue-500" /> Neural Node Deployment
          </h2>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-100 rounded-full">
            <Database size={10} className="text-slate-400" />
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{displayData.length} active sockets</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-2">
          <AnimatePresence mode="popLayout">
            {displayData.map((data, index) => (
              <StreetlightCard
                key={data.streetlightId}
                data={data}
                index={index}
                onToggle={handleToggle}
              />
            ))}
          </AnimatePresence>
        </div>
    </div>
  );
};

export default StreetlightDashboard;
