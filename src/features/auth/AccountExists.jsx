import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/auth.css';

const AccountExists = () => {
    const navigate = useNavigate();

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f8fafc',
            padding: '1rem'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '16px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                padding: '3rem 2rem',
                width: '100%',
                maxWidth: '420px',
                textAlign: 'center'
            }}>
                {/* Warning Icon */}
                <div style={{
                    marginBottom: '1.5rem',
                    height: '80px',
                    width: '80px',
                    margin: '0 auto 1.5rem auto',
                    borderRadius: '50%',
                    background: '#FEF2F2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                </div>

                <h1 style={{
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    marginBottom: '0.75rem',
                    lineHeight: '1.2'
                }}>
                    Account already exists
                </h1>

                <p style={{
                    color: '#64748b',
                    fontSize: '0.95rem',
                    marginBottom: '2rem',
                    lineHeight: '1.5'
                }}>
                    Please log in to continue
                </p>

                <button
                    onClick={() => navigate('/login')}
                    className="auth-button"
                    style={{
                        width: '100%',
                        padding: '0.875rem',
                        backgroundColor: '#1a1a1a',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#000'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1a1a1a'}
                >
                    Login
                </button>
            </div>
        </div>
    );
};

export default AccountExists;
