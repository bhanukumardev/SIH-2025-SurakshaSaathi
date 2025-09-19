import { NextResponse } from 'next/server';

async function detectLocationFromRequest(request: Request) {
  // Attempt to read X-Forwarded-For or remote IP via headers
  const forwarded = request.headers.get('x-forwarded-for') || '';
  const ip = forwarded.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'me';
  const url = ip === 'me' ? 'http://ip-api.com/json' : `http://ip-api.com/json/${ip}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.status !== 'success') return null;
    const display = [data.city, data.regionName, data.country].filter(Boolean).join(', ');
    return { lat: data.lat, lon: data.lon, display_name: display || data.query };
  } catch (e) {
    return null;
  }
}

export async function GET(request: Request) {
  const loc = await detectLocationFromRequest(request);
  if (!loc) return NextResponse.json({ error: 'Could not detect location' }, { status: 404 });
  return NextResponse.json({ location: loc });
}
