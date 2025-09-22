const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

let useSQLite = process.env.USE_SQLITE === '1' && process.env.NODE_ENV !== 'production';
let db = null;
const jsonFile = path.join(__dirname, '..', 'users.json');

// Only try to use SQLite in development, fallback to JSON in production/serverless
if (useSQLite) {
  try {
    const Database = require('better-sqlite3');
    const dbPath = path.join(__dirname, '..', 'data.sqlite');
    db = new Database(dbPath);
    db.prepare(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE,
        passwordHash TEXT,
        role TEXT,
        googleId TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        badges TEXT DEFAULT '[]',
        lastLoginDate DATETIME,
        loginStreak INTEGER DEFAULT 0
      )
    `).run();
    console.log('Using SQLite database for user storage');
  } catch (error) {
    console.warn('SQLite not available, falling back to JSON storage:', error.message);
    useSQLite = false;
  }
}

if (!useSQLite) {
  if (!fs.existsSync(jsonFile)) {
    fs.writeFileSync(jsonFile, JSON.stringify([]));
  }
  console.log('Using JSON file storage for user storage');
}

function normalizeUser(user) {
  if (!user) return user;
  user.badges = user.badges ? (typeof user.badges === 'string' ? JSON.parse(user.badges) : user.badges) : [];
  user.loginStreak = user.loginStreak || 0;
  return user;
}

function getUsers() {
  if (useSQLite) {
    const users = db.prepare('SELECT * FROM users').all();
    return users.map(normalizeUser);
  } else {
    const users = JSON.parse(fs.readFileSync(jsonFile));
    return users.map(normalizeUser);
  }
}

function saveUser(user) {
  if (useSQLite) {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO users (id, name, email, passwordHash, role, googleId, badges, lastLoginDate, loginStreak)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(user.id, user.name, user.email, user.passwordHash, user.role, user.googleId, JSON.stringify(user.badges || []), user.lastLoginDate, user.loginStreak || 0);
  } else {
    const users = getUsers();
    const existingIndex = users.findIndex(u => u.id === user.id);
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    fs.writeFileSync(jsonFile, JSON.stringify(users, null, 2));
  }
}

function getUserByEmail(email) {
  if (useSQLite) {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    return normalizeUser(user);
  } else {
    const users = getUsers();
    return users.find(u => u.email === email);
  }
}

function getUserById(id) {
  if (useSQLite) {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    return normalizeUser(user);
  } else {
    const users = getUsers();
    return users.find(u => u.id === id);
  }
}

function getUserByGoogleId(googleId) {
  if (useSQLite) {
    const user = db.prepare('SELECT * FROM users WHERE googleId = ?').get(googleId);
    return normalizeUser(user);
  } else {
    const users = getUsers();
    return users.find(u => u.googleId === googleId);
  }
}

module.exports = {
  saveUser,
  getUserByEmail,
  getUserById,
  getUserByGoogleId,
  getUsers,
};
