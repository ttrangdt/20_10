/**
 * main.js – Application Entry Point
 * Orchestrates screens, envelope, letter, photo slideshow, video gallery & background music.
 */

import { initScreenManager, goNext, goPrev } from './screenManager.js';
import { initEnvelope } from './envelope.js';
import { initPhotos } from './photos.js';
import { initVideoGallery } from './videoGallery.js';
import { initPlayer } from './audio.js';
import { initPetals } from './petals.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Screen Transition Manager
  initScreenManager();

  // 2. Initialize 3D Envelope (Screen 1)
  initEnvelope();

  // 3. Initialize Photo Slideshow (Screen 3)
  initPhotos();

  // 4. Initialize Video Gallery (Screen 4)
  initVideoGallery();

  // 5. Initialize Zing MP3 Player
  initPlayer();

  // 6. Floating Tulip Petals
  initPetals();

  // 7. Navigation Buttons
  const navPrevBtn = document.getElementById('nav-prev');
  const navNextBtn = document.getElementById('nav-next');
  navPrevBtn?.addEventListener('click', () => goPrev());
  navNextBtn?.addEventListener('click', () => goNext());

  // 8. Letter Next Button (Screen 2 -> Screen 3)
  const letterNextBtn = document.getElementById('letter-next-btn');
  letterNextBtn?.addEventListener('click', () => {
    goNext();
  });

  // 9. Keyboard Navigation
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') goNext();
    if (e.key === 'ArrowLeft') goPrev();
  });

  // 10. Share Button
  const shareBtn = document.getElementById('btn-share');
  shareBtn?.addEventListener('click', async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Gửi Mẹ Yêu • Chúc Mừng 20/10',
          text: 'Món quà con dành tặng mẹ nhân ngày 20/10 ❤️',
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        showToast('Đã sao chép liên kết vào bộ nhớ tạm! Gửi cho mẹ nhé 💕');
      }
    } catch (_) {
      // Fallback copy
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast('Đã sao chép liên kết vào bộ nhớ tạm! 💕');
      } catch (err) {
        showToast('Không thể sao chép liên kết.');
      }
    }
  });

  // 11. Screen-specific flair
  document.addEventListener('screenChange', ({ detail }) => {
    if (detail.screenId === 'screen-letter') {
      triggerHeartConfetti();
    }
  });
});

/**
 * Toast notification helper
 */
export function showToast(message, duration = 3000) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('out');
    setTimeout(() => toast.remove(), 400);
  }, duration);
}

/**
 * Heart / Rose petal confetti
 */
function triggerHeartConfetti() {
  if (typeof confetti !== 'function') return;
  try {
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.2 },
      colors: ['#E8959F', '#C85A68', '#FDECEC', '#FFD1DC', '#D4AF37'],
      disableForReducedMotion: true,
    });
  } catch (_) {}
}
