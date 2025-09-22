const Database = require('better-sqlite3');
const path = require('path');

let dbFile = path.join(__dirname, 'server', 'data.sqlite');

try {
  const db = new Database(dbFile);
  const alerts = db.prepare('SELECT * FROM alerts ORDER BY time DESC').all();
  console.log('Alerts in DB:', alerts);
  db.close();
} catch (err) {
  console.error('Error:', err);
}
