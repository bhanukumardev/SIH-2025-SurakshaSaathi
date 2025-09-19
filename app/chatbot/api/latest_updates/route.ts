import { NextResponse } from 'next/server';
import { fetchLatestDisasterUpdates } from '../utils';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const tag = body.tag || 'general';
  // Prefer local Python implementation if Flask is running
  try {
    const flaskRes = await fetch('http://127.0.0.1:5000/latest_updates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tag })
    });
    if (flaskRes.ok) {
      const d = await flaskRes.json();
      return NextResponse.json({ updates: d.get('updates') ? d.get('updates') : d.updates || d });
    }
  } catch (e) {
    // fallback to JS fetcher
  }

  const tips = await fetchLatestDisasterUpdates(tag);
  return NextResponse.json({ updates: tips });
}
