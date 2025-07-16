const express = require('express');
const { addReview, getReviews } = require('../controllers/reviewController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/:barbershopId', auth, addReview);     // POST /api/reviews/:barbershopId
router.get('/:barbershopId', getReviews);           // GET  /api/reviews/:barbershopId

module.exports = router;
// This file defines the routes for handling reviews.
// It uses the Express router to handle POST requests for adding reviews and GET requests for fetching reviews for a specific barbershop.
// The `auth` middleware is applied to the POST route to ensure only authenticated users can add reviews.
// The `addReview` controller handles the logic for adding a review, while the `get