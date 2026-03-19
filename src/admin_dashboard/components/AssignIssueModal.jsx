import React, { useState, useEffect } from 'react';
import { X, Users, UserCheck, Calendar, Clock, MapPin, ChevronDown, Check } from 'lucide-react';

const teams = [
    'Road Maintenance Team Alpha',
    'Road Maintenance Team Beta',
    'Street Light Crew A',
    'Street Light Crew B',
    'Water Infrastructure Unit 1',
    'Water Infrastructure Unit 2',
    'Bridge Inspection Team',
    'Emergency Response Unit'
];

const AssignIssueModal = ({ isOpen, issue, onClose, onConfirm }) => {
    const [selectedTeam, setSelectedTeam] = useState('');

    const now = new Date();
    const currentDate = now.toLocaleDateString();
    const currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    useEffect(() => {
        if (isOpen) {
            setSelectedTeam('');
        }
    }, [isOpen]);

    if (!isOpen || !issue) return null;

    return (
        <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8"
            onClick={onClose}
        >
            {/* Backdrop with intense blur */}
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" />

            {/* Modal Container */}
            <div 
                className="relative w-full max-w-xl max-h-[90vh] bg-white/80 backdrop-blur-3xl rounded-[3.5rem] border border-white/50 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 ease-out"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header with Blue-Indigo Gradient */}
                <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-600 relative overflow-hidden shrink-0">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
                    <div className="absolute inset-0 p-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30 shadow-lg">
                                <UserCheck className="text-white" size={20} />
                            </div>
                            <h2 className="text-xl font-black text-white tracking-tight uppercase">Registry Assignment</h2>
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-2 bg-black/10 hover:bg-black/20 rounded-full transition-colors text-white"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                <div className="p-8 space-y-8 overflow-y-auto hide-scrollbar flex-1">
                    {/* Issue Context Card */}
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-xl">
                            {issue.image || '📋'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-black text-slate-800 truncate uppercase tracking-widest leading-none mb-1">{issue.title}</h4>
                            <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                                <MapPin size={10} />
                                {issue.location}
                            </div>
                        </div>
                        <div className="px-3 py-1 bg-white border border-slate-100 rounded-lg text-[9px] font-black uppercase text-slate-500 tracking-widest shadow-sm">
                            {issue.severity}
                        </div>
                    </div>

                    {/* Team Selection Dropdown */}
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1 flex items-center gap-2 italic">
                             <Users size={12} /> Operations Registry
                        </label>
                        <div className="relative group">
                            <select
                                className="w-full h-14 pl-12 pr-10 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] appearance-none cursor-pointer"
                                value={selectedTeam}
                                onChange={(e) => setSelectedTeam(e.target.value)}
                            >
                                <option value="" disabled>Choose an authorized team...</option>
                                {teams.map(team => (
                                    <option key={team} value={team}>{team}</option>
                                ))}
                            </select>
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 pointer-events-none transition-colors">
                                <Users size={18} />
                            </div>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 pointer-events-none transition-colors">
                                <ChevronDown size={18} />
                            </div>
                        </div>
                    </div>

                    {/* Assignment Metadata */}
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                         <div className="flex flex-col gap-1.5">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-1">Assigned By</label>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] font-black text-slate-600 flex items-center gap-2">
                                <Check size={12} className="text-blue-500" /> Admin User
                            </div>
                         </div>
                         
                         <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-1">Date</label>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] font-black text-slate-600 flex items-center gap-3">
                                    <Calendar size={12} className="text-slate-400" /> {currentDate}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-1">Time</label>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] font-black text-slate-600 flex items-center gap-3">
                                    <Clock size={12} className="text-slate-400" /> {currentTime}
                                </div>
                            </div>
                         </div>
                    </div>
                </div>

                {/* Better Assignment Button UI */}
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-4">
                    <button 
                        onClick={onClose}
                        className="flex-1 py-4 bg-white border border-slate-200 text-slate-500 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-white/50 transition-all active:scale-95 shadow-sm"
                    >
                        Dismiss
                    </button>
                    <button 
                        disabled={!selectedTeam}
                        onClick={() => onConfirm(issue.id, selectedTeam)}
                        className={`flex-[2] py-4 font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 ${
                            selectedTeam 
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/40 hover:scale-[1.02] hover:shadow-indigo-500/30' 
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                    >
                        <UserCheck size={16} />
                        Execute Assignment
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AssignIssueModal;
