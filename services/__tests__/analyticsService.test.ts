import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { analytics } from '../analyticsService';
import { Product, MetalType, CategoryType } from '../../types';

// Mock window.gtag
const mockGtag = vi.fn();
Object.defineProperty(window, 'gtag', {
  writable: true,
  value: mockGtag,
});

describe('AnalyticsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset the singleton instance
    (analytics as any).isInitialized = false;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('initialize', () => {
    it('should initialize Google Analytics', () => {
      analytics.initialize('GA-TEST-ID');

      expect(window.gtag).toHaveBeenCalledWith('config', 'GA-TEST-ID', {
        custom_map: {
          dimension1: 'user_type',
          dimension2: 'product_category',
          metric1: 'cart_value',
        },
      });
    });

    it('should not reinitialize if already initialized', () => {
      analytics.initialize('GA-TEST-ID');
      analytics.initialize('GA-TEST-ID-2');

      expect(window.gtag).toHaveBeenCalledTimes(1); // Only initial call
    });
  });

  describe('trackPageView', () => {
    it('should track page views when initialized', () => {
      analytics.initialize('GA-TEST-ID');
      analytics.trackPageView('/test', 'Test Page');

      expect(window.gtag).toHaveBeenCalledWith('config', 'GA_MEASUREMENT_ID', {
        page_path: '/test',
        page_title: 'Test Page',
      });
    });

    it('should not track when not initialized', () => {
      analytics.trackPageView('/test', 'Test Page');

      expect(window.gtag).not.toHaveBeenCalled();
    });
  });

  describe('trackLogin', () => {
    it('should track login events', () => {
      analytics.initialize('GA-TEST-ID');
      analytics.trackLogin('email');

      expect(window.gtag).toHaveBeenCalledWith('event', 'login', {
        method: 'email',
      });
    });

    it('should use default method when not specified', () => {
      analytics.initialize('GA-TEST-ID');
      analytics.trackLogin();

      expect(window.gtag).toHaveBeenCalledWith('event', 'login', {
        method: 'email',
      });
    });
  });

  describe('trackSignUp', () => {
    it('should track signup events', () => {
      analytics.initialize('GA-TEST-ID');
      analytics.trackSignUp('google');

      expect(window.gtag).toHaveBeenCalledWith('event', 'sign_up', {
        method: 'google',
      });
    });
  });

  describe('trackProductView', () => {
    const mockProduct: Product = {
      id: '1',
      name: 'Gold Ring',
      price: 299.99,
      metal: 'Gold' as MetalType,
      category: 'Rings' as CategoryType,
      images: ['ring.jpg'],
      stock: 10,
      description: 'Beautiful ring',
    };

    it('should track product view events', () => {
      analytics.initialize('GA-TEST-ID');
      analytics.trackProductView(mockProduct);

      expect(window.gtag).toHaveBeenCalledWith('event', 'view_item', {
        currency: 'USD',
        value: 299.99,
        items: [
          {
            item_id: '1',
            item_name: 'Gold Ring',
            category: 'Rings',
            price: 299.99,
            quantity: 1,
          },
        ],
      });
    });
  });

  describe('trackAddToCart', () => {
    const mockProduct: Product = {
      id: '1',
      name: 'Gold Ring',
      price: 299.99,
      metal: 'Gold' as MetalType,
      category: 'Rings' as CategoryType,
      images: ['ring.jpg'],
      stock: 10,
      description: 'Beautiful ring',
    };

    it('should track add to cart events', () => {
      analytics.initialize('GA-TEST-ID');
      analytics.trackAddToCart(mockProduct, 2, 'Size 7');

      expect(window.gtag).toHaveBeenCalledWith('event', 'add_to_cart', {
        currency: 'USD',
        value: 599.98,
        items: [
          {
            item_id: '1',
            item_name: 'Gold Ring',
            category: 'Rings',
            price: 299.99,
            quantity: 2,
            item_variant: 'Size 7',
          },
        ],
      });
    });
  });

  describe('trackPurchase', () => {
    const mockProduct: Product = {
      id: '1',
      name: 'Gold Ring',
      price: 299.99,
      metal: 'Gold' as MetalType,
      category: 'Rings' as CategoryType,
      images: ['ring.jpg'],
      stock: 10,
      description: 'Beautiful ring',
    };

    const cartItems = [{ product: mockProduct, quantity: 2, size: 'Size 7' }];

    it('should track purchase events', () => {
      analytics.initialize('GA-TEST-ID');
      analytics.trackPurchase('order-123', cartItems, 599.98, 'credit_card');

      expect(window.gtag).toHaveBeenCalledWith('event', 'purchase', {
        transaction_id: 'order-123',
        currency: 'USD',
        value: 599.98,
        payment_type: 'credit_card',
        items: [
          {
            item_id: '1',
            item_name: 'Gold Ring',
            category: 'Rings',
            price: 299.99,
            quantity: 2,
            item_variant: 'Size 7',
          },
        ],
      });
    });
  });

  describe('trackSearch', () => {
    it('should track search events', () => {
      analytics.initialize('GA-TEST-ID');
      analytics.trackSearch('gold ring', 5);

      expect(window.gtag).toHaveBeenCalledWith('event', 'search', {
        search_term: 'gold ring',
        results_count: 5,
      });
    });
  });

  describe('trackFilterUse', () => {
    it('should track filter usage', () => {
      analytics.initialize('GA-TEST-ID');
      analytics.trackFilterUse('category', 'Rings');

      expect(window.gtag).toHaveBeenCalledWith('event', 'filter_use', {
        filter_type: 'category',
        filter_value: 'Rings',
      });
    });
  });

  describe('trackAddToWishlist', () => {
    const mockProduct: Product = {
      id: '1',
      name: 'Gold Ring',
      price: 299.99,
      metal: 'Gold' as MetalType,
      category: 'Rings' as CategoryType,
      images: ['ring.jpg'],
      stock: 10,
      description: 'Beautiful ring',
    };

    it('should track wishlist additions', () => {
      analytics.initialize('GA-TEST-ID');
      analytics.trackAddToWishlist(mockProduct);

      expect(window.gtag).toHaveBeenCalledWith('event', 'add_to_wishlist', {
        currency: 'USD',
        value: 299.99,
        items: [
          {
            item_id: '1',
            item_name: 'Gold Ring',
            category: 'Rings',
            price: 299.99,
            quantity: 1,
          },
        ],
      });
    });
  });

  describe('trackReviewSubmit', () => {
    it('should track review submissions', () => {
      analytics.initialize('GA-TEST-ID');
      analytics.trackReviewSubmit('product-1', 5);

      expect(window.gtag).toHaveBeenCalledWith('event', 'review_submit', {
        product_id: 'product-1',
        rating: 5,
      });
    });
  });

  describe('trackError', () => {
    it('should track error events', () => {
      analytics.initialize('GA-TEST-ID');
      analytics.trackError('network_error', 'Failed to load products');

      expect(window.gtag).toHaveBeenCalledWith('event', 'exception', {
        description: 'Failed to load products',
        fatal: false,
        custom_map: {
          error_type: 'network_error',
        },
      });
    });
  });

  describe('setUserProperties', () => {
    it('should set user properties for guests', () => {
      analytics.initialize('GA-TEST-ID');
      analytics.setUserProperties('guest');

      expect(window.gtag).toHaveBeenCalledWith('config', 'GA_MEASUREMENT_ID', {
        custom_map: {
          dimension1: 'guest',
        },
      });
    });

    it('should set user properties for customers', () => {
      analytics.initialize('GA-TEST-ID');
      analytics.setUserProperties('customer', 'user-123');

      expect(window.gtag).toHaveBeenCalledWith('config', 'GA_MEASUREMENT_ID', {
        custom_map: {
          dimension1: 'customer',
        },
      });
      expect(window.gtag).toHaveBeenCalledWith('config', 'GA_MEASUREMENT_ID', {
        user_id: 'user-123',
      });
    });
  });

  describe('trackTiming', () => {
    it('should track performance timing', () => {
      analytics.initialize('GA-TEST-ID');
      analytics.trackTiming('page_load', 1500, 'performance');

      expect(window.gtag).toHaveBeenCalledWith('event', 'timing_complete', {
        name: 'page_load',
        value: 1500,
        event_category: 'performance',
      });
    });
  });
});
