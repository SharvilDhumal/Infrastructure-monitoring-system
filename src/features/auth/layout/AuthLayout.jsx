import React from 'react';
import { Outlet } from 'react-router-dom';
import '../../../styles/auth.css';
import authSideImage from '../../../assets/authimg.png';

const AuthLayout = ({ title, subtitle }) => {
    return (
        <div className="auth-page">
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
                            color: '#1a1a1a',
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
                    {/* Title and subtitle are now handled by the specific route components or can be passed via outlet context if needed, 
                        but effectively we are removing the prop drill here and letting children handle their own headers 
                        OR we keep them if they are passed as props to the Layout? 
                        
                        Actually, with Outlet, the Layout wraps the route. The `title` and `subtitle` props passed to AuthLayout 
                        would need to come from the Route definition or we remove them from here and let pages render them.
                        
                        The existing forms render <AuthLayout title="...">. 
                        If we switch to <Route element={<AuthLayout />}>, we can't easily pass different props for each child route to the layout 
                        unless we use a context or simply let the children render their own implementation of the title/subtitle 
                        OR we move the title/subtitle INTO the children.
                        
                        Let's check the plan. "Change to render <Outlet />".
                        I will move the title/subtitle rendering INTO the child components since they vary per page.
                        But wait, the `div.auth-container` wraps everything. 
                        
                        I will remove `title` and `subtitle` from `AuthLayout` and let the children render them.
                    */}
                    <Outlet />
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
