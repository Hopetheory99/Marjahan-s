import { supabase } from './supabaseClient';

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  user_email?: string;
  profiles?: {
    email: string;
  };
}

export interface CreateReviewData {
  product_id: string;
  rating: number;
  comment?: string;
}

export const reviewService = {
  // Get all reviews for a product
  async getReviewsByProduct(productId: string): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select(
        `
        *,
        profiles:user_id (
          email
        )
      `,
      )
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Map profiles.email to user_email for compatibility
    const reviews = (data || []).map((review) => ({
      ...review,
      user_email: review.profiles?.email,
    }));

    return reviews;
  },

  // Create a new review
  async createReview(reviewData: CreateReviewData): Promise<Review> {
    const { data, error } = await supabase
      .from('reviews')
      .insert(reviewData)
      .select(
        `
        *,
        profiles:user_id (
          email
        )
      `,
      )
      .single();

    if (error) throw error;
    return {
      ...data,
      user_email: data.profiles?.email,
    };
  },

  // Update a review
  async updateReview(reviewId: string, updates: Partial<CreateReviewData>): Promise<Review> {
    const { data, error } = await supabase
      .from('reviews')
      .update(updates)
      .eq('id', reviewId)
      .select(
        `
        *,
        profiles:user_id (
          email
        )
      `,
      )
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a review
  async deleteReview(reviewId: string): Promise<void> {
    const { error } = await supabase.from('reviews').delete().eq('id', reviewId);

    if (error) throw error;
  },

  // Get average rating for a product
  async getAverageRating(productId: string): Promise<number> {
    const { data, error } = await supabase
      .from('reviews')
      .select('rating')
      .eq('product_id', productId);

    if (error) throw error;

    if (!data || data.length === 0) return 0;

    const sum = data.reduce((acc, review) => acc + review.rating, 0);
    return sum / data.length;
  },

  // Check if user has already reviewed this product
  async hasUserReviewed(productId: string, userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('reviews')
      .select('id')
      .eq('product_id', productId)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
    return !!data;
  },

  // Add a review (alias for createReview with different signature)
  async addReview(
    productId: string,
    userId: string,
    rating: number,
    comment?: string,
  ): Promise<Review> {
    return this.createReview({ product_id: productId, rating, comment });
  },

  // Get reviews (alias for getReviewsByProduct)
  async getReviews(productId: string): Promise<Review[]> {
    return this.getReviewsByProduct(productId);
  },

  // Calculate average rating from reviews array
  calculateAverageRating(reviews: Review[]): number {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  },
};
