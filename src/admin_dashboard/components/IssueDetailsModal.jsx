import React, { useEffect } from 'react';
import { X, MapPin, Clock, Shield, Target, Users, AlertCircle } from 'lucide-react';

const IssueDetailsModal = ({ issue, onClose }) => {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    if (!issue) return null;

    const getSeverityStyles = (severity) => {
        switch (severity?.toLowerCase()) {
            case 'critical':
            case 'high':
                return { 
                    color: 'text-rose-600', 
                    bg: 'bg-rose-50', 
                    border: 'border-rose-100',
                    gradient: 'from-rose-500 to-rose-600',
                    glow: 'shadow-rose-500/20'
                };
            case 'warning':
            case 'medium':
                return { 
                    color: 'text-amber-600', 
                    bg: 'bg-amber-50', 
                    border: 'border-amber-100',
                    gradient: 'from-amber-500 to-amber-600',
                    glow: 'shadow-amber-500/20'
                };
            default:
                return { 
                    color: 'text-emerald-600', 
                    bg: 'bg-emerald-50', 
                    border: 'border-emerald-100',
                    gradient: 'from-emerald-500 to-emerald-600',
                    glow: 'shadow-emerald-500/20'
                };
        }
    };

    const styles = getSeverityStyles(issue.severity);

    return (
        <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8"
            onClick={onClose}
        >
            {/* Backdrop with intense blur */}
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" />

            {/* Modal Container */}
            <div 
                className="relative w-full max-w-2xl max-h-[85vh] bg-white/80 backdrop-blur-2xl rounded-[3rem] border border-white shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 ease-out"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header with gradient theme - Slightly shorter */}
                <div className={`h-28 bg-gradient-to-br ${styles.gradient} relative overflow-hidden shrink-0`}>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute inset-0 p-6 flex items-end justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-lg">
                                <span className="text-2xl">{issue.image || '⚠️'}</span>
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-white leading-tight">{issue.title}</h2>
                                <p className="text-white/80 font-bold text-[10px] uppercase tracking-widest">{issue.module}</p>
                            </div>
                        </div>
                        <button 
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 bg-black/10 hover:bg-black/20 rounded-full transition-colors text-white"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                <div className="p-8 sm:p-10 space-y-8 overflow-y-auto hide-scrollbar flex-1">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <BadgeItem icon={AlertCircle} label="Severity" value={issue.severity} colorClass={styles.color} bgClass={styles.bg} />
                        <BadgeItem icon={Shield} label="Status" value={issue.status} colorClass="text-blue-600" bgClass="bg-blue-50" />
                        <BadgeItem icon={Target} label="Confidence" value={`${issue.confidence}%`} colorClass="text-indigo-600" bgClass="bg-indigo-50" />
                        <BadgeItem icon={MapPin} label="Location" value={issue.location} colSpan="col-span-1 md:col-span-2" />
                        <BadgeItem icon={Clock} label="Reported" value={issue.reportedTime} />
                        <BadgeItem icon={Users} label="Team" value={issue.assignedTeam || 'Unassigned'} />
                    </div>

                    {/* Description Section */}
                    <div className="space-y-3">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Description Analysis</h4>
                        <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 italic text-slate-600 text-sm leading-relaxed">
                            "{issue.description || 'No additional context provided for this detection event.'}"
                        </div>
                    </div>

                    {/* Technical Details */}
                    <div className="space-y-3">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Geospatial Coordinates</h4>
                        <div className="p-4 bg-slate-900 rounded-2xl font-mono text-xs text-blue-300 flex items-center gap-3 border-2 border-slate-800 shadow-inner">
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                            {issue.exactLocation}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex justify-end">
                    <button 
                        onClick={onClose}
                        className="px-8 py-3 bg-slate-900 text-white font-black text-sm rounded-2xl hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-900/10"
                    >
                        DISMISS
                    </button>
                </div>
            </div>
        </div>
    );
};

const BadgeItem = ({ icon: Icon, label, value, colorClass = "text-slate-600", bgClass = "bg-slate-50", colSpan = "col-span-1" }) => (
    <div className={`${colSpan} p-4 ${bgClass} rounded-2xl border border-slate-100 flex flex-col gap-2 transition-transform hover:scale-[1.02]`}>
        <div className="flex items-center gap-2">
            <Icon size={14} className={colorClass} />
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">{label}</span>
        </div>
        <span className={`text-sm font-black truncate capitalize ${colorClass}`}>{value}</span>
    </div>
);

export default IssueDetailsModal;
