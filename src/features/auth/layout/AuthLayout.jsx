import React from 'react';
import '../../../styles/auth.css';
import authSideImage from '../../../assets/authimg.png';

const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className="auth-page" style={{ backgroundColor: 'var(--surface)', color: 'var(--text-main)' }}>
            {/* Left Side - Content/Form */}
            <div className="auth-content">
                <div className="auth-container">
                    <div style={{
                        textAlign: 'center',
                        marginBottom: '1.5rem',
                        position: 'relative',
                        display: 'inline-block',
                        width: '100%'
                    }}>
                        <h2 style={{
                            fontFamily: '"Playfair Display", Georgia, serif',
                            fontSize: '1.5rem',
                            fontWeight: '600',
                            letterSpacing: '0.05em',
                            color: 'var(--text-main)',
                            margin: 0,
                            paddingBottom: '0.5rem',
                            background: 'linear-gradient(90deg, #1a1a1a, #4a5568)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            display: 'inline-block',
                        }}>
                            InfravisionAI
                        </h2>
                    </div>
                    <h1 className="auth-title">{title}</h1>
                    {subtitle && <p className="auth-subtitle">{subtitle}</p>}
                    {children}
                </div>
            </div>

            {/* Right Side - Visual/Decor */}
            <div className="auth-visual" style={{ padding: 0, overflow: 'hidden' }}>
                <img
                    src={authSideImage}
                    alt="Authentication Visual"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block'
                    }}
                />
            </div>
        </div>
    );
};

export default AuthLayout;
