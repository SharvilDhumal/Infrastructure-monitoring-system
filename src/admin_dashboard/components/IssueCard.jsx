import React from 'react';
import { MapPin, Clock, Calendar, CheckCircle2, User, Eye, UserPlus, Hammer } from 'lucide-react';

const IssueCard = ({
    issue,
    onAssign,
    onResolve,
    onViewDetails
}) => {
    const {
        title,
        location,
        severity,
        status,
        subStatus,
        description,
        assignedTo,
        reportedTime,
        resolvedAt,
        image
    } = issue;

    const getSeverityStyles = (sev) => {
        const s = sev?.toLowerCase();
        if (s === 'critical' || s === 'high') return 'bg-rose-50 text-rose-600 border-rose-100';
        if (s === 'medium' || s === 'warning') return 'bg-amber-50 text-amber-600 border-amber-100';
        if (s === 'low') return 'bg-emerald-50 text-emerald-600 border-emerald-100';
        return 'bg-slate-50 text-slate-600 border-slate-100';
    };

    const getStatusStyles = (stat, sub) => {
        if (stat === 'resolved') return { bg: 'bg-emerald-500', text: 'text-white', label: 'Resolved', icon: CheckCircle2 };
        if (sub === 'assigned') return { bg: 'bg-blue-600', text: 'text-white', label: 'Assigned', icon: User };
        if (sub === 'in-progress') return { bg: 'bg-indigo-600', text: 'text-white', label: 'In Progress', icon: Clock };
        return { bg: 'bg-rose-600', text: 'text-white', label: 'Detected', icon: Calendar };
    };

    const StatusIcon = getStatusStyles(status, subStatus).icon;
    const statusStyle = getStatusStyles(status, subStatus);

    return (
        <div className={`group bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex flex-col h-full ${status === 'resolved' ? 'opacity-80 grayscale-[20%]' : ''}`}>
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                        {image || '📋'}
                    </div>
                    <div>
                        <h3 className="font-black text-slate-900 leading-none mb-2 group-hover:text-blue-600 transition-colors uppercase text-xs tracking-wider">{title}</h3>
                        <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                            <MapPin size={10} />
                            {location}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getSeverityStyles(severity)}`}>
                        {severity}
                    </span>
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${statusStyle.bg} ${statusStyle.text} text-[9px] font-black uppercase tracking-widest shadow-lg shadow-current/10`}>
                        <StatusIcon size={10} />
                        {statusStyle.label}
                    </div>
                </div>
            </div>

            <div className="flex-1 mb-6">
                <p className="text-slate-500 text-xs font-medium leading-relaxed line-clamp-2 italic mb-4">
                    "{description || 'A suspected infrastructure defect requiring analysis.'}"
                </p>
                <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Reported</span>
                        <span className="text-[10px] font-black text-slate-700">{reportedTime}</span>
                    </div>
                    {assignedTo ? (
                         <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                            <span className="block text-[8px] font-black text-blue-400 uppercase tracking-widest mb-1">Assigned To</span>
                            <span className="text-[10px] font-black text-blue-700 truncate block">{assignedTo}</span>
                        </div>
                    ) : (
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 opacity-50">
                            <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Assigned To</span>
                            <span className="text-[10px] font-black text-slate-400">---</span>
                        </div>
                    )}
                </div>
                {status === 'resolved' && resolvedAt && (
                    <div className="mt-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
                         <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">Resolution Time</span>
                         <span className="text-[10px] font-black text-emerald-700">{new Date(resolvedAt).toLocaleDateString()}</span>
                    </div>
                )}
            </div>

            <div className="flex gap-2 pt-4 border-t border-slate-100">
                <button
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl transition-all active:scale-95 group/btn"
                    onClick={() => onViewDetails(issue)}
                >
                    <Eye size={14} className="group-hover/btn:text-blue-500 transition-colors" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Details</span>
                </button>

                {status !== 'resolved' && (
                    subStatus !== 'assigned' ? (
                        <button
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg shadow-blue-500/30 hover:scale-[1.02] hover:shadow-indigo-500/30 transition-all active:scale-95"
                            onClick={() => onAssign(issue)}
                            title="Assign Team"
                        >
                            <UserPlus size={14} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Assign</span>
                        </button>
                    ) : (
                        <button
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl shadow-lg shadow-indigo-500/30 hover:scale-[1.02] hover:shadow-violet-500/30 transition-all active:scale-95"
                            onClick={() => onResolve(issue)}
                            title="Resolve Issue"
                        >
                            <Hammer size={14} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Resolve</span>
                        </button>
                    )
                )}
            </div>
        </div>
    );
};

export default IssueCard;
