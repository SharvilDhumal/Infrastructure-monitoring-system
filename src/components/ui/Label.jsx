import React from 'react';

const Label = ({ children, className = '', ...props }) => {
  return (
    <label 
      className={`
        block 
        text-[11px] 
        font-black 
        text-slate-500 
        dark:text-slate-400
        uppercase 
        tracking-[0.2em] 
        mb-2.5 
        ml-1 
        ${className}
      `} 
      {...props}
    >
      {children}
    </label>
  );
};

export default Label;
