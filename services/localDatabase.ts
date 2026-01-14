/**
 * Local Database Service
 *
 * This service provides a local JSON-based database for development.
 * When deploying to production, switch to Supabase by updating the imports
 * in the respective service files.
 *
 * File Structure:
 * data/
 * ├── products.json    - Product catalog
 * ├── orders.json      - Customer orders
 * ├── users.json       - User accounts
 * ├── reviews.json     - Product reviews
 * ├── wishlists.json   - User wishlists
 * └── categories.json  - Product categories
 */

// Import JSON data
import productsData from '../data/products.json';
import ordersData from '../data/orders.json';
import usersData from '../data/users.json';
import reviewsData from '../data/reviews.json';
import wishlistsData from '../data/wishlists.json';
import categoriesData from '../data/categories.json';

// Types
export interface LocalProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  metal: string;
  category: string;
  sizes?: string[];
  stock: number;
  featured: boolean;
  createdAt: string;
}

export interface LocalOrder {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    productId: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    size?: string;
  }>;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: string;
  paymentMethod: string;
  paymentId: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface LocalUser {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin';
  avatar: string | null;
  phone: string | null;
  createdAt: string;
}

export interface LocalReview {
  id: string;
  productId: string;
  userId: string;
  userEmail: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface LocalWishlistItem {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
}

export interface LocalCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
}

// In-memory store (simulates database)
let products: LocalProduct[] = [...productsData] as LocalProduct[];
let orders: LocalOrder[] = [...ordersData] as LocalOrder[];
let users: LocalUser[] = [...usersData] as LocalUser[];
let reviews: LocalReview[] = [...reviewsData] as LocalReview[];
let wishlists: LocalWishlistItem[] = [...wishlistsData] as LocalWishlistItem[];
let categories: LocalCategory[] = [...categoriesData] as LocalCategory[];

// Helper function to generate IDs
const generateId = (prefix: string): string => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Database Service
export const localDb = {
  // === PRODUCTS ===
  products: {
    getAll: (): LocalProduct[] => products,

    getById: (id: string): LocalProduct | undefined => products.find((p) => p.id === id),

    getFeatured: (): LocalProduct[] => products.filter((p) => p.featured).slice(0, 4),

    getByCategory: (category: string): LocalProduct[] =>
      products.filter((p) => p.category.toLowerCase() === category.toLowerCase()),

    search: (query: string): LocalProduct[] => {
      const q = query.toLowerCase();
      return products.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
      );
    },

    create: (product: Omit<LocalProduct, 'id' | 'createdAt'>): LocalProduct => {
      const newProduct: LocalProduct = {
        ...product,
        id: generateId('prod'),
        createdAt: new Date().toISOString(),
      };
      products.push(newProduct);
      return newProduct;
    },

    update: (id: string, updates: Partial<LocalProduct>): LocalProduct | null => {
      const index = products.findIndex((p) => p.id === id);
      if (index === -1) return null;
      products[index] = { ...products[index], ...updates };
      return products[index];
    },

    delete: (id: string): boolean => {
      const index = products.findIndex((p) => p.id === id);
      if (index === -1) return false;
      products.splice(index, 1);
      return true;
    },
  },

  // === ORDERS ===
  orders: {
    getAll: (): LocalOrder[] => orders,

    getById: (id: string): LocalOrder | undefined => orders.find((o) => o.id === id),

    getByUserId: (userId: string): LocalOrder[] => orders.filter((o) => o.userId === userId),

    create: (order: Omit<LocalOrder, 'id' | 'createdAt' | 'updatedAt'>): LocalOrder => {
      const now = new Date().toISOString();
      const newOrder: LocalOrder = {
        ...order,
        id: generateId('order'),
        createdAt: now,
        updatedAt: now,
      };
      orders.push(newOrder);
      return newOrder;
    },

    updateStatus: (id: string, status: string): LocalOrder | null => {
      const index = orders.findIndex((o) => o.id === id);
      if (index === -1) return null;
      orders[index] = {
        ...orders[index],
        status,
        updatedAt: new Date().toISOString(),
      };
      return orders[index];
    },
  },

  // === USERS ===
  users: {
    getAll: (): LocalUser[] => users,

    getById: (id: string): LocalUser | undefined => users.find((u) => u.id === id),

    getByEmail: (email: string): LocalUser | undefined =>
      users.find((u) => u.email.toLowerCase() === email.toLowerCase()),

    create: (user: Omit<LocalUser, 'id' | 'createdAt'>): LocalUser => {
      const newUser: LocalUser = {
        ...user,
        id: generateId('user'),
        createdAt: new Date().toISOString(),
      };
      users.push(newUser);
      return newUser;
    },
  },

  // === REVIEWS ===
  reviews: {
    getAll: (): LocalReview[] => reviews,

    getByProductId: (productId: string): LocalReview[] =>
      reviews.filter((r) => r.productId === productId),

    getByUserId: (userId: string): LocalReview[] => reviews.filter((r) => r.userId === userId),

    create: (review: Omit<LocalReview, 'id' | 'createdAt'>): LocalReview => {
      const newReview: LocalReview = {
        ...review,
        id: generateId('review'),
        createdAt: new Date().toISOString(),
      };
      reviews.push(newReview);
      return newReview;
    },

    getAverageRating: (productId: string): number => {
      const productReviews = reviews.filter((r) => r.productId === productId);
      if (productReviews.length === 0) return 0;
      const sum = productReviews.reduce((acc, r) => acc + r.rating, 0);
      return Math.round((sum / productReviews.length) * 10) / 10;
    },
  },

  // === WISHLISTS ===
  wishlists: {
    getByUserId: (userId: string): LocalWishlistItem[] =>
      wishlists.filter((w) => w.userId === userId),

    add: (userId: string, productId: string): LocalWishlistItem => {
      const existing = wishlists.find((w) => w.userId === userId && w.productId === productId);
      if (existing) return existing;

      const newItem: LocalWishlistItem = {
        id: generateId('wish'),
        userId,
        productId,
        createdAt: new Date().toISOString(),
      };
      wishlists.push(newItem);
      return newItem;
    },

    remove: (userId: string, productId: string): boolean => {
      const index = wishlists.findIndex((w) => w.userId === userId && w.productId === productId);
      if (index === -1) return false;
      wishlists.splice(index, 1);
      return true;
    },

    isInWishlist: (userId: string, productId: string): boolean =>
      wishlists.some((w) => w.userId === userId && w.productId === productId),
  },

  // === CATEGORIES ===
  categories: {
    getAll: (): LocalCategory[] => categories,

    getBySlug: (slug: string): LocalCategory | undefined => categories.find((c) => c.slug === slug),
  },

  // === UTILITY ===
  reset: (): void => {
    // Reset to original data
    products = [...productsData] as LocalProduct[];
    orders = [...ordersData] as LocalOrder[];
    users = [...usersData] as LocalUser[];
    reviews = [...reviewsData] as LocalReview[];
    wishlists = [...wishlistsData] as LocalWishlistItem[];
    categories = [...categoriesData] as LocalCategory[];
  },
};

export default localDb;
