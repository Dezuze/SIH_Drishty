import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const IS_VERCEL = !!process.env.VERCEL;
const SEED_DB_PATH = path.join(__dirname, 'db.json');
const DB_PATH = IS_VERCEL ? path.join('/tmp', 'kisan_db.json') : SEED_DB_PATH;

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Helper to read database
function readDb() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      if (IS_VERCEL && fs.existsSync(SEED_DB_PATH)) {
        try {
          fs.copyFileSync(SEED_DB_PATH, DB_PATH);
        } catch (copyErr) {
          console.warn('Could not copy seed DB to /tmp:', copyErr);
        }
      } else if (!fs.existsSync(DB_PATH)) {
        return { users: [], orders: [], payments: [] };
      }
    }
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading db:', err);
    return { users: [], orders: [], payments: [] };
  }
}

// Helper to save database
function writeDb(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing db:', err);
  }
}

// Simple token generator & parser
function generateToken(user) {
  const payload = { id: user.id, email: user.email, role: user.role };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

function parseToken(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  try {
    const raw = authHeader.replace('Bearer ', '');
    const jsonStr = Buffer.from(raw, 'base64').toString('utf8');
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
}

// -------------------------------------------------------------
// AUTH ENDPOINTS
// -------------------------------------------------------------

// POST /api/auth/register
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, phone, role, address, city, pincode } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  const db = readDb();
  const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists' });
  }

  const newUser = {
    id: `usr_${Date.now()}`,
    name,
    email: email.toLowerCase(),
    password,
    phone: phone || '',
    role: role || 'customer',
    address: address || '',
    city: city || 'Kochi',
    pincode: pincode || '682001',
    avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80`,
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  writeDb(db);

  const token = generateToken(newUser);
  const { password: _, ...safeUser } = newUser;
  res.status(201).json({ token, user: safeUser });
});

// POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const db = readDb();
  const user = db.users.find(
    (u) =>
      (u.email.toLowerCase() === email.toLowerCase() || u.phone === email) &&
      u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = generateToken(user);
  const { password: _, ...safeUser } = user;
  res.json({ token, user: safeUser });
});

// GET /api/auth/me
app.get('/api/auth/me', (req, res) => {
  const tokenData = parseToken(req.headers.authorization);
  if (!tokenData) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const db = readDb();
  const user = db.users.find((u) => u.id === tokenData.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { password: _, ...safeUser } = user;
  res.json({ user: safeUser });
});

// PUT /api/auth/profile
app.put('/api/auth/profile', (req, res) => {
  const tokenData = parseToken(req.headers.authorization);
  if (!tokenData) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const db = readDb();
  const userIdx = db.users.findIndex((u) => u.id === tokenData.id);
  if (userIdx === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  const updates = req.body;
  delete updates.id;
  delete updates.email; // keep email unchanged for consistency

  db.users[userIdx] = { ...db.users[userIdx], ...updates };
  writeDb(db);

  const { password: _, ...safeUser } = db.users[userIdx];
  res.json({ user: safeUser });
});

// -------------------------------------------------------------
// ORDERS ENDPOINTS
// -------------------------------------------------------------

// GET /api/orders
app.get('/api/orders', (req, res) => {
  const db = readDb();
  const { userId, role } = req.query;

  let filtered = db.orders;
  if (userId) {
    filtered = filtered.filter((o) => o.userId === userId);
  }

  res.json({ orders: filtered });
});

// POST /api/orders
app.post('/api/orders', (req, res) => {
  const { order, payment } = req.body;
  if (!order) {
    return res.status(400).json({ error: 'Order details are required' });
  }

  const db = readDb();
  const orderId = order.orderId || `KSN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const newOrder = {
    ...order,
    orderId,
    status: order.status || 'Order Placed',
    createdAt: order.createdAt || new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
    timestamp: new Date().toISOString(),
    paymentDetails: payment || {
      gateway: order.customer?.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment',
      status: 'SUCCESS',
      paidAt: new Date().toISOString()
    }
  };

  db.orders.unshift(newOrder);
  writeDb(db);

  res.status(201).json({ success: true, order: newOrder });
});

// GET /api/orders/:id
app.get('/api/orders/:id', (req, res) => {
  const db = readDb();
  const order = db.orders.find((o) => o.orderId === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json({ order });
});

// PATCH /api/orders/:id/status
app.patch('/api/orders/:id/status', (req, res) => {
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  const db = readDb();
  const order = db.orders.find((o) => o.orderId === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  order.status = status;
  order.lastUpdated = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  writeDb(db);

  res.json({ success: true, order });
});

// -------------------------------------------------------------
// PAYMENT GATEWAY ENDPOINTS (Razorpay / UPI / Cards)
// -------------------------------------------------------------

// POST /api/payment/create-order
app.post('/api/payment/create-order', (req, res) => {
  const { amount, currency = 'INR', notes } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Valid amount is required' });
  }

  // Simulated Razorpay Order Response
  const razorpayOrderId = `order_rzp_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

  res.json({
    success: true,
    orderId: razorpayOrderId,
    amount: amount * 100, // amount in paise
    currency,
    key: 'rzp_test_kisan_drishti_sandbox',
    receipt: `rcpt_${Date.now()}`,
    status: 'created'
  });
});

// POST /api/payment/verify
app.post('/api/payment/verify', (req, res) => {
  const { orderId, paymentId, signature, method, amount } = req.body;

  const db = readDb();
  const record = {
    paymentId: paymentId || `pay_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`,
    orderId,
    method: method || 'UPI',
    amount,
    currency: 'INR',
    status: 'captured',
    timestamp: new Date().toISOString()
  };

  db.payments = db.payments || [];
  db.payments.unshift(record);
  writeDb(db);

  res.json({
    success: true,
    verified: true,
    payment: record,
    message: 'Payment authenticated and confirmed successfully'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'KisanDirect Backend API', timestamp: new Date().toISOString() });
});

// Serve static production frontend when dist/ exists (for Render / standalone hosting)
const DIST_PATH = path.join(__dirname, '../dist');
if (fs.existsSync(DIST_PATH)) {
  app.use(express.static(DIST_PATH));
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'API endpoint not found' });
    }
    res.sendFile(path.join(DIST_PATH, 'index.html'));
  });
}

// Only start listener if run directly (standalone server / Render), not in Vercel serverless functions
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[KISAN-BACKEND] Server listening on http://localhost:${PORT}`);
  });
}

export default app;
