import { NextResponse } from 'next/server';
import { fetchLatestDisasterUpdates } from '../utils';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const tag = body.tag || 'general';
  const tips = await fetchLatestDisasterUpdates(tag);
  return NextResponse.json({ updates: tips });
}
