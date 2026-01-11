import React from 'react';
import clsx from 'clsx';
import './Button.css'; // We'll create a small CSS file for button specific styles or just use inline/global for now, but let's stick to global utility classes or inline styles for simplicity as per plan to use globals, but actually component level CSS is cleaner. Let's use a module approach or just a simple css file. Ideally I should have made specific css files for components or put them in globals. I'll put base styles in globals but maybe specific component styles in the component file if I was using styled-components or CSS modules.
// Retrying: logic-free means it just renders. I'll stick to a simple clean implementation.
// I will assume styles are in globals.css or I'll inject a style block. 
// Actually, creating a Button.css is cleaner.

const Button = ({
    children,
    variant = 'primary',
    className,
    disabled,
    isLoading,
    type = 'button',
    ...props
}) => {
    return (
        <button
            type={type}
            disabled={disabled || isLoading}
            className={clsx(
                'ui-button',
                `ui-button--${variant}`,
                className,
                isLoading && 'ui-button--loading'
            )}
            {...props}
        >
            {isLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <svg className="spinner" viewBox="0 0 50 50" style={{ width: '20px', height: '20px', animation: 'spin 1s linear infinite' }}>
                        <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" strokeWidth="5" style={{ strokeDasharray: '90, 150', strokeDashoffset: '0' }}></circle>
                    </svg>
                    Loading...
                    <style>
                        {`
                            @keyframes spin {
                                0% { transform: rotate(0deg); }
                                100% { transform: rotate(360deg); }
                            }
                        `}
                    </style>
                </div>
            ) : children}
        </button>
    );
};

export default Button;
