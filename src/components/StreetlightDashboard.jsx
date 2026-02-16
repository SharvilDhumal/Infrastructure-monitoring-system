import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
  Lightbulb, Activity, Zap, Power, Clock, 
  AlertTriangle, ShieldCheck, Wifi, WifiOff, 
  TrendingUp, BarChart3, Radio, PowerOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

// Thresholds & Constants
const STALE_THRESHOLD_MS = 15000; // 15 seconds
const OVERLOAD_CURRENT_A = 5.0;

/**
 * RelativeTime Component
 */
const RelativeTime = ({ timestamp }) => {
  const [secondsAgo, setSecondsAgo] = useState(0);

  useEffect(() => {
    const update = () => {
      if (!timestamp) return;
      setSecondsAgo(Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [timestamp]);

  if (!timestamp) return 'No data';
  if (secondsAgo < 0) return 'Just now';
  return `${secondsAgo}s ago`;
};

/**
 * StreetlightCard Component
 */
const StreetlightCard = ({ data, index, onToggle }) => {
  const isStale = !data.timestamp || (Date.now() - new Date(data.timestamp).getTime() > STALE_THRESHOLD_MS);
  const isOverload = data.current > OVERLOAD_CURRENT_A;
  const isRelayOn = data.relayState === true;
  
  // Logical Status from data
  // "NORMAL Operation", "⚠ STREETLIGHT FAULTY", "Relay OFF", "🚨 OVERCURRENT! Relay OFF"
  const backendStatus = data.status || "Unknown";

  // Status computation for visual identity
  const statusConfig = isStale 
    ? { color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20', label: 'OFFLINE', icon: <WifiOff size={14} /> }
    : backendStatus.includes("OVERCURRENT")
    ? { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30', label: 'FAULTY', icon: <AlertTriangle size={14} /> }
    : backendStatus.includes("FAULTY")
    ? { color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/30', label: 'CHECK LAMP', icon: <AlertTriangle size={14} /> }
    : isRelayOn
    ? { color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', label: 'ACTIVE', icon: <Wifi size={14} /> }
    : { color: 'text-slate-400', bg: 'bg-slate-700/30', border: 'border-slate-700', label: 'STANDBY', icon: <Radio size={14} /> };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className={`relative group bg-[#0f172a] border ${statusConfig.border} rounded-2xl p-5 shadow-xl transition-all duration-300`}
    >
      {/* Background Glow for Active Lights */}
      {isRelayOn && !isStale && (
        <div className="absolute inset-0 bg-emerald-500/5 blur-xl rounded-2xl -z-10 group-hover:bg-emerald-500/10 transition-colors" />
      )}

      {/* Header Info */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl transition-colors ${isRelayOn ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
            <Lightbulb size={22} className={isRelayOn && !isStale ? 'drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' : ''} />
          </div>
          <div>
            <h3 className="text-white font-semibold flex items-center gap-2 tracking-tight">
              Streetlight {index + 1}
              {isStale && <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />}
            </h3>
            <span className="text-slate-500 font-mono text-[10px] tracking-wider uppercase">{data.streetlightId}</span>
          </div>
        </div>
        
        {/* Intelligence Badge */}
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-tighter uppercase ${statusConfig.bg} ${statusConfig.color}`}>
          {statusConfig.icon}
          {statusConfig.label}
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/30 group-hover:border-slate-700/60 transition-colors">
          <div className="flex items-center gap-1.5 text-slate-500 mb-1">
            <Zap size={12} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Voltage</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-mono font-bold text-white leading-none">{(data.voltage || 0).toFixed(1)}</span>
            <span className="text-[10px] text-slate-500 font-bold uppercase">V</span>
          </div>
        </div>
        
        <div className={`p-3 rounded-xl border transition-colors ${isOverload ? 'bg-amber-500/5 border-amber-500/30' : 'bg-slate-800/40 border-slate-700/30 group-hover:border-slate-700/60'}`}>
          <div className="flex items-center gap-1.5 text-slate-500 mb-1">
            <Activity size={12} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Current</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`text-lg font-mono font-bold leading-none ${isOverload ? 'text-amber-400' : 'text-white'}`}>
              {(data.current || 0).toFixed(2)}
            </span>
            <span className="text-[10px] text-slate-500 font-bold uppercase">A</span>
          </div>
        </div>

        <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/30 col-span-2 group-hover:border-slate-700/60 transition-colors flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-slate-500 mb-1">
              <Power size={12} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Power Draw</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-mono font-bold text-white leading-none">{(data.power || 0).toFixed(1)}</span>
              <span className="text-xs text-slate-500 font-bold uppercase tracking-tight">Watts</span>
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <span className="text-[9px] text-slate-500 font-bold uppercase mb-1">Relay State</span>
            <div className={`w-8 h-4 rounded-full relative transition-colors ${isRelayOn ? 'bg-emerald-500' : 'bg-slate-700'}`}>
              <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${isRelayOn ? 'left-[1.125rem]' : 'left-0.5'}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Control Actions */}
      <div className="grid grid-cols-2 gap-3 mb-6 px-1">
        <button 
          onClick={() => onToggle(index + 1, 'on')}
          disabled={isRelayOn && !isStale}
          className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
            isRelayOn && !isStale 
              ? 'bg-emerald-500/10 text-emerald-500/50 cursor-not-allowed border border-emerald-500/10' 
              : 'bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30 active:scale-95'
          }`}
        >
          <Power size={14} />
          ON
        </button>
        <button 
          onClick={() => onToggle(index + 1, 'off')}
          disabled={!isRelayOn && !isStale}
          className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
            !isRelayOn && !isStale 
              ? 'bg-rose-500/10 text-rose-500/50 cursor-not-allowed border border-rose-500/10' 
              : 'bg-rose-600/20 text-rose-400 hover:bg-rose-600/30 border border-rose-500/30 active:scale-95'
          }`}
        >
          <PowerOff size={14} />
          OFF
        </button>
      </div>

      {/* Footer Meta */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
          <Clock size={12} className="text-slate-600" />
          <RelativeTime timestamp={data.timestamp} />
        </div>
        <div className="flex items-center gap-1">
          <div className={`w-1.5 h-1.5 rounded-full ${isStale ? 'bg-rose-500' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)] animate-pulse'}`} />
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{isStale ? 'STALE' : 'LIVE'}</span>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * SummaryMetric Card
 */
const SummaryMetric = ({ label, value, unit, icon: Icon, colorClass }) => (
  <div className="bg-[#0f172a] border border-slate-800 p-4 rounded-2xl flex items-center gap-4">
    <div className={`p-3 rounded-xl bg-slate-800/50 ${colorClass}`}>
      <Icon size={20} />
    </div>
    <div>
      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-bold text-white leading-none">{value}</span>
        {unit && <span className="text-xs text-slate-500 font-bold uppercase">{unit}</span>}
      </div>
    </div>
  </div>
);

/**
 * StreetlightDashboard Component
 */
const StreetlightDashboard = () => {
  const [streetlights, setStreetlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [displayData, setDisplayData] = useState(() => 
    Array.from({ length: 4 }, (_, i) => ({
      streetlightId: `SL-0${i + 1}`,
      voltage: 0,
      current: 0,
      power: 0,
      status: 'OFF',
      relayState: false,
      timestamp: null
    }))
  );

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/latest');
      if (Array.isArray(response.data)) setStreetlights(response.data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (streetlights.length > 0) {
      const dataMap = new Map(streetlights.map(item => [item.streetlightId, item]));
      setDisplayData(prev => prev.map(item => dataMap.get(item.streetlightId) || item));
    }
  }, [streetlights]);

  const handleToggle = async (channel, state) => {
    const toastId = toast.loading(`Turning ${state.toUpperCase()} Streetlight ${channel}...`);
    try {
      await axios.post('http://localhost:5000/api/toggle-relay', { id: channel, state });
      toast.success(`Streetlight ${channel} turned ${state.toUpperCase()}`, { id: toastId });
      // Update local state optimisticially or wait for next poll
      fetchData();
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || `Failed to control Streetlight ${channel}`;
      toast.error(errorMsg, { id: toastId });
    }
  };

  // Derived Summary Metrics
  const stats = useMemo(() => {
    const total = displayData.length;
    const now = Date.now();
    const online = displayData.filter(d => d.timestamp && (now - new Date(d.timestamp).getTime() < STALE_THRESHOLD_MS)).length;
    const faulty = displayData.filter(d => d.status && d.status.includes('FAULTY')).length;
    const power = displayData.reduce((acc, curr) => acc + (curr.power || 0), 0);
    const health = online === total ? 'OPTIMAL' : online > 0 ? 'WARNING' : 'CRITICAL';
    return { total, online, offline: total - online, faulty, power, health };
  }, [displayData]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 p-6 md:p-10 selection:bg-blue-500 selection:text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Real-time Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase italic">Control Panel</h1>
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0.6, 1] }} 
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-1.5 h-1.5 rounded-full bg-emerald-500" 
                />
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Live Monitoring</span>
              </div>
            </div>
            <p className="text-slate-500 text-sm font-medium">Smart City Infrastructure • Streetlight Telemetry Hub</p>
          </div>
          
          <div className="bg-[#0f172a] border border-slate-800 px-4 py-2 rounded-xl flex items-center gap-3">
            <ShieldCheck className={stats.health === 'OPTIMAL' ? 'text-emerald-400' : 'text-amber-400'} size={20} />
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Global Status</p>
              <p className={`text-sm font-black tracking-tight ${stats.health === 'OPTIMAL' ? 'text-emerald-400' : 'text-amber-400'}`}>{stats.health}</p>
            </div>
          </div>
        </header>

        {/* Top Summary Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <SummaryMetric label="Connected" value={stats.total} icon={BarChart3} colorClass="text-blue-400" />
          <SummaryMetric label="Operational" value={stats.online} icon={Wifi} colorClass="text-emerald-400" />
          <SummaryMetric label="Fault Detected" value={stats.faulty} icon={WifiOff} colorClass="text-rose-400" />
          <SummaryMetric label="Total Power" value={stats.power.toFixed(1)} unit="W" icon={TrendingUp} colorClass="text-amber-400" />
        </section>

        {/* Asset Grid */}
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-800">
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Active Deployment</h2>
          <span className="text-[10px] text-slate-600 font-mono italic">Showing {displayData.length} nodes</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
    </div>
  );
};

export default StreetlightDashboard;
