import { NextResponse } from 'next/server';
import { fetchLatestDisasterUpdates } from '../utils';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const tag = body.tag || 'general';
  // Prefer local Python implementation if Flask is running
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const flaskRes = await fetch('http://127.0.0.1:5000/latest_updates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tag }),
      signal: controller.signal
    }).finally(() => clearTimeout(timeout));
    // Parse the Flask body even if Flask returns non-2xx (it may return helpful JSON)
    const d = await flaskRes.json().catch(() => null);
    if (d) {
      const updates = d.get && typeof d.get === 'function' ? d.get('updates') : (d.updates || d);
      return NextResponse.json({ updates }, { status: flaskRes.status || 200 });
    }
  } catch (e) {
    // If Flask cannot be reached or times out, fall back to the JS fetcher and include a note.
  }

  const tips = await fetchLatestDisasterUpdates(tag);
  // Provide a short meta note so consumers (frontend) can explain the fallback to users
  return NextResponse.json({ updates: tips, meta: { source: 'fallback-js', note: 'Could not reach local Flask service; returning cached/JS-sourced updates.' } });
}
