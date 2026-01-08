import React from 'react';
import clsx from 'clsx';
import './Label.css';

const Label = ({ children, htmlFor, className, ...props }) => {
    return (
        <label
            htmlFor={htmlFor}
            className={clsx('ui-label', className)}
            {...props}
        >
            {children}
        </label>
    );
};

export default Label;
