const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Host = require('../model/profile');
require('dotenv').config();

// Validate environment variables
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error('Google OAuth credentials not found in environment variables.');
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/auth/google/callback',
    },
    async (token, tokenSecret, profile, done) => {
      try {
        // Default email to check
        const defaultEmail = 'no-email@google.com';

        let host = await Host.findOne({ googleId: profile.id });
        if (!host) {
          // Check if the email is the default one and handle it separately
          const email = profile.emails?.[0]?.value || defaultEmail;

          // Check if a user with the default email already exists
          host = await Host.findOne({ email });
          if (!host) {
            // If not, create a new host
            const newHost = new Host({
              name: profile.displayName,
              email: email,
              googleId: profile.id,
              profileImage: profile.photos[0]?.value || '/no-profile-picture.jpg',
            });
            await newHost.save();
            return done(null, newHost);
          }
        }

        // If user exists with Google ID, return the existing host
        return done(null, host);
      } catch (error) {
        console.error('Error during passport strategy:', error);
        return done(error, null);
      }
    }
  )
);


// Serialize and deserialize user for sessions
passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await Host.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
