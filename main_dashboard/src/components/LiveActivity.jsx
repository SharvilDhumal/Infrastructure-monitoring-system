import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, AlertTriangle, CheckCircle, Info } from 'lucide-react';

const StatusIcon = ({ status }) => {
    switch (status) {
        case 'Pending': return <Clock size={16} className="text-amber-400" />;
        case 'Approved': return <Info size={16} className="text-blue-400" />;
        case 'Rejected': return <AlertTriangle size={16} className="text-red-400" />;
        case 'Resolved': return <CheckCircle size={16} className="text-green-400" />;
        default: return <Info size={16} className="text-slate-400" />;
    }
};

const LiveActivity = ({ activities }) => {
    return (
        <div className="glass-card p-6 h-[500px] overflow-hidden flex flex-col">
            <h3 className="font-orbitron text-lg mb-6 blue-gradient-text flex items-center">
                Live Activity Feed
                <span className="ml-2 flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
            </h3>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence initial={false}>
                    {activities?.map((activity, index) => (
                        <motion.div
                            key={activity._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="mb-4 pb-4 border-b border-white/5 last:border-0"
                        >
                            <div className="flex items-start gap-3">
                                <div className={`mt-1 p-2 rounded-full bg-white/5`}>
                                    <StatusIcon status={activity.status} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <p className="font-medium text-sm text-text-main truncate">
                                            {activity.title}
                                        </p>
                                        <span className="text-[10px] text-text-secondary whitespace-nowrap ml-2">
                                            {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p className="text-xs text-text-secondary mt-1 line-clamp-1">
                                        {activity.description}
                                    </p>
                                    <div className="flex items-center mt-2 gap-2">
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${activity.severity === 'High' ? 'bg-red-500/20 text-red-400' :
                                                activity.severity === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                                                    'bg-green-500/20 text-green-400'
                                            }`}>
                                            {activity.severity}
                                        </span>
                                        <span className="text-[10px] text-text-secondary">
                                            by {activity.userId?.name || 'Anonymous'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {(!activities || activities.length === 0) && (
                    <div className="h-full flex items-center justify-center text-text-secondary text-sm">
                        No recent activity detected.
                    </div>
                )}
            </div>
        </div>
    );
};

export default LiveActivity;
