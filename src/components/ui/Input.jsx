import React from 'react';
import clsx from 'clsx';
import './Input.css';

const Input = React.forwardRef(({
    className,
    error,
    type = 'text',
    id,
    ...props
}, ref) => {
    return (
        <div className='input-wrapper'>
            <input
                ref={ref}
                type={type}
                id={id}
                className={clsx(
                    'ui-input',
                    error && 'ui-input--error',
                    className
                )}
                aria-invalid={error ? 'true' : 'false'}
                {...props}
            />
            {error && <span className="ui-input-error-text">{error}</span>}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
