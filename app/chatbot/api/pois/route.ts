import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const p = path.resolve(process.cwd(), 'public', 'pois.json');
    if (!fs.existsSync(p)) return NextResponse.json({ error: 'No pre-fetched POIs found' }, { status: 404 });
    const raw = fs.readFileSync(p, 'utf8');
    const data = JSON.parse(raw);
    return NextResponse.json({ pois: data });
  } catch (e) {
    return NextResponse.json({ error: 'Could not read pois.json', details: String(e) }, { status: 500 });
  }
}
