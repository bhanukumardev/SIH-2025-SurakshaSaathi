const path = require('path');

let dbFile = path.join(__dirname, 'server', 'data.sqlite');

// Function to dynamically try to load better-sqlite3
function initializeDatabase() {
  try {
    // Use dynamic require to handle cases where better-sqlite3 is not available
    const Database = require('better-sqlite3');
    const db = new Database(dbFile);
    console.log('Connected to SQLite database for alert check');
    return db;
  } catch (err) {
    // This catches both module not found and database connection errors
    console.error('Error connecting to database:', err.message);
    console.log('This script requires better-sqlite3 to be installed and working.');
    console.log('Run: npm install better-sqlite3');
    return null;
  }
}

const db = initializeDatabase();

if (db) {
  try {
    const alerts = db.prepare('SELECT * FROM alerts ORDER BY time DESC').all();
    console.log('Alerts in DB:', alerts);
    db.close();
  } catch (err) {
    console.error('Error querying alerts:', err);
    if (db) db.close();
  }
} else {
  console.log('Skipping alert check - database not available');
}
