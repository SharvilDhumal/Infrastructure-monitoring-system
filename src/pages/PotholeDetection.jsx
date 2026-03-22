import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  CheckCircle,
  AlertTriangle,
  FileText,
  MapPin,
  Clock,
  User,
  X,
  Calendar,
  Activity,
  Zap,
  Download,
  AlertCircle,
  Maximize2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  RotateCcw
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { POTHOLE_API_URL, API_BASE_URL } from '../config/api';

const PotholeDetection = ({ hideLayout = false }) => {
  const [detections, setDetections] = useState([]);
  const [userReports, setUserReports] = useState([]);
  const [activeTab, setActiveTab] = useState('unsolved');
  const [selectedIssueId, setSelectedIssueId] = useState(null);
  const [solverName, setSolverName] = useState('');
  const [resolveTime, setResolveTime] = useState('');

  const fetchDetections = async () => {
    try {
      const response = await fetch(`${POTHOLE_API_URL}/detections/`);
      const data = await response.json();
      setDetections(data);
    } catch (error) {
      console.error("Error fetching detections:", error);
    }
  };

  const fetchUserReports = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/issues?faultType=road-damage`);
      const data = await res.json();
      if (data.success) {
        setUserReports(data.issues);
      }
    } catch (error) {
      console.error("Error fetching user reports:", error);
    }
  };

  useEffect(() => {
    fetchDetections();
    fetchUserReports();
    const interval = setInterval(() => { fetchDetections(); fetchUserReports(); }, 5000);
    return () => clearInterval(interval);
  }, []);

  const submitSolve = async () => {
    if (!solverName || !resolveTime) {
      alert("Please enter solver name and resolved time.");
      return;
    }
    try {
      await fetch(`${POTHOLE_API_URL}/solve/${selectedIssueId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ solver_name: solverName, resolved_time: resolveTime })
      });
      closeModal();
      fetchDetections();
    } catch (error) {
      console.error("Error solving issue:", error);
    }
  };

  const closeModal = () => {
    setSelectedIssueId(null);
    setSolverName('');
    setResolveTime('');
  };

  const generatePDF = () => {
    try {
      const doc = new jsPDF();
      const date = new Date().toLocaleDateString();
      doc.setFontSize(20);
      doc.text("Infravision - Pothole Detection Report", 14, 22);
      doc.setFontSize(11);
      doc.text(`Generated: ${date}`, 14, 30);
      doc.text(`Total Issues: ${detections.length}`, 14, 36);
      const tableColumn = ["ID", "Status", "Confidence", "Detected At", "Solved By", "Resolved At"];
      
      const tableRows = detections.map(ticket => [
        ticket.id,
        ticket.status.toUpperCase(),
        `${(ticket.confidence * 100).toFixed(1)}%`,
        formatDate(ticket.time),
        ticket.solver_name || "-",
        ticket.resolved_time ? ticket.resolved_time.replace('T', ' ') : "-"
      ]);
      
      autoTable(doc, { 
        head: [tableColumn], 
        body: tableRows, 
        startY: 45, 
        theme: 'grid', 
        styles: { fontSize: 8 }, 
        headStyles: { fillColor: [37, 99, 235] } 
      });
      doc.save(`Infravision_Report_${date.replace(/\//g, '-')}.pdf`);
    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert(`Failed to generate PDF: ${error.message}`);
    }
  };

  const unsolvedIssues = detections.filter(item => item.status === "unsolved");
  const solvedIssues = detections.filter(item => item.status === "solved");

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return dateStr.replace('_', ' ').replace(/(\d{4})(\d{2})(\d{2}) (\d{2})(\d{2})(\d{2})/, '$1-$2-$3 $4:$5');
  };

  return (
    <div className="w-full min-h-screen flex flex-col pt-16 pb-24 px-4 md:px-0 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Modern Header Area */}
        {!hideLayout && (
          <div className="mb-14 px-2 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                 <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/25 text-white">
                   <Zap size={24} strokeWidth={2.5} />
                 </div>
                 <h1 className="text-5xl font-black text-slate-900 tracking-tighter capitalize">Pothole <span className="text-blue-600">Detection</span></h1>
              </div>
              <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] ml-1">Real-time Road Hazard Analytics & Maintenance Lifecycle</p>
            </div>

            <div className="flex items-center gap-6 bg-white/80 backdrop-blur-3xl px-6 py-4 rounded-3xl border border-white/50 shadow-xl shadow-slate-200/50">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Core Engine Online</span>
              </div>
              <div className="w-px h-6 bg-slate-200" />
              <button 
                onClick={generatePDF}
                className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all"
              >
                <Download size={14} /> Export Protocol
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Tab Navigation */}
        <div className="flex bg-white/40 backdrop-blur-3xl p-2 rounded-[2rem] w-fit mb-12 border border-white/50 shadow-sm mx-2">
          <TabButton 
            active={activeTab === 'unsolved'} 
            onClick={() => setActiveTab('unsolved')} 
            icon={AlertCircle} 
            label="Live Alerts" 
            count={unsolvedIssues.length}
            color="rose"
          />
          <TabButton 
            active={activeTab === 'solved'} 
            onClick={() => setActiveTab('solved')} 
            icon={CheckCircle} 
            label="Resolved History" 
            color="emerald"
          />
          <TabButton 
            active={activeTab === 'report'} 
            onClick={() => setActiveTab('report')} 
            icon={FileText} 
            label="Analytic Log" 
            color="blue"
          />
          <TabButton 
            active={activeTab === 'user-reports'} 
            onClick={() => setActiveTab('user-reports')} 
            icon={User} 
            label="User Reports" 
            count={userReports.length}
            color="indigo"
          />
        </div>

        {/* Content Area */}
        <div className="px-2">
            {activeTab === 'unsolved' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {unsolvedIssues.length === 0 ? (
                  <EmptyState icon={ShieldCheck} title="Infrastructure Secure" description="No active road hazards detected across the monitored network." color="emerald" />
                ) : (
                  unsolvedIssues.map(item => (
                    <DetectionCard 
                        key={item.id} 
                        item={item} 
                        onResolve={() => setSelectedIssueId(item.id)} 
                        API_URL={POTHOLE_API_URL} 
                        formatDate={formatDate}
                    />
                  ))
                )}
              </div>
            )}

            {activeTab === 'solved' && (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {solvedIssues.length === 0 ? (
                   <EmptyState icon={RotateCcw} title="Clean History" description="Resolved incidents will appear here once maintenance is verified." color="slate" />
                ) : (
                  solvedIssues.map(item => (
                    <ResolvedCard 
                        key={item.id} 
                        item={item} 
                        API_URL={POTHOLE_API_URL} 
                        formatDate={formatDate}
                    />
                  ))
                )}
              </div>
            )}

            {activeTab === 'report' && (
               <div className="space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <BentoStat label="Total Detections" value={detections.length} icon={Activity} color="blue" description="Hazard events recorded all-time" />
                      <BentoStat label="Resolved Issues" value={solvedIssues.length} icon={CheckCircle} color="emerald" description="Verified repairs completed" />
                      <BentoStat label="Action Required" value={unsolvedIssues.length} icon={AlertTriangle} color="rose" description="Pending maintenance tickets" />
                  </div>

                  <div className="bg-white/80 backdrop-blur-3xl border border-white/50 rounded-[3rem] p-10 shadow-sm overflow-hidden">
                      <div className="flex items-center justify-between mb-10">
                          <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase flex items-center gap-3">
                              <ListFilter className="text-blue-600" size={20} /> Operational Log
                          </h3>
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tracking Infrastructure Integrity</div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-slate-100">
                              <th className="py-5 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Reference</th>
                              <th className="py-5 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                              <th className="py-5 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Confidence</th>
                              <th className="py-5 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Telemetry Time</th>
                              <th className="py-5 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Operator</th>
                            </tr>
                          </thead>
                          <tbody>
                            {detections.map((item) => (
                              <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                                <td className="py-5 px-4"><span className="font-black text-slate-800 text-sm italic">#{item.id}</span></td>
                                <td className="py-5 px-4">
                                  <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
                                    item.status === 'unsolved' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                  }`}>
                                    {item.status}
                                  </span>
                                </td>
                                <td className="py-5 px-4">
                                  <div className="flex items-center gap-2">
                                     <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-600 rounded-full transition-all duration-1000" style={{ width: `${item.confidence * 100}%` }} />
                                     </div>
                                     <span className="text-[10px] font-black text-slate-500">{(item.confidence * 100).toFixed(0)}%</span>
                                  </div>
                                </td>
                                <td className="py-5 px-4 text-[11px] font-bold text-slate-500 tracking-tight">{formatDate(item.time)}</td>
                                <td className="py-5 px-4">
                                  {item.solver_name ? (
                                    <div className="flex items-center gap-2">
                                      <div className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center text-[10px] font-black text-slate-400">{item.solver_name.charAt(0)}</div>
                                      <span className="text-[11px] font-black text-slate-700">{item.solver_name}</span>
                                    </div>
                                  ) : <span className="text-slate-200">---</span>}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                  </div>
               </div>
            )}

            {activeTab === 'user-reports' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {userReports.length === 0 ? (
                  <EmptyState icon={User} title="No User Reports" description="No road damage reported by users." color="emerald" />
                ) : (
                  userReports.map(item => (
                    <div key={item._id} className="group bg-white/80 backdrop-blur-3xl border border-white/50 rounded-[3rem] p-2 shadow-sm transition-all flex flex-col mt-4">
                        <div className="relative h-56 rounded-[2.5rem] overflow-hidden mb-6">
                            <img src={item.imageUrl || 'https://placehold.co/600x400/f1f5f9/94a3b8?text=Image+Unavailable'} alt="Report" className="w-full h-full object-cover" />
                            <div className="absolute top-4 left-4 bg-indigo-600/90 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                                {item.status}
                            </div>
                        </div>
                        <div className="px-6 pb-6 flex-1 flex flex-col">
                            <h4 className="text-xl font-bold text-slate-900 mb-2 truncate uppercase italic">{item.title}</h4>
                            <div className="text-[10px] text-slate-500 mb-4 flex items-center font-bold tracking-widest gap-2 uppercase">
                                <MapPin size={12} /> {item.location}
                            </div>
                            <p className="text-xs font-semibold text-slate-500 flex-1">{item.description}</p>
                            <div className="text-[10px] font-bold text-slate-400 mt-4 uppercase tracking-widest">
                                Reported By: {item.user?.name || 'Citizen'}
                            </div>
                        </div>
                    </div>
                  ))
                )}
              </div>
            )}
        </div>

        {/* Ultra-Modern Resolve Modal */}
        {selectedIssueId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={closeModal}>
            <div className="bg-white/95 backdrop-blur-2xl w-full max-w-lg rounded-[3.5rem] shadow-2xl overflow-hidden border border-white animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
                <div className="p-12">
                   <div className="flex items-center justify-between mb-10">
                      <div>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-1 uppercase italic">Ticket <span className="text-blue-600">Resolution</span></h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verify and seal incident #{selectedIssueId}</p>
                      </div>
                      <button onClick={closeModal} className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:bg-slate-100 transition-all shadow-inner">
                        <X size={20} />
                      </button>
                   </div>

                   <div className="space-y-8">
                      <div className="space-y-3">
                         <div className="flex items-center gap-2 ml-1">
                            <User size={12} className="text-blue-500" />
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Personnel Identification</label>
                         </div>
                         <input
                           type="text"
                           className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-black text-slate-800 placeholder:text-slate-300 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                           placeholder="Enter Full Name or Operator ID"
                           value={solverName}
                           onChange={(e) => setSolverName(e.target.value)}
                         />
                      </div>

                      <div className="space-y-3">
                         <div className="flex items-center gap-2 ml-1">
                            <Clock size={12} className="text-blue-500" />
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Completion Timestamp</label>
                         </div>
                         <input
                           type="datetime-local"
                           className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-black text-slate-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                           value={resolveTime}
                           onChange={(e) => setResolveTime(e.target.value)}
                         />
                      </div>
                   </div>

                   <button 
                    onClick={submitSolve}
                    className="w-full mt-12 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-[12px] uppercase tracking-[0.2em] rounded-3xl shadow-xl shadow-blue-500/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                   >
                     Confirm Verification <ChevronRight size={16} />
                   </button>
                </div>
            </div>
          </div>
        )}
    </div>
  );
};

const TabButton = ({ active, onClick, icon: Icon, label, count, color }) => {
    const colors = {
        rose: 'text-rose-600 bg-rose-50 border-rose-100',
        emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100',
        blue: 'text-blue-600 bg-blue-50 border-blue-100',
        indigo: 'text-indigo-600 bg-indigo-50 border-indigo-100'
    };
    return (
        <button 
            onClick={onClick} 
            className={`px-8 py-3.5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${
                active ? 'bg-white shadow-xl shadow-slate-200/50 text-slate-900 border border-slate-200' : 'text-slate-400 hover:text-slate-600'
            }`}
        >
            <div className={`p-1.5 rounded-lg border ${active ? colors[color] : 'bg-transparent border-transparent'}`}>
                <Icon size={14} />
            </div>
            {label}
            {count > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            )}
        </button>
    );
};

const DetectionCard = ({ item, onResolve, API_URL, formatDate }) => (
    <div className="group bg-white/80 backdrop-blur-3xl border border-white/50 rounded-[3rem] p-2 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col">
        <div className="relative h-56 rounded-[2.5rem] overflow-hidden mb-6">
            <img 
                src={`${API_URL}/${item.image}`} 
                alt="Detection"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                onError={(e) => e.target.src = 'https://placehold.co/600x400/f1f5f9/94a3b8?text=Image+Unavailable'}
            />
            <div className="absolute top-4 left-4 bg-rose-600/90 backdrop-blur-md text-white text-[8px] font-black uppercase tracking-widest px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                <AlertTriangle size={12} strokeWidth={3} /> Critical Anomalies
            </div>
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-black tracking-tighter px-4 py-2 rounded-full shadow-lg border border-slate-100">
                {(item.confidence * 100).toFixed(0)}% <span className="text-[8px] text-slate-400 uppercase tracking-widest ml-1 font-black">Confidence</span>
            </div>
        </div>
        
        <div className="px-6 pb-6 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-2xl font-black text-slate-900 italic tracking-tighter uppercase">Incident <span className="text-blue-600">#{item.id}</span></h4>
                <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Stream Active</span>
                </div>
            </div>

            <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-slate-500">
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-100"><MapPin size={14} /></div>
                    <span className="text-[10px] font-black uppercase tracking-widest max-w-[180px] truncate">{item.location || 'Automated Camera Zone'}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-100"><Clock size={14} /></div>
                    <span className="text-[10px] font-black uppercase tracking-widest italic">{formatDate(item.time)}</span>
                </div>
            </div>

            <button 
                onClick={onResolve}
                className="mt-auto w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-slate-400/20 hover:bg-blue-600 hover:shadow-blue-500/20 transition-all flex items-center justify-center gap-3"
            >
                Execute Fix Protocol <ExternalLink size={14} />
            </button>
        </div>
    </div>
);

const ResolvedCard = ({ item, API_URL, formatDate }) => (
    <div className="group bg-white/80 backdrop-blur-3xl border border-white/50 rounded-[3rem] p-2 shadow-sm transition-all duration-500 overflow-hidden flex flex-col opacity-90 hover:opacity-100">
        <div className="relative h-48 rounded-[2.5rem] overflow-hidden mb-6 grayscale group-hover:grayscale-0 transition-all duration-500">
            <img 
                src={`${API_URL}/${item.image}`} 
                className="w-full h-full object-cover" 
                onError={(e) => e.target.src = 'https://placehold.co/600x400/f1f5f9/94a3b8?text=Image+Unavailable'}
            />
            <div className="absolute top-4 left-4 bg-emerald-500/90 backdrop-blur-md text-white text-[8px] font-black uppercase tracking-widest px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                <CheckCircle size={12} strokeWidth={3} /> Verified Secure
            </div>
        </div>
        
        <div className="px-6 pb-6">
            <h4 className="text-xl font-black text-slate-900 italic tracking-tighter uppercase mb-5">Incident #{item.id}</h4>
            <div className="space-y-3">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                    <div className="w-8 h-8 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 font-black text-xs uppercase shadow-inner">
                        {item.solver_name?.charAt(0) || '?'}
                    </div>
                    <div>
                        <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Operator</div>
                        <div className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{item.solver_name}</div>
                    </div>
                </div>
                <div className="px-4 py-2 flex items-center justify-between">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic">Archived</span>
                    <span className="text-[9px] font-black text-slate-500 lowercase">{item.resolved_time?.split('T')[0]}</span>
                </div>
            </div>
        </div>
    </div>
);

const BentoStat = ({ label, value, icon: Icon, color, description }) => {
    const variants = {
        blue: 'text-blue-600 bg-blue-50 border-blue-100',
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
            <div className="text-4xl font-black text-slate-900 tracking-tighter mb-2">{value}</div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</div>
            <p className="text-[10px] font-bold text-slate-300 italic">{description}</p>
        </div>
    );
};

const EmptyState = ({ icon: Icon, title, description, color }) => (
    <div className="col-span-full py-32 flex flex-col items-center justify-center bg-white/50 rounded-[4rem] border-2 border-dashed border-slate-200 text-slate-400 mx-2">
        <div className={`p-8 rounded-full mb-8 ring-8 transition-colors ${
            color === 'emerald' ? 'bg-emerald-50 ring-emerald-50/50 text-emerald-500' : 'bg-slate-50 ring-slate-50/50 text-slate-400'
        }`}>
            <Icon size={64} strokeWidth={1} />
        </div>
        <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2 uppercase italic">{title}</h3>
        <p className="text-xs font-bold text-slate-400 tracking-widest uppercase">{description}</p>
    </div>
);

const ListFilter = ({ className, size }) => (
    <Activity className={className} size={size} />
);

export default PotholeDetection;
