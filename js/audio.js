/**
 * audio.js – Zing MP3 Floating Music Capsule + Web Audio Chimes
 */

const SONGS = [
  {
    name: 'Chưa Bao Giờ Mẹ Kể',
    artist: 'MIN, ERIK',
    src: 'assets/music/chua-bao-gio-me-ke.mp3',
  },
  {
    name: 'Ước Mơ Của Mẹ',
    artist: 'Văn Mai Hương, Hứa Kim Tuyền',
    src: 'assets/music/uoc-mo-cua-me.mp3',
  },
];

let currentSongIndex = 0;
let bgAudio = null;
let isPlaying = false;
let spinning = false;

export function playSong(index, shouldPlay = true) {
  if (!bgAudio) bgAudio = document.getElementById('bg-audio');
  if (!bgAudio) return;

  currentSongIndex = (index + SONGS.length) % SONGS.length;
  const song = SONGS[currentSongIndex];

  // Check if source needs updating
  const currentSrc = bgAudio.getAttribute('data-song-index');
  if (currentSrc !== String(currentSongIndex)) {
    bgAudio.src = song.src;
    bgAudio.setAttribute('data-song-index', String(currentSongIndex));
    bgAudio.currentTime = 0;
  }

  if (shouldPlay) {
    bgAudio.volume = 0.8;
    bgAudio.play().then(() => {
      isPlaying = true;
      spinning = true;
      const vinyl = document.getElementById('mini-vinyl');
      if (vinyl) vinyl.classList.add('spinning');
      updatePillAndDrawer(true);
    }).catch(() => {
      document.addEventListener('click', function tryPlay() {
        bgAudio.play().then(() => {
          isPlaying = true;
          spinning = true;
          const vinyl = document.getElementById('mini-vinyl');
          if (vinyl) vinyl.classList.add('spinning');
          updatePillAndDrawer(true);
          document.removeEventListener('click', tryPlay);
        }).catch(() => {});
      }, { once: true });
    });
  } else {
    bgAudio.pause();
    isPlaying = false;
    spinning = false;
    const vinyl = document.getElementById('mini-vinyl');
    if (vinyl) vinyl.classList.remove('spinning');
    updatePillAndDrawer(false);
  }
}

export function startBgMusic() {
  playSong(currentSongIndex, true);
}

export function playNextSong() {
  playSong((currentSongIndex + 1) % SONGS.length, true);
}

function updatePillAndDrawer(playing) {
  const song = SONGS[currentSongIndex];
  const statusEl = document.getElementById('music-pill-status');
  const titleEl = document.getElementById('music-pill-title');
  const icon = document.getElementById('play-pause-icon');
  const text = document.getElementById('play-pause-text');

  if (titleEl) titleEl.textContent = song.name;
  if (statusEl) statusEl.textContent = playing ? `${song.artist} • Đang phát` : 'Đã tạm dừng';
  if (icon) icon.textContent = playing ? '⏸️' : '▶️';
  if (text) text.textContent = playing ? 'Tạm dừng' : 'Tiếp tục phát';

  document.querySelectorAll('.drawer-song-btn').forEach((btn, idx) => {
    btn.classList.toggle('active', idx === currentSongIndex);
  });
}

export function initPlayer() {
  bgAudio = document.getElementById('bg-audio');
  if (bgAudio) {
    bgAudio.setAttribute('data-song-index', '0');
    // When current song ends, auto switch to next song, looping continuously
    bgAudio.addEventListener('ended', () => {
      if (isPlaying) {
        playNextSong();
      }
    });
  }

  const pill    = document.getElementById('music-pill');
  const drawer  = document.getElementById('music-drawer');
  const closeBtn = document.getElementById('music-drawer-close');
  const togglePlay = document.getElementById('drawer-toggle-play');
  const btn0    = document.getElementById('song-btn-0');
  const btn1    = document.getElementById('song-btn-1');

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

  // Song 0: Chưa Bao Giờ Mẹ Kể
  btn0?.addEventListener('click', (e) => {
    e.stopPropagation();
    playSong(0, true);
  });

  // Song 1: Ước Mơ Của Mẹ
  btn1?.addEventListener('click', (e) => {
    e.stopPropagation();
    playSong(1, true);
  });

  // Toggle play / pause
  togglePlay?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!bgAudio) return;
    if (isPlaying) {
      playSong(currentSongIndex, false);
    } else {
      playSong(currentSongIndex, true);
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
