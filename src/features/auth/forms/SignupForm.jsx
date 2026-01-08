import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import authService from '../authService';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Label from '../../../components/ui/Label';

const GoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 48 48">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
);

const SignupForm = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // We just call the register endpoint - authService already handles the fetch
            // Need to make sure authService.register returns the full response or handles errors appropriately so we can check status
            // Assuming authService.register throws on error, we catch it.
            const res = await authService.register(formData);

            // If we get here, it means 201 Created (or 200)
            // Show Success Toast and stay on page or redirect to login
            toast.success('Signup successful! Please check your email to verify your account.');
            // Optional: Redirect to login so they are ready to sign in after verification
            // navigate('/login'); 
            // For now, let's keep them here so they see the message clearly. 
            // Actually, usually it's better to clear form. 
            setFormData({ name: '', email: '', password: '' });

        } catch (err) {
            // Handle 409 specifically if axios/fetch error structure supports it
            // Assuming standard error response: err.response.status === 409
            if (err.response && err.response.status === 409) {
                toast.error('Account already exists. Please sign in.');
            } else {
                toast.error(
                    err?.response?.data?.message || 'Signup failed'
                );
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleClick = () => {
        // Direct redirect to backend with state=signup
        window.location.href = 'http://localhost:5000/api/auth/google?state=signup';
    };

    return (
        <>
            <h1 className="auth-title">Create an account</h1>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={formData.name} onChange={handleChange} required placeholder="Enter your full name" />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={formData.email} onChange={handleChange} required placeholder="name@example.com" />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" value={formData.password} onChange={handleChange} required placeholder="Create a password" />
                </div>

                <Button
                    type="submit"
                    variant="primary"
                    isLoading={isLoading}
                    style={{ marginTop: '0.5rem' }}
                >
                    Sign Up
                </Button>

                <div className="auth-separator" style={{ margin: '1rem 0' }}>OR</div>

                <Button
                    type="button"
                    className="btn-google"
                    onClick={handleGoogleClick}
                    disabled={isGoogleLoading}
                >
                    <GoogleIcon />
                    Sign up with Google
                </Button>

                <p className="auth-footer" style={{ marginTop: '1rem' }}>
                    Already have an account? <Link to="/login" style={{ fontWeight: 500 }}>Sign in</Link>
                </p>
            </form>
        </>
    );
};

export default SignupForm;
