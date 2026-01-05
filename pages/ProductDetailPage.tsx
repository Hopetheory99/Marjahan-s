import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/Button';
import WishlistButton from '../components/WishlistButton';
import { useProductDetail } from '../hooks/useProducts';
import SEO from '../components/SEO';
import Image from '../components/Image';
import StarRating from '../components/StarRating';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import { reviewService, Review } from '../services/reviewService';
import { analytics } from '../services/analyticsService';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const { product, loading, error } = useProductDetail(id);

  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [showFlyingCart, setShowFlyingCart] = useState(false);

  const fetchReviews = useCallback(async () => {
    if (!id) return;
    setReviewsLoading(true);
    try {
      const data = await reviewService.getReviews(id);
      setReviews(data);
      setAverageRating(reviewService.calculateAverageRating(data));
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    } finally {
      setReviewsLoading(false);
    }
  }, [id]);

  // Update local state when product data arrives
  useEffect(() => {
    if (product) {
      setSelectedImage(product.images[0]);
      if (product.sizes) {
        setSelectedSize(product.sizes[0]);
      }
    }
  }, [product]);

  // Fetch reviews when product loads
  useEffect(() => {
    if (id) {
      fetchReviews();
    }
  }, [id, fetchReviews]);

  // Track product view when product loads
  useEffect(() => {
    if (product) {
      analytics.trackProductView(product);
    }
  }, [product]);

  // Redirect on error
  useEffect(() => {
    if (error) {
      navigate('/products');
    }
  }, [error, navigate]);

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-12 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-gray-200 h-96 rounded-lg"></div>
          <div className="space-y-4">
            <div className="bg-gray-200 h-10 w-3/4"></div>
            <div className="bg-gray-200 h-8 w-1/4"></div>
            <div className="bg-gray-200 h-24 w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const handleAddToCart = () => {
    if (quantity > product.stock) {
      addToast(`Sorry, we only have ${product.stock} of this item in stock.`, 'error');
      return;
    }

    // Track add to cart event
    analytics.trackAddToCart(product, quantity, selectedSize);

    // Trigger flying cart animation
    setShowFlyingCart(true);
    setTimeout(() => setShowFlyingCart(false), 1000);

    addToCart(product, quantity, selectedSize);
    addToast(`Added ${quantity} ${product.name} to bag 🛒`, 'success');
  };

  const handleQuantityChange = (val: number) => {
    if (val > product.stock) {
      addToast(`Max stock available is ${product.stock}`, 'info');
      setQuantity(product.stock);
    } else if (val < 1) {
      setQuantity(1);
    } else {
      setQuantity(val);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <SEO
        title={product.name}
        description={product.description}
        image={product.images[0]}
        type="product"
        product={{
          name: product.name,
          description: product.description,
          image: product.images,
          offers: {
            price: product.price,
            priceCurrency: 'USD',
            availability:
              product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            condition: 'https://schema.org/NewCondition',
          },
          aggregateRating:
            reviews.length > 0
              ? {
                  ratingValue: averageRating,
                  reviewCount: reviews.length,
                }
              : undefined,
          brand: {
            name: "Marjahan's Jewelry",
          },
        }}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <Image
            src={selectedImage}
            alt={product.name}
            className="w-full h-auto object-cover rounded-lg shadow-lg mb-4 transition-all duration-300"
            loading="eager"
            width={600}
            height={600}
          />
          <div className="flex space-x-2">
            {product.images.map((img, index) => (
              <Image
                key={index}
                src={img}
                alt={`${product.name} thumbnail ${index + 1}`}
                className={`w-24 h-24 object-cover cursor-pointer rounded ${selectedImage === img ? 'border-2 border-brand-gold' : 'opacity-70 hover:opacity-100'}`}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-serif">{product.name}</h1>
          </div>

          {/* Rating Display */}
          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <StarRating rating={Math.round(averageRating)} size="md" />
              <span className="text-gray-600 text-sm">
                {averageRating.toFixed(1)} ({reviews.length} review{reviews.length !== 1 ? 's' : ''}
                )
              </span>
            </div>
          )}

          <p className="text-2xl font-sans text-gray-700 mb-6">${product.price.toLocaleString()}</p>
          <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

          <div className="flex items-center space-x-4 mb-6">
            <span className="font-semibold">Metal:</span>
            <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">{product.metal}</span>
          </div>

          <div className="flex items-center space-x-4 mb-6">
            <span className="font-semibold">Availability:</span>
            <span
              className={`${product.stock > 0 ? 'text-green-600' : 'text-red-600'} font-medium`}
            >
              {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
            </span>
          </div>

          {product.sizes && (
            <div className="mb-6">
              <label htmlFor="size" className="font-semibold block mb-2">
                Select Size:
              </label>
              <select
                id="size"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="border border-gray-300 p-2 rounded w-full md:w-auto focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none"
              >
                {product.sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center space-x-4 mb-8">
            <label htmlFor="quantity" className="font-semibold">
              Quantity:
            </label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10))}
              className="w-20 text-center border border-gray-300 p-2 rounded focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none"
              min="1"
              max={product.stock}
            />
          </div>

          <div className="flex items-center gap-4">
            <Button
              onClick={handleAddToCart}
              fullWidth
              className="md:w-auto flex-1"
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
            <WishlistButton productId={product.id} productName={product.name} size="lg" />
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="mt-16 border-t pt-12">
        <h2 className="text-3xl font-serif mb-8">Customer Reviews</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            {reviewsLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="bg-gray-200 h-20 rounded"></div>
                <div className="bg-gray-200 h-20 rounded"></div>
              </div>
            ) : (
              <ReviewList reviews={reviews} />
            )}
          </div>
          <div>
            <ReviewForm productId={product.id} onReviewAdded={fetchReviews} />
          </div>
        </div>
      </div>

      {/* Flying Cart Animation */}
      {showFlyingCart && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute bottom-20 right-8 animate-bounce">
            <div className="bg-brand-gold rounded-full p-4 shadow-2xl transform animate-pulse">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13l-1.1 5M7 13l1.1-5m8.9 5L17 8m2 5v5a2 2 0 01-2 2H9a2 2 0 01-2-2v-5m8-5V5a2 2 0 00-2-2H9a2 2 0 00-2 2v3.1"
                />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
