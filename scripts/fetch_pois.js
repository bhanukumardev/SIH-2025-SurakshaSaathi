#!/usr/bin/env node
// Robust utility: fetch POIs for a list of locations using the local Next.js API (which proxies to Flask if available)
// Usage examples:
//  pnpm run fetch:pois -- --locations '[{"name":"Bengaluru","lat":12.97,"lon":77.59}]' --out public/pois.json
//  pnpm run fetch:pois -- --file locations.json --out public/pois.json

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

function usageAndExit(msg) {
  if (msg) console.error(msg);
  console.error('\nUsage: fetch_pois.js --locations "[JSON array]" | --file path/to/locations.json [--url URL] [--out out.json]\n');
  process.exit(msg ? 2 : 0);
}

async function main() {
  const argv = require('minimist')(process.argv.slice(2));
  const url = argv.url || 'http://localhost:3000/chatbot/api/map_pois';
  const out = argv.out || 'public/pois.json';

  let locations = null;
  if (argv.locations) {
    try {
      locations = JSON.parse(argv.locations);
      if (!Array.isArray(locations)) throw new Error('locations must be an array');
    } catch (e) {
      usageAndExit('Could not parse --locations JSON: ' + e.message);
    }
  } else if (argv.file) {
    try {
      const f = fs.readFileSync(path.resolve(argv.file), 'utf8');
      locations = JSON.parse(f);
      if (!Array.isArray(locations)) throw new Error('file JSON must be an array');
    } catch (e) {
      usageAndExit('Could not read/parse --file: ' + e.message);
    }
  } else {
    usageAndExit('No locations provided');
  }

  const result = {};
  for (const loc of locations) {
    const name = loc.name || `${loc.lat},${loc.lon}`;
    console.log('Fetching', name);
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat: loc.lat, lon: loc.lon, radius_m: loc.radius_m || 20000, kind: loc.kind || 'amenity', limit: loc.limit || 50 })
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        console.error(`Request failed for ${name}: ${res.status} ${res.statusText} ${txt}`);
        result[name] = { error: `HTTP ${res.status}` };
        continue;
      }
      const data = await res.json();
      result[name] = data.pois || data;
      console.log(`  -> ${Array.isArray(result[name]) ? result[name].length : 'ok'} results`);
    } catch (e) {
      console.error('Failed for', name, e.message || e);
      result[name] = { error: String(e) };
    }
  }

  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(result, null, 2));
  console.log('Wrote', out);
}

main().catch(e => { console.error(e); process.exit(1); });
