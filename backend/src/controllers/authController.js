const User = require('../models/User');
const EmailToken = require('../models/EmailToken');
const sendEmail = require('../utils/sendEmail');
const { normalizeProvider } = require('../utils/authUtils');
const {
  getPasswordResetTemplate,
  getVerificationEmailTemplate,
  getWelcomeEmailTemplate
} = require('../utils/emailTemplates');

const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

/* =========================
   NORMAL SIGNUP (EMAIL/PASSWORD)
========================= */
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      const provider = normalizeProvider(user);
      if (provider === 'google') {
        return res.status(409).json({ message: 'Please sign in with Google' });
      }
      return res.status(409).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
      provider: 'local',
      isVerified: false
    });

    await user.save();

    const token = crypto.randomBytes(32).toString('hex');

    await EmailToken.create({
      userId: user._id,
      token,
      expiresAt: Date.now() + 86400000 // 24h
    });

    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
    const verifyUrl = `${baseUrl}/api/auth/verify-email?token=${token}`;

    await sendEmail(
      user.email,
      'Verify your email',
      `Click to verify: ${verifyUrl}`,
      getVerificationEmailTemplate(verifyUrl)
    );

    res.status(201).json({
      message: 'Please verify your email to continue'
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/* =========================
   EMAIL VERIFICATION
========================= */
exports.verifyEmail = async (req, res) => {
  try {
    const tokenStr = req.query.token;
    if (!tokenStr) return res.status(400).send('Token missing');

    const token = await EmailToken.findOne({ token: tokenStr });
    if (!token || token.expiresAt < Date.now()) {
      return res.status(400).send('Invalid or expired token');
    }

    const user = await User.findById(token.userId);
    if (!user) return res.status(400).send('User not found');

    user.isVerified = true;
    await user.save();
    await EmailToken.deleteOne({ _id: token._id });

    res.redirect(`${FRONTEND_URL}/email-verified`);
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).send('Server error');
  }
};

/* =========================
   NORMAL LOGIN
========================= */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const provider = normalizeProvider(user);
    if (provider === 'google') {
      return res.status(409).json({ message: 'Please sign in with Google' });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: 'Please verify your email before logging in'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/* =========================
   FORGOT PASSWORD
========================= */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Security: Don't reveal if user exists or not, but for this app requirements seem open
      // Plan said: "User not found" is acceptable or generic message. Existing code was 404.
      // Let's stick to 404 for clarity as per user request for meaningful errors, 
      // though security wise 200 is better. User asked for "Errors are clear and meaningful".
      return res.status(404).json({ message: 'Please create an account first' });
    }

    // Fix: Explicitly check for google provider to block.
    // Legacy users (undefined provider) or 'local' provider should be allowed.
    if (user.provider === 'google') {
      return res.status(400).json({ message: 'Please sign in with Google to reset your password' });
    }

    const token = crypto.randomBytes(32).toString('hex');

    await EmailToken.findOneAndUpdate(
      { userId: user._id },
      { token, expiresAt: Date.now() + 3600000 },
      { upsert: true, new: true }
    );

    const resetUrl = `${FRONTEND_URL}/reset-password?token=${token}`;

    await sendEmail(
      user.email,
      'Reset Password',
      `Reset here: ${resetUrl}`,
      getPasswordResetTemplate(resetUrl)
    );

    res.json({ message: 'Reset link sent to email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/* =========================
   RESET PASSWORD
========================= */
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const emailToken = await EmailToken.findOne({ token });
    if (!emailToken || emailToken.expiresAt < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const user = await User.findById(emailToken.userId);
    if (!user) return res.status(400).json({ message: 'User not found' });

    if (user.provider === 'google') {
      return res.status(400).json({ message: 'Please sign in with Google' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    // Auto-verify user on password reset since they proved email ownership
    user.isVerified = true;
    await user.save();

    await EmailToken.deleteOne({ _id: emailToken._id });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/* =========================
   GOOGLE CALLBACK (LOGIN + SIGNUP)
========================= */
exports.googleCallback = async (req, res) => {
  try {
    const { email, googleId, name, avatar } = req.user;

    // Decode state (login/signup)
    // Default to 'login' if not specified
    let flow = 'login';
    if (req.query.state) {
      try {
        const decoded = JSON.parse(
          Buffer.from(req.query.state, 'base64url').toString('utf-8')
        );
        flow = decoded.flow || 'login';
      } catch { }
    }

    let user = await User.findOne({ email });

    if (user) {
      const provider = normalizeProvider(user);

      if (provider !== 'google') {
        // User exists as local, force password login
        return res.redirect(`${FRONTEND_URL}/login?error=use_password_login`);
      }

      // Existing Google user - ensure they are verified
      if (!user.isVerified) {
        user.isVerified = true;
        await user.save();
      }

      // FLOW: SIGNUP
      // If user exists but flow is signup -> Redirect to Account Exists
      if (flow === 'signup') {
        return res.redirect(`${FRONTEND_URL}/account-exists`);
      }

      // FLOW: LOGIN
      // If user exists and flow is login -> Proceed to login (fall through)

    } else {
      // User does NOT exist

      // FLOW: LOGIN
      // If user missing and flow is login -> Redirect to No Account Found
      if (flow === 'login') {
        return res.redirect(`${FRONTEND_URL}/no-account-found`);
      }

      // FLOW: SIGNUP
      // If user missing and flow is signup -> Create new user
      user = await User.create({
        name,
        email,
        provider: 'google',
        googleId,
        isVerified: true,
        avatar
      });

      // Send welcome email asynchronously
      sendEmail(
        user.email,
        'Welcome to Infravision AI',
        'Welcome!',
        getWelcomeEmailTemplate(FRONTEND_URL)
      ).catch(() => { });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Redirect based on flow/type
    // Login flow -> type=login (frontend will auto-redirect)
    // Signup flow -> type=signup (frontend will show success page)
    res.redirect(
      `${FRONTEND_URL}/google-success?token=${token}&type=${flow}`
    );
  } catch (error) {
    console.error('Google callback error:', error);
    res.redirect(
      `${FRONTEND_URL}/login?error=server_error`
    );
  }
};
