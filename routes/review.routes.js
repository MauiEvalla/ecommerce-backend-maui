import express from 'express';
import { addReview, getReviewsForProduct, updateReview, deleteReview } from '../controllers/review.controllers.js';
import { protect } from '../middlewares/protect.js';

const router = express.Router();

// Add a review (Protected route)
router.post('/', protect, addReview);

// Get all reviews for a product
router.get('/:product_id', getReviewsForProduct);

// Update a review (Protected route)
router.put('/:review_id', protect, updateReview);

// Delete a review (Protected route)
router.delete('/:review_id', protect, deleteReview);

export default router;
