import fs from 'fs';
import path from 'path';

type UpdateResult = string[];

const SOURCES: Record<string, string[]> = {
  earthquake: [
    'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson',
    'https://api.reliefweb.int/v1/disasters?appname=apidoc&filter[type]=earthquake'
  ],
  flood: [
    'https://api.reliefweb.int/v1/disasters?appname=apidoc&filter[type]=flood',
    'https://api.weather.gov/alerts/active?event=Flood'
  ],
  hurricane_cyclone_typhoon: [
    'https://api.weather.gov/alerts/active?event=Hurricane',
    'https://rss.weather.gov.hk/rss/SeveralWeather.xml'
  ],
  wildfire: [
    'https://api.reliefweb.int/v1/disasters?appname=apidoc&filter[type]=wildfire',
    'https://api.weather.gov/alerts/active?event=Fire'
  ],
  tsunami: [
    'https://api.weather.gov/alerts/active?event=Tsunami',
    'https://api.reliefweb.int/v1/disasters?appname=apidoc&filter[type]=tsunami'
  ],
  general: ['https://api.reliefweb.int/v1/disasters?appname=apidoc&limit=5']
};

function extractTitlesFromXml(text: string, limit = 3) {
  const titles: string[] = [];
  // naive regex-based title extraction for RSS/Atom/html headlines
  const re = /<title[^>]*>([^<]+)<\/title>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) && titles.length < limit) {
    const t = m[1].trim();
    if (t && !titles.includes(t)) titles.push(t);
  }
  return titles;
}

export async function fetchLatestDisasterUpdates(tag = 'general'): Promise<UpdateResult> {
  const urls = SOURCES[tag] || SOURCES['general'];
  const tips: string[] = [];

  for (const url of urls) {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) continue;
      const ct = (res.headers.get('content-type') || '').toLowerCase();
      const text = await res.text();

      if (ct.includes('application/json') || text.trim().startsWith('{')) {
        try {
          const data = JSON.parse(text);
          if (data && Array.isArray(data.features)) {
            for (const f of data.features.slice(0, 3)) {
              const props = f.properties || {};
              const mag = props.mag;
              const place = props.place;
              const label = mag || place ? `Alert: Magnitude ${mag} earthquake near ${place}` : 'Earthquake alert';
              if (!tips.includes(label)) tips.push(label);
            }
          } else if (data && Array.isArray(data.data)) {
            for (const item of data.data.slice(0, 3)) {
              const fields = item.fields || {};
              const title = fields.name || fields.title || item.title;
              const status = fields.status || 'Active';
              const label = `Update: ${title} - ${status}`;
              if (title && !tips.includes(label)) tips.push(label);
            }
          }
        } catch (e) {
          // ignore JSON parse errors
        }
      } else {
        // parse XML/RSS/HTML with naive title regex
        const found = extractTitlesFromXml(text, 3);
        for (const t of found) {
          const label = `Update: ${t}`;
          if (!tips.includes(label)) tips.push(label);
        }
      }
    } catch (e) {
      continue;
    }
    if (tips.length >= 5) break;
  }

  if (tips.length === 0) {
    return [
      'Remember to stay informed through local news and weather services',
      'Keep emergency contacts handy',
      'Have an emergency kit ready with essentials'
    ];
  }

  // dedupe & return up to 5
  const out: string[] = [];
  for (const t of tips) {
    if (t && !out.includes(t)) out.push(t);
    if (out.length >= 5) break;
  }
  return out;
}

export function loadIntentsJson() {
  try {
    const p = path.join(process.cwd(), 'chatbot', 'intents.json');
    const raw = fs.readFileSync(p, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    return { intents: [] };
  }
}
