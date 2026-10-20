/**
 * videoGallery.js – Video gallery screen (Screen 4)
 */

const VIDEOS = [
  { src: 'assets/video/mami.mp4',    label: 'Mẹ yêu thương 💕' },
  { src: 'assets/video/1_child.mp4', label: 'Kỷ niệm con thơ 🌻' },
  { src: 'assets/video/2_child.mp4', label: 'Bên mẹ luôn vui ☀️' },
];

let currentVideo = 0;
let hugCount = parseInt(localStorage.getItem('hug_count') || '0', 10);

export function initVideoGallery() {
  buildThumbs();
  setupMainPlayer();
  setupHugBtn();
  loadVideo(0);
}

function buildThumbs() {
  const thumbsWrap = document.getElementById('video-thumbs');
  if (!thumbsWrap) return;

  VIDEOS.forEach((v, i) => {
    const item = document.createElement('div');
    item.className = 'thumb-item' + (i === 0 ? ' active' : '');
    item.dataset.index = i;
    item.innerHTML = `
      <video src="${v.src}" preload="metadata" muted playsinline></video>
      <p class="thumb-label">${v.label}</p>`;
    item.addEventListener('click', () => loadVideo(i));
    thumbsWrap.appendChild(item);
  });
}

function loadVideo(index) {
  currentVideo = index;

  const mainVid = document.getElementById('main-video');
  const overlay = document.getElementById('video-play-overlay');
  const titleEl = document.getElementById('video-title');
  const countEl = document.getElementById('video-count');

  if (!mainVid) return;

  mainVid.pause();
  mainVid.src = VIDEOS[index].src;
  mainVid.load();
  if (titleEl) titleEl.textContent = VIDEOS[index].label;
  if (countEl) countEl.textContent = `${index + 1} / ${VIDEOS.length}`;

  overlay?.classList.remove('hidden');

  // Update thumb active state
  document.querySelectorAll('.thumb-item').forEach((el, i) => {
    el.classList.toggle('active', i === index);
  });

  // Show end section after last video ends
  if (mainVid) {
    mainVid.onended = () => {
      const next = index + 1;
      if (next < VIDEOS.length) {
        loadVideo(next);
        document.getElementById('main-video')?.play();
        document.getElementById('video-play-overlay')?.classList.add('hidden');
      } else {
        // All done
        document.getElementById('video-end-section')?.classList.add('visible');
      }
    };
  }
}

function setupMainPlayer() {
  const mainVid = document.getElementById('main-video');
  const overlay = document.getElementById('video-play-overlay');
  const playBtn = document.getElementById('play-btn-main');

  if (!mainVid || !overlay) return;

  function doPlay() {
    mainVid.play();
    overlay.classList.add('hidden');
  }

  overlay.addEventListener('click', doPlay);
  playBtn?.addEventListener('click', e => { e.stopPropagation(); doPlay(); });
}

function setupHugBtn() {
  const btn = document.getElementById('hug-btn');
  const ctr = document.getElementById('hug-counter');

  updateHugCounter(ctr);

  btn?.addEventListener('click', () => {
    hugCount++;
    localStorage.setItem('hug_count', hugCount);
    updateHugCounter(ctr);

    // Chime
    playHugChime();

    // Confetti
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.75 },
        colors: ['#C85A68','#E8959F','#FDECEC','#D4AF37','#FF758F'],
        gravity: 0.65
      });
    }
  });
}

function updateHugCounter(el) {
  if (!el) return;
  el.textContent = hugCount === 0
    ? 'Bấm để gửi cái ôm đến con mẹ nhé 💕'
    : `Mẹ đã gửi ${hugCount} cái ôm ấm áp cho con 💖`;
}

function playHugChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = f;
      g.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
      g.gain.linearRampToValueAtTime(0.15, ctx.currentTime + i * 0.12 + 0.05);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.12 + 1.6);
      o.connect(g); g.connect(ctx.destination);
      o.start(ctx.currentTime + i * 0.12);
      o.stop(ctx.currentTime + i * 0.12 + 1.7);
    });
  } catch (_) {}
}

// Auto play video when navigating to screen-video
document.addEventListener('screenChange', ({ detail }) => {
  const mainVid = document.getElementById('main-video');
  const overlay = document.getElementById('video-play-overlay');
  if (detail.screenId === 'screen-video') {
    if (mainVid) {
      mainVid.play().then(() => {
        overlay?.classList.add('hidden');
      }).catch(() => {
        // Autoplay policy requires user click, overlay stays visible
      });
    }
  } else {
    if (mainVid && !mainVid.paused) {
      mainVid.pause();
      overlay?.classList.remove('hidden');
    }
  }
});
