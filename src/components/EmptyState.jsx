import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmptyState = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 px-4 bg-white/[0.02] border border-dashed border-white/10 rounded-[2.5rem] text-center"
    >
      <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400 mb-6 shadow-[0_0_50px_rgba(59,130,246,0.1)] border border-blue-500/20">
        <LayoutDashboard size={40} />
      </div>
      
      <h3 className="text-2xl font-bold text-white mb-2">No Issues Reported Yet</h3>
      <p className="text-gray-400 max-w-sm mb-8">
        It looks like you haven't reported any infrastructure faults yet. Your city needs your help!
      </p>
      
      <Link
        to="/report"
        className="flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all duration-300 shadow-xl shadow-blue-600/20 active:scale-95 group"
      >
        <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
        Report Your First Issue
      </Link>
    </motion.div>
  );
};

export default EmptyState;
