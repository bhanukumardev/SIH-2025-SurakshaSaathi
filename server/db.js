const fs = require('fs');
const path = require('path');

let dbFile = path.join(__dirname, 'data.sqlite');
if (process.env.DATABASE_URL) {
  if (process.env.DATABASE_URL.startsWith('sqlite:')) {
    dbFile = process.env.DATABASE_URL.substring(7);
  } else {
    dbFile = process.env.DATABASE_URL;
  }
}

// Ensure the directory exists
const dbDir = path.dirname(dbFile);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

let db;

// Function to dynamically try to load better-sqlite3
function initializeDatabase() {
  try {
    // Use dynamic require to handle cases where better-sqlite3 is not available
    const Database = require('better-sqlite3');
    db = new Database(dbFile);
    console.log(`Connected to SQLite database at ${dbFile}`);
    return true;
  } catch (err) {
    // This catches both module not found and database connection errors
    console.error('Failed to connect to SQLite database, falling back to JSON storage.', err);
    db = null;
    return false;
  }
}

// Try to initialize database
const hasSQLite = initializeDatabase();

const jsonFile = path.join(__dirname, 'users.json');

function getUsersFromJson() {
  if (!fs.existsSync(jsonFile)) {
    fs.writeFileSync(jsonFile, JSON.stringify([]));
  }
  const data = fs.readFileSync(jsonFile);
  return JSON.parse(data);
}

function saveUsersToJson(users) {
  fs.writeFileSync(jsonFile, JSON.stringify(users, null, 2));
}

function createTables() {
  if (!db) return;
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      role TEXT,
      school TEXT,
      class TEXT,
      region TEXT,
      language TEXT,
      googleId TEXT
    )
  `;
  db.prepare(createUsersTable).run();
}

createTables();

function findUserByEmail(email) {
  if (db) {
    return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  } else {
    const users = getUsersFromJson();
    return users.find(u => u.email === email);
  }
}

function findUserById(id) {
  if (db) {
    return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  } else {
    const users = getUsersFromJson();
    return users.find(u => u.id === id);
  }
}

function findUserByGoogleId(googleId) {
  if (db) {
    return db.prepare('SELECT * FROM users WHERE googleId = ?').get(googleId);
  } else {
    const users = getUsersFromJson();
    return users.find(u => u.googleId === googleId);
  }
}

function addUser(user) {
  if (db) {
    const stmt = db.prepare(`INSERT INTO users (id, name, email, password, role, school, class, region, language, googleId)
      VALUES (@id, @name, @email, @password, @role, @school, @class, @region, @language, @googleId)`);
    stmt.run(user);
  } else {
    const users = getUsersFromJson();
    users.push(user);
    saveUsersToJson(users);
  }
}

module.exports = {
  findUserByEmail,
  findUserById,
  findUserByGoogleId,
  addUser,
};
