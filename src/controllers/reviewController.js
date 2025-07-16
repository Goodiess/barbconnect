const Review = require('../models/Review');

// Add a review (clients only)
exports.addReview = async (req, res) => {
  if (req.user.role !== 'client') {
    return res.status(403).json({ message: 'Only clients can leave reviews' });
  }

  const { barbershopId } = req.params;
  const { rating, comment } = req.body;

  try {
    const review = new Review({
      user: req.user.userId,
      barbershop: barbershopId,
      rating,
      comment
    });

    await review.save();
    res.status(201).json(review);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'You already reviewed this barbershop' });
    }
    res.status(500).json({ error: err.message });
  }
};

// Get all reviews for a barbershop
exports.getReviews = async (req, res) => {
  const { barbershopId } = req.params;

  try {
    const reviews = await Review.find({ barbershop: barbershopId }).populate('user', 'name');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Delete a review (clients only)
exports.deleteReview = async (req, res) => { 
  if (req.user.role !== 'client') {
    return res.status(403).json({ message: 'Only clients can delete reviews' });
  }

  try {
    const review = await Review.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found or you are not authorized to delete it' });
    }

    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}