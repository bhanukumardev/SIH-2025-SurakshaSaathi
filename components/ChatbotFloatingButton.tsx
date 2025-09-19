"use client";

import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { copyToClipboard as utilCopy, sendToHandleMessage } from './chatbot-utils';

function ChatbotPanel({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Array<{ id: string; sender: 'user' | 'bot'; text: string }>>([
    { id: '1', sender: 'bot', text: "Hello! I'm your safety assistant. Ask me anything." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [radiusKm, setRadiusKm] = useState<number>(20);
  const [days, setDays] = useState<number>(180);
  const [country, setCountry] = useState<string>('India');
  const [textOnly, setTextOnly] = useState<boolean>(false);
  const [autoSendLocation, setAutoSendLocation] = useState<boolean>(true);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [geoMethod, setGeoMethod] = useState<'browser' | 'ip' | 'none'>('none');

  const send = async () => {
    if (!input.trim()) return;
    const txt = input;
    const id = Date.now().toString();
    setMessages((m) => [...m, { id, sender: 'user', text: txt }]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/chatbot/api/handle_message', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: txt }) });
      const d = await res.json();
      const botText = d?.response || 'No response';
      setMessages((m) => [...m, { id: Date.now().toString(), sender: 'bot', text: botText }]);
    } catch (e) {
      setMessages((m) => [...m, { id: Date.now().toString(), sender: 'bot', text: "Sorry, I couldn't reach the server." }]);
    } finally {
      setLoading(false);
    }
  };

  // map removed: we render text-only results using the React ResultsList component below

  function escapeHtml(s: string) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  async function copyToClipboard(text: string) {
    try {
      await utilCopy(text);
      setMessages((m) => [...m, { id: Date.now().toString(), sender: 'bot', text: 'Coordinates copied to clipboard.' }]);
    } catch (e) {
      setMessages((m) => [...m, { id: Date.now().toString(), sender: 'bot', text: 'Could not copy to clipboard.' }]);
    }
  }

  async function shareToChat(text: string) {
    const id = Date.now().toString();
    setMessages((m) => [...m, { id, sender: 'user', text }]);
    if (!autoSendLocation) return;
    try {
      const d = await sendToHandleMessage(text);
      setMessages((m) => [...m, { id: Date.now().toString(), sender: 'bot', text: d?.response || 'No response' }]);
    } catch (e) {
      setMessages((m) => [...m, { id: Date.now().toString(), sender: 'bot', text: 'Could not send location to chat.' }]);
    }
  }


  const getLatestUpdates = async (tag = 'general') => {
    setLoading(true);
    try {
      const res = await fetch('/chatbot/api/latest_updates', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tag }) });
      const d = await res.json();
      const updates = d?.updates || [];
      const text = updates.length ? `LATEST UPDATES:\n${updates.map((u: string, i: number) => `${i+1}. ${u}`).join('\n')}` : 'No updates found.';
      setMessages((m) => [...m, { id: Date.now().toString(), sender: 'bot', text }]);
    } catch (e) {
      setMessages((m) => [...m, { id: Date.now().toString(), sender: 'bot', text: "Could not fetch latest updates." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationClick = async () => {
    setLoading(true);
    // ask for browser geolocation first
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setGeoMethod('browser');
        setMessages((m) => [...m, { id: Date.now().toString(), sender: 'bot', text: `Detected location: ${lat.toFixed(4)}, ${lon.toFixed(4)}` }]);
          try {
          const nearRes = await fetch('/chatbot/api/nearby_disasters', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lat, lon, radius_km: radiusKm, days, country }) });
          const nearJson = await nearRes.json();
          const list = nearJson.disasters || [];
          if (!list.length) {
            setMessages((m) => [...m, { id: Date.now().toString(), sender: 'bot', text: 'No nearby incidents found.' }]);
          } else {
            const text = list.slice(0, 5).map((d: any, i: number) => `${i+1}. ${d.title || d.type} ${d._distance_km ? `(${d._distance_km} km)` : ''}`).join('\n');
            setMessages((m) => [...m, { id: Date.now().toString(), sender: 'bot', text: `Nearby incidents:\n${text}` }]);
          }

            // also fetch POIs (hospitals) nearby
          try {
            const poisRes = await fetch('/chatbot/api/map_pois', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lat, lon, kind: 'hospital', radius_m: Math.round(radiusKm * 1000), limit: 50 }) });
            const poisJson = await poisRes.json();
            const pois = poisJson.pois || [];
            if (pois.length) {
              const ptext = pois.map((p: any, idx: number) => `${idx+1}. ${p.name || p.tags?.name || 'POI'} ${p.distance_km ? `(${p.distance_km} km)` : ''}`).join('\n');
              setMessages((m) => [...m, { id: Date.now().toString(), sender: 'bot', text: `Nearby POIs (hospitals):\n${ptext}` }]);
            }
            // set results state for React rendering (pagination handled by ResultsList)
            setResults({ disasters: list, pois });
          } catch (e) {
            // ignore POI errors but still set disasters
            setResults({ disasters: list, pois: [] });
          }
        } catch (e) {
          setMessages((m) => [...m, { id: Date.now().toString(), sender: 'bot', text: 'Error fetching nearby incidents.' }]);
          setErrorBanner('Error fetching nearby incidents. The backend may be unavailable.');
        } finally {
          setLoading(false);
        }
      }, async (err) => {
        // geolocation failed — fall back to server-side detect
        try {
          const locRes = await fetch('/chatbot/api/detect_location');
          if (locRes.ok) {
            const d = await locRes.json();
            const loc = d.location;
            if (loc) {
              const lat = loc.lat;
              const lon = loc.lon;
              setGeoMethod('ip');
              setMessages((m) => [...m, { id: Date.now().toString(), sender: 'bot', text: `Detected approximate location: ${loc.display_name}` }]);
              // reuse the same flow to fetch nearby incidents and POIs
              const nearRes = await fetch('/chatbot/api/nearby_disasters', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lat, lon, radius_km: radiusKm, days, country }) });
              const nearJson = await nearRes.json();
              const list = nearJson.disasters || [];
              if (!list.length) {
                setMessages((m) => [...m, { id: Date.now().toString(), sender: 'bot', text: 'No nearby incidents found.' }]);
              } else {
                const text = list.slice(0, 5).map((d: any, i: number) => `${i+1}. ${d.title || d.type} ${d._distance_km ? `(${d._distance_km} km)` : ''}`).join('\n');
                setMessages((m) => [...m, { id: Date.now().toString(), sender: 'bot', text: `Nearby incidents:\n${text}` }]);
              }
              setResults({ disasters: list, pois: [] });
            } else {
              setMessages((m) => [...m, { id: Date.now().toString(), sender: 'bot', text: 'Could not detect location.' }]);
            }
          } else {
            setMessages((m) => [...m, { id: Date.now().toString(), sender: 'bot', text: 'Could not detect location (server).' }]);
          }
        } catch (e2) {
          setMessages((m) => [...m, { id: Date.now().toString(), sender: 'bot', text: `Geolocation error: ${err?.message || 'unknown'}` }]);
        } finally {
          setLoading(false);
        }
      });
    } else {
      setMessages((m) => [...m, { id: Date.now().toString(), sender: 'bot', text: 'Geolocation is not supported by your browser.' }]);
      setLoading(false);
    }
  };

  // Results state for React rendering
  const [results, setResults] = useState<{ disasters: any[]; pois: any[] }>({ disasters: [], pois: [] });

  function ResultsList({ disasters, pois }: { disasters: any[]; pois: any[] }) {
    const [dPage, setDPage] = useState(0);
    const [pPage, setPPage] = useState(0);
    const pageSize = 6;

    const dSlice = disasters.slice(dPage * pageSize, (dPage + 1) * pageSize);
    const pSlice = pois.slice(pPage * pageSize, (pPage + 1) * pageSize);

    return (
      <div className="space-y-3">
        {disasters.length > 0 && (
          <div>
            <div className="flex items-center justify-between">
              <div className="font-semibold flex items-center gap-2">📛 Nearby Incidents <span className="text-xs text-gray-500">({disasters.length})</span></div>
              <div className="text-xs text-gray-500">Sorted by distance</div>
            </div>
            <div className="mt-2 grid gap-2">
              {dSlice.map((d: any) => (
                <div key={d.id || `${d.lat}-${d.lon}-${d._distance_km || ''}`} className="p-3 bg-white border rounded flex items-start justify-between">
                  <div>
                    <div className="font-medium">{d.title || d.type}</div>
                    <div className="text-xs text-gray-500">{d._distance_km ? `${d._distance_km} km` : ''} {d.time ? `· ${d.time}` : ''}</div>
                    <div className="text-sm text-gray-700 mt-1">{d.description || ''}</div>
                  </div>
                  <div className="flex flex-col gap-2 ml-2">
                    {d.lat && d.lon && <button onClick={() => copyToClipboard(`${d.lat},${d.lon}`)} className="px-2 py-1 bg-gray-100 rounded text-xs">Copy</button>}
                    {d.lat && d.lon && <button onClick={() => shareToChat(`Incident: ${d.title || d.type} at ${d.lat},${d.lon}`)} className="px-2 py-1 bg-blue-50 rounded text-xs">Share</button>}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-2 mt-2">
              <button disabled={dPage === 0} onClick={() => setDPage((p) => p - 1)} className="px-2 py-1 bg-gray-100 rounded text-xs">Prev</button>
              <div className="text-xs text-gray-500">Page {dPage + 1} / {Math.max(1, Math.ceil(disasters.length / pageSize))}</div>
              <button disabled={(dPage + 1) * pageSize >= disasters.length} onClick={() => setDPage((p) => p + 1)} className="px-2 py-1 bg-gray-100 rounded text-xs">Next</button>
            </div>
          </div>
        )}

        {pois.length > 0 && (
          <div>
            <div className="flex items-center justify-between">
              <div className="font-semibold flex items-center gap-2">🏥 Nearby POIs <span className="text-xs text-gray-500">({pois.length})</span></div>
              <div className="text-xs text-gray-500">Showing hospitals & clinics</div>
            </div>
            <div className="mt-2 grid gap-2">
              {pSlice.map((p: any) => (
                <div key={p.id || `${p.lat}-${p.lon}`} className="p-3 bg-white border rounded flex items-start justify-between">
                  <div>
                    <div className="font-medium">{p.name || p.tags?.name || 'POI'}</div>
                    <div className="text-xs text-gray-500">{p.tags?.amenity ? `${p.tags.amenity}` : ''} {p.distance_km ? `· ${p.distance_km} km` : ''}</div>
                  </div>
                  <div className="flex flex-col gap-2 ml-2">
                    {p.lat && p.lon && <button onClick={() => copyToClipboard(`${p.lat},${p.lon}`)} className="px-2 py-1 bg-gray-100 rounded text-xs">Copy</button>}
                    {p.lat && p.lon && <button onClick={() => shareToChat(`POI: ${p.name || p.tags?.name || 'POI'} at ${p.lat},${p.lon}`)} className="px-2 py-1 bg-blue-50 rounded text-xs">Share</button>}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-2 mt-2">
              <button disabled={pPage === 0} onClick={() => setPPage((p) => p - 1)} className="px-2 py-1 bg-gray-100 rounded text-xs">Prev</button>
              <div className="text-xs text-gray-500">Page {pPage + 1} / {Math.max(1, Math.ceil(pois.length / pageSize))}</div>
              <button disabled={(pPage + 1) * pageSize >= pois.length} onClick={() => setPPage((p) => p + 1)} className="px-2 py-1 bg-gray-100 rounded text-xs">Next</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-80 h-96 bg-white shadow-xl rounded-lg flex flex-col overflow-hidden">
      <div className="p-2 bg-blue-600 text-white flex items-center justify-between">
        <div className="font-semibold">Safety Assistant</div>
        <div className="flex items-center gap-2">
          <button onClick={() => getLatestUpdates('general')} className="text-white text-sm mr-2">Get Latest Updates</button>
          <button onClick={onClose} className="text-white text-sm">Close</button>
        </div>
      </div>
      <div className="p-2 border-b bg-transparent">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-sm">Radius (km):</label>
          <input value={radiusKm} onChange={(e) => setRadiusKm(Number(e.target.value))} type="number" className="w-20 p-1 border rounded" />
          <label className="text-sm">Days:</label>
          <input value={days} onChange={(e) => setDays(Number(e.target.value))} type="number" className="w-20 p-1 border rounded" />
        </div>
        <div className="flex items-center gap-2 mb-2">
          <label className="text-sm">Country:</label>
          <input value={country} onChange={(e) => setCountry(e.target.value)} type="text" className="w-32 p-1 border rounded" />
          <button onClick={() => setTextOnly((t) => !t)} className="px-2 py-1 bg-gray-100 rounded">{textOnly ? 'Text-only' : 'Map'}</button>
          <button onClick={handleLocationClick} className="px-2 py-1 bg-gray-100 rounded">📍 Share my location</button>
        </div>
        <div className="text-xs text-gray-600">Geo: {geoMethod === 'none' ? 'Not checked' : geoMethod === 'browser' ? 'Browser' : 'IP fallback'}</div>
      </div>
      <div className="p-2 flex-1 overflow-y-auto space-y-2">
        {errorBanner && (
          <div className="p-2 bg-red-50 border border-red-200 text-red-700 rounded">{errorBanner}</div>
        )}
        <div className="flex items-center gap-2">
          <label className="text-sm">Auto-send shared items:</label>
          <input type="checkbox" checked={autoSendLocation} onChange={(e) => setAutoSendLocation(e.target.checked)} />
        </div>
        {messages.map((m) => (
          <div key={m.id} className={`p-2 rounded ${m.sender === 'user' ? 'bg-blue-500 text-white ml-auto max-w-xs' : 'bg-gray-100 text-gray-900 max-w-xs'}`}>
            <pre className="whitespace-pre-wrap">{m.text}</pre>
          </div>
        ))}

        <div className="space-y-2">
          <ResultsList disasters={results.disasters} pois={results.pois} />
        </div>
      </div>
      <div className="p-2 border-t flex space-x-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask a question..." className="flex-1 p-2 border rounded" onKeyDown={(e) => e.key === 'Enter' && send()} />
        <Button onClick={send} disabled={loading}>Send</Button>
      </div>
    </div>
  );
}

export default function ChatbotFloatingButton() {
  const [open, setOpen] = useState(false);
  const [serverUp, setServerUp] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function check() {
      try {
        const res = await fetch('/chatbot/api/health');
        const d = await res.json();
        if (!cancelled) setServerUp(Boolean(d?.up));
      } catch (e) {
        if (!cancelled) setServerUp(false);
      }
    }
    check();
    const iv = setInterval(check, 5000);
    return () => { cancelled = true; clearInterval(iv); };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex items-end flex-col gap-2">
        {open && <ChatbotPanel onClose={() => setOpen(false)} />}
        <button onClick={() => setOpen((o) => !o)} className="rounded-full w-14 h-14 flex items-center justify-center shadow-lg bg-white">
          <span style={{ fontSize: 20 }}>💬</span>
        </button>
        <div className="text-xs text-gray-700 text-center">
          {serverUp === null ? 'Checking...' : serverUp ? 'Connected' : 'Offline'}
        </div>
      </div>
    </div>
  );
}
