const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const authRoute = require('./routes/Gauth.routes');
const authRoutes = require('./routes/auth.routes'); 
const userRoutes = require('./routes/create.routes');
const listingRoutes = require('./routes/listing.routes');
const paymentRoutes = require('./routes/payment.routes');
const GraphRoutes = require('./routes/graphs.routes');

const app = express();
require('dotenv').config();

const mongoURL = process.env.MONGO_URI;

const Port = process.env.PORT || 5000

app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' },
}));

app.use(express.json());

require('./config/passport');

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoutes); 
app.use('/api/host/auth', userRoutes);
app.use('/api/listing',listingRoutes)
app.use('/api/payment',paymentRoutes)
app.use('/api/graphs',GraphRoutes)
app.use(authRoute);
app.use("/uploads", express.static("uploads"));

const server = app.listen(Port, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});

mongoose.connect(mongoURL).then(() => {
  console.log('Database connection done');
}).catch(err => console.log(err.message));
