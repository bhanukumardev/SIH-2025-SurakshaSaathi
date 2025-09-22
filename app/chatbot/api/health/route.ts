import { NextResponse } from 'next/server';

export async function GET() {
  // Try contacting the local Flask chatbot server's model_status endpoint
  try {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch('http://127.0.0.1:5000/model_status', { method: 'GET', signal: controller.signal }).finally(() => clearTimeout(timeout));
    const d = await res.json().catch(() => null);
    // Normalize Flask's response into the frontend-friendly shape { up, modelLoaded }
    if (d && typeof d === 'object') {
      // Flask uses various keys (model_loaded, modelLoaded, loaded) depending on server code.
      const modelLoadedRaw = d.model_loaded ?? d.modelLoaded ?? d.loaded ?? null;
      const modelLoaded = modelLoadedRaw === null ? null : Boolean(modelLoadedRaw);
      return NextResponse.json({ up: true, modelLoaded }, { status: res.status || 200 });
    }
    // Flask reachable but returned no usable JSON
    return NextResponse.json({ up: true, modelLoaded: null }, { status: res.status || 200 });
  } catch (e) {
    // Flask not reachable or timed out
    return NextResponse.json({ up: false }, { status: 503 });
  }
}
