const express = require('express');
const router = express.Router();
const {
  createBarbershop,
  getBarbershops,
  getNearbyBarbershops,
  getBarbershopById,
  updateBarbershop,
  deleteBarbershop
} = require('../controllers/barbershopController');
const auth = require('../middleware/authMiddleware');

// Routes
router.post('/', auth, createBarbershop);
router.get('/', getBarbershops);
router.get('/nearby', getNearbyBarbershops);
router.get('/:id', getBarbershopById);
router.put('/:id', auth, updateBarbershop);
router.delete('/:id', auth, deleteBarbershop);

module.exports = router;
// This file defines the routes for barbershop operations.
// It uses the Express router to handle POST requests for creating a barbershop, GET requests