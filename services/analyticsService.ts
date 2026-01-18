import { Product } from '../types';

// Analytics service for Google Analytics 4 integration
export class AnalyticsService {
  private static instance: AnalyticsService;
  private isInitialized = false;
  private measurementId: string | null = null;

  private constructor() {}

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  // Initialize Google Analytics
  initialize(measurementId: string): void {
    if (this.isInitialized) return;

    // Load gtag script if not already loaded
    if (!window.gtag) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      window.gtag = (...args: any[]) => {
        window.dataLayer.push(args);
      };

      window.gtag('js', new Date());
    }

    // Configure GA4
    this.measurementId = measurementId;
    window.gtag('config', measurementId, {
      custom_map: {
        dimension1: 'user_type',
        dimension2: 'product_category',
        metric1: 'cart_value',
      },
    });

    this.isInitialized = true;
  }

  // Track page views
  trackPageView(pagePath: string, pageTitle: string): void {
    if (!this.isInitialized || !this.measurementId) return;

    window.gtag('config', this.measurementId, {
      page_path: pagePath,
      page_title: pageTitle,
    });
  }

  // Track user login
  trackLogin(method: string = 'email'): void {
    if (!this.isInitialized) return;

    window.gtag('event', 'login', {
      method: method,
    });
  }

  // Track user signup
  trackSignUp(method: string = 'email'): void {
    if (!this.isInitialized) return;

    window.gtag('event', 'sign_up', {
      method: method,
    });
  }

  // Track product views
  trackProductView(product: Product): void {
    if (!this.isInitialized) return;

    window.gtag('event', 'view_item', {
      currency: 'USD',
      value: product.price,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          category: product.category,
          price: product.price,
          quantity: 1,
        },
      ],
    });
  }

  // Track adding items to cart
  trackAddToCart(product: Product, quantity: number, size?: string): void {
    if (!this.isInitialized) return;

    window.gtag('event', 'add_to_cart', {
      currency: 'USD',
      value: product.price * quantity,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          category: product.category,
          price: product.price,
          quantity: quantity,
          item_variant: size,
        },
      ],
    });
  }

  // Track removing items from cart
  trackRemoveFromCart(product: Product, quantity: number): void {
    if (!this.isInitialized) return;

    window.gtag('event', 'remove_from_cart', {
      currency: 'USD',
      value: product.price * quantity,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          category: product.category,
          price: product.price,
          quantity: quantity,
        },
      ],
    });
  }

  // Track viewing cart
  trackViewCart(
    cartItems: Array<{ product: Product; quantity: number; size?: string }>,
    totalValue: number,
  ): void {
    if (!this.isInitialized) return;

    const items = cartItems.map(({ product, quantity, size }) => ({
      item_id: product.id,
      item_name: product.name,
      category: product.category,
      price: product.price,
      quantity: quantity,
      item_variant: size,
    }));

    window.gtag('event', 'view_cart', {
      currency: 'USD',
      value: totalValue,
      items: items,
    });
  }

  // Track beginning checkout
  trackBeginCheckout(
    cartItems: Array<{ product: Product; quantity: number; size?: string }>,
    totalValue: number,
  ): void {
    if (!this.isInitialized) return;

    const items = cartItems.map(({ product, quantity, size }) => ({
      item_id: product.id,
      item_name: product.name,
      category: product.category,
      price: product.price,
      quantity: quantity,
      item_variant: size,
    }));

    window.gtag('event', 'begin_checkout', {
      currency: 'USD',
      value: totalValue,
      items: items,
    });
  }

  // Track purchase completion
  trackPurchase(
    orderId: string,
    cartItems: Array<{ product: Product; quantity: number; size?: string }>,
    totalValue: number,
    paymentMethod: string,
  ): void {
    if (!this.isInitialized) return;

    const items = cartItems.map(({ product, quantity, size }) => ({
      item_id: product.id,
      item_name: product.name,
      category: product.category,
      price: product.price,
      quantity: quantity,
      item_variant: size,
    }));

    window.gtag('event', 'purchase', {
      transaction_id: orderId,
      currency: 'USD',
      value: totalValue,
      payment_type: paymentMethod,
      items: items,
    });
  }

  // Track search queries
  trackSearch(searchTerm: string, resultsCount: number): void {
    if (!this.isInitialized) return;

    window.gtag('event', 'search', {
      search_term: searchTerm,
      results_count: resultsCount,
    });
  }

  // Track filter usage
  trackFilterUse(filterType: string, filterValue: string): void {
    if (!this.isInitialized) return;

    window.gtag('event', 'filter_use', {
      filter_type: filterType,
      filter_value: filterValue,
    });
  }

  // Track wishlist additions
  trackAddToWishlist(product: Product): void {
    if (!this.isInitialized) return;

    window.gtag('event', 'add_to_wishlist', {
      currency: 'USD',
      value: product.price,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          category: product.category,
          price: product.price,
          quantity: 1,
        },
      ],
    });
  }

  // Track review submissions
  trackReviewSubmit(productId: string, rating: number): void {
    if (!this.isInitialized) return;

    window.gtag('event', 'review_submit', {
      product_id: productId,
      rating: rating,
    });
  }

  // Track newsletter signup
  trackNewsletterSignup(method: string = 'footer'): void {
    if (!this.isInitialized) return;

    window.gtag('event', 'newsletter_signup', {
      method: method,
    });
  }

  // Track social media shares
  trackSocialShare(platform: string, contentType: string, contentId?: string): void {
    if (!this.isInitialized) return;

    window.gtag('event', 'share', {
      method: platform,
      content_type: contentType,
      content_id: contentId,
    });
  }

  // Track error events
  trackError(errorType: string, errorMessage: string): void {
    if (!this.isInitialized) return;

    window.gtag('event', 'exception', {
      description: errorMessage,
      fatal: false,
      custom_map: {
        error_type: errorType,
      },
    });
  }

  // Track user engagement
  trackEngagement(action: string, category: string, label?: string, value?: number): void {
    if (!this.isInitialized) return;

    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }

  // Set user properties
  setUserProperties(userType: 'guest' | 'customer' | 'admin', userId?: string): void {
    if (!this.isInitialized || !this.measurementId) return;

    window.gtag('config', this.measurementId, {
      custom_map: {
        dimension1: userType,
      },
    });

    if (userId) {
      window.gtag('config', this.measurementId, {
        user_id: userId,
      });
    }
  }

  // Track custom timing events
  trackTiming(name: string, value: number, category: string = 'performance'): void {
    if (!this.isInitialized) return;

    window.gtag('event', 'timing_complete', {
      name: name,
      value: value,
      event_category: category,
    });
  }
}

// Global type declarations
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const analytics = AnalyticsService.getInstance();
