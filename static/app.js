const message = document.getElementById('message');
const count = document.getElementById('count');
const analyzeBtn = document.getElementById('analyze');
let type = 'email';

document.querySelectorAll('.tab').forEach(btn => btn.addEventListener('click', () => {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active'); type = btn.dataset.type;
  document.getElementById('field-label').textContent = type === 'email' ? 'PASTE EMAIL CONTENT' : 'PASTE SMS / MESSAGE';
  message.placeholder = type === 'email' ? 'Paste the email subject and body here...' : 'Paste the text message here...';
}));
message.addEventListener('input', () => count.textContent = `${message.value.length} / 5000`);

document.querySelectorAll('.sample').forEach(btn => btn.addEventListener('click', () => {
  message.value = btn.dataset.sample === 'spam'
    ? 'CONGRATULATIONS! You have won a FREE cash prize of 50000. Click this link now to claim your reward. Limited time offer!'
    : 'Hi, please bring your laptop tomorrow. We will discuss the project after class. Call me when you reach college.';
  count.textContent = `${message.value.length} / 5000`;
}));

analyzeBtn.addEventListener('click', async () => {
  const text = message.value.trim();
  if (!text) { showError('Please paste a message before analyzing.'); message.focus(); return; }
  analyzeBtn.disabled = true; analyzeBtn.querySelector('span').textContent = 'Analyzing...';
  document.getElementById('error').classList.add('hidden');
  try {
    const response = await fetch('/predict', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({message:text, type})});
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Could not analyze this message.');
    showResult(data);
  } catch (err) { showError(err.message || 'Server connection failed.'); }
  finally { analyzeBtn.disabled = false; analyzeBtn.querySelector('span').textContent = 'Analyze message'; }
});

function showResult(data) {
  document.getElementById('empty').classList.add('hidden');
  document.getElementById('result').classList.remove('hidden');
  const spam = data.label === 'spam';
  document.getElementById('verdict').textContent = spam ? 'Spam detected' : 'Not spam';
  document.getElementById('badge').textContent = spam ? '⚠ SPAM' : '✓ SAFE';
  document.getElementById('badge').classList.toggle('danger', spam);
  document.getElementById('score').textContent = `${data.spam_score}%`;
  document.getElementById('meter-fill').style.width = `${data.spam_score}%`;
  document.getElementById('risk').textContent = data.risk;
  document.getElementById('confidence').textContent = `${data.confidence}%`;
  document.getElementById('words').textContent = data.words;
  const advice = document.getElementById('advice');
  advice.classList.toggle('warn', spam);
  advice.querySelector('b').textContent = spam ? '!' : '✓';
  advice.querySelector('span').textContent = spam
    ? 'Do not click links, share OTPs, or send money. Verify the sender through an official channel.'
    : 'The model classifies this as normal. Still verify unexpected links and requests before acting.';
}
function showError(msg) { const e=document.getElementById('error'); e.textContent=msg; e.classList.remove('hidden'); }
document.getElementById('reset').addEventListener('click', () => {
  document.getElementById('result').classList.add('hidden');
  document.getElementById('empty').classList.remove('hidden');
  message.value=''; count.textContent='0 / 5000'; message.focus();
});
