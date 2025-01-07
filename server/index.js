const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
const session = require('express-session');
const authRoute = require('./routes/auth.routes');
const authRoutes = require('./routes/routes');
require('dotenv').config();

const app = express();

// Validate required environment variables
const { MONGO_URI, SESSION_SECRET, CLIENT_URL, PORT } = process.env;
if (!MONGO_URI || !SESSION_SECRET) {
  throw new Error('MongoDB URI or Session Secret is missing in environment variables.');
}

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Middleware
app.use(express.json());

// Initialize Passport
require('./config/passport'); // Ensure passport is initialized before routes

// CORS setup
app.use(cors({
  origin: CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// Session handling
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' },
}));

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api', authRoutes);  // API routes for additional endpoints
app.use(authRoute);  // Authentication routes

// Start the server
const port = PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
