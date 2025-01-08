const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const authRoute = require('./routes/auth.routes');
const authRoutes = require('./routes/routes');
require('dotenv').config();

const app = express();
app.use(cookieParser());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB connection error:', err));

app.use(express.json());

// Passport Configuration
require('./config/passport');

// CORS Configuration - Allow frontend origin
app.use(cors({
  origin: 'http://localhost:5173',  // Allow only your frontend URL
  credentials: true,  // Allow cookies to be sent with requests
}));

// Session Handling
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }, // Adjust for production
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api', authRoutes); 
app.use(authRoute);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
