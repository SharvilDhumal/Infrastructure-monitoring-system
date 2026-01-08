const User = require('../models/User');
const Token = require('../models/Token');
const sendEmail = require('../utils/sendEmail');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { getPasswordResetTemplate, getVerificationEmailTemplate } = require('../utils/emailTemplates');

// Generate JWT Helper
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        // Check availability
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(409).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        // Generate Token
        // NOTE: If you have email verification, don't generate token here or don't login yet.
        // For MERN simplicity, often we log them in or ask to verify.
        // Assuming verification is needed:

        let token = await new Token({
            userId: user._id,
            token: crypto.randomBytes(32).toString('hex'),
        }).save();

        const url = `${process.env.CLIENT_URL}/verify/${user._id}/${token.token}`;
        const message = getVerificationEmailTemplate(url);
        await sendEmail(user.email, 'Verify Email', '', message);

        res.status(201).json({
            message: 'An email has been sent to your account. Please verify.',
            user: { _id: user._id, name: user.name, email: user.email },
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            if (!user.isVerified) {
                return res.status(400).json({ message: 'Please verify your email first.' });
            }

            res.json({
                user: { _id: user._id, name: user.name, email: user.email },
                token: generateToken(user._id),
                message: 'Login successful'
            });
        } else {
            res.status(400).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Verify Email
// @route   GET /api/auth/verify-email
// @access  Public
// NOTE: Ideally this should accept tokens via params, but based on routes, it might be looking for query or body.
// Adjusted to standard: GET /api/auth/verify-email?id=...&token=... 
// OR often routes are /verify/:id/:token
// @desc    Verify Email
// @route   POST /api/auth/verify-email
// @access  Public
exports.verifyEmail = async (req, res) => {
    try {
        const { userId, token } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(400).json({ message: 'Invalid link' });

        const verificationToken = await Token.findOne({
            userId: user._id,
            token: token,
        });

        if (!verificationToken) {
            return res.status(400).json({ message: 'Invalid or expired link' });
        }

        user.isVerified = true;
        await user.save();
        await verificationToken.deleteOne();

        res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'No account found with this email' });
        }

        // Delete any existing tokens for this user
        await Token.deleteMany({ userId: user._id });

        // Generate unhashed token
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Hash token before saving to DB
        const hashedToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Save hashed token
        await new Token({
            userId: user._id,
            token: hashedToken,
            createdAt: Date.now(),
        }).save();

        // Create Reset URL with UNHASHED token
        const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}&id=${user._id}`;

        // Use HTML Template
        const message = getPasswordResetTemplate(resetUrl);

        try {
            // Send Email (prioritize HTML)
            await sendEmail(user.email, 'Password Reset Request', '', message);
            res.json({ message: 'Password reset link has been sent to your email' });
        } catch (emailError) {
            // Cleanup token if email fails
            await Token.deleteMany({ userId: user._id });
            console.error('Email send failed:', emailError);
            return res.status(500).json({ message: 'Email could not be sent' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword, id } = req.body;

        // Hash the incoming token to compare with DB
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        // Find token in DB
        const resetTokenDoc = await Token.findOne({
            userId: id,
            token: hashedToken,
        });

        if (!resetTokenDoc) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        // Delete the used token
        await resetTokenDoc.deleteOne();

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Check if user exists for Google Auth
// @route   POST /api/auth/google/precheck
// @access  Public
exports.googlePrecheck = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        res.json({ exists: !!user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Google OAuth Callback
// @route   GET /api/auth/google/callback
// @access  Public
exports.googleCallback = async (req, res) => {
    // req.user contains the authenticated user from Passport Google Strategy
    const token = generateToken(req.user._id);

    // Check state to enforce intent
    const state = req.query.state; // 'signup' or 'login'

    // Check if the user object has the transient _isNew flag from passport
    const isNewUser = req.user._isNew === true;

    // SCENARIO 1: User Tried to SIGNUP, but Account ALREADY EXISTS
    if (state === 'signup' && !isNewUser) {
        // Requirement: "Case A: Google Email Already Exists -> Redirect to Account Exists Screen"
        // We do NOT log them in. We redirect to a special page.
        // We do NOT pass the token.
        return res.redirect(`${process.env.CLIENT_URL}/account-exists`);
    }

    // SCENARIO 2: User Tried to SIGNUP, and is NEW -> Success
    // SCENARIO 3: User Tried to LOGIN (new or existing) -> Success (Login flow usually allows creating if not found, or just logging in)

    // For "Login", if they are new, they just get created and logged in. That's standard behavior.
    // If we wanted to restrict login to ONLY existing, we'd need more logic, but user req only specified Signup restrictions.

    // Prepare user data for frontend
    const userStr = JSON.stringify({
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        authProvider: req.user.authProvider
    });

    // If Signup & New -> Redirect to Success Screen
    if (state === 'signup' && isNewUser) {
        // Redirect to Shared Success Screen (used for both, but maybe with a flag)
        // requirement: "Redirect to Success Screen (same as normal signup)"
        return res.redirect(`${process.env.CLIENT_URL}/auth-success?token=${token}&user=${encodeURIComponent(userStr)}&type=signup`);
    }

    // If Login -> Redirect to Dashboard (or intermediate success if requested)
    // Requirement for login isn't explicitly "Show Success Screen", but in previous convo they wanted it.
    // Let's stick to the current "GoogleSuccess" page which handles "login" type.
    const redirectUrl = `${process.env.CLIENT_URL}/auth-success?token=${token}&user=${encodeURIComponent(userStr)}&type=login`;

    res.redirect(redirectUrl);
};
