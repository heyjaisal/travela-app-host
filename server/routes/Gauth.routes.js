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

// Google OAuth callback route
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
        // No password here
      });
      await host.save();
    }

    // Sign the JWT token with the user ID
    const token = jwt.sign({ email: host.email, userId: host._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Send the token as a cookie
    res.cookie('token', token, {
      httpOnly: true,  
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 60 * 60 * 24 * 30 * 5 * 1000,  // 5 months expiry
      path: '/',
    });

    // Redirect the user to the home page
    res.redirect(`${process.env.CLIENT_URL}/home`);
    
  } catch (error) {
    console.error('Error during Google OAuth callback:', error);
    res.status(500).json({ message: `Internal server error: ${error.message}` });
  }
});


router.get('/auth/login/failed', (req, res) => {
  res.status(401).json({ message: 'Login failed' });
});

router.get('/logout', (req, res) => {

  res.clearCookie('token');
  res.redirect(`${process.env.CLIENT_URL}/`);
});

module.exports = router;
