import React, { useState } from 'react';
import { X, CheckCircle, MapPin, Calendar, Clock, User, ShieldCheck } from 'lucide-react';

const ResolveIssueModal = ({ isOpen, issue, onClose, onConfirm }) => {
    const [resolverName, setResolverName] = useState('Admin User');

    const now = new Date();
    const currentDate = now.toLocaleDateString();
    const currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

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
                className="relative w-full max-w-lg bg-white/80 backdrop-blur-3xl rounded-[3.5rem] border border-white/50 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 ease-out flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header with Emerald-Teal Gradient */}
                <div className="h-24 bg-gradient-to-r from-emerald-500 to-teal-600 relative overflow-hidden shrink-0">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
                    <div className="absolute inset-0 p-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30 shadow-lg text-white">
                                <ShieldCheck size={20} />
                            </div>
                            <h2 className="text-xl font-black text-white tracking-tight uppercase">Resolution Verified</h2>
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
                    <div className="p-5 bg-emerald-50 rounded-[2.5rem] border border-emerald-100 flex items-center gap-5">
                        <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-emerald-100 flex items-center justify-center text-3xl">
                            {issue.image || '✅'}
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-black text-emerald-900 uppercase tracking-widest leading-none mb-1">{issue.title}</h4>
                            <div className="flex items-center gap-2 text-emerald-600 font-bold text-[10px] uppercase tracking-widest">
                                <MapPin size={10} />
                                {issue.location}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex flex-col gap-2">
                             <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Resolver Name</label>
                             <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                                    <User size={16} />
                                </div>
                                <input
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-slate-700 outline-none focus:border-emerald-500 focus:bg-white transition-all shadow-inner"
                                    placeholder="Enter resolver name..."
                                    value={resolverName}
                                    onChange={(e) => setResolverName(e.target.value)}
                                />
                             </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Date</label>
                                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-black text-slate-600 flex items-center gap-2">
                                    <Calendar size={14} className="text-slate-400" /> {currentDate}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Time</label>
                                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-black text-slate-600 flex items-center gap-2">
                                    <Clock size={14} className="text-slate-400" /> {currentTime}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-3">
                        <span className="text-lg">ℹ️</span>
                        <p className="text-[10px] font-bold text-amber-900 leading-normal">
                            Closing this incident will mark the asset as operational. All monitoring teams will be notified of the resolution.
                        </p>
                    </div>
                </div>

                {/* Footer and Resolution Action */}
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-4">
                    <button 
                        onClick={onClose}
                        className="flex-1 py-4 bg-white border border-slate-200 text-slate-500 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-white/50 transition-all active:scale-95 shadow-sm"
                    >
                        Back
                    </button>
                    <button 
                        onClick={() => onConfirm(issue.id, resolverName)}
                        className="flex-[2] py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-500/40 hover:scale-[1.02] hover:shadow-teal-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <CheckCircle size={16} />
                        Confirm Registry
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResolveIssueModal;
