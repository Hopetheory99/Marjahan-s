const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const cookieParser = require('cookie-parser');

const config = require('./config');
const logger = require('./logger');
const { 
  generateTokens, 
  verifyRefreshToken,
  authenticateRequest, 
  requireAdmin 
} = require('./auth');
const { validate } = require('./middleware');
const {
  loginSchema,
  refreshTokenSchema,
  productSchema,
  updateProductSchema,
  checkoutSchema,
  updateOrderStatusSchema,
  recommendationSchema
} = require('./schemas');

const DATA_DIR = path.join(__dirname, 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

// Utility functions
const readJson = (file) => {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    logger.error('File read error', { file, error: err.message });
    return [];
  }
};

const writeJson = (file, data) => {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    logger.error('File write error', { file, error: err.message });
    throw err;
  }
};

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(cookieParser());

// Request logging middleware
app.use((req, res, next) => {
  logger.debug(`${req.method} ${req.path}`, { 
    ip: req.ip,
    userAgent: req.headers['user-agent']?.substring(0, 100)
  });
  next();
});

// Global error handler
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((error) => {
    logger.error('Unhandled error', { 
      path: req.path,
      message: error.message,
      stack: error.stack?.substring(0, 500)
    });
    res.status(500).json({ message: 'Internal server error' });
  });
};

// ==========================================
// AUTH ENDPOINTS
// ==========================================

/**
 * POST /api/auth/login
 * Authenticate with password and receive JWT tokens
 */
app.post('/api/auth/login', validate(loginSchema), asyncHandler(async (req, res) => {
  const { password } = req.validatedData;

  // Verify admin password
  const adminPassword = config.ADMIN.PASSWORD;
  if (!adminPassword) {
    logger.error('Admin password not configured');
    return res.status(500).json({ message: 'Authentication not configured' });
  }

  if (password !== adminPassword) {
    logger.warn('Failed login attempt', { timestamp: new Date().toISOString() });
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens('admin-user', 'admin');

  // Set refresh token in httpOnly cookie (secure in production)
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  logger.info('Admin login successful');
  res.json({ 
    ok: true, 
    accessToken,
    role: 'admin'
  });
}));

/**
 * POST /api/auth/refresh
 * Use refresh token to get new access token
 */
app.post('/api/auth/refresh', validate(refreshTokenSchema), asyncHandler(async (req, res) => {
  const { refreshToken } = req.validatedData;

  const { valid, decoded } = verifyRefreshToken(refreshToken);
  if (!valid) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }

  const { accessToken, refreshToken: newRefreshToken } = generateTokens(decoded.userId, decoded.role);

  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.json({ accessToken });
}));

/**
 * POST /api/auth/logout
 * Clear refresh token cookie
 */
app.post('/api/auth/logout', asyncHandler(async (req, res) => {
  res.clearCookie('refreshToken');
  logger.info('Logout successful');
  res.json({ ok: true });
}));

// ==========================================
// PRODUCTS ENDPOINTS
// ==========================================

/**
 * GET /api/products
 * Get all products with optional filtering
 */
app.get('/api/products', asyncHandler(async (req, res) => {
  let products = readJson(PRODUCTS_FILE);
  const { price, metals, categories } = req.query;

  // Apply filters
  if (price) products = products.filter(p => p.price <= Number(price));
  if (metals) {
    const list = String(metals).split(',');
    products = products.filter(p => list.includes(p.metal));
  }
  if (categories) {
    const list = String(categories).split(',');
    products = products.filter(p => list.includes(p.category));
  }

  res.json(products);
}));

/**
 * GET /api/products/featured
 * Get featured products (first 4)
 */
app.get('/api/products/featured', asyncHandler(async (req, res) => {
  const products = readJson(PRODUCTS_FILE);
  res.json(products.slice(0, 4));
}));

/**
 * GET /api/products/:id
 * Get product by ID
 */
