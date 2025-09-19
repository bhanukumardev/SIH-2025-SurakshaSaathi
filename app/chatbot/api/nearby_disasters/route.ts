import { NextResponse } from 'next/server';

async function queryUSGSEarthquakes(lat: number, lon: number, maxradiuskm = 200, days = 180, limit = 10) {
  const start = new Date(Date.now() - days * 24 * 3600 * 1000).toISOString().slice(0, 10);
  const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&latitude=${lat}&longitude=${lon}&maxradiuskm=${maxradiuskm}&starttime=${start}&limit=${limit}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    const out: any[] = [];
    for (const feat of (data.features || []).slice(0, limit)) {
      const props = feat.properties || {};
      const geom = feat.geometry || {};
      const coords = geom.coordinates || [];
      out.push({
        type: 'earthquake',
        title: props.title || `M ${props.mag} - ${props.place}`,
        mag: props.mag,
        place: props.place,
        time: props.time ? new Date(props.time).toISOString() : null,
        lat: coords[1] || null,
        lon: coords[0] || null,
        url: props.url
      });
    }
    return out;
  } catch (e) {
    return [];
  }
}

async function queryWeatherAlerts(lat: number, lon: number) {
  const url = `https://api.weather.gov/alerts/active?point=${lat},${lon}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    const out: any[] = [];
    for (const feat of (data.features || []).slice(0, 10)) {
      const props = feat.properties || {};
      out.push({
        type: 'weather',
        title: props.headline || props.event,
        severity: props.severity,
        onset: props.onset,
        expires: props.expires,
        areas: props.areaDesc
      });
    }
    return out;
  } catch (e) {
    return [];
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const lat = parseFloat(body.lat);
  const lon = parseFloat(body.lon);
  const radius = parseFloat(body.radius_km || body.radius || 20);
  const days = parseInt(body.days || '180', 10) || 180;
  const country = body.country || null;

  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    return NextResponse.json({ error: 'lat and lon required' }, { status: 400 });
  }

  const eqs = await queryUSGSEarthquakes(lat, lon, radius, days, 50);
  const alerts = await queryWeatherAlerts(lat, lon);
  const combined = [...eqs, ...alerts];

  // Simple dedupe by title/url
  const seen = new Set();
  const normalized: any[] = [];
  for (const ev of combined) {
    const id = ev.url || ev.title || JSON.stringify(ev);
    if (seen.has(id)) continue;
    seen.add(id);
    normalized.push(ev);
  }

  // Sort by time where possible (earthquakes may have time)
  normalized.sort((a, b) => {
    const ta = a.time ? new Date(a.time).getTime() : 0;
    const tb = b.time ? new Date(b.time).getTime() : 0;
    return tb - ta;
  });

  return NextResponse.json({ disasters: normalized });
}
