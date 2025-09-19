import { NextResponse } from 'next/server';
import { fetchLatestDisasterUpdates, loadIntentsJson } from '../utils';

export async function POST(request: Request) {
  const data = await request.json().catch(() => ({}));
  const message = (data.message || '').toString();

  // Try a lightweight local intent match using intents.json (fallback)
  const intentsJson = loadIntentsJson();
  const text = message.toLowerCase();

  // keyword fallback similar to Flask's _FALLBACK_RULES
  const RULES: Record<string, string[]> = {
    greeting: ['hello', 'hi', 'hey', 'good morning', 'good evening'],
    goodbye: ['bye', 'goodbye', 'see you', 'take care'],
    thanks: ['thanks', 'thank you', 'thx'],
    earthquake: ['earthquake', 'tremor', 'shake', 'shaking'],
    flood: ['flood', 'flooding', 'inundation', 'heavy rain', 'river overflow'],
    hurricane_cyclone_typhoon: ['cyclone', 'hurricane', 'typhoon', 'storm surge'],
    wildfire: ['fire', 'wildfire', 'bushfire', 'forest fire'],
    tsunami: ['tsunami', 'sea wave', 'tidal wave'],
    preparedness: ['prepare', 'preparation', 'kit', 'emergency kit', 'evacuate', 'evacuation']
  };

  function fallbackIntentForMessage(msg: string) {
    for (const [tag, kws] of Object.entries(RULES)) {
      for (const kw of kws) {
        if (msg.includes(kw)) return tag;
      }
    }
    return null;
  }

  function buildFallbackResponse(tag: string | null) {
    if (!tag) return "I'm sorry — I couldn't access the model right now. I can provide general preparedness tips or latest updates.";
    const intent = (intentsJson.intents || []).find((i: any) => i.tag === tag);
    if (intent && Array.isArray(intent.responses) && intent.responses.length > 0) {
      const pick = intent.responses.slice(0, 3);
      return pick.join('\n');
    }
    return "I'm sorry — I couldn't access the model right now. I can provide general preparedness tips or latest updates.";
  }

  // First: try proxying to a running Python Flask server (app.py) if available.
  try {
    const flaskRes = await fetch('http://127.0.0.1:5000/handle_message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    if (flaskRes.ok) {
      const d = await flaskRes.json();
      if (d && d.response) return NextResponse.json({ response: d.response });
    }
    // If flask returns non-ok, we fall through to local fallback
  } catch (e) {
    // connection failed — no Flask server running locally; continue to fallback
  }

  // Attempt a simple keyword fallback using intents.json
  const tag = fallbackIntentForMessage(text);
  if (tag) {
    let respText = buildFallbackResponse(tag);
    try {
      const tips = await fetchLatestDisasterUpdates(tag);
      if (tips && tips.length) {
        respText += '\n\nLATEST UPDATES:\n' + tips.slice(0, 3).map((t, i) => `${i + 1}. ${t}`).join('\n');
      }
    } catch (e) {
      // ignore
    }
    return NextResponse.json({ response: respText });
  }

  // No keyword match — return general updates as a helpful fallback
  const tips = await fetchLatestDisasterUpdates('general');
  const fallText = "I couldn't access the ML model right now, but here are some important tips and latest updates:\n\n" + tips.map((t, i) => `${i + 1}. ${t}`).join('\n');
  return NextResponse.json({ response: fallText }, { status: 503 });
}
