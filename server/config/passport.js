const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Host = require('../models/profile'); 

module.exports = (passport) => {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/auth/google/callback',
  },
  async (accessToken, refreshToken, profile, done) => {
    const { id, displayName, emails, photos } = profile;
    try {
      let user = await Host.findOne({ googleId: id }); 
      if (!user) {
        user = await Host.create({
          name: displayName,
          email: emails[0].value,
          googleId: id,
          profileImage: photos[0].value,
          verified: true, 
        });
      }
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }));

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => User.findById(id).then(user => done(null, user)));
};
