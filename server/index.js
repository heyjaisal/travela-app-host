const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
const session = require('express-session');
const authRoute = require('./routes/auth.routes');
const authRoutes = require('./routes/routes')
require('dotenv').config();

const app = express();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

app.use(
  session({
    name: 'session',
    keys: ['travela'],
    maxAge: 24 * 60 * 60 * 1000,
  })
);

app.use('/api', authRoutes);
app.use('/auth', authRoute);

app.use(passport.initialize());
app.use(passport.session());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));