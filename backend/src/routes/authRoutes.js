const express = require('express');
const router = express.Router();
const { signup, login, verifyEmail, forgotPassword, resetPassword } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);
router.get('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.post('/reset-password', resetPassword);

// Google OAuth Routes
const passport = require('passport');
const { googleCallback } = require('../controllers/authController');

// Scope: profile and email
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback
router.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    googleCallback
);

module.exports = router;
