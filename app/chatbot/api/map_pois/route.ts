import { NextResponse } from 'next/server';

function buildOverpassQuery(kind: string, lat: number, lon: number, radius_m = 20000) {
  const k = (kind || 'amenity').toLowerCase();
  if (k === 'hospital' || k === 'hospitals') return `[out:json][timeout:25];(node["amenity"="hospital"](around:${radius_m},${lat},${lon}););out body;>;out skel qt;`;
  if (k === 'school' || k === 'schools') return `[out:json][timeout:25];(node["amenity"="school"](around:${radius_m},${lat},${lon});node["amenity"="college"](around:${radius_m},${lat},${lon});node["amenity"="university"](around:${radius_m},${lat},${lon}););out body;>;out skel qt;`;
  if (k === 'roads' || k === 'road' || k === 'highway') return `[out:json][timeout:25];(way["highway"](around:${radius_m},${lat},${lon}););out body;>;out skel qt;`;
  if (k === 'electricity' || k === 'power') return `[out:json][timeout:25];(node["power"](around:${radius_m},${lat},${lon}););out body;>;out skel qt;`;
  return `[out:json][timeout:25];(node["amenity"="${k}"](around:${radius_m},${lat},${lon}););out body;>;out skel qt;`;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const lat = parseFloat(body.lat);
  const lon = parseFloat(body.lon);
  const radius = parseInt(body.radius_m || body.radius || 20000, 10);
  const kind = body.kind || 'amenity';
  const limit = parseInt(body.limit || '50', 10) || 50;

  if (Number.isNaN(lat) || Number.isNaN(lon) || Number.isNaN(radius)) {
    return NextResponse.json({ error: 'lat, lon, radius_m and limit must be numeric' }, { status: 400 });
  }

  const q = buildOverpassQuery(kind, lat, lon, radius);
  try {
    // Prefer local Flask endpoint which may provide caching / custom logic
    try {
      const flaskRes = await fetch('http://127.0.0.1:5000/map_pois', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lon, radius_m: radius, kind, limit })
      });
      if (flaskRes.ok) {
        const d = await flaskRes.json();
        return NextResponse.json(d);
      }
    } catch (err) {
      // fall back to direct Overpass call below
    }

    const res = await fetch('http://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: new URLSearchParams({ data: q }),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    if (!res.ok) return NextResponse.json({ error: 'Could not fetch POIs' }, { status: 500 });
    const data = await res.json();
    const elements = Array.isArray(data.elements) ? data.elements : [];
    const pois: any[] = [];
    for (const el of elements) {
      const lat_v = el.lat || (el.center && el.center.lat);
      const lon_v = el.lon || (el.center && el.center.lon);
      const tags = el.tags || {};
      const name = tags.name || tags.official_name || tags.ref || '';
      if (lat_v && lon_v) {
        pois.push({ id: el.id, osm_type: el.type, lat: parseFloat(lat_v), lon: parseFloat(lon_v), name, tags });
      }
      if (pois.length >= limit) break;
    }
    return NextResponse.json({ pois });
  } catch (e) {
    return NextResponse.json({ error: 'Could not fetch POIs', details: String(e) }, { status: 500 });
  }
}
