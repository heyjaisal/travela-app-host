const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const googleRoutess = require('./routes/authroutes');
const authRoutes = require('./routes/routes')
require('dotenv').config();

const app = express();
require('./config/passport')(passport);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api', authRoutes);
app.use(googleRoutess);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
