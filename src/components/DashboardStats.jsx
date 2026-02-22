import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, XCircle, ShieldCheck } from 'lucide-react';

const StatCard = ({ label, count, icon: Icon, color, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="flex-1 min-w-[200px] p-8 rounded-2xl bg-white border-4 border-[#002147] shadow-[4px_4px_0px_#002147] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all duration-200"
    >

      <div className="flex flex-col items-center justify-center mb-4">
        <motion.span
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          className="text-4xl font-black text-[#002147] tracking-tight mb-2"
        >
          {count}
        </motion.span>
        <span className="text-lg font-bold text-gray-800 uppercase tracking-wide">{label}</span>
      </div>
    </motion.div>
  );
};

const DashboardStats = ({ stats }) => {
  const cards = [
    { label: 'Approved', count: stats?.approved || 0, icon: ShieldCheck, color: 'from-emerald-400 to-teal-500' },
    { label: 'Pending', count: stats?.pending || 0, icon: Clock, color: 'from-amber-400 to-orange-500' },
    { label: 'In Progress', count: stats?.inProgress || 0, icon: Clock, color: 'from-indigo-400 to-purple-500' },
    { label: 'Resolved', count: stats?.resolved || 0, icon: CheckCircle2, color: 'from-blue-400 to-indigo-500' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <StatCard key={card.label} {...card} delay={index * 0.1} />
      ))}
    </div>
  );
};

export default DashboardStats;
