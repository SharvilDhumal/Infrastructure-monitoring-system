import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../styles/auth.css';

const AuthSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { type } = location.state || {}; // Expecting 'signup' or 'login'

    const content = {
        login: {
            title: "Welcome back!",
            message: "You’ve successfully signed in. Welcome to InfravisionAI.",
            buttonText: "Go to Dashboard"
        },
        signup: {
            title: "Account created successfully 🎉",
            message: "Welcome to InfravisionAI! We're excited to have you on board.",
            buttonText: "Get Started"
        },
        default: {
            title: "Authentication Successful",
            message: "You have successfully signed in. Welcome to InfravisionAI.",
            buttonText: "Go to Dashboard"
        }
    };

    const { title, message, buttonText } = content[type] || content.default;

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
                {/* InfravisionAI Logo */}
                <div style={{ marginBottom: '2rem' }}>
                    <h2 style={{
                        fontFamily: '"Playfair Display", Georgia, serif',
                        fontSize: '1.5rem',
                        fontWeight: '600',
                        color: '#1a1a1a',
                        margin: 0,
                        background: 'linear-gradient(90deg, #1a1a1a, #4a5568)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        display: 'inline-block',
                    }}>
                        InfravisionAI
                    </h2>
                </div>

                {/* Animated Success Icon */}
                <div style={{
                    marginBottom: '1.5rem',
                    position: 'relative',
                    height: '80px',
                    width: '80px',
                    margin: '0 auto 1.5rem auto'
                }}>
                    <style>
                        {`
                            @keyframes scaleUp {
                                0% { transform: scale(0); opacity: 0; }
                                60% { transform: scale(1.1); }
                                100% { transform: scale(1); opacity: 1; }
                            }
                            @keyframes drawCheck {
                                0% { stroke-dashoffset: 50; }
                                100% { stroke-dashoffset: 0; }
                            }
                        `}
                    </style>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: '#dcfce7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        animation: 'scaleUp 0.5s ease-out forwards'
                    }}>
                        <svg
                            width="40"
                            height="40"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#16a34a"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{
                                strokeDasharray: 50,
                                strokeDashoffset: 50,
                                animation: 'drawCheck 0.5s ease-out 0.4s forwards'
                            }}
                        >
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </div>
                </div>

                <h1 style={{
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    marginBottom: '0.75rem',
                    lineHeight: '1.2'
                }}>
                    {title}
                </h1>

                <p style={{
                    color: '#64748b',
                    fontSize: '0.95rem',
                    marginBottom: '2rem',
                    lineHeight: '1.5'
                }}>
                    {message}
                </p>

                <button
                    onClick={() => navigate('/dashboard')}
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
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#000'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1a1a1a'}
                >
                    {buttonText}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default AuthSuccess;
