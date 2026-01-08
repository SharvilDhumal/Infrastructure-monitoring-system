const express = require('express');
const cors = require('cors');
const passport = require('passport');
require('./config/passport'); // Import Passport Config
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(passport.initialize());

// Routes
app.use('/api/auth', authRoutes);

module.exports = app;
