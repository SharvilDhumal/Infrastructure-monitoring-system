import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import authService from '../authService';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Label from '../../../components/ui/Label';
import AuthLayout from '../layout/AuthLayout';



const SignupForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await authService.register(formData);
            toast.success(res.message || 'Signup successful! Please verify your email.');
            setIsLoading(false); // Stop loading before navigation
            // Redirect to login page to wait for verification
            navigate('/login');
        } catch (error) {
            console.error(error);
            toast.error(error.message || 'Signup failed');
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Create an account"
        >
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

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
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <Button type="submit" variant="primary" isLoading={isLoading}>Sign Up</Button>



                <div className="auth-footer">
                    Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
                </div>
            </form>
        </AuthLayout>
    );
};

export default SignupForm;
