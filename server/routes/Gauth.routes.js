const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const Host = require('../model/profile');
const router = express.Router();
require('dotenv').config();

if (!process.env.JWT_SECRET || !process.env.CLIENT_URL) {
  throw new Error('Missing required environment variables: JWT_SECRET or CLIENT_URL');
}

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/auth/login/failed' }), async (req, res) => {
  if (!req.user) {
    console.error('No user data found in callback.');
    return res.redirect('/auth/login/failed');
  }

  if (!req.user.email) {
    console.error('No email associated with the Google account:', req.user);
    return res.status(400).json({ message: 'No email associated with the Google account.' });
  }

  const { googleId, displayName, email, photos } = req.user;
  const profileImage = photos?.[0]?.value || '/no-profile-picture.jpg';

  try {
    let host = await Host.findOne({ googleId });

    if (!host) {
      host = new Host({
        name: displayName,
        email,
        googleId,
        profileImage,
      });
      await host.save();
    }

    const token = jwt.sign({ id: host._id, role: host.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 60 * 60 * 24 * 30 * 5 * 1000, // 5 months
      path: '/',
    });
    

    res.redirect(`${process.env.CLIENT_URL}/login?token=${token}&role=${host.role}`);
  } catch (error) {
    console.error('Error during Google OAuth callback:', error);
    res.status(500).json({ message: `Internal server error: ${error.message}` });
  }
});

// Login failed route
router.get('/auth/login/failed', (req, res) => {
  res.status(401).json({ message: 'Login failed' });
});

// Logout route
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
