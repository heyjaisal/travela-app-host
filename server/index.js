const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
const session = require('express-session');
const authRoute = require('./routes/auth.routes');
const authRoutes = require('./routes/routes');
require('dotenv').config();

const app = express();

const { MONGO_URI, SESSION_SECRET, CLIENT_URL, PORT } = process.env;
if (!MONGO_URI || !SESSION_SECRET) {
  throw new Error('MongoDB URI or Session Secret is missing in environment variables.');
}

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB connection error:', err));

app.use(express.json());

require('./config/passport'); 

app.use(cors({
  origin: CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' },
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api', authRoutes); 
app.use(authRoute);

const port = PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
