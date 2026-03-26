import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    User, 
    Mail, 
    MapPin, 
    Calendar, 
    Clock, 
    ExternalLink, 
    CheckCircle2, 
    XCircle, 
    Timer, 
    AlertCircle,
    X,
    Maximize2,
    Eye,
    Hammer,
    Check
} from 'lucide-react';

const UserIssues = ({ hideLayout = false }) => {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [previewIssue, setPreviewIssue] = useState(null);

    const API_URL = 'http://localhost:5001/api/issues';
    const token = sessionStorage.getItem('token');

    const fetchIssues = async () => {
        try {
            setLoading(true);
            setError(null);
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const response = await axios.get(API_URL, { headers });
            const issuesData = response.data.issues || response.data;
            setIssues(issuesData);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIssues();
    }, []);

    const handleStatusUpdate = async (id, status) => {
        try {
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            await axios.put(`${API_URL}/${id}/status`, { status }, { headers });
            setIssues(issues.map(issue =>
                issue._id === id ? { ...issue, status } : issue
            ));
            if (previewIssue?._id === id) {
                setPreviewIssue({ ...previewIssue, status });
            }
        } catch (err) {
            console.error('Error updating status:', err);
        }
    };

    if (loading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] text-slate-500 space-y-4">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
                <p className="font-black tracking-widest uppercase text-[10px]">Synchronizing Community Reports...</p>
            </div>
        );
    }

    return (
        <div className={`w-full h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 mx-auto ${hideLayout ? 'max-w-none pt-4 px-4 sm:px-10 pb-20' : 'max-w-[1600px] pt-4 px-4 sm:px-6 md:pt-10 md:px-8 pb-20'}`}>
            {/* Header Area */}
            <div className="mb-8 md:mb-12">
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-1 md:mb-2">Community <span className="text-blue-600">Feed</span></h1>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Moderate and manage public infrastructure reports</p>
            </div>

            {/* Premium Table Card */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden">
                <div className="overflow-x-auto hide-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Reporter</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Issue Context</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Visuals</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Timeline</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {issues.map((issue) => (
                                <tr key={issue._id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center text-slate-500 shadow-inner">
                                                <User size={18} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-black text-slate-800">{issue.user?.name || 'Anonymous User'}</div>
                                                <div className="text-[10px] font-bold text-slate-400 truncate max-w-[150px]">{issue.user?.email || 'noreply@community.org'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-1.5">
                                            <div className="text-sm font-black text-slate-800 uppercase tracking-tight">{issue.title}</div>
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                <MapPin size={12} className="text-blue-500" />
                                                {issue.location}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex justify-center">
                                            <button 
                                                onClick={() => setPreviewIssue(issue)}
                                                className="relative w-16 h-12 rounded-xl border-2 border-slate-100 overflow-hidden group/img hover:border-blue-500 transition-all shadow-sm"
                                            >
                                                <img src={issue.imageUrl} alt="Proof" className="w-full h-full object-cover transition-transform group-hover/img:scale-110" />
                                                <div className="absolute inset-0 bg-blue-600/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white">
                                                    <Maximize2 size={16} />
                                                </div>
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <StatusBadge status={issue.status} />
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-1.5 text-xs font-black text-slate-600">
                                                <Calendar size={12} className="text-slate-300" />
                                                {new Date(issue.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                {new Date(issue.createdAt).getFullYear()}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <ActionButtons issue={issue} onUpdate={handleStatusUpdate} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Image Preview Modal (Card System) */}
            {previewIssue && (
                <div 
                    className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-8"
                    onClick={() => setPreviewIssue(null)}
                >
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-300" />
                    <div 
                        className="relative w-full max-w-4xl bg-white/80 backdrop-blur-3xl rounded-[3rem] border border-white shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 slide-in-from-bottom-8 duration-500"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Image Panel */}
                        <div className="w-full md:w-3/5 bg-slate-100 relative group min-h-[300px] md:min-h-[500px]">
                            <img src={previewIssue.imageUrl} alt="Full Proof" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-8 flex items-end">
                                <a 
                                    href={previewIssue.imageUrl} 
                                    target="_blank" 
                                    className="p-3 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-white/40 transition-all flex items-center gap-2 text-xs font-black uppercase tracking-widest border border-white/20"
                                >
                                    <ExternalLink size={14} /> Open Original
                                </a>
                            </div>
                            <button 
                                onClick={() => setPreviewIssue(null)}
                                className="absolute top-6 left-6 p-2 bg-black/20 backdrop-blur-md text-white rounded-full hover:bg-black/40 transition-all md:hidden"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content Panel */}
                        <div className="w-full md:w-2/5 p-8 md:p-10 flex flex-col justify-between">
                            <div className="space-y-8">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-tight">{previewIssue.title}</h2>
                                        <StatusBadge status={previewIssue.status} />
                                    </div>
                                    <button 
                                        onClick={() => setPreviewIssue(null)}
                                        className="hidden md:block p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-all"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <DetailRow icon={User} label="Reporter" value={previewIssue.user?.name || 'Anonymous User'} subValue={previewIssue.user?.email} />
                                    <DetailRow icon={MapPin} label="Geography" value={previewIssue.location} color="text-blue-600" />
                                    <DetailRow icon={Timer} label="Submission" value={new Date(previewIssue.createdAt).toLocaleString()} />
                                </div>

                                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-2">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                        <AlertCircle size={10} /> Case Description
                                    </div>
                                    <p className="text-sm font-bold text-slate-600 italic">
                                        "{previewIssue.description || 'Verified report submitted via mobile terminal.'}"
                                    </p>
                                </div>
                            </div>

                            <div className="pt-8 flex flex-col gap-3 border-t border-slate-100">
                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1 mb-1">Administrative Control</div>
                                <div className="flex gap-3">
                                    <ActionButtons issue={previewIssue} onUpdate={handleStatusUpdate} isFull />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const StatusBadge = ({ status = 'Pending' }) => {
    const config = {
        pending: { bg: 'bg-amber-50 text-amber-600 border-amber-100', icon: Timer },
        approved: { bg: 'bg-blue-50 text-blue-600 border-blue-100', icon: CheckCircle2 },
        'in progress': { bg: 'bg-indigo-50 text-indigo-600 border-indigo-100', icon: Hammer },
        resolved: { bg: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: Check },
        rejected: { bg: 'bg-rose-50 text-rose-600 border-rose-100', icon: XCircle }
    };

    const s = status.toLowerCase();
    const { bg, icon: Icon } = config[s] || config.pending;

    return (
        <div className={`px-3 py-1.5 rounded-lg border ${bg} text-[10px] font-black uppercase tracking-widest flex items-center gap-2 w-fit shadow-sm`}>
            <Icon size={12} />
            {status}
        </div>
    );
};

const DetailRow = ({ icon: Icon, label, value, subValue, color = "text-slate-800" }) => (
    <div className="flex gap-4">
        <div className="w-10 h-10 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
            <Icon size={18} />
        </div>
        <div className="min-w-0">
            <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">{label}</div>
            <div className={`text-sm font-black truncate ${color}`}>{value}</div>
            {subValue && <div className="text-[10px] font-bold text-slate-400 truncate">{subValue}</div>}
        </div>
    </div>
);

const ActionButtons = ({ issue, onUpdate, isFull = false }) => {
    const s = issue.status?.toLowerCase() || 'pending';

    if (s === 'pending') {
        return (
            <>
                <button
                    onClick={() => onUpdate(issue._id, 'Approved')}
                    className={`${isFull ? 'flex-1 py-4' : 'p-2'} bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg shadow-blue-500/20 hover:scale-[1.05] transition-all flex items-center justify-center gap-2`}
                >
                    <CheckCircle2 size={isFull ? 16 : 14} /> {isFull && 'Authorize Case'}
                </button>
                <button
                    onClick={() => onUpdate(issue._id, 'Rejected')}
                    className={`${isFull ? 'flex-1 py-4' : 'p-2'} bg-white border border-slate-200 text-slate-400 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all flex items-center justify-center gap-2`}
                >
                    <XCircle size={isFull ? 16 : 14} /> {isFull && 'Dismiss'}
                </button>
            </>
        );
    }

    if (s === 'approved') {
        return (
            <button
                onClick={() => onUpdate(issue._id, 'In Progress')}
                className="flex-1 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
                <Hammer size={16} /> Deploy Response
            </button>
        );
    }

    if (s === 'in progress') {
        return (
            <button
                onClick={() => onUpdate(issue._id, 'Resolved')}
                className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
                <Check size={16} /> Finalize Solution
            </button>
        );
    }

    return (
        <div className="px-5 py-2.5 bg-slate-100 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <CheckCircle2 size={12} /> Lifecycle Complete
        </div>
    );
};

export default UserIssues;
