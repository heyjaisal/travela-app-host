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
if (!process.env.MONGO_URI || !process.env.SESSION_SECRET) {
  throw new Error('MongoDB URI or Session Secret is missing in environment variables.');
}

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Middleware
app.use(express.json());

// Initialize Passport
require('./config/passport'); // Ensure passport is initialized before routes

// CORS setup
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));

// Session handling
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api', authRoutes);  // API routes for additional endpoints
app.use(authRoute);  // Authentication routes

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
