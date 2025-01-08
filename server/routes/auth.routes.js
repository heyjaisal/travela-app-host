const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const Host = require('../model/profile');
const router = express.Router();
require('dotenv').config();

if (!process.env.JWT_SECRET || !process.env.CLIENT_URL) {
  throw new Error('Missing required environment variables: JWT_SECRET or CLIENT_URL');
}

// Google OAuth Login Route
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth Callback Route
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/auth/login/failed' }), async (req, res) => {
  if (!req.user) return res.redirect('/auth/login/failed');

  const { id, displayName, emails, photos } = req.user;
  const email = emails?.[0]?.value || 'no-email@google.com';
  const profileImage = photos?.[0]?.value || '/no-profile-picture.jpg';

  try {
    let host = await Host.findOne({ googleId: id }) || await Host.findOne({ email });
    if (!host) {
      host = new Host({
        name: displayName || 'Unknown User',
        email,
        googleId: id,
        profileImage,
      });
      await host.save();
    }

    const token = jwt.sign({ id: host._id, role: host.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 60 * 60 * 24 * 7 * 1000,
      path: '/', 
    });
    res.redirect(`${process.env.CLIENT_URL}/home?token=${token}&role=${host.role}`); 
    

  } catch (error) {
    console.error('Error during Google OAuth callback:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/auth/login/failed', (req, res) => {
  res.status(401).json({ message: 'Login failed' });
});


router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Failed to log out.');
    }
    res.clearCookie('token'); 
    res.redirect(`${process.env.CLIENT_URL}/`);
  });
});

module.exports = router;
