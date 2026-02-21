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
    <div className="flex flex-col md:flex-row items-center gap-4 mb-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
      <label htmlFor="issue-filter" className="text-lg font-bold text-[#002147] w-full md:w-auto text-left flex items-center gap-2 m-0 p-0">
        <Filter size={20} />
        Filter By:
      </label>
      <div className="relative w-full md:w-64">
        <select
          id="issue-filter"
          value={currentFilter}
          onChange={(e) => onFilterChange(e.target.value)}
          className="w-full bg-white border-2 border-gray-300 text-gray-800 font-bold text-base rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:border-[#002147] focus:ring-1 focus:ring-[#002147] appearance-none cursor-pointer transition-colors"
        >
          {filters.map((f) => (
            <option key={f.id} value={f.id} className="text-base text-gray-800 font-medium">
              {f.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      </div>
    </div>
  );
};

export default IssueFilter;
