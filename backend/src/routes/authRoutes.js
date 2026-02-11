const express = require('express');
const router = express.Router();
const passport = require('passport');

const {
  signup,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  googleCallback
} = require('../controllers/authController');

/* =========================
   NORMAL AUTH ROUTES
========================= */
router.post('/signup', signup);
router.post('/login', login);
router.get('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

/* =========================
   GOOGLE AUTH ROUTES (FIXED)
========================= */

// 👉 Start Google OAuth
// ❌ NO flow
// ❌ NO state
// ❌ NO user checks
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

// 👉 Google OAuth Callback
// ALL decisions happen inside googleCallback
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/auth/result?status=auth_failed`
  }),
  googleCallback
);

module.exports = router;
