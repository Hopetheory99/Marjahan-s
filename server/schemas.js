/**
 * Validation schemas using Zod
 * All API request/response shapes defined here for type safety
 */

const { z } = require('zod');

// Auth schemas
const loginSchema = z.object({
  password: z.string().min(1, 'Password required'),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token required'),
});

// Product schemas
const productSchema = z.object({
  name: z.string().min(1, 'Name required').max(200),
  description: z.string().max(2000).optional(),
  price: z.number().positive('Price must be positive'),
  metal: z.enum(['Gold', 'Silver', 'Platinum']),
  category: z.enum(['Rings', 'Necklaces', 'Earrings', 'Bracelets']),
  images: z.array(z.string().url()).min(1),
  sizes: z.array(z.string()).optional(),
  stock: z.number().int().nonnegative('Stock must be >= 0'),
});

const updateProductSchema = productSchema.partial();

// Order schemas
const cartItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().positive(),
  image: z.string().url(),
  quantity: z.number().int().positive(),
  size: z.string().optional(),
});

const customerSchema = z.object({
  email: z.string().email('Invalid email'),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  country: z.string().min(1),
  zip: z.string().min(1),
});

const checkoutSchema = z.object({
  cart: z.array(cartItemSchema).min(1, 'Cart cannot be empty'),
  customer: customerSchema,
});

const updateOrderStatusSchema = z.object({
  status: z.enum(['Pending', 'Shipped', 'Delivered']),
});

// Recommendation schema
const recommendationSchema = z.object({
  userId: z.string().optional(),
  context: z.string().optional(),
});

module.exports = {
  loginSchema,
  refreshTokenSchema,
  productSchema,
  updateProductSchema,
  checkoutSchema,
  updateOrderStatusSchema,
  recommendationSchema,
};
