const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
            passReqToCallback: true
        },
        async (req, accessToken, refreshToken, profile, done) => {
            try {
                // Check if user exists by Google ID
                let user = await User.findOne({ googleId: profile.id });

                if (user) {
                    return done(null, user);
                }

                // Check if user exists by Email
                user = await User.findOne({ email: profile.emails[0].value });

                if (user) {
                    // Update user with Google ID if they signed up locally previously
                    user.googleId = profile.id;
                    // We don't change authProvider to 'google' exclusively, but we could if we want to track primary
                    // For now, let's just link it.
                    user.isVerified = true;
                    await user.save();
                    return done(null, user);
                }

                // Create new user
                user = new User({
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    authProvider: 'google',
                    isVerified: true, // Google emails are verified
                });

                await user.save();
                // Mark as new for the controller to know
                user._isNew = true;
                return done(null, user);
            } catch (err) {
                console.error(err);
                return done(err, null);
            }
        }
    )
);

// Serialization (Not strictly needed for session: false, but good practice if session used later)
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});
