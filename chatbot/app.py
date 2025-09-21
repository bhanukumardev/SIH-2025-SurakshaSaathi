from flask import Flask, request, jsonify, render_template
import logging
import json
import random

app = Flask(__name__, template_folder='templates')
logging.basicConfig(level=logging.INFO)

# Load intents for a lightweight fallback responder when the ML backend is unavailable
try:
    INTENTS_JSON = json.load(open('intents.json'))
except Exception:
    INTENTS_JSON = {'intents': []}

# Simple keyword rules for fallback (keeps server responsive if model import fails)
_FALLBACK_RULES = {
    'greeting': ['hello', 'hi', 'hey', 'good morning', 'good evening'],
    'goodbye': ['bye', 'goodbye', 'see you', 'take care'],
    'thanks': ['thanks', 'thank you', 'thx'],
    'earthquake': ['earthquake', 'tremor', 'shake', 'shaking'],
    'flood': ['flood', 'flooding', 'inundation', 'heavy rain', 'river overflow'],
    'hurricane_cyclone_typhoon': ['cyclone', 'hurricane', 'typhoon', 'storm surge'],
    'wildfire': ['fire', 'wildfire', 'bushfire', 'forest fire'],
    'tsunami': ['tsunami', 'sea wave', 'tidal wave'],
    'preparedness': ['prepare', 'preparation', 'kit', 'emergency kit', 'evacuate', 'evacuation']
}

def _fallback_intent_for_message(message):
    text = (message or '').lower()
    for tag, kws in _FALLBACK_RULES.items():
        for kw in kws:
            if kw in text:
                return tag
    return None

def _build_fallback_response(tag):
    # Find intent in INTENTS_JSON
    for it in INTENTS_JSON.get('intents', []):
        if it.get('tag') == tag:
            responses = it.get('responses', [])
            if responses:
                # choose up to 3 responses to present
                pick = random.sample(responses, min(len(responses), 3))
                return '\n'.join(pick)
    # generic fallback
    return "I'm sorry — I couldn't access the model right now. I can provide general preparedness tips or latest updates."

# Lazy import of heavy backend modules occurs inside routes to keep startup fast
def _get_main():
    import importlib
    import importlib.util
    import sys
    import os
    # Try common import paths so module can be loaded whether app.py is run
    # from repo root or from inside the chatbot folder.
    try:
        return importlib.import_module('main')
    except Exception as e:
        app.logger.info('import main failed: %s', e)
    try:
        return importlib.import_module('chatbot.main')
    except Exception as e:
        app.logger.info('import chatbot.main failed: %s', e)
    # Fallback: load from file path relative to this file
    main_path = os.path.join(os.path.dirname(__file__), 'main.py')
    app.logger.debug('attempting to load main from %s', main_path)
    if os.path.exists(main_path):
        try:
            spec = importlib.util.spec_from_file_location('chatbot_main', main_path)
            if spec and spec.loader:
                mod = importlib.util.module_from_spec(spec)
                spec.loader.exec_module(mod)
                return mod
            else:
                app.logger.error('could not create spec/loader for main at %s', main_path)
        except Exception as e:
            app.logger.exception('failed to exec_module for main at %s: %s', main_path, e)
    else:
        app.logger.error('main.py not found at %s', main_path)
    raise ImportError('could not import main module')

import updates
import location


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/handle_message', methods=['POST'])
def handle_message():
    message = request.json.get('message', '')

    # Attempt to import the ML backend lazily. If importing or running the
    # model fails (for example, NLTK not installed in this interpreter),
    # return a helpful fallback with latest updates so the frontend can still
    # provide value to the user.
    try:
        main = _get_main()
    except Exception as e:
        # Instead of immediately returning 503, attempt a lightweight keyword
        # fallback so the chat remains responsive.
        tag = _fallback_intent_for_message(message)
        if tag:
            resp_text = _build_fallback_response(tag)
            # also append a couple of latest updates
            try:
                tips = updates.fetch_latest_disaster_updates(tag or 'general')
                if tips:
                    resp_text += "\n\nLATEST UPDATES:\n" + "\n".join(f"{i+1}. {t}" for i, t in enumerate(tips[:3]))
            except Exception:
                pass
            return jsonify({'response': resp_text})

        # No rule matched — return general tips instead of 503 so frontend can show something useful
        tips = updates.fetch_latest_disaster_updates('general')
        fall_text = "I couldn't access the model right now, but here are some important tips and latest updates:\n\n"
        fall_text += "\n".join(f"{i+1}. {t}" for i, t in enumerate(tips))
        return jsonify({'response': fall_text}), 503

    try:
        intents_list = main.predict_class(message)
        response = main.get_response(intents_list, main.intents)
        return jsonify({'response': response})
    except Exception as e:
        # If runtime error occurs while predicting, return updates instead of 500 stack
        tips = updates.fetch_latest_disaster_updates('general')
        fall_text = "An error occurred while generating a response. Here are some important tips and latest updates:\n\n"
        fall_text += "\n".join(f"{i+1}. {t}" for i, t in enumerate(tips))
        return jsonify({'response': fall_text}), 500


