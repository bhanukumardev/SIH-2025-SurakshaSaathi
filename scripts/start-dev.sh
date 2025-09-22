#!/usr/bin/env bash
set -euo pipefail

# Start the Flask chatbot backend (prefer virtualenv python if available),
# run Next dev in foreground, and ensure Flask is killed when Next exits.

CHATBOT_PY="./chatbot/.venv/bin/python3"
if [ -x "$CHATBOT_PY" ]; then
  "$CHATBOT_PY" chatbot/app.py &
else
  python3 chatbot/app.py &
fi
FLASK_PID=$!
trap 'kill "$FLASK_PID" 2>/dev/null || true' EXIT

echo "Started Flask (pid=$FLASK_PID). Starting Next dev..."
pnpm dev
