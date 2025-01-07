const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const Host = require('../model/profile');
const router = express.Router();
require('dotenv').config();

// Validate required environment variables
if (!process.env.JWT_SECRET || !process.env.CLIENT_URL) {
  throw new Error('Missing required environment variables: JWT_SECRET or CLIENT_URL');
}

// Route to start Google OAuth authentication
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback route after Google OAuth is successful
router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/login/failed' }),
  async (req, res) => {
    if (!req.user) {
      return res.redirect('/auth/login/failed');
    }

    const { id, displayName, emails, photos } = req.user;
    try {
      let host = await Host.findOne({ googleId: id });
      if (!host) {
        // Default email check
        const defaultEmail = 'no-email@google.com';

        if (emails?.[0]?.value === defaultEmail) {
          // Check if a user with the default email already exists
          host = await Host.findOne({ email: defaultEmail });
          if (!host) {
            // Only create if no host with the default email exists
            host = new Host({
              name: displayName || 'Unknown User',
              email: defaultEmail,
              googleId: id,
              profileImage: photos?.[0]?.value || '/no-profile-picture.jpg',
            });
            await host.save();
          }
        } else {
          // Proceed with the usual check for a valid email
          host = await Host.findOne({ googleId: id });
          if (!host) {
            host = new Host({
              name: displayName || 'Unknown User',
              email: emails?.[0]?.value || 'no-email@google.com',
              googleId: id,
              profileImage: photos?.[0]?.value || '/no-profile-picture.jpg',
            });
            await host.save();
          }
        }
      }

      const token = jwt.sign({ id: host._id, role: host.role }, process.env.JWT_SECRET, {
        expiresIn: '1d',
      });

      // Set the JWT token in a secure cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Ensure secure flag for HTTPS
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      });

      // Redirect to the home page
      res.redirect(`${process.env.CLIENT_URL}/home`);
    } catch (error) {
      console.error('Error during Google OAuth callback:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// Route for login failure
router.get('/auth/login/failed', (req, res) => {
  res.status(401).json({ message: 'Login failed' });
});

module.exports = router;
