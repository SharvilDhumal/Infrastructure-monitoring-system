import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Droplets,
  Activity,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Waves,
  User,
  MapPin
} from 'lucide-react';

const API_URL = 'http://localhost:5001/latest';

function WaterLeakage({ hideLayout = false }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState("telemetry");
  const [userReports, setUserReports] = useState([]);

  const fetchUserReports = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/issues?faultType=drainage');
      if (res.data.success) {
        setUserReports(res.data.issues);
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL);
      setData(response.data);
      setLoading(false);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      if (!data) {
        setLoading(false);
        setError('Connection to node lost.');
      }
    }
  };

  useEffect(() => {
    fetchData();
    fetchUserReports();
    const interval = setInterval(() => { fetchData(); fetchUserReports(); }, 2000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-800">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4"></div>
        <p className="font-medium animate-pulse text-slate-500 text-sm tracking-widest uppercase">Initializing Dashboard...</p>
      </div>
    );
  }

  const isLeakDetected = data?.leak === true;

  return (
    <div className={`min-h-screen transition-colors duration-700 ${isLeakDetected ? 'bg-red-50' : 'bg-slate-50'}`}>

      <div className={`relative z-10 max-w-[1400px] mx-auto ${hideLayout ? 'px-4 py-4' : 'px-6 py-8'}`}>
        {/* Header */}
        {!hideLayout && (
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 sm:mb-10 pb-4 sm:pb-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-2.5 bg-blue-600/20 rounded-xl border border-blue-500/30 shrink-0">
                <Waves size={20} className="text-blue-400 sm:w-[24px] sm:h-[24px]" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight truncate">AquaGuard <span className="text-blue-500 underline decoration-blue-500/30 underline-offset-4">IoT</span></h1>
                <p className="text-xs sm:text-sm text-slate-600 font-medium truncate">Real-time Water Monitoring System</p>
              </div>
            </div>

            <div className="flex items-center gap-4 sm:gap-6 bg-white shadow-sm px-4 py-2.5 rounded-2xl border border-slate-200 self-start w-full md:w-auto overflow-x-auto hide-scrollbar">
              <div className="flex items-center gap-2 shrink-0">
                <div className={`w-2 h-2 rounded-full ${isLeakDetected ? 'bg-red-500 animate-pulse ring-4 ring-red-500/20' : 'bg-emerald-500 ring-4 ring-emerald-500/20'}`}></div>
                <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${isLeakDetected ? 'text-red-400' : 'text-emerald-400'}`}>
                  {isLeakDetected ? 'Critical Alert' : 'System Healthy'}
                </span>
              </div>
              <div className="h-4 w-[1px] bg-white/10 shrink-0"></div>
              <div className="flex items-center gap-2 text-slate-400 shrink-0 pr-2">
                <Clock size={14} />
                <span className="text-[10px] sm:text-xs font-medium">{data?.time || '--:--:--'}</span>
              </div>
            </div>
          </header>
        )}

        {/* Leak Alert Banner */}
        {isLeakDetected && (
          <div className="mb-6 sm:mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="bg-red-500/10 border border-red-500/50 backdrop-blur-xl p-4 sm:p-5 rounded-[1.5rem] sm:rounded-3xl flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 shadow-2xl shadow-red-950/20">
              <div className="p-3 sm:p-4 bg-red-500 rounded-2xl animate-pulse ring-8 ring-red-500/20 self-start sm:self-auto shrink-0">
                <AlertTriangle size={24} className="text-white sm:w-[32px] sm:h-[32px]" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg sm:text-xl font-bold text-red-500 mb-1 leading-none">Emergency Leak Detected!</h2>
                <p className="text-red-400/80 font-medium text-xs sm:text-sm">Hardware sensors triggered a positive leakage status. Immediate inspection required.</p>
              </div>
              <button className="touch-target w-full sm:w-auto bg-red-500 text-white px-6 py-3 sm:py-2.5 rounded-xl font-bold text-sm hover:bg-red-600 transition-colors shadow-lg shadow-red-500/25">
                Mute Alert
              </button>
            </div>
          </div>
        )}

        <div className="flex overflow-x-auto hide-scrollbar bg-white/60 backdrop-blur-md p-1.5 rounded-2xl w-full mb-6 sm:mb-8 mx-0 border border-slate-200 shadow-sm snap-x">
            <button onClick={() => setActiveView('telemetry')} className={`touch-target shrink-0 snap-start px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${activeView === 'telemetry' ? 'bg-white shadow-sm border border-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'}`}><Activity size={14} className="sm:w-[16px] sm:h-[16px]" /> Live Telemetry</button>
            <button onClick={() => setActiveView('reports')} className={`touch-target shrink-0 snap-start px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${activeView === 'reports' ? 'bg-white shadow-sm border border-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'}`}><User size={14} className="sm:w-[16px] sm:h-[16px]" /> User Reports</button>
        </div>

        {activeView === 'telemetry' ? (
          <>
            {/* Dashboard Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5 mb-8 w-full">
              <StatCard
                title="Supply Line A"
                value={data?.flow1 || 0}
                unit="L/min"
                icon={<Activity className="text-blue-400" size={20} />}
                color="blue"
                description="Main pump int"
              />
              <StatCard
                title="Outlet Line B"
                value={data?.flow2 || 0}
                unit="L/min"
                icon={<Activity className="text-cyan-400" size={20} />} // Changed Zap to Activity for consistency with imports
                color="cyan"
                description="Garden irrig"
              />
              <StatCard
                title="Moisture"
                value={data?.moisture || 0}
                unit="/ 1024"
                icon={<Droplets className="text-indigo-400" size={20} />}
                color="indigo"
                description="Kitchen sensor"
              />
              <StatCard
                title="Sync Status"
                value="Stable"
                unit="2s poll"
                icon={<Activity className="text-emerald-400" size={20} />}
                color="emerald"
                description="Conn health"
              />
              <div className="col-span-2 md:col-span-1">
                <StatusCard
                    title="System State"
                    isLeak={isLeakDetected}
                    description="Hardware status"
                />
              </div>
            </div>

            {/* Analytics Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white border border-slate-200 p-6 rounded-[2.5rem] shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Activity size={20} className="text-blue-500" />
                    Live Flow Analytics
                  </h3>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20 text-[10px] font-bold text-blue-400 uppercase">Input</div>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-cyan-500/10 rounded-full border border-cyan-500/20 text-[10px] font-bold text-cyan-400 uppercase">Output</div>
                  </div>
                </div>

                <div className="h-[240px] w-full flex items-end gap-1 px-2">
                  {[40, 65, 45, 80, 55, 90, 40, 60, 35, 75, 45, 85, 50, 70, 40].map((h, i) => (
                    <div key={i} className="flex-1 group relative flex flex-col items-center gap-2 h-full justify-end">
                      <div
                        style={{ height: `${h}%` }}
                        className={`w-full rounded-t-lg transition-all duration-1000 bg-gradient-to-t from-blue-600/40 to-blue-400/60 group-hover:from-blue-500 group-hover:to-cyan-400`}
                      ></div>
                      <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl -m-2"></div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-6 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  <span>-30m</span>
                  <span>-20m</span>
                  <span>-15m</span>
                  <span>-10m</span>
                  <span>-5m</span>
                  <span>Now</span>
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm flex flex-col justify-center items-center text-center">
                <div className={`mb-6 p-6 rounded-full ${isLeakDetected ? 'bg-red-500/10 ring-4 ring-red-500/5' : 'bg-blue-500/10 ring-4 ring-blue-500/5'}`}>
                  <CheckCircle2 size={48} className={isLeakDetected ? 'text-red-500' : 'text-blue-500'} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Automated Shutoff</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-8 px-4">
                  System is configured to auto-shutoff main valve if flow &gt; 100L or moisture thresholds are breached.
                </p>
                <button className="w-full py-4 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-2xl text-slate-700 font-bold transition-all hover:scale-[1.02] active:scale-[0.98]">
                  Reset Alarm Config
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="pb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {userReports.length === 0 ? (
                      <div className="col-span-full bg-white border border-slate-200 p-12 rounded-[2.5rem] shadow-sm flex flex-col items-center justify-center text-center">
                          <div className="p-4 bg-blue-500/10 rounded-full mb-4 ring-8 ring-blue-500/5">
                              <User className="text-blue-500" size={48} />
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 mb-2">No Reports</h3>
                          <p className="text-slate-500 font-medium tracking-wide">No citizen reports for drainage/leakage yet.</p>
                      </div>
                  ) : (
                      userReports.map((issue) => (
                          <div key={issue._id} className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden flex flex-col p-1.5 transition-opacity">
                              <div className="relative h-40 bg-slate-100 rounded-[1.5rem] overflow-hidden">
                                  <img src={issue.imageUrl || 'https://placehold.co/600x400/f1f5f9/94a3b8?text=Image+Unavailable'} alt={issue.title} className="w-full h-full object-cover" />
                                  <div className="absolute top-3 left-3 bg-blue-500/90 backdrop-blur text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center shadow-lg">
                                      {issue.status}
                                  </div>
                              </div>
                              <div className="p-4 flex-1 flex flex-col bg-slate-50/50 rounded-b-[1.5rem]">
                                  <h4 className="font-bold text-slate-900 text-lg mb-2 truncate uppercase italic">{issue.title}</h4>
                                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-2 truncate">
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
        )}

        {!hideLayout && (
          <footer className="mt-12 text-center text-[11px] font-bold uppercase tracking-[0.2em] text-slate-600">
            Powered by IoT Grid Core v2.4.0 • Encrypted Signal Link
          </footer>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, unit, icon, description, color }) {
  const colorMap = {
    blue: 'from-blue-500/10 to-transparent border-blue-500/20',
    cyan: 'from-cyan-500/10 to-transparent border-cyan-500/20',
    indigo: 'from-indigo-500/10 to-transparent border-indigo-500/20',
    emerald: 'from-emerald-500/10 to-transparent border-emerald-500/20',
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
        <span className="text-xs font-bold text-slate-500 uppercase">{unit}</span>
      </div>
      <p className="text-[10px] text-slate-500 font-medium">{description}</p>

      <div className={`absolute bottom-0 left-0 right-0 h-1 rounded-full bg-gradient-to-r ${colorMap[color] || colorMap.blue}`}></div>
    </div>
  );
}

function StatusCard({ title, isLeak, description }) {
  return (
    <div className={`group relative overflow-hidden p-5 rounded-[2rem] border transition-all hover:-translate-y-1 ${isLeak
      ? 'bg-red-50 border-red-200 shadow-lg shadow-red-100'
      : 'bg-white border-emerald-200 hover:border-emerald-300 shadow-md shadow-slate-100'
      }`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{title}</span>
        <div className={`p-2 rounded-lg border ${isLeak ? 'bg-red-500/20 border-red-500/30' : 'bg-emerald-500/20 border-emerald-500/30'}`}>
          <AlertTriangle className={isLeak ? 'text-red-400' : 'text-emerald-400'} size={20} />
        </div>
      </div>

      <div className="mb-2">
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isLeak
          ? 'bg-red-500 text-white animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]'
          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
          }`}>
          {isLeak ? 'Leakage !!' : 'All Clear'}
        </span>
      </div>
      <p className="text-[10px] text-slate-500 font-medium">{description}</p>
    </div>
  );
}

export default WaterLeakage;
