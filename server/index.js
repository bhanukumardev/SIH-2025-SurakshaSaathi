require('dotenv').config();

const express = require('express');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const passport = require('./auth');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const { findUserByEmail, findUserById, addUser } = require('./db');
const { sendPasswordResetEmail } = require('./email');
const next = require('next');

dotenv.config();

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const app = express();
const PORT = 3000;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session setup with SQLite store or fallback to memory store
const sessionOptions = {
  secret: process.env.SESSION_SECRET || 'default_session_secret',
  resave: false,
  saveUninitialized: false,
};

if (process.env.DATABASE_URL) {
  sessionOptions.store = new SQLiteStore({ db: 'sessions.sqlite', dir: __dirname });
}

app.use(session(sessionOptions));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Helper middleware to check authentication
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  // Check JWT token
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    jwt.verify(token, process.env.SESSION_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token' });
      }
      req.user = decoded;
      next();
    });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
}

// Registration endpoint
app.post('/register', async (req, res) => {
  const { name, email, password, role, school, class: className, region, language } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }
  const existingUser = findUserByEmail(email);
  if (existingUser) {
    return res.status(409).json({ message: 'User already exists' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: uuidv4(),
    name,
    email,
    password: hashedPassword,
    role: role || 'student',
    school: school || null,
    class: className || null,
    region: region || null,
    language: language || null,
  };
  addUser(newUser);
  res.status(201).json({ message: 'User registered successfully' });
});

// Login endpoint with JWT token response
app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) { return res.status(401).json({ message: info.message || 'Login failed' }); }
    req.logIn(user, (err) => {
      if (err) { return next(err); }
      // Issue JWT token
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.SESSION_SECRET, { expiresIn: '1h' });
      res.json({ message: 'Login successful', token });
    });
  })(req, res, next);
});

// Google OAuth routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  res.redirect('/');
});

// Logout route
app.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.json({ message: 'Logged out' });
  });
});

// Protected profile route
app.get('/profile', ensureAuthenticated, (req, res) => {
  res.json({ user: req.user });
});

// Password reset request endpoint
app.post('/reset-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });
  const user = findUserByEmail(email);
  if (!user) return res.status(404).json({ message: 'User not found' });
  // Generate reset token (for demo, just a UUID)
  const resetToken = uuidv4();
  // In real app, store token with expiry in DB
  await sendPasswordResetEmail(email, resetToken);
  res.json({ message: 'Password reset email sent' });
});

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Test route is working' });
});

// Next.js handling for pages
nextApp.prepare().then(() => {
  app.use((req, res) => {
    return handle(req, res);
  });

  // Startup logging
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Endpoints:');
    console.log('POST /register - Register new user');
    console.log('POST /login - Login with email/password, returns JWT token');
    console.log('GET /auth/google - Google OAuth login');
    console.log('GET /auth/google/callback - Google OAuth callback');
    console.log('GET /logout - Logout');
    console.log('GET /profile - Get user profile (requires auth)');
    console.log('POST /reset-password - Request password reset email');
    console.log('GET /test - Test route');
  });
});

module.exports = app;