@app.route('/latest_updates', methods=['POST'])
def latest_updates():
    data = request.json or {}
    tag = data.get('tag', 'general')
    tips = updates.fetch_latest_disaster_updates(tag)
    return jsonify({'updates': tips})


@app.route('/detect_location', methods=['GET'])
def detect_location_route():
    app.logger.info('detect_location called from %s', request.remote_addr)
    # Use server-side IP-based location detection as a fallback to browser geolocation
    loc = location.detect_location(request)
    app.logger.info('detect_location result: %s', bool(loc))
    if not loc:
        return jsonify({'error': 'Could not detect location'}), 404
    return jsonify({'location': loc})


@app.route('/model_status', methods=['GET'])
def model_status_route():
    app.logger.info('model_status called from %s', request.remote_addr)
    """Return whether the ML backend module can be loaded and whether the model was loaded."""
    try:
        main = _get_main()
    except Exception:
        # Could not import the ML module at all
        return jsonify({'loaded': False, 'model_loaded': False})

    # If module imported, check its model flags if present
    model_loaded = False
    try:
        model_loaded = bool(getattr(main, 'model', None) is not None and not getattr(main, '_model_load_failed', False))
    except Exception:
        model_loaded = False
    return jsonify({'loaded': True, 'model_loaded': model_loaded})
    app.logger.info('model_status called from %s', request.remote_addr)
    try:
        main = _get_main()
    except Exception:
        # Could not import the ML module at all
        return jsonify({'loaded': False, 'model_loaded': False})

    # Attempt to ensure the model is loaded (non-blocking if already attempted)
    try:
        loaded = bool(getattr(main, 'model', None) is not None and not getattr(main, '_model_load_failed', False))
        if not loaded and hasattr(main, 'ensure_model_loaded'):
            # Try to load model on demand (may take time). Return current state.
            try:
                main.ensure_model_loaded()
            except Exception:
                pass
        model_loaded = bool(getattr(main, 'model', None) is not None and not getattr(main, '_model_load_failed', False))
    except Exception:
        model_loaded = False
    return jsonify({'loaded': True, 'model_loaded': model_loaded})


@app.route('/load_model', methods=['POST'])
def load_model_route():
    """Trigger model loading explicitly. Returns immediately with status indicating if the load was started/succeeded."""
    try:
        main = _get_main()
    except Exception:
        return jsonify({'started': False, 'error': 'could not import main module'}), 500
    try:
        ok = False
        if hasattr(main, 'ensure_model_loaded'):
            ok = main.ensure_model_loaded()
        return jsonify({'started': True, 'model_loaded': bool(ok)})
    except Exception as e:
        return jsonify({'started': False, 'error': str(e)}), 500


@app.route('/nearby_disasters', methods=['POST'])
def nearby_disasters_route():
    app.logger.info('nearby_disasters called from %s', request.remote_addr)
    data = request.json or {}
    lat = data.get('lat')
    lon = data.get('lon')
    radius = data.get('radius_km') or data.get('radius') or 20
    days = data.get('days')
    country = data.get('country')
    try:
        lat = float(lat)
        lon = float(lon)
    except Exception:
        return jsonify({'error': 'lat and lon required'}), 400

    from disasters import get_nearby_disasters
    # Provide defaults in get_nearby_disasters if None
    res = get_nearby_disasters(lat=lat, lon=lon, radius_km=radius or None, days=days or None, country=country)
    return jsonify({'disasters': res})


@app.route('/map_pois', methods=['POST'])
def map_pois_route():
    app.logger.info('map_pois called from %s', request.remote_addr)
    """Return POIs near a lat/lon using the Overpass programmatic helper.

    Expected JSON body: { lat: float, lon: float, radius_m: int, kind: str, limit: int }
    """
    data = request.json or {}
    lat = data.get('lat')
    lon = data.get('lon')
    radius = data.get('radius_m') or data.get('radius') or 20000
    kind = data.get('kind') or 'amenity'
    limit = data.get('limit') or 50

    try:
        lat = float(lat)
        lon = float(lon)
        radius = int(radius)
        limit = int(limit)
    except Exception:
        return jsonify({'error': 'lat, lon, radius_m and limit must be numeric'}), 400

    try:
        # Lazy import so server startup stays fast
        import importlib
        overpass = importlib.import_module('overpass')
        pois = overpass.search_pois(lat=lat, lon=lon, radius_m=radius, kind=kind, limit=limit)
        return jsonify({'pois': pois})
    except Exception as e:
        # Don't leak internals to clients; return a friendly error
        return jsonify({'error': 'Could not fetch POIs', 'details': str(e)}), 500


# curl -X POST http://127.0.0.1:5000/handle_message -d '{"message":"what is coding"}' -H "Content-Type: application/json"


if __name__ == '__main__':
    # Run without the debug reloader in this automated environment to
    # avoid the double-fork/reloader which has caused request hangs.
    app.run(host='0.0.0.0', debug=False, use_reloader=False)