// Small utilities used by the chatbot UI. Kept in plain JS to make unit testing simple.

async function copyToClipboard(text) {
  if (!navigator?.clipboard?.writeText) {
    throw new Error('clipboard-not-supported');
  }
  await navigator.clipboard.writeText(text);
}

async function sendToHandleMessage(message) {
  const res = await fetch('/chatbot/api/handle_message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });
  if (!res.ok) throw new Error('network-error');
  return res.json();
}

module.exports = { copyToClipboard, sendToHandleMessage };
