import { NextResponse } from 'next/server';

export async function GET() {
  // Try contacting the local Flask chatbot server
  try {
    const res = await fetch('http://127.0.0.1:5000/', { method: 'GET' });
    if (res.ok) return NextResponse.json({ up: true });
  } catch (e) {
    // ignore
  }
  return NextResponse.json({ up: false });
}
