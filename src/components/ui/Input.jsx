import React from 'react';

const Input = ({ className = '', ...props }) => {
  return (
    <input
      className={`
        w-full 
        /* Use Variables for Theme-Aware Contrast */
        bg-[var(--input-bg)] 
        border-2 border-[var(--input-border)]
        text-[var(--input-text)]
        placeholder:text-[var(--input-placeholder)]
        
        /* Focus & Interaction */
        rounded-2xl 
        py-4 px-6 
        focus:outline-none 
        focus:ring-4 focus:ring-blue-600/10 
        focus:border-blue-600
        
        /* Selection Styles for Visibility */
        selection:bg-blue-600 selection:text-white
        
        /* Hover State */
        hover:border-slate-300 dark:hover:border-white/20
        
        /* Smooth Transitions */
        transition-all duration-200 
        ease-in-out
        
        autofill:bg-transparent
        ${className}
      `}
      style={{
        // Webkit specific overrides for autofill and consistency
        WebkitBoxShadow: '0 0 0px 1000px transparent inset',
        WebkitTextFillColor: 'inherit',
      }}
      {...props}
    />
  );
};

export default Input;
