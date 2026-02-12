import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import toast from 'react-hot-toast'; // Removed unused Link import
import authService from '../authService';
import ForgotPasswordForm from './ForgotPasswordForm';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Label from '../../../components/ui/Label';
import AuthLayout from '../layout/AuthLayout';
import { Eye, EyeOff } from 'lucide-react';



const LoginForm = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Auth Guard: Redirect if already logged in

        const params = new URLSearchParams(location.search);
        if (params.get('verified')) {
            toast.success('Email verified successfully! Please login.');
        }
        if (params.get('error')) {
            toast.error('Authentication failed. Please try again.');
        }
    }, [location, navigate]);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form fields
        if (!formData.email || !formData.password) {
            toast.error('Please fill in all fields');
            return;
        }

        setIsLoading(true);
        try {
            await authService.login(formData);
            toast.success('Login successful!');
            navigate('/');
        } catch (error) {
            console.error('Login error:', error);
            toast.error(error.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout
            title={isForgotPassword ? "Reset your password" : "Welcome back"}
            subtitle={isForgotPassword ? "Enter your registered email and we’ll send you a reset link." : "Welcome back! Please enter your details."}
        >
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
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="pr-12"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="password-toggle"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
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

                    <Button
                        type="submit"
                        variant="primary"
                        isLoading={isLoading}
                        disabled={!formData.email || !formData.password || isLoading}
                        style={{ marginTop: '1rem' }}
                    >
                        Sign In
                    </Button>



                    <div className="auth-footer">
                        Don't have an account? <Link to="/signup" className="auth-link">Sign up</Link>
                    </div>
                </form>
            )}
        </AuthLayout>
    );
};

export default LoginForm;

