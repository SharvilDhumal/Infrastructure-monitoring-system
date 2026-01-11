const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if user already exists
            let user = await User.findOne({ email: profile.emails[0].value });

            if (user) {
                // If user exists but provider is not google, you might want to link accounts
                // For now, we just log them in. 
                // Optional: Update googleId if you had one, or provider.
                // keeping it simple as per instructions.
                return done(null, user);
            }

            // Create new user
            user = new User({
                name: profile.displayName,
                email: profile.emails[0].value,
                provider: 'google',
                isVerified: true, // Google emails are verified
                password: '' // No password for Google auth
            });

            await user.save();

            // Mark as new user to trigger welcome email in controller
            user._isNewUser = true;

            done(null, user);
        } catch (error) {
            done(error, null);
        }
    }));

module.exports = passport;
