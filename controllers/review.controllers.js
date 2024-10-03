import Review from '../models/review.model.js';

// Create a new review for a product
export const addReview = async (req, res) => {
  const { product_id, rating, comment } = req.body;
  const user_id = req.user._id; // Assuming protect middleware is in use

  try {
    const newReview = new Review({
      user_id,
      product_id,
      rating,
      comment
    });

    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Failed to create review' });
  }
};

// Get all reviews for a product
export const getReviewsForProduct = async (req, res) => {
  const { product_id } = req.params;

  try {
    const reviews = await Review.find({ product_id }).populate('user_id', 'name'); // Populating user's name for display
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
};

// Update a review
export const updateReview = async (req, res) => {
  const { review_id } = req.params;
  const { rating, comment } = req.body;

  try {
    const updatedReview = await Review.findByIdAndUpdate(
      review_id,
      { rating, comment },
      { new: true } // Return the updated review
    );

    if (!updatedReview) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json(updatedReview);
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ message: 'Failed to update review' });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  const { review_id } = req.params;

  try {
    const deletedReview = await Review.findByIdAndDelete(review_id);

    if (!deletedReview) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Failed to delete review' });
  }
};
