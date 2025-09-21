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
  // Try proxying to a running Python Flask server (app.py) if available.
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const flaskRes = await fetch('http://127.0.0.1:5000/handle_message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
      signal: controller.signal
    }).finally(() => clearTimeout(timeout));
    // Parse JSON body even if Flask returned a non-2xx status.
    const d = await flaskRes.json().catch(() => null);
    if (d && d.response) {
      // Return the Flask-provided response and preserve Flask status code where appropriate.
      return NextResponse.json({ response: d.response }, { status: flaskRes.status || 200 });
    }
    // If Flask returned no useful body, fall through to local fallback
  } catch (e) {
    // connection failed or timed out — continue to fallback
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
  const defaultTips = [
    'Stay tuned to local news and official alerts for your area.',
    'Prepare an emergency kit with water, food, and essential medicines.',
    'Identify safe locations and have an evacuation plan ready.'
  ];
  const chosen = (tips && tips.length) ? tips.slice(0, 3) : defaultTips;
  const fallText = [
    "I couldn't reach the ML model right now.",
    "I can still help — here are a few useful options:",
    `1) Preparedness tips and recent updates:\n${chosen.map((t, i) => `${i + 1}. ${t}`).join('\n')}`,
    '2) Try re-sending your question in a moment, or ask a specific topic (for example: "earthquake preparedness").',
    '3) Share your location so I can look up nearby resources (hospitals, shelters, schools).'
  ].join('\n\n');

  return NextResponse.json({ response: fallText }, { status: 200 });
}
