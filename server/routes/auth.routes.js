const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const Host = require('../model/profile')
const router = express.Router();

router.get('/google', passport.authenticate('google', ['profile', 'email']));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login/failed' }),
  async (req, res) => {
    const { id, displayName, emails, photos } = req.user;
    try {
      let host = await Host.findOne({ googleId: id });
      if (!host) {
        host = new Host({
          name: displayName,
          email: emails[0].value,
          googleId: id,
          profileImage: photos[0]?.value || '/no-profile-picture.jpg',
        });
        await host.save();
      }

      const token = jwt.sign({ id: host._id, role: host.role }, process.env.JWT_SECRET, {
        expiresIn: '1d',
      });

      res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
      res.redirect(`${process.env.CLIENT_URL}?token=${token}`);
    } catch (error) {
      console.error('Error during Google OAuth callback:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

router.get('/login/failed', (req, res) => {
  res.status(401).json({ message: 'Login failed' });
});

module.exports = router;
