// Test missing fields
fetch('http://localhost:3001/api/alerts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ region: 'Delhi', level: 'High' })
}).then(async res => {
  console.log('Missing fields test:', res.status, await res.text());
}).catch(console.error);

// Test wrong API key
fetch('http://localhost:3001/api/alerts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'x-api-key': 'wrong' },
  body: JSON.stringify({ region: 'Delhi', level: 'High', message: 'Test' })
}).then(async res => {
  console.log('Wrong API key test:', res.status, await res.text());
}).catch(console.error);

// Test correct API key
fetch('http://localhost:3001/api/alerts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'x-api-key': 'testkey' },
  body: JSON.stringify({ region: 'Delhi', level: 'High', message: 'Strong quake reported. Drop, Cover, Hold On.' })
}).then(async res => {
  console.log('Correct API key test:', res.status, await res.text());
}).catch(console.error);
