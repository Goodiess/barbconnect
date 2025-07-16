const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  barbershop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Barbershop',
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  comment: String
}, {
  timestamps: true
});

// Prevent duplicate reviews by same user on same shop
reviewSchema.index({ user: 1, barbershop: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
// This model defines the structure of a review document in MongoDB.
// It includes fields for the user who wrote the review, the barbershop being reviewed,