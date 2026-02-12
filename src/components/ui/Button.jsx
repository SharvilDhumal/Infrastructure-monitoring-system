import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none rounded-2xl';
  
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20',
    secondary: 'bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10',
    outline: 'bg-transparent border-2 border-slate-200 dark:border-white/10 hover:border-blue-500/50 text-slate-700 dark:text-white',
    ghost: 'bg-transparent hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white',
    danger: 'bg-red-500/10 hover:bg-red-500/20 text-red-500 dark:text-red-400 border border-red-500/20'
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-8 py-4 text-sm',
    lg: 'px-10 py-5 text-base'
  };

  return (
    <motion.button
      whileHover={{ y: -1 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading...</span>
        </div>
      ) : children}
    </motion.button>
  );
};

export default Button;
