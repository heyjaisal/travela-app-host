const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const session = require('express-session');
const cookieParser = require('cookie-parser');
const authRoute = require('./routes/Gauth.routes');
const authRoutes = require('./routes/auth.routes'); 
const userRoutes = require('./routes/create.routes');
const listingRoutes = require('./routes/listing.routes');
const message = require("./routes/messages.routes")
const paymentRoutes = require('./routes/payment.routes');
const GraphRoutes = require('./routes/graphs.routes');

const setupSocketServer = require('./sockets'); 

const app = express();

const server = http.createServer(app);

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5175',
  'https://user.jaisal.blog',
  'https://host.jaisal.blog',
];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

app.set('io', io);
app.set('trust proxy', 1);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    domain: process.env.NODE_ENV === 'production' ? '.jaisal.blog' : undefined,
  },
}));

app.use(express.json());

require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());


app.use('/api/auth', authRoutes); 
app.use('/api/host/auth', userRoutes);
app.use('/api/listing',listingRoutes)
app.use('/api/payment',paymentRoutes)
app.use('/api/graphs',GraphRoutes);
app.use('/api/chat',message)
app.use(authRoute);
app.use("/uploads", express.static("uploads"));

setupSocketServer(io); 

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[DB] ✅ Connected to MongoDB');

    const PORT = process.env.PORT || 7000;
    server.listen(PORT, () => {
      console.log(`[Server] 🚀 Listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('[DB] ❌ MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

startServer();