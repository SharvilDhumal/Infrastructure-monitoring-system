import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, CheckCircle2, Clock, XCircle, CheckSquare, ChevronRight } from 'lucide-react';

const IssueCard = ({ issue }) => {
    const getStatusStyles = (status) => {
        switch (status) {
            case 'Approved': return {
                bg: 'bg-emerald-500/10',
                text: 'text-emerald-400',
                border: 'border-emerald-500/20',
                icon: <CheckCircle2 size={14} className="mr-1.5" />
            };
            case 'Pending': return {
                bg: 'bg-amber-500/10',
                text: 'text-amber-400',
                border: 'border-amber-500/20',
                icon: <Clock size={14} className="mr-1.5" />
            };
            case 'Rejected': return {
                bg: 'bg-rose-500/10',
                text: 'text-rose-400',
                border: 'border-rose-500/20',
                icon: <XCircle size={14} className="mr-1.5" />
            };
            case 'Resolved': return {
                bg: 'bg-blue-500/10',
                text: 'text-blue-400',
                border: 'border-blue-500/20',
                icon: <CheckSquare size={14} className="mr-1.5" />
            };
            default: return {
                bg: 'bg-gray-500/10',
                text: 'text-gray-400',
                border: 'border-gray-500/20',
                icon: null
            };
        }
    };

    const styles = getStatusStyles(issue.status);

    return (
        <motion.div 
            whileHover={{ y: -4, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
            className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-5 transition-all duration-300 cursor-pointer overflow-hidden relative"
        >
            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-300 text-blue-500">
                <ChevronRight size={24} />
            </div>

            <div className="flex items-center gap-6">
                {issue.imageUrl ? (
                    <div className="relative w-24 h-24 flex-shrink-0">
                        <img
                            src={issue.imageUrl}
                            alt={issue.title}
                            className="w-full h-full rounded-2xl object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                ) : (
                    <div className="w-24 h-24 rounded-2xl bg-white/5 flex items-center justify-center text-gray-600 border border-dashed border-white/10">
                        <MapPin size={32} />
                    </div>
                )}
                
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles.bg} ${styles.text} ${styles.border}`}>
                            {styles.icon}
                            {issue.status}
                        </span>
                        <div className="flex items-center text-gray-500 text-xs font-medium">
                            <Clock size={12} className="mr-1" />
                            {new Date(issue.createdAt).toLocaleDateString()}
                        </div>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors truncate">
                        {issue.title}
                    </h3>

                    <div className="flex items-center text-gray-400 text-sm mb-3">
                        <MapPin size={14} className="mr-1.5 text-blue-500/50" />
                        <span className="truncate">{issue.location}</span>
                    </div>

                    <p className="text-gray-500 text-sm line-clamp-1 group-hover:text-gray-400 transition-colors">
                        {issue.description}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default IssueCard;
