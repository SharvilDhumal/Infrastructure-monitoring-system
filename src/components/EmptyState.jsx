import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmptyState = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl text-center"
    >
      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-gray-400 mb-6 border border-gray-200 shadow-sm">
        <LayoutDashboard size={32} />
      </div>

      <h3 className="text-2xl font-bold text-[#002147] mb-3">No Issues Reported Yet</h3>
      <p className="text-gray-600 max-w-md mb-8 text-base">
        It looks like you haven't reported any infrastructure faults yet. Your city needs your help!
      </p>

      <Link
        to="/report"
        className="flex items-center justify-center gap-2 px-6 py-3 bg-[#002147] hover:bg-blue-900 text-white font-bold rounded-lg transition-all duration-300 shadow-sm active:scale-95 text-base w-full md:w-auto"
      >
        <Plus size={20} />
        Report an Issue
      </Link>
    </motion.div>
  );
};

export default EmptyState;
