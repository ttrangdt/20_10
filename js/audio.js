/**
 * audio.js – Zing MP3 Floating Music Capsule + Web Audio Chimes
 */

const SONGS = [
  {
    name: 'Chưa Bao Giờ Mẹ Kể',
    artist: 'MIN, ERIK',
    src: 'assets/music/chua-bao-gio-me-ke.mp3',
    local: true,
  },
  {
    name: 'Ước Mơ Của Mẹ',
    artist: 'Văn Mai Hương',
    src: null,
    url: 'https://zingmp3.vn/bai-hat/Uoc-Mo-Cua-Me-Van-Mai-Huong/r0sOO1PNh7Kw.html',
    local: false,
  },
];

let bgAudio = null;
let isPlaying = false;
let spinning = false;

export function startBgMusic() {
  if (!bgAudio) bgAudio = document.getElementById('bg-audio');
  if (!bgAudio) return;
  bgAudio.volume = 0.75;
  bgAudio.play().then(() => {
    isPlaying = true;
    spinning = true;
    const vinyl = document.getElementById('mini-vinyl');
    if (vinyl) vinyl.classList.add('spinning');
    updatePillStatus(true);
  }).catch(() => {
    document.addEventListener('click', function tryPlay() {
      bgAudio.play().then(() => {
        isPlaying = true;
        spinning = true;
        const vinyl = document.getElementById('mini-vinyl');
        if (vinyl) vinyl.classList.add('spinning');
        updatePillStatus(true);
        document.removeEventListener('click', tryPlay);
      }).catch(() => {});
    }, { once: true });
  });
}

function updatePillStatus(playing) {
  const statusEl = document.getElementById('music-pill-status');
  const titleEl = document.getElementById('music-pill-title');
  const icon = document.getElementById('play-pause-icon');
  const text = document.getElementById('play-pause-text');
  if (statusEl) statusEl.textContent = playing ? 'MIN, ERIK • Đang phát' : 'Đã tạm dừng';
  if (titleEl) titleEl.textContent = 'Chưa Bao Giờ Mẹ Kể';
  if (icon) icon.textContent = playing ? '⏸️' : '▶️';
  if (text) text.textContent = playing ? 'Tạm dừng' : 'Tiếp tục phát';
}

export function initPlayer() {
  bgAudio = document.getElementById('bg-audio');
  const pill    = document.getElementById('music-pill');
  const drawer  = document.getElementById('music-drawer');
  const closeBtn = document.getElementById('music-drawer-close');
  const togglePlay = document.getElementById('drawer-toggle-play');
  const btn0    = document.getElementById('song-btn-0');
  const btn1    = document.getElementById('song-btn-1');
  const miniVinyl = document.getElementById('mini-vinyl');

  // Open/close drawer
  pill?.addEventListener('click', (e) => {
    e.stopPropagation();
    drawer?.classList.toggle('open');
  });
  closeBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    drawer?.classList.remove('open');
  });
  document.addEventListener('click', (e) => {
    if (drawer && !drawer.contains(e.target) && !pill?.contains(e.target)) {
      drawer.classList.remove('open');
    }
  });

  // Song 0 – local MP3
  btn0?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!isPlaying) {
      startBgMusic();
    }
    btn0.classList.add('active');
    btn1?.classList.remove('active');
  });

  // Song 1 – open Zing in new tab
  btn1?.addEventListener('click', (e) => {
    e.stopPropagation();
    window.open(SONGS[1].url, '_blank', 'noopener');
  });

  // Toggle play / pause
  togglePlay?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!bgAudio) return;
    if (isPlaying) {
      bgAudio.pause();
      isPlaying = false;
      spinning = false;
      miniVinyl?.classList.remove('spinning');
      updatePillStatus(false);
    } else {
      bgAudio.play().then(() => {
        isPlaying = true;
        spinning = true;
        miniVinyl?.classList.add('spinning');
        updatePillStatus(true);
      }).catch(() => {});
    }
  });
}

/** Sweet chime for envelope open */
export function playSweetChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = f;
      g.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
      g.gain.linearRampToValueAtTime(0.16, ctx.currentTime + i * 0.12 + 0.05);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.12 + 1.8);
      o.connect(g); g.connect(ctx.destination);
      o.start(ctx.currentTime + i * 0.12);
      o.stop(ctx.currentTime + i * 0.12 + 2);
    });
  } catch (_) {}
}
