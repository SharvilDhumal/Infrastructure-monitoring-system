const User = require('../models/User');
const EmailToken = require('../models/EmailToken');
const sendEmail = require('../utils/sendEmail');
const { getPasswordResetTemplate, getWelcomeEmailTemplate, getVerificationEmailTemplate } = require('../utils/emailTemplates');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            name,
            email,
            password: hashedPassword,
        });

        await user.save();

        const token = crypto.randomBytes(32).toString('hex');
        const emailToken = new EmailToken({
            userId: user._id,
            token: token,
            expiresAt: Date.now() + 86400000 // 24 hours (matched to email text)
        });
        await emailToken.save();

        // Construct verification URL pointing to the BACKEND
        // The backend will handle the verification and redirect to frontend
        const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
        const url = `${baseUrl}/api/auth/verify-email?token=${token}`;

        const emailHtml = getVerificationEmailTemplate(url);

        await sendEmail(user.email, 'Verify your email address', `Click this link to verify your email: ${url}`, emailHtml);

        res.status(201).json({ message: 'Please check your email and click verify to continue' });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.verifyEmail = async (req, res) => {
    try {
        const tokenStr = req.query.token;
        if (!tokenStr) return res.status(400).send('No token provided');

        const token = await EmailToken.findOne({ token: tokenStr });
        if (!token) return res.status(400).send('Invalid or expired token');

        if (token.expiresAt < Date.now()) {
            await EmailToken.deleteOne({ _id: token._id });
            return res.status(400).send('Token expired');
        }

        const user = await User.findById(token.userId);
        if (!user) return res.status(400).send('User not found');

        user.isVerified = true;
        await user.save();
        await EmailToken.deleteOne({ _id: token._id });

        // Redirect to frontend email verified page
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        res.redirect(`${frontendUrl}/email-verified`);
    } catch (error) {
        console.error('Verify error:', error);
        res.status(500).send('Server Error');
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        if (!user.isVerified) {
            return res.status(403).json({ message: 'Please verify your email before logging in' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const token = crypto.randomBytes(32).toString('hex');

        // Create or update token
        await EmailToken.findOneAndUpdate(
            { userId: user._id },
            { token: token, expiresAt: Date.now() + 3600000 },
            { upsert: true, new: true }
        );

        // Link points to Frontend Reset Page
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const url = `${frontendUrl}/reset-password?token=${token}`;

        const emailHtml = getPasswordResetTemplate(url);

        await sendEmail(user.email, 'Reset Password', `Click this link to reset your password: ${url}`, emailHtml);

        res.json({ message: 'Reset link sent to email' });

    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        const emailToken = await EmailToken.findOne({ token });
        if (!emailToken) return res.status(400).json({ message: 'Invalid or expired token' });

        if (emailToken.expiresAt < Date.now()) {
            await EmailToken.deleteOne({ _id: emailToken._id });
            return res.status(400).json({ message: 'Token expired' });
        }

        const user = await User.findById(emailToken.userId);
        if (!user) return res.status(400).json({ message: 'User not found' });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        await EmailToken.deleteOne({ _id: emailToken._id });

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.googleCallback = async (req, res) => {
    try {
        const user = req.user;

        // Generate JWT
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

        // Check if new user flag was set in strategy
        if (user._isNewUser) {
            // Send Welcome Email
            const emailHtml = getWelcomeEmailTemplate(frontendUrl); // Points to Homepage as requested

            // Send email asynchronously (don't block response)
            sendEmail(user.email, 'Welcome to Infravision AI', 'Welcome to our platform!', emailHtml).catch(err => {
                console.error('Failed to send welcome email:', err);
            });
        }

        if (user._isNewUser) {
            // Redirect to Google Success Page for new users
            res.redirect(`${frontendUrl}/google-success?token=${token}&type=signup`);
        } else {
            // Redirect to Google Success Page for existing users too (intermediate screen)
            res.redirect(`${frontendUrl}/google-success?token=${token}&type=login`);
        }

    } catch (error) {
        console.error('Google callback error:', error);
        res.redirect('/login?error=server_error');
    }
};
