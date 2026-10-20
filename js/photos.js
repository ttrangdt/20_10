/**
 * photos.js – Film-strip photo slideshow (Screen 3)
 */
import { goNext } from './screenManager.js';

// All photos in assets/photos (excluding the letter attachment)
const PHOTOS = [
  { src: 'assets/photos/mami.jpg',       caption: 'Mẹ yêu thương của con 🌸' },
  { src: 'assets/photos/mami1.jpg',      caption: 'Nụ cười đẹp nhất đời con ☀️' },
  { src: 'assets/photos/thanhminh.jpg',  caption: 'Khoảnh khắc bên mẹ 💕' },
  { src: 'assets/photos/thanhminh1.jpg', caption: 'Ký ức ngọt ngào không phai 🌷' },
  { src: 'assets/photos/thanhminh2.jpg', caption: 'Luôn bên nhau mẹ nhé ✨' },
  { src: 'assets/photos/allfam.jpg',     caption: 'Gia đình mình hạnh phúc mãi 🏠' },
  { src: 'assets/photos/2_child.jpg',    caption: 'Những năm tháng tuổi thơ tươi đẹp 🌻' },
  { src: 'assets/photos/3_child.jpg',    caption: 'Con lớn lên nhờ bàn tay mẹ 💗' },
  { src: 'assets/photos/meee.jpg',       caption: 'Con yêu mẹ nhiều lắm! ❤️' },
  { src: 'assets/photos/minh.jpg',       caption: 'Cảm ơn mẹ vì tất cả 🙏' },
];

const SWAYS = ['-3deg', '2.5deg', '-2deg', '3.5deg', '-1.5deg', '2deg', '-3.5deg', '1.5deg', '-2.5deg', '3deg'];

let currentPhoto = 0;
let autoTimer = null;
let autoPlaying = true;

export function initPhotos() {
  const container = document.querySelector('.photo-slide-area');
  const progressBar = document.querySelector('.film-progress');
  const counter = document.querySelector('.photo-counter');
  if (!container) return;

  // Build slides
  PHOTOS.forEach((p, i) => {
    // Slide
    const slide = document.createElement('div');
    slide.className = 'photo-slide' + (i === 0 ? ' active' : '');
    slide.innerHTML = `
      <div class="photo-frame" style="--sway:${SWAYS[i % SWAYS.length]}">
        <img src="${p.src}" alt="${p.caption}" loading="${i === 0 ? 'eager' : 'lazy'}">
        <p class="photo-caption">${p.caption}</p>
      </div>`;
    container.appendChild(slide);

    // Tick
    if (progressBar) {
      const tick = document.createElement('div');
      tick.className = 'film-tick' + (i === 0 ? ' active' : '');
      progressBar.appendChild(tick);
    }
  });

  updateCounter(counter);
  setupControls();
  startAutoPlay();
}

function showPhoto(index) {
  const slides = document.querySelectorAll('.photo-slide');
  const ticks = document.querySelectorAll('.film-tick');
  const counter = document.querySelector('.photo-counter');

  slides[currentPhoto]?.classList.remove('active');
  ticks[currentPhoto]?.classList.remove('active');

  currentPhoto = (index + PHOTOS.length) % PHOTOS.length;

  slides[currentPhoto]?.classList.add('active');
  ticks[currentPhoto]?.classList.add('active');

  updateCounter(counter);
}

function updateCounter(counter) {
  if (counter) counter.textContent = `${currentPhoto + 1} / ${PHOTOS.length}`;
}

function setupControls() {
  document.getElementById('slide-prev')?.addEventListener('click', () => { showPhoto(currentPhoto - 1); resetAutoPlay(); });
  document.getElementById('slide-next')?.addEventListener('click', () => { showPhoto(currentPhoto + 1); resetAutoPlay(); });
  document.getElementById('photo-next-btn')?.addEventListener('click', () => { stopAutoPlay(); goNext(); });

  // Swipe support
  let touchStartX = 0;
  document.querySelector('.photo-slide-area')?.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  document.querySelector('.photo-slide-area')?.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) { showPhoto(currentPhoto + (dx < 0 ? 1 : -1)); resetAutoPlay(); }
  }, { passive: true });
}

function startAutoPlay() {
  autoTimer = setInterval(() => {
    if (!autoPlaying) return;
    const next = currentPhoto + 1;

    if (next >= PHOTOS.length) {
      // Reached the end of all photos! Automatically go to video screen
      stopAutoPlay();
      document.getElementById('photo-next-btn')?.classList.add('highlight');
      setTimeout(() => {
        goNext();
      }, 1500);
      return;
    }

    showPhoto(next);
  }, 3800);
}

function stopAutoPlay() {
  autoPlaying = false;
  if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
}

function resetAutoPlay() {
  stopAutoPlay();
  autoPlaying = true;
  startAutoPlay();
}

// Resume / pause when screen changes
document.addEventListener('screenChange', ({ detail }) => {
  if (detail.screenId === 'screen-photos') {
    autoPlaying = true;
    if (!autoTimer) startAutoPlay();
  } else {
    stopAutoPlay();
  }
});
