import React from 'react';
import StarRating from './StarRating';
import { Review } from '../services/reviewService';

interface ReviewListProps {
  reviews: Review[];
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No reviews yet. Be the first to review this product!</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-gold/20 rounded-full flex items-center justify-center">
                <span className="text-brand-gold font-semibold text-sm">
                  {(review.user_email || 'A').charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {review.user_email?.split('@')[0] || 'Anonymous'}
                </p>
                <p className="text-xs text-gray-500">{formatDate(review.created_at)}</p>
              </div>
            </div>
            <StarRating rating={review.rating} size="sm" />
          </div>
          {review.comment && <p className="text-gray-600 mt-2 pl-13">{review.comment}</p>}
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
