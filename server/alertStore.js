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

let db;
let useSQLite = process.env.NODE_ENV !== 'production';

// Only try to use SQLite in development, fallback to JSON in production/serverless
if (useSQLite) {
  try {
    const Database = require('better-sqlite3');
    db = new Database(dbFile);
    console.log(`Connected to SQLite database at ${dbFile}`);
  } catch (err) {
    console.warn('SQLite not available, falling back to JSON storage:', err.message);
    db = null;
    useSQLite = false;
  }
}

// Use /tmp directory for serverless environments like Vercel
const jsonFile = process.env.NODE_ENV === 'production' 
  ? '/tmp/alerts.json' 
  : path.join(__dirname, 'alerts.json');

function getAlertsFromJson() {
  // Ensure the directory exists for serverless environments
  const dir = path.dirname(jsonFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  if (!fs.existsSync(jsonFile)) {
    fs.writeFileSync(jsonFile, JSON.stringify([]));
  }
  const data = fs.readFileSync(jsonFile);
  return JSON.parse(data);
}

function saveAlertsToJson(alerts) {
  const dir = path.dirname(jsonFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(jsonFile, JSON.stringify(alerts, null, 2));
}

function createAlertsTable() {
  if (!db) return;
  const createAlertsTable = `
    CREATE TABLE IF NOT EXISTS alerts (
      id TEXT PRIMARY KEY,
      region TEXT,
      level TEXT,
      message TEXT,
      time INTEGER
    )
  `;
  db.prepare(createAlertsTable).run();
}

createAlertsTable();

function saveAlert(alert) {
  if (db) {
    const stmt = db.prepare(`INSERT INTO alerts (id, region, level, message, time)
      VALUES (@id, @region, @level, @message, @time)`);
    stmt.run(alert);
  } else {
    const alerts = getAlertsFromJson();
    alerts.push(alert);
    saveAlertsToJson(alerts);
  }
}

function getAllAlerts() {
  if (db) {
    return db.prepare('SELECT * FROM alerts ORDER BY time DESC').all();
  } else {
    return getAlertsFromJson();
  }
}

module.exports = {
  saveAlert,
  getAllAlerts,
};
