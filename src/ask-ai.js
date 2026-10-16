// Ask AI: the portfolio assistant. Talks only to /api/ask; no keys in the client.
const log = document.querySelector('#nge-chat-log');
const form = document.querySelector('#nge-chat-form');
const input = document.querySelector('#nge-chat-input');
const send = form.querySelector('.nge-chat-send');
const history = [];

function addMessage(text, who) {
  const p = document.createElement('p');
  p.className = `nge-chat-msg ${who === 'you' ? 'nge-chat-you' : 'nge-chat-bot'}`;
  p.textContent = text;
  log.appendChild(p);
  log.scrollTop = log.scrollHeight;
  return p;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const question = input.value.trim();
  if (!question) return;
  input.value = '';
  addMessage(question, 'you');
  history.push({ role: 'user', content: question });
  send.disabled = true;
  input.disabled = true;
  const thinking = addMessage('…', 'bot');
  thinking.classList.add('nge-chat-thinking');
  try {
    const res = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: question, history: history.slice(-6) })
    });
    const data = await res.json().catch(() => ({}));
    const answer = res.ok && data.answer
      ? data.answer
      : (data.error || 'Something went wrong on my side. Please try again in a moment.');
    thinking.textContent = answer;
    thinking.classList.remove('nge-chat-thinking');
    history.push({ role: 'assistant', content: answer });
  } catch {
    thinking.textContent = 'No connection right now. Please try again in a moment.';
    thinking.classList.remove('nge-chat-thinking');
  }
  send.disabled = false;
  input.disabled = false;
  input.focus();
});