app.get('/api/products/:id', asyncHandler(async (req, res) => {
  const products = readJson(PRODUCTS_FILE);
  const product = products.find(p => p.id === req.params.id);
  
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  
  res.json(product);
}));

/**
 * POST /api/products
 * Create new product (admin only)
 * Requires: Authentication + Admin role
 */
app.post('/api/products', 
  authenticateRequest,
  requireAdmin,
  validate(productSchema),
  asyncHandler(async (req, res) => {
    const products = readJson(PRODUCTS_FILE);
    const newProduct = { id: uuidv4(), ...req.validatedData };
    products.push(newProduct);
    writeJson(PRODUCTS_FILE, products);

    logger.info('Product created', { productId: newProduct.id });
    res.status(201).json(newProduct);
  })
);

/**
 * PUT /api/products/:id
 * Update product (admin only)
 * Requires: Authentication + Admin role
 */
app.put('/api/products/:id',
  authenticateRequest,
  requireAdmin,
  validate(updateProductSchema),
  asyncHandler(async (req, res) => {
    const products = readJson(PRODUCTS_FILE);
    const idx = products.findIndex(p => p.id === req.params.id);

    if (idx === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }

    products[idx] = { ...products[idx], ...req.validatedData };
    writeJson(PRODUCTS_FILE, products);

    logger.info('Product updated', { productId: req.params.id });
    res.json(products[idx]);
  })
);

/**
 * DELETE /api/products/:id
 * Delete product (admin only)
 * Requires: Authentication + Admin role
 */
app.delete('/api/products/:id',
  authenticateRequest,
  requireAdmin,
  asyncHandler(async (req, res) => {
    let products = readJson(PRODUCTS_FILE);
    const initialLength = products.length;
    products = products.filter(p => p.id !== req.params.id);

    if (products.length === initialLength) {
      return res.status(404).json({ message: 'Product not found' });
    }

    writeJson(PRODUCTS_FILE, products);
    logger.info('Product deleted', { productId: req.params.id });
    res.status(204).end();
  })
);

// ==========================================
// ORDERS ENDPOINTS
// ==========================================

/**
 * GET /api/orders
 * Get all orders (admin only)
 * Requires: Authentication + Admin role
 */
app.get('/api/orders',
  authenticateRequest,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const orders = readJson(ORDERS_FILE);
    res.json(orders);
  })
);

/**
 * POST /api/orders
 * Create new order from checkout
 * Public endpoint (no auth required for initial submission)
 */
app.post('/api/orders',
  validate(checkoutSchema),
  asyncHandler(async (req, res) => {
    const orders = readJson(ORDERS_FILE);
    const { cart, customer } = req.validatedData;

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const newOrder = {
      id: uuidv4(),
      status: 'Pending',
      createdAt: new Date().toISOString(),
      cart,
      customer,
      total
    };

    orders.push(newOrder);
    writeJson(ORDERS_FILE, orders);

    logger.info('Order created', { 
      orderId: newOrder.id, 
      total,
      itemCount: cart.length
    });

    res.status(201).json(newOrder);
  })
);

/**
 * GET /api/orders/:id
 * Get order by ID (accessible to customer or admin)
 */
app.get('/api/orders/:id', asyncHandler(async (req, res) => {
  const orders = readJson(ORDERS_FILE);
  const order = orders.find(o => o.id === req.params.id);

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  res.json(order);
}));

/**
 * PUT /api/orders/:id/status
 * Update order status (admin only)
 * Requires: Authentication + Admin role
 */
app.put('/api/orders/:id/status',
  authenticateRequest,
  requireAdmin,
  validate(updateOrderStatusSchema),
  asyncHandler(async (req, res) => {
    const orders = readJson(ORDERS_FILE);
    const idx = orders.findIndex(o => o.id === req.params.id);

    if (idx === -1) {
      return res.status(404).json({ message: 'Order not found' });
    }

    orders[idx] = { ...orders[idx], status: req.validatedData.status };
    writeJson(ORDERS_FILE, orders);

    logger.info('Order status updated', { 
      orderId: req.params.id,
      newStatus: req.validatedData.status
    });

    res.json(orders[idx]);
  })
);

