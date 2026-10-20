/**
 * audio.js – Zing MP3 Vinyl Player Widget + Web Audio chimes
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
  const collapseBtn = document.getElementById('vinyl-collapse-btn');
  const widget      = document.getElementById('vinyl-widget');
  const disc        = document.getElementById('vinyl-disc');
  const tonearm     = document.getElementById('vinyl-tonearm');
  const turntable   = document.getElementById('vinyl-turntable');
  const tab0        = document.getElementById('tab-0');
  const tab1        = document.getElementById('tab-1');

  collapseBtn?.addEventListener('click', () => {
    widget?.classList.toggle('collapsed');
    const icon = collapseBtn.querySelector('span');
    if (icon) icon.textContent = widget?.classList.contains('collapsed') ? '▲' : '▼';
  });

  turntable?.addEventListener('click', () => {
    spinning = !spinning;
    disc?.classList.toggle('spinning', spinning);
    tonearm?.classList.toggle('on', spinning);
    if (spinning) switchSong(currentSong, true);
  });

  tab0?.addEventListener('click', (e) => { e.stopPropagation(); switchSong(0); });
  tab1?.addEventListener('click', (e) => { e.stopPropagation(); switchSong(1); });

  // Auto-start on first user interaction with the page
  const autoStart = () => {
    if (!spinning) {
      spinning = true;
      disc?.classList.add('spinning');
      tonearm?.classList.add('on');
      switchSong(0, true);
    }
    document.removeEventListener('click', autoStart);
    document.removeEventListener('keydown', autoStart);
    document.removeEventListener('touchstart', autoStart);
  };

  document.addEventListener('click', autoStart);
  document.addEventListener('keydown', autoStart);
  document.addEventListener('touchstart', autoStart, { passive: true });

  // Start immediately when page loads (autoplay attempt)
  setTimeout(() => autoStart(), 200);
}

function switchSong(index, autoStart = true) {
  currentSong = index;
  const song = ZING_SONGS[index];
  if (!song) return;

  // Tab UI
  document.getElementById('tab-0')?.classList.toggle('active', index === 0);
  document.getElementById('tab-1')?.classList.toggle('active', index === 1);

  // Track name
  const nameEl = document.getElementById('vinyl-track-name');
  if (nameEl) nameEl.textContent = song.full + ' 🎵';

  // External link
  const extLink = document.getElementById('zing-ext-link');
  if (extLink) extLink.href = song.url;

  // Load embed iframe with start param
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
