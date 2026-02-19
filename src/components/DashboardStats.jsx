import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, XCircle, ShieldCheck } from 'lucide-react';

const StatCard = ({ label, count, icon: Icon, color, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="relative flex-1 min-w-[200px] p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all duration-300 group"
    >
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${color} opacity-50 group-hover:opacity-100 transition-opacity`} />
      
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-lg bg-white/5 text-gray-400 group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={24} />
        </div>
        <motion.span 
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          className="text-3xl font-bold text-white tracking-tight"
        >
          {count}
        </motion.span>
      </div>
      
      <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">{label}</h3>
    </motion.div>
  );
};

const DashboardStats = ({ stats }) => {
  const cards = [
    { label: 'Approved', count: stats?.approved || 0, icon: ShieldCheck, color: 'from-emerald-400 to-teal-500' },
    { label: 'Pending', count: stats?.pending || 0, icon: Clock, color: 'from-amber-400 to-orange-500' },
    { label: 'Rejected', count: stats?.rejected || 0, icon: XCircle, color: 'from-rose-400 to-red-500' },
    { label: 'Resolved', count: stats?.resolved || 0, icon: CheckCircle2, color: 'from-blue-400 to-indigo-500' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <StatCard key={card.label} {...card} delay={index * 0.1} />
      ))}
    </div>
  );
};

export default DashboardStats;
