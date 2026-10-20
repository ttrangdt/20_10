/**
 * audio.js – Zing MP3 Floating Music Capsule + Web Audio Chimes
 */

const ZING_SONGS = [
  {
    id: 'ZW80ZI60',
    name: 'Chưa Bao Giờ Mẹ Kể',
    artist: 'MIN, ERIK',
    full: 'Chưa Bao Giờ Mẹ Kể • MIN, ERIK',
    url: 'https://zingmp3.vn/album/Chua-Bao-Gio-Me-Ke-Single-MIN-ERIK/3COqAuOefVC.html',
    embed: 'https://zingmp3.vn/embed/song/ZW80ZI60'
  },
  {
    id: 'ZZEEWE8D',
    name: 'Ước Mơ Của Mẹ',
    artist: 'Văn Mai Hương',
    full: 'Ước Mơ Của Mẹ • Văn Mai Hương',
    url: 'https://zingmp3.vn/bai-hat/Uoc-Mo-Cua-Me-Van-Mai-Huong/r0sOO1PNh7Kw.html',
    embed: 'https://zingmp3.vn/embed/song/ZZEEWE8D'
  }
];

let currentSong = 0;
let spinning = false;

export function initPlayer() {
  const pill       = document.getElementById('music-pill');
  const drawer     = document.getElementById('music-drawer');
  const closeBtn   = document.getElementById('music-drawer-close');
  const miniVinyl  = document.getElementById('mini-vinyl');
  const togglePlay = document.getElementById('drawer-toggle-play');
  const btn0       = document.getElementById('song-btn-0');
  const btn1       = document.getElementById('song-btn-1');

  // Toggle drawer open / close
  pill?.addEventListener('click', (e) => {
    e.stopPropagation();
    drawer?.classList.toggle('open');
  });

  closeBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    drawer?.classList.remove('open');
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (drawer && !drawer.contains(e.target) && !pill?.contains(e.target)) {
      drawer.classList.remove('open');
    }
  });

  // Song switching
  btn0?.addEventListener('click', (e) => {
    e.stopPropagation();
    switchSong(0, true);
  });

  btn1?.addEventListener('click', (e) => {
    e.stopPropagation();
    switchSong(1, true);
  });

  // Toggle play/pause
  togglePlay?.addEventListener('click', (e) => {
    e.stopPropagation();
    spinning = !spinning;
    miniVinyl?.classList.toggle('spinning', spinning);
    const icon = document.getElementById('play-pause-icon');
    const text = document.getElementById('play-pause-text');
    const statusEl = document.getElementById('music-pill-status');
    const iframe = document.getElementById('zing-iframe');

    if (spinning) {
      if (icon) icon.textContent = '⏸️';
      if (text) text.textContent = 'Tạm dừng';
      if (statusEl) statusEl.textContent = `${ZING_SONGS[currentSong].artist} • Đang phát`;
      switchSong(currentSong, true);
    } else {
      if (icon) icon.textContent = '▶️';
      if (text) text.textContent = 'Tiếp tục phát';
      if (statusEl) statusEl.textContent = 'Đã tạm dừng';
      if (iframe) iframe.src = 'about:blank';
    }
  });

  // Auto-start on first user interaction with page
  const autoStart = () => {
    if (!spinning) {
      spinning = true;
      miniVinyl?.classList.add('spinning');
      switchSong(0, true);
    }
    document.removeEventListener('click', autoStart);
    document.removeEventListener('keydown', autoStart);
    document.removeEventListener('touchstart', autoStart);
  };

  document.addEventListener('click', autoStart);
  document.addEventListener('keydown', autoStart);
  document.addEventListener('touchstart', autoStart, { passive: true });

  // Start immediately when page loads
  setTimeout(() => autoStart(), 200);
}

function switchSong(index, autoStart = true) {
  currentSong = index;
  const song = ZING_SONGS[index];
  if (!song) return;

  // Active button
  document.getElementById('song-btn-0')?.classList.toggle('active', index === 0);
  document.getElementById('song-btn-1')?.classList.toggle('active', index === 1);

  // Pill Title & Status
  const titleEl = document.getElementById('music-pill-title');
  const statusEl = document.getElementById('music-pill-status');
  if (titleEl) titleEl.textContent = song.name;
  if (statusEl) statusEl.textContent = `${song.artist} • Đang phát`;

  // Start iframe playback in background
  const iframe = document.getElementById('zing-iframe');
  if (iframe) {
    iframe.src = `${song.embed}?start=${autoStart ? 'true' : 'false'}`;
  }
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
