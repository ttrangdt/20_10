/**
 * envelope.js – 3D envelope opening and transition to letter screen
 */
import { goNext } from './screenManager.js';
import { playSweetChime, startBgMusic } from './audio.js';

export function initEnvelope() {
  const env = document.getElementById('envelope-3d');
  if (!env) return;

  env.addEventListener('click', openEnvelope);
  env.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openEnvelope(); });
  env.setAttribute('tabindex', '0');
  env.setAttribute('role', 'button');
  env.setAttribute('aria-label', 'Mở phong bì thư');
}

let opened = false;

function openEnvelope() {
  if (opened) return;
  opened = true;

  const env = document.getElementById('envelope-3d');
  env.classList.add('is-open');

  playSweetChime();
  startBgMusic();

  // Update hint
  const hint = document.getElementById('env-hint');
  if (hint) {
    hint.innerHTML = '<span>💌</span><span>Bức thư yêu thương đang từ từ mở ra...</span>';
    hint.style.animation = 'bounce 1.5s infinite';
  }

  // After animation (6s), go to letter screen
  setTimeout(() => goNext(), 6000);
}
