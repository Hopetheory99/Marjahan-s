import React, { useState } from 'react';
import StarRating from './StarRating';
import Button from './Button';
import { reviewService } from '../services/reviewService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

interface ReviewFormProps {
  productId: string;
  onReviewAdded: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ productId, onReviewAdded }) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      addToast('Please login to submit a review.', 'error');
      return;
    }

    if (rating === 0) {
      addToast('Please select a star rating.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await reviewService.addReview(productId, user.id, rating, comment);
      addToast('Review submitted successfully!', 'success');
      setRating(0);
      setComment('');
      onReviewAdded();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to submit review.';
      addToast(message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg text-center">
        <p className="text-gray-600">
          Please{' '}
          <a href="/login" className="text-brand-gold underline">
            login
          </a>{' '}
          to leave a review.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg space-y-4">
      <h4 className="font-semibold text-lg">Write a Review</h4>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Your Rating</label>
        <StarRating rating={rating} size="lg" interactive onRatingChange={setRating} />
      </div>
      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
          Your Review (Optional)
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder="Share your experience with this product..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none resize-none"
        />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </Button>
    </form>
  );
};

export default ReviewForm;