// ==========================================
// STRIPE ENDPOINTS
// ==========================================

/**
 * POST /api/stripe/create-checkout-session
 * Create Stripe checkout session or mock session for dev
 */
app.post('/api/stripe/create-checkout-session',
  validate(checkoutSchema),
  asyncHandler(async (req, res) => {
    const { cart, customer } = req.validatedData;

    if (!cart || cart.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const total = Math.round(cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 100);

    // If real Stripe is configured, use it (implementation required)
    if (config.FEATURES.ENABLE_REAL_STRIPE) {
      // TODO: Implement real Stripe checkout session creation
      // const stripe = require('stripe')(config.STRIPE.SECRET_KEY);
      // const session = await stripe.checkout.sessions.create({ ... });
      logger.warn('Real Stripe not yet implemented');
      return res.status(501).json({ message: 'Real Stripe integration pending' });
    }

    // Dev mode: Create mock order and return mock session
    const orders = readJson(ORDERS_FILE);
    const newOrder = {
      id: uuidv4(),
      status: 'Pending',
      createdAt: new Date().toISOString(),
      cart,
      customer,
      total: total / 100,
      stripeSessionId: `dev_${uuidv4()}`
    };

    orders.push(newOrder);
    writeJson(ORDERS_FILE, orders);

    logger.info('Mock Stripe session created', { orderId: newOrder.id, total });

    res.json({
      sessionId: newOrder.stripeSessionId,
      sessionUrl: `/confirmation?orderId=${newOrder.id}`,
      order: newOrder
    });
  })
);

// ==========================================
// RECOMMENDATIONS ENDPOINT
// ==========================================

/**
 * POST /api/recommendations
 * Get product recommendations (stub for AI integration)
 */
app.post('/api/recommendations',
  validate(recommendationSchema),
  asyncHandler(async (req, res) => {
    // Stub implementation; replace with real Gemini/AI service
    const recs = [
      { id: 'p1', score: 0.95, title: '14k Gold Diamond Studs', reason: 'Popular' },
      { id: 'p2', score: 0.9, title: 'Pearl Drop Necklace', reason: 'Customers also viewed' }
    ];
    res.json(recs);
  })
);

// ==========================================
// LEGACY ENDPOINTS (DEPRECATED - For compatibility)
// ==========================================

/**
 * POST /api/create-checkout-session
 * DEPRECATED: Use /api/stripe/create-checkout-session
 */
app.post('/api/create-checkout-session',
  validate(checkoutSchema),
  asyncHandler(async (req, res) => {
    const { cart, customer } = req.validatedData;

    if (!cart || cart.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const orders = readJson(ORDERS_FILE);
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const newOrder = {
      id: uuidv4(),
      status: 'Pending',
      createdAt: new Date().toISOString(),
      cart,
      customer,
      total
    };

    orders.push(newOrder);
    writeJson(ORDERS_FILE, orders);

    logger.warn('Deprecated endpoint used: /api/create-checkout-session');
    res.json({ ok: true, sessionUrl: `/confirmation?orderId=${newOrder.id}`, order: newOrder });
  })
);

// ==========================================
// HEALTH CHECK
// ==========================================

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ==========================================
// 404 HANDLER
// ==========================================

app.use((req, res) => {
  logger.warn('404 Not Found', { path: req.path, method: req.method });
  res.status(404).json({ message: 'Endpoint not found' });
});

// ==========================================
// START SERVER
// ==========================================

const PORT = config.PORT;
app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`, { 
    env: config.NODE_ENV,
    features: config.FEATURES
  });
});

module.exports = app;
