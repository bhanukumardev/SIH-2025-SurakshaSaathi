require('dotenv').config();
const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { getUserByEmail, getUserById, getUserByGoogleId, saveUser } = require('./lib/userStore');
const { saveAlert } = require('./server/alertStore');
const { saveQuizAttempt, getUserProgress } = require('./lib/userProgressStore');
const { saveDrillParticipationRecord, getDrillParticipation } = require('./lib/drillStore');
const { checkAndAwardBadges } = require('./lib/badges');
const register = require('./api/auth/register');
const login = require('./api/auth/login');
const googleAuth = require('./api/auth/google');
const googleCallback = require('./api/auth/googleCallback');
const { getAllModules, getModuleById } = require('./api/modules');
const quizRouter = require('./api/quiz');
const leaderboardRouter = require('./api/leaderboard');
const getUserStats = require('./api/user/stats/index');
const fs = require('fs');
const path = require('path');

// Database connections
const mongoose = require('mongoose');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Passport setup
passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
  const user = getUserByEmail(email);
  if (!user) return done(null, false, { message: 'Invalid credentials' });
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return done(null, false, { message: 'Invalid credentials' });
  return done(null, user);
}));

// passport.use(new GoogleStrategy({
//   clientID: process.env.GOOGLE_CLIENT_ID,
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//   callbackURL: "/api/auth/googleCallback",
// }, async (accessToken, refreshToken, profile, done) => {
//   let user = getUserByGoogleId(profile.id);
//   if (!user) {
//     user = getUserByEmail(profile.emails[0].value);
//     if (user) {
//       user.googleId = profile.id;
//       saveUser(user);
//     } else {
//       user = { id: uuidv4(), name: profile.displayName, email: profile.emails[0].value, role: "student", googleId: profile.id };
//       saveUser(user);
//     }
//   }
//   return done(null, user);
// }));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  const user = getUserById(id);
  done(null, user);
});

app.use(passport.initialize());

let clients = [];

// SSE stream endpoint
app.get('/api/alerts/stream', (req, res) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });
  res.flushHeaders();

  // Keep connection alive
  res.write('retry: 10000\n\n');
  clients.push(res);

  req.on('close', () => {
    clients = clients.filter(client => client !== res);
  });
});

// function to broadcast alert to all clients
function broadcastAlert(alertObj) {
  const data = `data: ${JSON.stringify(alertObj)}\n\n`;
  clients.forEach(res => res.write(data));
}

// Load drill scenarios from file
function loadDrillScenarios() {
  try {
    const data = fs.readFileSync(path.join(__dirname, 'data', 'drillScenarios.json'), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading drill scenarios:', error);
    return [];
  }
}

// In-memory storage for drill participation (for now)
let drillParticipation = [];

// Function to record drill participation
function recordDrillParticipation(userId, drillId) {
  const record = {
    id: uuidv4(),
    userId,
    drillId,
    timestamp: Date.now()
  };
  drillParticipation.push(record);
  // TODO: Save to file or database for persistence
  console.log('Drill participation recorded:', record);
}

// Routes
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);
app.get('/api/auth/google', googleAuth);
app.get('/api/auth/googleCallback', googleCallback);

// Protected route example
app.get('/api/admin/metrics', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('X-API-Key: ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  // Check API key
  res.json({ metrics: 'some data' });
});

// Admin API to push new alerts
app.post('/api/alerts', (req, res) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.ADMIN_API_KEY) {
    return res.status(403).json({ error: "Unauthorized" });
  }
  const { region, level, message } = req.body;
  if (!region || !level || !message) {
    return res.status(400).json({ error: "Missing fields" });
  }
  const alertObj = { id: uuidv4(), region, level, message, time: Date.now() };

  // Save to file/SQLite and broadcast to clients
  saveAlert(alertObj);        // persist for audit/history
  broadcastAlert(alertObj);   // send to all SSE clients

  res.json({ success: true });
});

// Modules API
app.get('/api/modules', getAllModules);
app.get('/api/modules/:id', getModuleById);

// Quiz API
app.use('/api/quiz', quizRouter);

// Leaderboard API
app.use('/api/leaderboard', leaderboardRouter);

// User badges API
app.get('/api/user/:userId/badges', (req, res) => {
  const user = getUserById(req.params.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ badges: user.badges || [] });
});

// User stats API
app.get('/api/user/stats', getUserStats);

// Drills API
app.get('/api/drills', (req, res) => {
  const drillData = loadDrillScenarios();
  // Optionally filter by user region if req.query.region
  const region = req.query.region;
  if (region) {
    const filtered = drillData.filter(d => d.region === region || d.region === 'all');
    res.json(filtered);
  } else {
    res.json(drillData);
  }
});

app.get('/api/drills/:id', (req, res) => {
  const drillData = loadDrillScenarios();
  const drill = drillData.find(d => d.id === req.params.id);
  if (!drill) return res.status(404).json({ error: 'Drill not found' });
  res.json(drill);
});

app.post('/api/drills/:id/start', (req, res) => {
  const drillData = loadDrillScenarios();
  const drill = drillData.find(d => d.id === req.params.id);
  if (!drill) return res.status(404).json({ error: 'Drill not found' });
  // Assume userId from auth or req.body, for now use a placeholder
  const userId = (req.body && req.body.userId) || 'anonymous'; // TODO: Get from authenticated user
  if (userId !== 'anonymous') {
    const user = getUserById(userId);
    if (user) {
      saveDrillParticipationRecord(userId, drill.id);
      // Check for new badges
      const userProgress = getUserProgress();
      const drillParticipation = getDrillParticipation();
      const newBadges = checkAndAwardBadges(user, userProgress, drillParticipation);
      if (newBadges.length > 0) {
        saveUser(user);
      }
      res.json({ started: true, drillId: drill.id, newBadges });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } else {
    res.json({ started: true, drillId: drill.id });
  }
});

// Database connection setup
async function connectDatabases() {
  try {
    // Connect to MongoDB
    if (process.env.DATABASE_URL) {
      await mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log('✅ MongoDB connected successfully');
    }

    // Test Supabase connection
    if (supabaseUrl && supabaseKey) {
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      if (error) {
        console.log('⚠️  Supabase connection test failed, but continuing...');
      } else {
        console.log('✅ Supabase connected successfully');
      }
    }

    console.log('🎉 All database connections established');
  } catch (error) {
    console.error('❌ Database connection error:', error);
    // Don't exit process, let the app continue with limited functionality
  }
}

// Initialize database connections
connectDatabases();

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
  console.log(`🤖 Chatbot available at http://localhost:5000`);
});
