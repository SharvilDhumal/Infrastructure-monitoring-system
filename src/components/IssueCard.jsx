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
            whileHover={{ y: -2, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
            className="group bg-white border border-gray-200 hover:border-gray-300 rounded-xl p-5 transition-all duration-300 cursor-pointer overflow-hidden relative shadow-sm"
        >
            <div className="absolute top-0 right-0 p-5 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-300 text-gray-400">
                <ChevronRight size={20} />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                {issue.imageUrl ? (
                    <div className="relative w-full sm:w-32 h-40 sm:h-24 flex-shrink-0">
                        <img
                            src={issue.imageUrl}
                            alt={issue.title}
                            className="w-full h-full rounded-lg object-cover border border-gray-100 transition-all duration-500"
                        />
                    </div>
                ) : (
                    <div className="w-full sm:w-24 h-24 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-200">
                        <MapPin size={28} />
                    </div>
                )}

                <div className="flex-1 min-w-0 pr-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#002147] transition-colors truncate">
                            {issue.title}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${styles.bg} ${styles.text} ${styles.border}`}>
                            {styles.icon}
                            {issue.status}
                        </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 font-medium gap-3 mb-2">
                        <div className="flex items-center">
                            <MapPin size={14} className="mr-1.5" />
                            <span className="truncate max-w-[200px]">{issue.location}</span>
                        </div>
                        <div className="hidden sm:block w-1 h-1 rounded-full bg-gray-300"></div>
                        <div className="flex items-center">
                            <Clock size={14} className="mr-1.5" />
                            {new Date(issue.createdAt).toLocaleDateString()}
                        </div>
                    </div>

                    <p className="text-gray-600 text-sm line-clamp-2 mt-2 leading-relaxed">
                        {issue.description}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default IssueCard;
