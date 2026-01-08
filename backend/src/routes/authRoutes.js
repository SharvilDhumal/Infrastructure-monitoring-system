const express = require('express');
const router = express.Router();
const { signup, login, verifyEmail, forgotPassword, resetPassword, googlePrecheck } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.post('/reset-password', resetPassword);

// Google OAuth Routes
const passport = require('passport');
const { googleCallback } = require('../controllers/authController');

// Pre-check
router.post('/google/precheck', googlePrecheck);

// Scope: profile and email
router.get('/google', (req, res, next) => {
    const state = req.query.state;
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        prompt: 'select_account',
        state: state
    })(req, res, next);
});

// Callback
router.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    googleCallback
);

module.exports = router;
