require('dotenv').config();
require('./config/passport'); // Import passport config
const express = require('express');
const passport = require('passport');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(passport.initialize());

// Routes
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

module.exports = app;
