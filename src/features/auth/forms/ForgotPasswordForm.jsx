import React, { useState } from 'react';
import toast from 'react-hot-toast';
import authService from '../authService';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Label from '../../../components/ui/Label';

const ForgotPasswordForm = ({ onBack }) => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await authService.forgotPassword(email);
            // Always show success message for security (or as per req "always show neutral success-style")
            toast.success('Password reset link has been sent to your email');
            setEmail(''); // Optional clearing
        } catch (error) {
            // Requirements say: "Do not reveal whether an email exists explicitly (security best practice)"
            // BUT also said: "❌ Error: 'No account found with this email'"
            // AND "Always show a neutral success-style message"
            // These are contradictory. 
            // "UX Rules: Do not reveal whether an email exists... Always show a neutral success-style message"
            // "Notifications... ❌ Error: 'No account found with this email'"
            // I will stick to the safer UX Rule (Neutral) BUT since the user explicitly asked for specific Error text in point 5, I will prioritize showing the error if it's a "real" error (like network), but for "Not Found", standard practice is neutral.
            // However, the prompt SPECIFICALLY asked for "No account found with this email". I will follow that instruction despite it contradicting the "security best practice" note, as explicit strings usually override general advice in these prompts.
            // Wait, actually, let's look closer at the prompt:
            // "UX Rules -> Do not reveal... Always show neutral..."
            // "Notifications -> Error: No account found..."
            // It's a conflict. I'll implement the Error toast for now to be "responsive" to the specific error requirement, but I'll add a comment.
            toast.error(error.message || 'Failed to send reset link');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <Label htmlFor="forgot-email">Email</Label>
                <Input
                    id="forgot-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <Button type="submit" variant="primary" isLoading={isLoading}>
                Send Reset Link
            </Button>

            <div className="form-group" style={{ marginTop: '1rem', textAlign: 'center' }}>
                <Button
                    type="button"
                    variant="link"
                    onClick={onBack}
                    style={{ textDecoration: 'none', color: 'var(--primary-color)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                    Back to Login
                </Button>
            </div>
        </form>
    );
};

export default ForgotPasswordForm;
