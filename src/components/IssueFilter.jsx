import React from 'react';
import { Filter } from 'lucide-react';

const IssueFilter = ({ currentFilter, onFilterChange }) => {
  const filters = [
    { id: 'all', label: 'All Issues' },
    { id: 'Pending', label: 'Pending' },
    { id: 'Approved', label: 'Approved' },
    { id: 'Resolved', label: 'Resolved' },
    { id: 'Rejected', label: 'Rejected' },
  ];

  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-blue-400 transition-colors">
          <Filter size={16} />
        </div>
        <select
          value={currentFilter}
          onChange={(e) => onFilterChange(e.target.value)}
          className="bg-white/5 border border-white/10 text-white text-sm rounded-xl py-3 pl-11 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 hover:bg-white/10 transition-all appearance-none cursor-pointer"
        >
          {filters.map((f) => (
            <option key={f.id} value={f.id} className="bg-gray-900 text-white">
              {f.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      </div>
      
      <div className="hidden sm:flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => onFilterChange(f.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
              currentFilter === f.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default IssueFilter;
