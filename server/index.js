const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_DIR = path.join(__dirname, 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

const readJson = (file) => {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    return [];
  }
};

const writeJson = (file, data) => {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
};

const app = express();
app.use(cors());
app.use(express.json());

// Basic dev auth endpoint. Use DEV_ADMIN_PASSWORD env var to set the password.
app.post('/api/auth/login', (req, res) => {
  const { password } = req.body || {};
  const devPass = process.env.DEV_ADMIN_PASSWORD || 'admin123';
  if (password === devPass) {
    // return a simple token that is not secure; this is for local dev only
    return res.json({ ok: true, token: 'dev-token', role: 'admin' });
  }
  return res.status(401).json({ ok: false, message: 'Invalid credentials' });
});

// Products
app.get('/api/products', (req, res) => {
  let products = readJson(PRODUCTS_FILE);
  const { price, metals, categories } = req.query;
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
});

app.get('/api/products/featured', (req, res) => {
  const products = readJson(PRODUCTS_FILE);
  res.json(products.slice(0, 4));
});

app.get('/api/products/:id', (req, res) => {
  const products = readJson(PRODUCTS_FILE);
  const p = products.find(x => x.id === req.params.id);
  if (!p) return res.status(404).json({ message: 'Product not found' });
  res.json(p);
});

app.post('/api/products', (req, res) => {
  const products = readJson(PRODUCTS_FILE);
  const payload = req.body;
  const newProduct = { id: uuidv4(), ...payload };
  products.push(newProduct);
  writeJson(PRODUCTS_FILE, products);
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', (req, res) => {
  const products = readJson(PRODUCTS_FILE);
  const idx = products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Product not found' });
  products[idx] = { ...products[idx], ...req.body };
  writeJson(PRODUCTS_FILE, products);
  res.json(products[idx]);
});

app.delete('/api/products/:id', (req, res) => {
  let products = readJson(PRODUCTS_FILE);
  products = products.filter(p => p.id !== req.params.id);
  writeJson(PRODUCTS_FILE, products);
  res.status(204).end();
});

// Orders
app.get('/api/orders', (req, res) => {
  const orders = readJson(ORDERS_FILE);
  res.json(orders);
});

app.post('/api/orders', (req, res) => {
  const orders = readJson(ORDERS_FILE);
  const payload = req.body;
  const newOrder = { id: uuidv4(), status: 'pending', createdAt: new Date().toISOString(), ...payload };
  orders.push(newOrder);
  writeJson(ORDERS_FILE, orders);
  res.status(201).json(newOrder);
});

// Create a mock checkout session (dev-only). This will persist an order and
// return a session URL that navigates to the confirmation page with order id.
app.post('/api/create-checkout-session', (req, res) => {
  try {
    const orders = readJson(ORDERS_FILE);
    const { cart, customer } = req.body || {};
    const total = (cart || []).reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);
    const newOrder = {
      id: uuidv4(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      cart: cart || [],
      customer: customer || {},
      total
    };
    orders.push(newOrder);
    writeJson(ORDERS_FILE, orders);

    // Return a mock session URL that the frontend can navigate to (dev flow)
    return res.json({ sessionUrl: `/confirmation?orderId=${newOrder.id}`, order: newOrder });
  } catch (err) {
    console.error('create-checkout-session error', err);
    return res.status(500).json({ message: 'Could not create checkout session' });
  }
});

// Stripe mock/create-checkout-session endpoint.
// If STRIPE_SECRET_KEY is provided in env, you should implement real Stripe logic here.
// For local dev we return a mock session object that the frontend can navigate to.
app.post('/api/stripe/create-checkout-session', (req, res) => {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    const { cart, customer } = req.body || {};

    // If a real stripe key is set, return 501 to indicate integration required.
    if (stripeKey) {
      // In a real server you would use the Stripe SDK to create a session here.
      return res.status(501).json({ message: 'Real Stripe integration not implemented in mock server.' });
    }

    // Otherwise simulate creating a session and persisting an order.
    const orders = readJson(ORDERS_FILE);
    const total = (cart || []).reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);
    const newOrder = {
      id: uuidv4(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      cart: cart || [],
      customer: customer || {},
      total
    };
    orders.push(newOrder);
    writeJson(ORDERS_FILE, orders);

    return res.json({ sessionId: `sess_${newOrder.id}`, sessionUrl: `/confirmation?orderId=${newOrder.id}`, order: newOrder });
  } catch (err) {
    console.error('stripe/create-checkout-session error', err);
    return res.status(500).json({ message: 'Could not create stripe checkout session' });
  }
});

app.put('/api/orders/:id/status', (req, res) => {
  const orders = readJson(ORDERS_FILE);
  const idx = orders.findIndex(o => o.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Order not found' });
  orders[idx] = { ...orders[idx], status: req.body.status };
  writeJson(ORDERS_FILE, orders);
  res.json(orders[idx]);
});

// Recommendations (simple stub)
app.post('/api/recommendations', (req, res) => {
  // Accepts { userId, context } and returns simple recommendations
  const recs = [
    { id: 'p1', score: 0.95, title: '14k Gold Diamond Studs', reason: 'Popular' },
    { id: 'p2', score: 0.9, title: 'Pearl Drop Necklace', reason: 'Customers also viewed' }
  ];
  res.json(recs);
});

// Create checkout session (dev-only): create an order and return a mock session URL
app.post('/api/create-checkout-session', (req, res) => {
  const orders = readJson(ORDERS_FILE);
  const { cart, customer } = req.body || {};
  if (!cart || !Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }

  const newOrder = { id: uuidv4(), status: 'pending', createdAt: new Date().toISOString(), cart, customer };
  orders.push(newOrder);
  writeJson(ORDERS_FILE, orders);

  // In a real server you'd call Stripe to create a Checkout Session and return the session URL.
  const sessionUrl = `/confirmation?orderId=${newOrder.id}`;
  res.json({ ok: true, sessionUrl, order: newOrder });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Mock server running on http://localhost:${port}`));
