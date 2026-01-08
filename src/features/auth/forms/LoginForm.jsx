import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast'; // Removed unused Link import
import authService from '../authService';
import ForgotPasswordForm from './ForgotPasswordForm';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Label from '../../../components/ui/Label';

const GoogleIcon = () => (
    <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
        <path fill="none" d="M0 0h48v48H0z" />
    </svg>
);

const LoginForm = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Auth Guard: Redirect if already logged in
        if (localStorage.getItem('token')) {
            navigate('/dashboard');
        }

        const params = new URLSearchParams(location.search);
        if (params.get('verified')) {
            toast.success('Email verified successfully! Please login.');
        }
    }, [location, navigate]);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await authService.login(formData);
            navigate('/');
        } catch (error) {
            console.error(error);
            toast.error(error.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <h1 className="auth-title">{isForgotPassword ? "Reset your password" : "Welcome back"}</h1>
            <p className="auth-subtitle">
                {isForgotPassword ? "Enter your registered email and we’ll send you a reset link." : "Welcome back! Please enter your details."}
            </p>
            {isForgotPassword ? (
                <ForgotPasswordForm onBack={() => setIsForgotPassword(false)} />
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
                            <button
                                type="button"
                                className="forgot-password-link"
                                onClick={() => setIsForgotPassword(true)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    padding: 0,
                                    cursor: 'pointer',
                                    font: 'inherit',
                                    display: 'inline-block',
                                    marginTop: 0 // Reset margin since container handles it
                                }}
                            >
                                Forgot password?
                            </button>
                        </div>
                    </div>

                    <Button type="submit" variant="primary" isLoading={isLoading}>Sign In</Button>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <div style={{ height: '1.5rem' }}></div> {/* Spacer */}
                        <Button
                            type="button"
                            className="btn-google"
                            onClick={() => window.location.href = 'http://localhost:5000/api/auth/google?state=login'}
                        >
                            <GoogleIcon />
                            Continue with Google
                        </Button>
                    </div>

                    <div className="auth-footer">
                        Don't have an account? <span onClick={() => navigate('/signup')} className="auth-link" style={{ cursor: 'pointer' }}>Sign up</span>
                    </div>
                </form>
            )}
        </>
    );
};

export default LoginForm;
