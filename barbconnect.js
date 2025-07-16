require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

// Cloudinary configuration
const cloudinary = require('cloudinary').v2;  // Importing cloudinary from 'cloudinary' package

// Route imports
const authRoutes = require('./src/routes/authRoutes');
const barbershopRoutes = require('./src/routes/barbershopRoutes');
const reviewRoutes = require('./src/routes/reviewRoutes');

const app = express();
app.use(express.json());

const uploadRoutes = require('./src/routes/uploadRoutes');
app.use('/api/upload', uploadRoutes);


// Route setup (after `app` is initialized)
app.use('/api/auth', authRoutes);
app.use('/api/barbershops', barbershopRoutes);
app.use('/api/reviews', reviewRoutes);

const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => console.error(err));
