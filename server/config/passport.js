const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const Host = require('../models/host');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL}/auth/google/callback`,
    },
    async (token, tokenSecret, profile, done) => {
      try {
        const host = await Host.findOne({ googleId: profile.id });
        if (!host) {
          const newHost = new Host({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            profileImage: profile.photos[0]?.value || '/no-profile-picture.jpg',
          });
          await newHost.save();
          return done(null, newHost);
        }
        return done(null, host);
      } catch (error) {
        console.error('Error during passport strategy:', error);
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  Host.findById(id, (err, user) => done(err, user));
});

module.exports = passport;
